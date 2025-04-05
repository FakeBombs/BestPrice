
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // Get the authentication session to identify the user
    const {
      data: { session },
    } = await supabaseClient.auth.getSession()

    if (!session) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { 
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    const { action, amount, paymentMethod, description } = await req.json()
    
    // Validate the request
    if (!action || (action === 'deposit' && (!amount || !paymentMethod))) {
      return new Response(
        JSON.stringify({ error: 'Missing required parameters' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }
    
    // Handle different wallet operations
    switch (action) {
      case 'deposit': {
        // Create a transaction record
        const { error: txError } = await supabaseClient
          .from('transactions')
          .insert({
            user_id: session.user.id,
            amount: amount,
            description: `Deposit via ${paymentMethod}`,
            status: 'completed',
            type: 'deposit'
          })
          
        if (txError) {
          throw new Error(`Transaction creation failed: ${txError.message}`)
        }
        
        // Update wallet balance
        const { data: wallet, error: walletError } = await supabaseClient
          .from('wallets')
          .update({ 
            balance: supabaseClient.rpc('add_to_balance', { user_id: session.user.id, amount: amount }),
            updated_at: new Date().toISOString()
          })
          .eq('user_id', session.user.id)
          .select()
          .single()
          
        if (walletError) {
          throw new Error(`Wallet update failed: ${walletError.message}`)
        }
        
        return new Response(
          JSON.stringify({ 
            success: true,
            message: 'Deposit successful',
            data: wallet
          }),
          { 
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        )
      }
      
      case 'withdraw': {
        // Validate withdrawal amount is available
        const { data: wallet, error: fetchError } = await supabaseClient
          .from('wallets')
          .select('balance')
          .eq('user_id', session.user.id)
          .single()
          
        if (fetchError) {
          throw new Error(`Couldn't fetch wallet: ${fetchError.message}`)
        }
        
        if (wallet.balance < amount) {
          return new Response(
            JSON.stringify({ error: 'Insufficient funds' }),
            { 
              status: 400,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
          )
        }
        
        // Create transaction record
        const { error: txError } = await supabaseClient
          .from('transactions')
          .insert({
            user_id: session.user.id,
            amount: -amount,
            description: description || 'Withdrawal',
            status: 'completed',
            type: 'withdrawal'
          })
          
        if (txError) {
          throw new Error(`Transaction creation failed: ${txError.message}`)
        }
        
        // Update wallet balance
        const { data: updatedWallet, error: walletError } = await supabaseClient
          .from('wallets')
          .update({ 
            balance: supabaseClient.rpc('subtract_from_balance', { 
              user_id: session.user.id, 
              amount: amount 
            }),
            updated_at: new Date().toISOString()
          })
          .eq('user_id', session.user.id)
          .select()
          .single()
          
        if (walletError) {
          throw new Error(`Wallet update failed: ${walletError.message}`)
        }
        
        return new Response(
          JSON.stringify({ 
            success: true,
            message: 'Withdrawal successful',
            data: updatedWallet
          }),
          { 
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        )
      }
      
      default:
        return new Response(
          JSON.stringify({ error: 'Invalid action' }),
          { 
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        )
    }
  } catch (error) {
    console.error('Error processing request:', error)
    
    return new Response(
      JSON.stringify({ error: 'Internal Server Error', details: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
