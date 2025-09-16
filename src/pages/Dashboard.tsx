import { useAuthStore } from "@/stores/authStore";
import { Users, BarChart3, Activity, TrendingUp } from "lucide-react";

export function Dashboard() {
  const { user } = useAuthStore();

  const stats = [
    {
      name: "Total Users",
      value: "1,234",
      change: "+12%",
      changeType: "positive",
      icon: Users,
    },
    {
      name: "Active Sessions",
      value: "567",
      change: "+8%",
      changeType: "positive",
      icon: Activity,
    },
    {
      name: "Page Views",
      value: "12.5K",
      change: "+23%",
      changeType: "positive",
      icon: BarChart3,
    },
    {
      name: "Conversion Rate",
      value: "3.2%",
      change: "-2%",
      changeType: "negative",
      icon: TrendingUp,
    },
  ];

  return (
    <div className="space-y-6 py-10 px-10">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold">Welcome back, {user?.username}!</h1>
        <p className="mt-2 opacity-90">
          Here's what's happening with your MediCare Pro dashboard today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {stat.name}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Icon className="h-8 w-8 text-primary-600" />
                  <span
                    className={`text-sm font-medium ${
                      stat.changeType === "positive"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {stat.change}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Recent Activity
          </h3>
          <div className="space-y-3">
            {[
              {
                action: "New user registered",
                time: "2 minutes ago",
                type: "user",
              },
              {
                action: "System backup completed",
                time: "1 hour ago",
                type: "system",
              },
              {
                action: "Data export finished",
                time: "3 hours ago",
                type: "export",
              },
              {
                action: "User profile updated",
                time: "5 hours ago",
                type: "user",
              },
            ].map((activity, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <div
                    className={`h-2 w-2 rounded-full ${
                      activity.type === "user"
                        ? "bg-blue-500"
                        : activity.type === "system"
                        ? "bg-green-500"
                        : "bg-purple-500"
                    }`}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">{activity.action}</p>
                  <p className="text-sm text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Quick Actions
          </h3>
          <div className="space-y-3">
            <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
              <div className="font-medium text-gray-900">Add New User</div>
              <div className="text-sm text-gray-500">
                Create a new user account
              </div>
            </button>
            <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
              <div className="font-medium text-gray-900">Generate Report</div>
              <div className="text-sm text-gray-500">
                Export system analytics
              </div>
            </button>
            <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
              <div className="font-medium text-gray-900">System Settings</div>
              <div className="text-sm text-gray-500">
                Configure application settings
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
