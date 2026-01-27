import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { cn } from '../../utils';

interface DataPoint {
  date: string;
  critical: number;
  high: number;
  medium: number;
  low: number;
}

interface RiskTrendChartProps {
  data?: DataPoint[];
  className?: string;
}

const defaultData: DataPoint[] = [
  { date: 'Jan', critical: 2, high: 5, medium: 8, low: 12 },
  { date: 'Feb', critical: 2, high: 4, medium: 9, low: 11 },
  { date: 'Mar', critical: 3, high: 6, medium: 7, low: 13 },
  { date: 'Apr', critical: 2, high: 5, medium: 8, low: 12 },
  { date: 'May', critical: 3, high: 4, medium: 9, low: 10 },
  { date: 'Jun', critical: 2, high: 5, medium: 8, low: 12 },
];

export function RiskTrendChart({ data = defaultData, className }: RiskTrendChartProps) {
  return (
    <div className={cn('h-64', className)}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorCritical" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#dc2626" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#dc2626" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorHigh" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorMedium" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorLow" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
          <XAxis
            dataKey="date"
            stroke="#475569"
            tick={{ fill: '#64748b', fontSize: 12 }}
            axisLine={{ stroke: '#1e293b' }}
          />
          <YAxis
            stroke="#475569"
            tick={{ fill: '#64748b', fontSize: 12 }}
            axisLine={{ stroke: '#1e293b' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(15, 23, 42, 0.95)',
              border: '1px solid #334155',
              borderRadius: '8px',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)',
            }}
            labelStyle={{ color: '#e2e8f0', fontWeight: 600 }}
            itemStyle={{ color: '#94a3b8' }}
          />
          <Area
            type="monotone"
            dataKey="critical"
            stackId="1"
            stroke="#dc2626"
            fill="url(#colorCritical)"
            name="Critical"
          />
          <Area
            type="monotone"
            dataKey="high"
            stackId="1"
            stroke="#ef4444"
            fill="url(#colorHigh)"
            name="High"
          />
          <Area
            type="monotone"
            dataKey="medium"
            stackId="1"
            stroke="#f59e0b"
            fill="url(#colorMedium)"
            name="Medium"
          />
          <Area
            type="monotone"
            dataKey="low"
            stackId="1"
            stroke="#22c55e"
            fill="url(#colorLow)"
            name="Low"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
