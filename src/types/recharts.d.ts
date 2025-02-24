declare module 'recharts' {
  import { ComponentType } from 'react';

  interface BaseProps {
    width?: number | string;
    height?: number | string;
    data?: any[];
    className?: string;
    style?: React.CSSProperties;
  }

  interface TooltipProps {
    formatter?: (value: any, name?: string, props?: any) => [string | number];
  }

  interface LegendProps {
    verticalAlign?: 'top' | 'middle' | 'bottom';
    align?: 'left' | 'center' | 'right';
  }

  interface CartesianGridProps {
    strokeDasharray?: string;
  }

  interface XAxisProps {
    dataKey?: string;
  }

  interface YAxisProps {
    width?: number;
  }

  interface BarProps {
    dataKey: string;
    name?: string;
    fill?: string;
    stroke?: string;
  }

  interface ResponsiveContainerProps extends BaseProps {
    aspect?: number;
    minWidth?: number;
    minHeight?: number;
    debounce?: number;
  }

  interface BarChartProps extends BaseProps {
    layout?: 'horizontal' | 'vertical';
    barCategoryGap?: number | string;
    barGap?: number | string;
  }

  export const ResponsiveContainer: ComponentType<ResponsiveContainerProps>;
  export const BarChart: ComponentType<BarChartProps>;
  export const Bar: ComponentType<BarProps>;
  export const XAxis: ComponentType<XAxisProps>;
  export const YAxis: ComponentType<YAxisProps>;
  export const CartesianGrid: ComponentType<CartesianGridProps>;
  export const Tooltip: ComponentType<TooltipProps>;
  export const Legend: ComponentType<LegendProps>;
}
