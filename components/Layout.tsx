import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import DashboardStats from "@/components/DashboardStats";
import DataTable from "@/components/DataTable";
import { Activity, TrendingUp, DollarSign } from "lucide-react";

export default function Dashboard() {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              Dashboard Overview
            </h1>
            <p className="text-gray-600">
              Welcome back! Here's what's happening with your store today.
            </p>
          </div>

          <DashboardStats />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Chart Placeholder */}
            <div className="lg:col-span-2 card p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Sales Overview
                  </h3>
                  <p className="text-sm text-gray-500">
                    Monthly revenue performance
                  </p>
                </div>
                <select className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm">
                  <option>Last 30 days</option>
                  <option>Last 90 days</option>
                  <option>This year</option>
                </select>
              </div>
              <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Sales chart visualization</p>
                  <p className="text-sm text-gray-400 mt-2">
                    (Chart would be implemented with a charting library)
                  </p>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="card p-6">
              <div className="flex items-center mb-6">
                <Activity className="w-5 h-5 text-gray-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Recent Activity
                </h3>
              </div>
              <div className="space-y-4">
                {[
                  {
                    time: "2 min ago",
                    action: "New order #1234 placed",
                    user: "John Smith",
                  },
                  {
                    time: "15 min ago",
                    action: 'Product "Wireless Earbuds" updated',
                    user: "You",
                  },
                  {
                    time: "1 hour ago",
                    action: "New user registered",
                    user: "Sarah Johnson",
                  },
                  {
                    time: "2 hours ago",
                    action: "Order #1231 shipped",
                    user: "System",
                  },
                  {
                    time: "5 hours ago",
                    action: "Payment of $299.99 received",
                    user: "Customer",
                  },
                ].map((activity, index) => (
                  <div key={index} className="flex items-start">
                    <div className="w-2 h-2 bg-primary-600 rounded-full mt-2 mr-3"></div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">{activity.action}</p>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs text-gray-500">
                          {activity.time}
                        </span>
                        <span className="text-xs text-primary-600">
                          {activity.user}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <DataTable />
        </main>
      </div>
    </div>
  );
}
