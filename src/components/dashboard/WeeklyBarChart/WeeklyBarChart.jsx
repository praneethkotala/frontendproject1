import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { format, subDays } from 'date-fns'
import './WeeklyBarChart.css'

export const WeeklyBarChart = ({ daywiseData = [] }) => {
  // Build 7 consecutive days data
  const processChartData = () => {
    // Generate last 7 days template
    const daysMap = {}
    for (let i = 6; i >= 0; i--) {
      const d = subDays(new Date(), i)
      const dayKey = format(d, 'EEE') // e.g. Mon, Tue
      daysMap[dayKey] = {
        day: dayKey,
        Credit: 0,
        Debit: 0,
      }
    }

    if (Array.isArray(daywiseData) && daywiseData.length > 0) {
      daywiseData.forEach((item) => {
        try {
          const itemDate = new Date(item.date)
          const dayKey = format(itemDate, 'EEE')
          const amount = Number(item.sum) || 0
          if (!daysMap[dayKey]) {
            daysMap[dayKey] = { day: dayKey, Credit: 0, Debit: 0 }
          }
          if (item.type === 'credit') {
            daysMap[dayKey].Credit += amount
          } else if (item.type === 'debit') {
            daysMap[dayKey].Debit += amount
          }
        } catch {
          // Ignore invalid dates
        }
      })
    }

    return Object.values(daysMap)
  }

  const chartData = processChartData()

  const customTooltipFormatter = (value, name) => [
    `$${Number(value).toLocaleString()}`,
    name,
  ]

  return (
    <div className="weekly-bar-chart-card">
      <div className="chart-header">
        <h3 className="chart-title">Debit & Credit Overview</h3>
      </div>
      <div className="chart-container">
        <ResponsiveContainer width="100%" height={280}>
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 20, left: -10, bottom: 5 }}
            barGap={8}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f2f5" />
            <XAxis
              dataKey="day"
              stroke="#718ebf"
              fontSize={12}
              tickLine={false}
              axisLine={{ stroke: '#e6eff5' }}
            />
            <YAxis
              stroke="#718ebf"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `$${v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}`}
            />
            <Tooltip
              formatter={customTooltipFormatter}
              contentStyle={{
                backgroundColor: '#ffffff',
                border: '1px solid #e6eff5',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              }}
            />
            <Legend
              verticalAlign="top"
              align="right"
              iconType="circle"
              wrapperStyle={{ paddingBottom: '16px', fontSize: '13px' }}
            />
            <Bar
              dataKey="Credit"
              fill="#4D78FF"
              radius={[6, 6, 0, 0]}
              barSize={18}
            />
            <Bar
              dataKey="Debit"
              fill="#FCAA0B"
              radius={[6, 6, 0, 0]}
              barSize={18}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
