
import { useState } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

// Mock price history data - in a real app, this would come from your backend
const generatePriceData = (basePrice: number, days: number) => {
  const data = [];
  const now = new Date();
  
  for (let i = days; i >= 0; i--) {
    const date = new Date();
    date.setDate(now.getDate() - i);
    
    // Create some price variations
    const variation = Math.random() * 20 - 10; // Random between -10 and +10
    const price = Math.max(basePrice + variation, basePrice * 0.8);
    
    data.push({
      date: date.toISOString().split('T')[0],
      price: parseFloat(price.toFixed(2))
    });
  }
  
  return data;
};

interface PriceHistoryChartProps {
  productId: string;
  basePrice: number;
}

const PriceHistoryChart = ({ productId, basePrice }: PriceHistoryChartProps) => {
  const [timeRange, setTimeRange] = useState<'1m' | '3m' | '6m' | '1y'>('1m');
  
  // Generate mock data based on the selected time range
  const getDaysFromRange = (range: string): number => {
    switch(range) {
      case '1m': return 30;
      case '3m': return 90;
      case '6m': return 180;
      case '1y': return 365;
      default: return 30;
    }
  };
  
  const priceData = generatePriceData(basePrice, getDaysFromRange(timeRange));
  
  const minPrice = Math.min(...priceData.map(item => item.price));
  const maxPrice = Math.max(...priceData.map(item => item.price));
  const currentPrice = priceData[priceData.length - 1].price;
  const lowestPriceDate = priceData.find(item => item.price === minPrice)?.date;
  
  const config = {
    price: {
      label: "Price",
      theme: { light: "#0284c7", dark: "#38bdf8" },
    },
  };
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">Price History</CardTitle>
          <div className="flex space-x-1">
            <Button 
              variant={timeRange === '1m' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setTimeRange('1m')}
            >
              1M
            </Button>
            <Button 
              variant={timeRange === '3m' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTimeRange('3m')}
            >
              3M
            </Button>
            <Button 
              variant={timeRange === '6m' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTimeRange('6m')}
            >
              6M
            </Button>
            <Button 
              variant={timeRange === '1y' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTimeRange('1y')}
            >
              1Y
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="bg-muted/50 p-3 rounded-lg">
            <div className="text-sm text-muted-foreground mb-1">Current Price</div>
            <div className="text-xl font-bold">${currentPrice.toFixed(2)}</div>
          </div>
          <div className="bg-muted/50 p-3 rounded-lg">
            <div className="text-sm text-muted-foreground mb-1">Lowest Price</div>
            <div className="text-xl font-bold">${minPrice.toFixed(2)}</div>
            <div className="text-xs text-muted-foreground">on {lowestPriceDate}</div>
          </div>
          <div className="bg-muted/50 p-3 rounded-lg">
            <div className="text-sm text-muted-foreground mb-1">Highest Price</div>
            <div className="text-xl font-bold">${maxPrice.toFixed(2)}</div>
          </div>
        </div>
        
        <div className="h-[300px]">
          <ChartContainer config={config}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={priceData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(value) => {
                    const date = new Date(value);
                    return `${date.getMonth() + 1}/${date.getDate()}`;
                  }}
                />
                <YAxis 
                  domain={[minPrice * 0.95, maxPrice * 1.05]} 
                  tickFormatter={(value) => `$${value}`}
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent labelKey="date" nameKey="name" />
                  }
                />
                <Line 
                  type="monotone" 
                  dataKey="price" 
                  name="price"
                  stroke="var(--color-price)" 
                  activeDot={{ r: 8 }} 
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default PriceHistoryChart;
