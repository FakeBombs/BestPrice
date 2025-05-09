import React, { useMemo } from 'react'; // Removed useState as timeRange is a prop
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, CartesianGrid } from 'recharts';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'; // Added CardDescription
import { useTranslation } from '@/hooks/useTranslation'; // Import translation hook

// --- Helper Functions (Moved inside or kept as is if broadly used) ---
export const generatePriceData = (basePrice: number, days: number) => {
  const data = [];
  const now = new Date();
  // Ensure basePrice is a number
  const numericBasePrice = typeof basePrice === 'number' && !isNaN(basePrice) ? basePrice : 100; // Default to 100 if invalid

  for (let i = days - 1; i >= 0; i--) { // Iterate from past to present for correct chart order
    const date = new Date();
    date.setDate(now.getDate() - i);
    // Ensure variation doesn't make price negative or too low if basePrice is small
    const variationFactor = (Math.random() * 0.2) - 0.1; // +/- 10% variation
    let price = numericBasePrice * (1 + variationFactor);
    price = Math.max(price, numericBasePrice * 0.5, 1); // Ensure price is at least 50% of base, and at least 1
    
    data.push({
      date: date.toISOString().split('T')[0],
      price: parseFloat(price.toFixed(2)),
    });
  }
  // Add current day if not already included (or adjust loop to ensure it is)
  if (!data.find(d => d.date === now.toISOString().split('T')[0])) {
    data.push({
        date: now.toISOString().split('T')[0],
        price: parseFloat(numericBasePrice.toFixed(2)) // Current price is assumed to be basePrice for this mock
    });
  }
  return data.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()); // Ensure sorted by date
};

export const getDaysFromRange = (range: string): number => {
  switch (range) {
    case '1m': return 30;
    case '3m': return 90;
    case '6m': return 180;
    case '1y': return 365;
    default: return 30; // Default to 1 month
  }
};

// --- Currency/Locale Formatting (from ProductCard) ---
const localeCurrencyMap: Record<string, { locale: string; currency: string }> = {
  el: { locale: 'el-GR', currency: 'EUR' },
  en: { locale: 'en-GB', currency: 'GBP' },
  de: { locale: 'de-DE', currency: 'EUR' },
  es: { locale: 'es-ES', currency: 'EUR' },
  fr: { locale: 'fr-FR', currency: 'EUR' },
};
const defaultLocale = 'el-GR';
const defaultCurrency = 'EUR';
// --- End Currency/Locale Formatting ---


