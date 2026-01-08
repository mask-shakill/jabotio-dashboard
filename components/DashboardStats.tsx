// components/DashboardStats.tsx
import {
  DollarSign,
  Package,
  ShoppingCart,
  Users,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

const stats = [
  {
    title: "Total Revenue",
    value: "$54,231",
    change: "+12.5%",
    trend: "up",
    icon: DollarSign,
    color: "bg-green-100 text-green-600",
  },
  {
    title: "Total Products",
    value: "2,345",
    change: "+3.2%",
    trend: "up",
    icon: Package,
    color: "bg-blue-100 text-blue-600",
  },
  {
    title: "Total Orders",
    value: "1,234",
    change: "-2.1%",
    trend: "down",
    icon: ShoppingCart,
    color: "bg-purple-100 text-purple-600",
  },
  {
    title: "Total Users",
    value: "5,678",
    change: "+5.7%",
    trend: "up",
    icon: Users,
    color: "bg-orange-100 text-orange-600",
  },
];

export default function DashboardStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div key={index} className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <div className="flex items-center mt-2">
                  {stat.trend === "up" ? (
                    <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                  )}
                  <span
                    className={`text-sm ${
                      stat.trend === "up" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {stat.change}
                  </span>
                  <span className="text-sm text-gray-500 ml-1">
                    from last month
                  </span>
                </div>
              </div>
              <div className={`p-3 rounded-full ${stat.color}`}>
                <Icon className="w-6 h-6" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
