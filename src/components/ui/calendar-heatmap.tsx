import * as React from 'react';
import { subDays, format, parseISO, isSameDay } from 'date-fns';
import { cn } from '@/lib/utils';
import { Card } from './card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './tooltip';

export interface HeatmapData {
  date: string | Date;
  value: number;
  label?: string;
}

interface CalendarHeatmapProps {
  data: HeatmapData[];
  startDate?: Date;
  numDays?: number;
  colorScale?: string[];
  className?: string;
  daySize?: number;
  gap?: number;
  showTooltip?: boolean;
  formatTooltip?: (data: HeatmapData) => string;
  onDayClick?: (data: HeatmapData) => void;
}

export function CalendarHeatmap({
  data,
  startDate = new Date(),
  numDays = 365,
  colorScale = [
    'var(--primary)',
    'rgba(var(--primary), 0.8)',
    'rgba(var(--primary), 0.6)',
    'rgba(var(--primary), 0.4)',
    'rgba(var(--primary), 0.2)',
  ],
  className,
  daySize = 10,
  gap = 2,
  showTooltip = true,
  formatTooltip,
  onDayClick,
}: CalendarHeatmapProps) {
  const endDate = React.useMemo(() => startDate, [startDate]);
  const dates = React.useMemo(
    () =>
      Array.from({ length: numDays }, (_, i) =>
        subDays(endDate, numDays - i - 1)
      ),
    [endDate, numDays]
  );

  const maxValue = React.useMemo(
    () => Math.max(...data.map((d) => d.value)),
    [data]
  );

  const getColorIndex = React.useCallback(
    (value: number) => {
      if (value === 0) return colorScale.length - 1;
      const step = maxValue / (colorScale.length - 1);
      return Math.min(
        Math.floor(value / step),
        colorScale.length - 1
      );
    },
    [maxValue, colorScale]
  );

  const weeks = React.useMemo(() => {
    const result: Date[][] = [];
    let currentWeek: Date[] = [];

    dates.forEach((date) => {
      currentWeek.push(date);
      if (currentWeek.length === 7) {
        result.push(currentWeek);
        currentWeek = [];
      }
    });

    if (currentWeek.length > 0) {
      result.push(currentWeek);
    }

    return result;
  }, [dates]);

  const defaultFormatTooltip = React.useCallback(
    (heatmapData: HeatmapData) => {
      const date =
        typeof heatmapData.date === 'string'
          ? parseISO(heatmapData.date)
          : heatmapData.date;
      return `${format(date, 'PP')}: ${heatmapData.value}${
        heatmapData.label ? ` ${heatmapData.label}` : ''
      }`;
    },
    []
  );

  return (
    <Card className={cn('p-4', className)}>
      <div
        className="grid gap-1"
        style={{
          gridTemplateColumns: `repeat(${Math.ceil(
            numDays / 7
          )}, ${daySize}px)`,
          gap: `${gap}px`,
        }}
      >
        {weeks.map((week, weekIndex) =>
          week.map((day, dayIndex) => {
            const dayData = data.find((d) =>
              isSameDay(
                typeof d.date === 'string'
                  ? parseISO(d.date)
                  : d.date,
                day
              )
            );

            const colorIndex = dayData
              ? getColorIndex(dayData.value)
              : colorScale.length - 1;

            return (
              <TooltipProvider key={day.toISOString()}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div
                      className={cn(
                        'rounded-sm',
                        onDayClick &&
                          dayData &&
                          'cursor-pointer hover:ring-2 hover:ring-ring hover:ring-offset-1'
                      )}
                      style={{
                        width: daySize,
                        height: daySize,
                        backgroundColor: colorScale[colorIndex],
                      }}
                      onClick={() =>
                        dayData && onDayClick?.(dayData)
                      }
                      role={onDayClick ? 'button' : 'presentation'}
                    />
                  </TooltipTrigger>
                  {showTooltip && dayData && (
                    <TooltipContent>
                      {(formatTooltip || defaultFormatTooltip)(
                        dayData
                      )}
                    </TooltipContent>
                  )}
                </Tooltip>
              </TooltipProvider>
            );
          })
        )}
      </div>
      <div className="mt-4 flex items-center justify-end gap-2">
        <span className="text-sm text-muted-foreground">
          Less
        </span>
        {colorScale.map((color, i) => (
          <div
            key={i}
            className="h-3 w-3 rounded-sm"
            style={{ backgroundColor: color }}
          />
        ))}
        <span className="text-sm text-muted-foreground">
          More
        </span>
      </div>
    </Card>
  );
}

// Type-safe heatmap data helpers
export function aggregateHeatmapData(
  data: HeatmapData[],
  options?: {
    groupBy?: 'day' | 'week' | 'month';
    aggregator?: (values: number[]) => number;
  }
): HeatmapData[] {
  const { groupBy = 'day', aggregator = (values) => values.reduce((a, b) => a + b, 0) } = options || {};

  const grouped = data.reduce((acc, item) => {
    const date = typeof item.date === 'string' ? parseISO(item.date) : item.date;
    const key = format(date, {
      day: 'yyyy-MM-dd',
      week: 'yyyy-ww',
      month: 'yyyy-MM',
    }[groupBy]);

    if (!acc[key]) {
      acc[key] = {
        date: key,
        values: [],
      };
    }

    acc[key].values.push(item.value);
    return acc;
  }, {} as Record<string, { date: string; values: number[] }>);

  return Object.values(grouped).map((group) => ({
    date: group.date,
    value: aggregator(group.values),
  }));
}

export function normalizeHeatmapValues(
  data: HeatmapData[],
  options?: {
    min?: number;
    max?: number;
    scale?: [number, number];
  }
): HeatmapData[] {
  const { scale = [0, 1] } = options || {};
  const values = data.map((d) => d.value);
  const min = options?.min ?? Math.min(...values);
  const max = options?.max ?? Math.max(...values);
  const range = max - min;

  return data.map((item) => ({
    ...item,
    value:
      range === 0
        ? scale[0]
        : scale[0] +
          ((item.value - min) / range) * (scale[1] - scale[0]),
  }));
}