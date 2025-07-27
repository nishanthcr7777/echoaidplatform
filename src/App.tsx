import { Authenticated, Unauthenticated, useQuery, useMutation } from "convex/react";
    import { api } from "../convex/_generated/api";
    import { SignInForm } from "./SignInForm";
    import { SignOutButton } from "./SignOutButton";
    import { Toaster } from "sonner";
    import { useState, useEffect } from "react";
    import Dashboard from "./components/Dashboard";
    import LiveRequests from "./components/LiveRequests";
    import Analytics from "./components/Analytics";
    import NgoRouting from "./components/NgoRouting";
    import Settings from "./components/Settings";
    import Sidebar from "./components/Sidebar";
    import VoiceCallInterface from "./components/VoiceCallInterface";
    import OngoingCalls from "./components/OngoingCalls";

    export default function App() {
      return (
        <div className="min-h-screen bg-gray-900 text-white">
          <Authenticated>
            <AdminDashboard />
          </Authenticated>
          <Unauthenticated>
            <LoginPage />
          </Unauthenticated>
          <Toaster theme="dark" />
        </div>
      );
    }

    function LoginPage() {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900">
          <div className="w-full max-w-md mx-auto p-8">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-blue-400 mb-2">EchoAid Admin</h1>
              <p className="text-gray-400">Emergency Response Management System</p>
            </div>
            <SignInForm />
          </div>
        </div>
      );
    }

    function AdminDashboard() {
      const [activeTab, setActiveTab] = useState("live-requests");
      const [notifications, setNotifications] = useState(0);

      const loggedInUser = useQuery(api.auth.loggedInUser);
      const initializeNgos = useMutation(api.ngos.initializeNgos);

      useEffect(() => {
        initializeNgos();
      }, [initializeNgos]);

      const renderContent = () => {
        switch (activeTab) {
          case "dashboard":
            return <Dashboard />;
          case "live-requests":
            return <LiveRequests onNewRequest={() => setNotifications(prev => prev + 1)} />;
          case "analytics":
            return <Analytics />;
          case "ngo-routing":
            return <NgoRouting />;
          case "ongoing-calls":
            return <OngoingCalls />;
          case "settings":
            return <Settings />;
          default:
            return <Dashboard />;
        }
      };

      return (
        <div className="relative min-h-screen">
          <div className="flex h-screen bg-gray-900">
            <Sidebar
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              notifications={notifications}
            />
            <div className="flex-1 flex flex-col overflow-hidden">
              <header className="bg-gray-800 border-b border-gray-700 px-6 py-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h1 className="text-2xl font-bold text-blue-400">EchoAid Admin</h1>
                    <p className="text-gray-400 text-sm">Emergency Response Management</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm text-gray-300">Welcome back,</p>
                      <p className="font-semibold">{loggedInUser?.name || "Admin"}</p>
                    </div>
                    <SignOutButton />
                  </div>
                </div>
              </header>
              <main className="flex-1 overflow-y-auto p-6">
                {renderContent()}
              </main>
            </div>
          </div>
          <VoiceCallInterface />
        </div>
      );
    }
