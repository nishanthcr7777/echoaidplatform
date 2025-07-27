import {
      ChartBarIcon,
      Cog6ToothIcon,
      HomeIcon,
      ListBulletIcon,
      MapIcon,
      PhoneArrowUpRightIcon,
    } from "@heroicons/react/24/outline";
    
    interface SidebarProps {
      activeTab: string;
      setActiveTab: (tab: string) => void;
      notifications: number;
    }
    
    export default function Sidebar({ activeTab, setActiveTab, notifications }: SidebarProps) {
      const menuItems = [
        { id: "dashboard", label: "Dashboard", icon: HomeIcon },
        { id: "live-requests", label: "Live Requests", icon: ListBulletIcon, notificationCount: notifications },
        { id: "analytics", label: "Analytics", icon: ChartBarIcon },
        { id: "ngo-routing", label: "NGO Routing", icon: MapIcon },
        { id: "ongoing-calls", label: "Ongoing Calls", icon: PhoneArrowUpRightIcon },
        { id: "settings", label: "Settings", icon: Cog6ToothIcon },
      ];
    
      return (
        <div className="w-64 bg-gray-800 border-r border-gray-700 flex flex-col">
          <div className="p-6">
            <h2 className="text-xl font-bold text-white">Menu</h2>
          </div>
          <nav className="flex-1 px-4 space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === item.id
                    ? "bg-blue-600 text-white"
                    : "text-gray-300 hover:bg-gray-700"
                }`}
              >
                <item.icon className="w-6 h-6" />
                <span className="font-medium">{item.label}</span>
                {item.notificationCount && item.notificationCount > 0 && (
                  <span className="ml-auto bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center">
                    {item.notificationCount}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>
      );
    }
