
// Source: https://github.com/shadcn-ui/ui/blob/main/apps/www/registry/default/ui/chart.tsx
import * as React from "react"

import { cn } from "@/lib/utils"

export const useChartContext = React.createContext<{
  config?: Record<string, any>
}>({})

interface ChartContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  config: Record<string, any>
}

export function ChartContainer({
  children,
  config,
  className,
  ...props
}: ChartContainerProps) {
  return (
    <useChartContext.Provider value={{ config }}>
      <div className={cn("", className)} {...props}>
        {children}
      </div>
    </useChartContext.Provider>
  )
}

type ChartTooltipProps<TData extends object> = React.HTMLAttributes<HTMLDivElement> & {
  content: React.ReactNode
  labelKey?: string
  nameKey?: string
  format?: (value: any) => string
  formattedValue?: string
  payload?: TData[]
  active?: boolean
  label?: string
}

export function ChartTooltip<TData extends object>({
  className,
  content,
  labelKey = "name",
  nameKey = "name",
  format = (value) => value.toString(),
  ...props
}: ChartTooltipProps<TData>) {
  const { config } = React.useContext(useChartContext)

  if (!props.active || !props.payload?.length) {
    return null
  }

  return (
    <div
      className={cn(
        "border border-slate-200 rounded-md bg-white/80 bg-clip-padding backdrop-blur-md backdrop-filter shadow-md dark:bg-black/80 dark:border-slate-800",
        className
      )}
    >
      {React.isValidElement(content) ? (
        content
      ) : (
        <div className="p-2">
          {props.label ? (
            <div className="flex flex-1 items-center justify-between gap-8">
              <span className="font-medium">{props.label}</span>
            </div>
          ) : null}
          <div className="py-1">
            {props.payload.map((data, i) => {
              // @ts-ignore
              const name = data[nameKey]
              const dataKey = Object.keys(data?.payload || {}).find(
                (key) => key !== labelKey
              )
              const value = dataKey
                ? // @ts-ignore
                  data?.payload[dataKey]
                : // @ts-ignore
                  data.value

              // @ts-ignore
              const color = config?.[name]?.theme.light

              return (
                <div
                  key={`item-${i}`}
                  className="flex items-center justify-between gap-8"
                >
                  <div className="flex items-center gap-1">
                    <div
                      className="h-1 w-4 rounded-sm"
                      style={{ background: color }}
                    />
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {/* @ts-ignore */}
                      {data[nameKey]}
                    </span>
                  </div>
                  <span className="text-xs text-slate-900 dark:text-slate-100">
                    {/* @ts-ignore */}
                    {props.formattedValue || format(value)}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

interface ChartTooltipContentProps
  extends React.HTMLAttributes<HTMLDivElement> {
  labelKey?: string
  nameKey?: string
  format?: (value: any) => string
}

export function ChartTooltipContent({
  className,
  labelKey = "name",
  nameKey = "name",
  format = (value) => value.toString(),
  ...props
}: ChartTooltipContentProps) {
  const { config } = React.useContext(useChartContext)

  // @ts-ignore
  if (!props.active || !props.payload?.length) {
    return null
  }

  return (
    <div
      className={cn(
        "border border-slate-200 rounded-md bg-white/80 bg-clip-padding backdrop-blur-md backdrop-filter shadow-md dark:bg-black/80 dark:border-slate-800",
        className
      )}
    >
      <div className="p-2">
        {/* @ts-ignore */}
        {props.label ? (
          <div className="flex flex-1 items-center justify-between gap-8">
            {/* @ts-ignore */}
            <span className="font-medium">{props.label}</span>
          </div>
        ) : null}
        <div className="py-1">
          {/* @ts-ignore */}
          {props.payload.map((data, i) => {
            // @ts-ignore
            const name = data[nameKey]
            const dataKey = Object.keys(data?.payload || {}).find(
              (key) => key !== labelKey
            )
            const value = dataKey
              ? // @ts-ignore
                data?.payload[dataKey]
              : // @ts-ignore
                data.value

            // @ts-ignore
            const color = config?.[name]?.theme.light

            return (
              <div
                key={`item-${i}`}
                className="flex items-center justify-between gap-8"
              >
                <div className="flex items-center gap-1">
                  <div
                    className="h-1 w-4 rounded-sm"
                    style={{ background: color }}
                  />
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {/* @ts-ignore */}
                    {data[nameKey]}
                  </span>
                </div>
                <span className="text-xs text-slate-900 dark:text-slate-100">
                  {/* @ts-ignore */}
                  {props.formattedValue || format(value)}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
