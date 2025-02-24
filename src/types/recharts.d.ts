declare module 'recharts' {
  import { ComponentType, ReactNode } from 'react';

  interface BaseProps {
    width?: number | string;
    height?: number | string;
    data?: any[];
    className?: string;
    style?: React.CSSProperties;
    children?: ReactNode;
  }

  interface TooltipProps {
    formatter?: (value: number, name?: string, props?: any) => [string] | string;
    separator?: string;
    offset?: number;
    itemStyle?: React.CSSProperties;
    wrapperStyle?: React.CSSProperties;
    labelStyle?: React.CSSProperties;
    cursor?: boolean | React.ReactElement | object;
    viewBox?: {
      x?: number;
      y?: number;
      width?: number;
      height?: number;
    };
    active?: boolean;
    coordinate?: {
      x: number;
      y: number;
    };
    payload?: Array<{
      value: any;
      name: string;
      dataKey: string | number;
      payload: any;
    }>;
    label?: string | number;
  }

  interface LegendProps {
    width?: number;
    height?: number;
    layout?: 'horizontal' | 'vertical';
    align?: 'left' | 'center' | 'right';
    verticalAlign?: 'top' | 'middle' | 'bottom';
    payload?: Array<{
      value: any;
      type?: string;
      id?: string;
      color?: string;
    }>;
  }

  interface CartesianGridProps {
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    horizontal?: boolean;
    vertical?: boolean;
    horizontalPoints?: number[];
    verticalPoints?: number[];
    strokeDasharray?: string;
  }

  interface XAxisProps {
    allowDecimals?: boolean;
    hide?: boolean;
    name?: string | number;
    unit?: string | number;
    domain?: Array<string | number | ((dataMin: number, dataMax: number) => number)>;
    dataKey?: string;
    type?: 'number' | 'category';
    tickFormatter?: (value: any) => string;
    stroke?: string;
  }

  interface YAxisProps extends XAxisProps {}

  interface BarProps {
    dataKey: string;
    fill?: string;
    name?: string;
    unit?: string | number;
    strokeWidth?: number;
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
    barSize?: number;
    maxBarSize?: number;
  }

  export const BarChart: ComponentType<BarChartProps>;
  export const Bar: ComponentType<BarProps>;
  export const XAxis: ComponentType<XAxisProps>;
  export const YAxis: ComponentType<YAxisProps>;
  export const CartesianGrid: ComponentType<CartesianGridProps>;
  export const Tooltip: ComponentType<TooltipProps>;
  export const Legend: ComponentType<LegendProps>;
  export const ResponsiveContainer: ComponentType<ResponsiveContainerProps>;
}
