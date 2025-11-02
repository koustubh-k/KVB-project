import React from "react";
import { useQuery } from "react-query";
import {
  Users,
  UserCheck,
  Package,
  ClipboardList,
  TrendingUp,
  AlertTriangle,
  DollarSign,
  Target,
} from "lucide-react";
import { adminAPI } from "@/lib/api";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import { Task, Product } from "@/types";

const DashboardStats: React.FC = () => {
  const { data: dashboardStats } = useQuery("admin-dashboard", () =>
    adminAPI.getDashboardStats().then((res) => res.data)
  );

  const { data: customers } = useQuery("admin-customers", () =>
    adminAPI.getAllCustomers().then((res) => res.data)
  );
  const { data: workers } = useQuery("admin-workers", () =>
    adminAPI.getAllWorkers().then((res) => res.data)
  );
  const { data: products } = useQuery("admin-products", () =>
    adminAPI.getAllProducts().then((res) => res.data)
  );
  const { data: tasks } = useQuery("admin-tasks", () =>
    adminAPI.getAllTasks().then((res) => res.data)
  );

  const stats = [
    {
      title: "Total Customers",
      value: dashboardStats?.totalCustomers || customers?.length || 0,
      icon: Users,
      color: "bg-blue-500",
      change: dashboardStats?.customerGrowth || "+12%",
      changeType: "positive" as const,
    },
    {
      title: "Active Workers",
      value: dashboardStats?.totalWorkers || workers?.length || 0,
      icon: UserCheck,
      color: "bg-green-500",
      change: dashboardStats?.workerGrowth || "+5%",
      changeType: "positive" as const,
    },
    {
      title: "Total Products",
      value: dashboardStats?.totalProducts || products?.length || 0,
      icon: Package,
      color: "bg-purple-500",
      change: dashboardStats?.productGrowth || "+8%",
      changeType: "positive" as const,
    },
    {
      title: "Active Tasks",
      value:
        dashboardStats?.activeTasks ||
        tasks?.filter(
          (task: Task) =>
            task.status !== "completed" && task.status !== "cancelled"
        ).length ||
        0,
      icon: ClipboardList,
      color: "bg-orange-500",
      change: dashboardStats?.taskGrowth || "-3%",
      changeType: "negative" as const,
    },
  ];

  const taskStatusCounts = tasks
    ? {
        pending: tasks.filter((t: Task) => t.status === "pending").length,
        inProgress: tasks.filter((t: Task) => t.status === "in-progress")
          .length,
        completed: tasks.filter((t: Task) => t.status === "completed").length,
        cancelled: tasks.filter((t: Task) => t.status === "cancelled").length,
      }
    : { pending: 0, inProgress: 0, completed: 0, cancelled: 0 };

  const lowStockProducts =
    products?.filter((p: Product) => (p.stock || 0) < 10) || [];
  const highPriorityTasks =
    tasks?.filter(
      (t: Task) => t.priority === "high" && t.status !== "completed"
    ) || [];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.title} className="relative">
              <GlowingEffect
                spread={40}
                glow={true}
                disabled={false}
                proximity={64}
                inactiveZone={0.01}
                borderWidth={3}
                className="rounded-lg"
              />
              <div className="card">
                <div className="card-content">
                  <div className="flex items-center">
                    <div className={`${stat.color} rounded-lg p-3`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-400">
                        {stat.title}
                      </p>
                      <div className="flex items-center">
                        <p className="text-2xl font-semibold text-white">
                          {stat.value}
                        </p>
                        <span
                          className={`ml-2 text-sm ${
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
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts and Additional Info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Task Status Distribution */}
        <div className="relative">
          <GlowingEffect
            spread={50}
            glow={true}
            disabled={false}
            proximity={64}
            inactiveZone={0.01}
            borderWidth={4}
            className="rounded-lg"
          />
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-semibold text-white">
                Task Status Overview
              </h3>
            </div>
            <div className="card-content">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full mr-3"></div>
                    <span className="text-sm text-gray-400">Pending</span>
                  </div>
                  <span className="text-sm font-semibold text-white">
                    {taskStatusCounts.pending}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                    <span className="text-sm text-gray-400">In Progress</span>
                  </div>
                  <span className="text-sm font-semibold text-white">
                    {taskStatusCounts.inProgress}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                    <span className="text-sm text-gray-400">Completed</span>
                  </div>
                  <span className="text-sm font-semibold text-white">
                    {taskStatusCounts.completed}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-red-500 rounded-full mr-3"></div>
                    <span className="text-sm text-gray-400">Cancelled</span>
                  </div>
                  <span className="text-sm font-semibold text-white">
                    {taskStatusCounts.cancelled}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Alerts and Notifications */}
        <div className="relative">
          <GlowingEffect
            spread={50}
            glow={true}
            disabled={false}
            proximity={64}
            inactiveZone={0.01}
            borderWidth={4}
            className="rounded-lg"
          />
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-semibold text-white">
                Alerts & Notifications
              </h3>
            </div>
            <div className="card-content">
              <div className="space-y-4">
                {/* Low Stock Alert */}
                {lowStockProducts.length > 0 && (
                  <div className="flex items-start p-3 bg-yellow-900 rounded-lg">
                    <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-yellow-200">
                        Low Stock Alert
                      </p>
                      <p className="text-sm text-yellow-300">
                        {lowStockProducts.length} product(s) have low stock
                        levels
                      </p>
                    </div>
                  </div>
                )}

                {/* High Priority Tasks */}
                {highPriorityTasks.length > 0 && (
                  <div className="flex items-start p-3 bg-red-900 rounded-lg">
                    <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-red-200">
                        High Priority Tasks
                      </p>
                      <p className="text-sm text-red-300">
                        {highPriorityTasks.length} high priority task(s) need
                        attention
                      </p>
                    </div>
                  </div>
                )}

                {/* Performance Indicator */}
                <div className="flex items-start p-3 bg-green-900 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-green-400 mt-0.5 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-green-200">
                      System Performance
                    </p>
                    <p className="text-sm text-green-300">
                      All systems operational and performing well
                    </p>
                  </div>
                </div>

                {lowStockProducts.length === 0 &&
                  highPriorityTasks.length === 0 && (
                    <div className="text-center py-4">
                      <p className="text-sm text-gray-400">
                        No alerts at this time
                      </p>
                    </div>
                  )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="relative">
        <GlowingEffect
          spread={50}
          glow={true}
          disabled={false}
          proximity={64}
          inactiveZone={0.01}
          borderWidth={4}
          className="rounded-lg"
        />
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-white">
              Recent Activity
            </h3>
          </div>
          <div className="card-content">
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                <span className="text-sm text-gray-400">
                  New customer registration
                </span>
                <span className="ml-auto text-xs text-gray-500">
                  2 hours ago
                </span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                <span className="text-sm text-gray-400">
                  Task assigned to worker
                </span>
                <span className="ml-auto text-xs text-gray-500">
                  4 hours ago
                </span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                <span className="text-sm text-gray-400">
                  New product added to catalog
                </span>
                <span className="ml-auto text-xs text-gray-500">
                  6 hours ago
                </span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></div>
                <span className="text-sm text-gray-400">
                  Task status updated
                </span>
                <span className="ml-auto text-xs text-gray-500">1 day ago</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;
