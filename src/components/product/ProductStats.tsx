"use client"


interface StatCardProps {
  label: string
  value: number
  color?: string
}

export function ProductStats({ stats }: { stats: StatCardProps[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {stats.map((stat, i) => (
        <div
          key={i}
          className="bg-white rounded-xl shadow p-4 text-center border"
        >
          <p className={`text-xl font-bold ${stat.color || "text-gray-900"}`}>
            {stat.value}
          </p>
          <p className="text-gray-600">{stat.label}</p>
        </div>
      ))}
    </div>
  )
}
