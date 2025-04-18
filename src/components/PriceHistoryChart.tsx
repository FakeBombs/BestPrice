import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const generatePriceData = (basePrice: number, days: number) => {
  const data = [];
  const now = new Date();
  for (let i = days; i >= 0; i--) {
    const date = new Date();
    date.setDate(now.getDate() - i);
    const variation = Math.random() * 20 - 10; // +/- 10 variation
    const price = Math.max(basePrice + variation, basePrice * 0.8);
    data.push({
      date: date.toISOString().split('T')[0],
      price: parseFloat(price.toFixed(2)),
    });
  }
  return data;
};

export const getDaysFromRange = (range: string): number => {
  switch (range) {
    case '1m': return 30;
    case '3m': return 90;
    case '6m': return 180;
    case '1y': return 365;
    default: return 30;
  }
};

interface PriceHistoryChartProps {
  productId: number;
  basePrice: number;
  timeRange: '1m' | '3m' | '6m' | '1y';
  setTimeRange: React.Dispatch<React.SetStateAction<'1m' | '3m' | '6m' | '1y'>>;
}

const PriceHistoryChart = ({ productId, basePrice, timeRange, setTimeRange }: PriceHistoryChartProps) => {
  const priceData = generatePriceData(basePrice, getDaysFromRange(timeRange));
  const minPrice = Math.min(...priceData.map(item => item.price));
  const currentPrice = priceData[priceData.length - 1]?.price || 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Price History</CardTitle>
        <div>
          {['1m', '3m', '6m', '1y'].map(range => (
            <Button
              key={range}
              variant={timeRange === range ? 'default' : 'outline'}
              onClick={() => setTimeRange(range)}
            >
              {range.toUpperCase()}
            </Button>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        <div className="chart-container" style={{ height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={priceData}>
              <XAxis dataKey="date" tickFormatter={value => new Date(value).toLocaleDateString()} />
              <YAxis tickFormatter={value => `$${value}`} />
              <Tooltip content={props => <CustomTooltipContent {...props} />} />
              <ReferenceLine y={currentPrice} stroke="red" strokeDasharray="3 3" />
              <Line type="monotone" dataKey="price" stroke="#EC1639" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div>
          <div>Current Price: ${currentPrice.toFixed(2)}</div>
          <div>Minimum Price: ${minPrice.toFixed(2)}</div>
        </div>
      </CardContent>
    </Card>
  );
};

const CustomTooltipContent = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="custom-tooltip">
      <p>{new Date(label).toLocaleDateString()}</p>
      <p>Price: ${payload[0].value}</p>
    </div>
  );
};

export default PriceHistoryChart;