interface PriceHistoryChartProps {
  productId: number; // Not used in this mock version, but good to keep for real data
  basePrice: number; // This is the "current" price for mock data generation
  timeRange: '1m' | '3m' | '6m' | '1y';
  setTimeRange: (range: '1m' | '3m' | '6m' | '1y') => void; // Corrected type
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
    } catch (e) {
        return dateString; // Fallback
    }
  };
  
  const formatDateForTooltip = (dateString: string) => {
    try {
        return new Date(dateString).toLocaleDateString(currentLocale, { year: 'numeric', month: 'long', day: 'numeric' });
    } catch (e) {
        return dateString; // Fallback
    }
  };


  const priceData = useMemo(() => {
    // Ensure basePrice is valid before generating data
    if (typeof basePrice !== 'number' || isNaN(basePrice) || basePrice <= 0) {
      return []; // Return empty if basePrice is invalid
    }
    return generatePriceData(basePrice, getDaysFromRange(timeRange));
  }, [basePrice, timeRange]);

  const { minPrice, currentPrice, avgPrice } = useMemo(() => {
    if (!priceData || priceData.length === 0) return { minPrice: 0, currentPrice: basePrice, avgPrice: 0 }; // Use basePrice for current if no data
    
    const prices = priceData.map(item => item.price);
    const min = Math.min(...prices);
    const current = priceData[priceData.length - 1]?.price || basePrice; // Use basePrice if last item is missing
    const sum = prices.reduce((acc, val) => acc + val, 0);
    const avg = prices.length > 0 ? sum / prices.length : 0;
    
    return { minPrice: min, currentPrice: current, avgPrice: avg };
  }, [priceData, basePrice]);


  if (!priceData || priceData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t('price_history_title', 'Price History')}</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{t('no_price_data_available', 'No price data available for the selected range.')}</p>
        </CardContent>
      </Card>
    );
  }

  // For Y-axis domain, add some padding
  const yAxisDomain = [
    Math.floor(minPrice * 0.95), // 5% padding below min
    Math.ceil(Math.max(...priceData.map(p => p.price), currentPrice) * 1.05) // 5% padding above max
  ];


  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-medium">
          {t('price_history_title', 'Price History')}
        </CardTitle>
        <div className="flex items-center space-x-1">
          {(['1m', '3m', '6m', '1y'] as const).map(range => (
            <Button
              key={range}
              variant={timeRange === range ? 'default' : 'outline'}
              size="sm" // Smaller buttons
              onClick={() => setTimeRange(range)}
              className="px-2 text-xs" // More compact padding
            >
              {t(`time_range_${range}` as any, range.toUpperCase())} {/* Use translation keys */}
            </Button>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        <div className="chart-container" style={{ height: 300, width: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={priceData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}> {/* Adjusted margins */}
              <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.5} />
              <XAxis 
                dataKey="date" 
                tickFormatter={formatDateForAxis} 
                tick={{ fontSize: 10 }} 
                axisLine={{ strokeOpacity: 0.5 }}
                tickLine={{ strokeOpacity: 0.5 }}
              />
              <YAxis 
                tickFormatter={(value) => formatCurrency(value)} 
                domain={yAxisDomain} 
                tick={{ fontSize: 10 }} 
                axisLine={{ strokeOpacity: 0.5 }}
                tickLine={{ strokeOpacity: 0.5 }}
                allowDecimals={false} // Show whole numbers or adjust as needed
              />
              <Tooltip content={<CustomTooltipContent currentLocale={currentLocale} currentCurrency={currentCurrency} formatDate={formatDateForTooltip} formatCurrency={formatCurrency}/>} />
              <ReferenceLine y={currentPrice} label={{ value: t('current_price_label', 'Current'), position: 'insideRight', fill: '#dc2626', fontSize: 10 }} stroke="#dc2626" strokeDasharray="3 3" strokeWidth={1.5} />
              <ReferenceLine y={minPrice} label={{ value: t('minimum_price_label', 'Min'), position: 'insideRight', fill: '#16a34a', fontSize: 10 }} stroke="#16a34a" strokeDasharray="3 3" strokeWidth={1.5}/>
              <Line type="monotone" dataKey="price" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3, strokeWidth: 1, fill: '#3b82f6' }} activeDot={{ r: 5, strokeWidth: 1 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 flex justify-around text-xs text-muted-foreground">
          <div>{t('current_price_label', 'Current Price')}: <span className="font-semibold text-foreground">{formatCurrency(currentPrice)}</span></div>
          <div>{t('minimum_price_label', 'Minimum Price')}: <span className="font-semibold text-foreground">{formatCurrency(minPrice)}</span></div>
          {/* <div>Avg Price: <span className="font-semibold text-foreground">{formatCurrency(avgPrice)}</span></div> */}
        </div>
      </CardContent>
    </Card>
  );
};

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: { date: string; price: number }; // Assuming your data structure
    value: number; // This is typically the price for the 'price' dataKey
    // Add other properties if your payload structure is different
  }>;
  label?: string; // This is typically the x-axis value (date string)
  currentLocale: string;
  currentCurrency: string;
  formatDate: (dateString: string) => string;
  formatCurrency: (value: number) => string;
}

const CustomTooltipContent: React.FC<CustomTooltipProps> = ({ active, payload, label, formatDate, formatCurrency }) => {
  if (active && payload && payload.length && label) {
    return (
      <div className="custom-tooltip bg-background border p-2 rounded shadow-lg text-xs">
        <p className="label font-semibold">{formatDate(label)}</p>
        <p className="intro text-primary">{`${t('tooltip_price_label', 'Price')}: ${formatCurrency(payload[0].value)}`}</p>
        {/* You can add more info from payload[0].payload if needed */}
      </div>
    );
  }
  return null;
};

// Helper function for useTranslation hook inside CustomTooltipContent
// This is a bit of a workaround since hooks can't be called conditionally.
// For a cleaner solution, pass `t` function directly as a prop to CustomTooltipContent.
const t = (key: string, fallback: string) => {
    const { t: translateFunc } = useTranslation();
    return translateFunc(key, fallback);
};


export default PriceHistoryChart;
