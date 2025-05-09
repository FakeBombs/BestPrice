import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, CartesianGrid } from 'recharts';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from '@/hooks/useTranslation';

// Helper Functions
export const generatePriceData = (basePrice: number, days: number) => {
  const data = [];
  const now = new Date();
  const numericBasePrice = typeof basePrice === 'number' && !isNaN(basePrice) && basePrice > 0 ? basePrice : 100;

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(now.getDate() - i);
    const variationFactor = (Math.random() * 0.2) - 0.1;
    let price = numericBasePrice * (1 + variationFactor);
    price = Math.max(price, numericBasePrice * 0.5, 1);
    
    data.push({
      date: date.toISOString().split('T')[0],
      price: parseFloat(price.toFixed(2)),
    });
  }
  if (!data.find(d => d.date === now.toISOString().split('T')[0])) {
    data.push({
        date: now.toISOString().split('T')[0],
        price: parseFloat(numericBasePrice.toFixed(2))
    });
  }
  return data.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
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

const localeCurrencyMap: Record<string, { locale: string; currency: string }> = {
  el: { locale: 'el-GR', currency: 'EUR' },
  en: { locale: 'en-GB', currency: 'GBP' },
  de: { locale: 'de-DE', currency: 'EUR' },
  es: { locale: 'es-ES', currency: 'EUR' },
  fr: { locale: 'fr-FR', currency: 'EUR' },
};
const defaultLocale = 'el-GR';
const defaultCurrency = 'EUR';

interface PriceHistoryChartProps {
  productId: number;
  basePrice: number;
  timeRange: '1m' | '3m' | '6m' | '1y';
  setTimeRange: (range: '1m' | '3m' | '6m' | '1y') => void;
}

const PriceHistoryChart: React.FC<PriceHistoryChartProps> = ({
  productId,
  basePrice,
  timeRange,
  setTimeRange
}) => {
  const { t, language } = useTranslation();

  const currentLocale = localeCurrencyMap[language]?.locale || defaultLocale;
  const currentCurrency = localeCurrencyMap[language]?.currency || defaultCurrency;

  const formatCurrency = (value: number) => {
    try {
      return value.toLocaleString(currentLocale, { style: 'currency', currency: currentCurrency, minimumFractionDigits: 2, maximumFractionDigits: 2 });
    } catch (e) {
      return value.toLocaleString(defaultLocale, { style: 'currency', currency: defaultCurrency, minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
  };

  const formatDateForAxis = (dateString: string) => {
    try {
        return new Date(dateString).toLocaleDateString(currentLocale, { month: 'short', day: 'numeric' });
    } catch (e) { return dateString; }
  };
  
  const formatDateForTooltip = (dateString: string) => {
    try {
        return new Date(dateString).toLocaleDateString(currentLocale, { year: 'numeric', month: 'long', day: 'numeric' });
    } catch (e) { return dateString; }
  };

  const priceData = useMemo(() => {
    if (typeof basePrice !== 'number' || isNaN(basePrice) || basePrice <= 0) {
      return []; 
    }
    return generatePriceData(basePrice, getDaysFromRange(timeRange));
  }, [basePrice, timeRange]);

  const { minPrice, currentPrice } = useMemo(() => {
    if (!priceData || priceData.length === 0) return { minPrice: 0, currentPrice: basePrice > 0 ? basePrice : 0 };
    const prices = priceData.map(item => item.price);
    const min = Math.min(...prices);
    const current = priceData[priceData.length - 1]?.price || (basePrice > 0 ? basePrice : 0);
    return { minPrice: min, currentPrice: current };
  }, [priceData, basePrice]);

  if (!priceData || priceData.length === 0) {
    return (
      <Card>
        <CardContent>
          <p>{t('no_price_data_available', 'No price data available for the selected range.')}</p>
        </CardContent>
      </Card>
    );
  }

  const yAxisDomain: [number, number] = [
    Math.floor(minPrice * 0.95),
    Math.ceil(Math.max(...priceData.map(p => p.price), currentPrice) * 1.05)
  ];
  if (yAxisDomain[0] === yAxisDomain[1]) { // Prevent flat line if all prices are same
      yAxisDomain[0] = Math.max(0, yAxisDomain[0] - 10);
      yAxisDomain[1] = yAxisDomain[1] + 10;
  }
  if (yAxisDomain[0] < 0) yAxisDomain[0] = 0; // Ensure domain doesn't go below 0

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center space-x-1">
          {(['1m', '3m', '6m', '1y'] as const).map(range => (
            <Button key={range} variant={timeRange === range ? 'default' : 'outline'} size="sm" onClick={() => setTimeRange(range)} className="px-2 text-xs">
              {t(`time_range_${range}` as any, range.toUpperCase())}
            </Button>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        <div className="chart-container" style={{ height: 300, width: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={priceData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.5} />
              <XAxis dataKey="date" tickFormatter={formatDateForAxis} tick={{ fontSize: 10 }} axisLine={{ strokeOpacity: 0.5 }}tickLine={{ strokeOpacity: 0.5 }}/>
              <YAxis tickFormatter={(value) => formatCurrency(value)} domain={yAxisDomain} tick={{ fontSize: 10 }} axisLine={{ strokeOpacity: 0.5 }} tickLine={{ strokeOpacity: 0.5 }} allowDecimals={false}/>
              <Tooltip content={<CustomTooltipContent currentLocale={currentLocale} currentCurrency={currentCurrency} formatDate={formatDateForTooltip} formatCurrency={formatCurrency}/>} />
              <ReferenceLine y={currentPrice} label={{ value: t('current_price_label', 'Current'), position: 'insideRight', fill: '#dc2626', fontSize: 10 }} stroke="#dc2626" strokeDasharray="3 3" strokeWidth={1.5} />
              <ReferenceLine y={minPrice} label={{ value: t('minimum_price_label', 'Min'), position: 'insideRight', fill: '#16a34a', fontSize: 10 }} stroke="#16a34a" strokeDasharray="3 3" strokeWidth={1.5}/>
              <Line type="monotone" dataKey="price" stroke="#3b82f6" strokeWidth={2} dot={{ r: 2, strokeWidth: 1, fill: '#3b82f6' }} activeDot={{ r: 4, strokeWidth: 1 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 flex justify-around text-xs text-muted-foreground">
          <div>{t('current_price_label', 'Current Price')}: <span className="font-semibold text-foreground">{formatCurrency(currentPrice)}</span></div>
          <div>{t('minimum_price_label', 'Minimum Price')}: <span className="font-semibold text-foreground">{formatCurrency(minPrice)}</span></div>
        </div>
      </CardContent>
    </Card>
  );
};

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: { date: string; price: number };
    value: number;
  }>;
  label?: string;
  currentLocale: string;
  currentCurrency: string;
  formatDate: (dateString: string) => string;
  formatCurrency: (value: number) => string;
}

// Store t function outside to avoid calling hook inside non-hook function
let translateFunc: (key: string, fallback?: string) => string;

const CustomTooltipContent: React.FC<CustomTooltipProps> = ({ active, payload, label, formatDate, formatCurrency }) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { t: translate } = useTranslation(); // Call hook at top level
  translateFunc = translate; // Assign to outer scope variable

  if (active && payload && payload.length && label) {
    return (
      <div className="custom-tooltip bg-background border p-2 rounded shadow-lg text-xs">
        <p className="label font-semibold">{formatDate(label)}</p>
        <p className="intro text-primary">{`${translateFunc('tooltip_price_label', 'Price')}: ${formatCurrency(payload[0].value)}`}</p>
      </div>
    );
  }
  return null;
};

export default PriceHistoryChart;
