
-- Function to add an amount to a user's wallet balance
CREATE OR REPLACE FUNCTION add_to_wallet(user_id UUID, amount_to_add DECIMAL)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.wallets
  SET balance = balance + amount_to_add,
      updated_at = NOW()
  WHERE user_id = $1;
END;
$$;

-- Function to subtract an amount from a user's wallet balance
CREATE OR REPLACE FUNCTION subtract_from_wallet(user_id UUID, amount_to_subtract DECIMAL)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_balance DECIMAL;
BEGIN
  -- Get current balance
  SELECT balance INTO current_balance FROM public.wallets WHERE user_id = $1;
  
  -- Check if there are sufficient funds
  IF current_balance < amount_to_subtract THEN
    RAISE EXCEPTION 'Insufficient funds';
  END IF;
  
  -- Update the balance
  UPDATE public.wallets
  SET balance = balance - amount_to_subtract,
      updated_at = NOW()
  WHERE user_id = $1;
END;
$$;
