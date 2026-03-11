import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { cn } from '../../utils';
import type { KRI } from '../../types';

interface KRIGaugeChartProps {
  kri: KRI;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function KRIGaugeChart({ kri, size = 'md', className }: KRIGaugeChartProps) {
  // Calculate percentage position within the total range
  const maxThreshold = Math.max(kri.threshold.red.max, kri.threshold.amber.max, kri.threshold.green.max);
  const percentage = Math.min((kri.currentValue / maxThreshold) * 100, 100);

  // Gauge data (180 degree arc)
  const gaugeData = [
    { value: percentage, fill: 'currentColor' },
    { value: 100 - percentage, fill: '#1e293b' },
  ];

  const getStatusColor = () => {
    switch (kri.status) {
      case 'green':
        return '#10b981';
      case 'amber':
        return '#f59e0b';
      case 'red':
        return '#ef4444';
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return { container: 'h-24', value: 'text-lg', label: 'text-2xs' };
      case 'md':
        return { container: 'h-32', value: 'text-2xl', label: 'text-xs' };
      case 'lg':
        return { container: 'h-40', value: 'text-3xl', label: 'text-sm' };
    }
  };

  const sizeStyles = getSizeStyles();

  return (
    <div className={cn('relative', sizeStyles.container, className)}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={gaugeData}
            cx="50%"
            cy="75%"
            startAngle={180}
            endAngle={0}
            innerRadius="60%"
            outerRadius="90%"
            paddingAngle={0}
            dataKey="value"
            stroke="none"
          >
            {gaugeData.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={index === 0 ? getStatusColor() : '#1e293b'}
              />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>

      {/* Center value */}
      <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ paddingTop: '15%' }}>
        <span className={cn('font-bold text-navy-100', sizeStyles.value)}>
          {kri.currentValue}
          <span className={cn('font-normal text-navy-400', sizeStyles.label)}>{kri.unit}</span>
        </span>
      </div>
    </div>
  );
}
