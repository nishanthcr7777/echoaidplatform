import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { SignOutButton } from "../SignOutButton";
import { useState } from "react";

function ToggleSwitch({ label, enabled, setEnabled }: { label: string, enabled: boolean, setEnabled: (enabled: boolean) => void }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-gray-300">{label}</span>
      <button
        onClick={() => setEnabled(!enabled)}
        className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${
          enabled ? 'bg-blue-600' : 'bg-gray-600'
        }`}
      >
        <span
          className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
            enabled ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );
}

export default function Settings() {
  const loggedInUser = useQuery(api.auth.loggedInUser);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);
  const [smsAlerts, setSmsAlerts] = useState(true);

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Settings</h2>
        <p className="text-gray-400">Manage your account and notification preferences.</p>
      </div>

      {/* Profile Settings */}
      <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4">Profile Information</h3>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-400">Name</label>
            <p className="text-white mt-1">{loggedInUser?.name || "Admin User"}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-400">Email</label>
            <p className="text-white mt-1">{loggedInUser?.email || "admin@example.com"}</p>
          </div>
          <div className="pt-2">
            <SignOutButton />
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4">Notification Preferences</h3>
        <div className="space-y-4">
          <ToggleSwitch label="Email Notifications" enabled={emailNotifications} setEnabled={setEmailNotifications} />
          <ToggleSwitch label="Push Notifications" enabled={pushNotifications} setEnabled={setPushNotifications} />
          <ToggleSwitch label="SMS Alerts for Critical Events" enabled={smsAlerts} setEnabled={setSmsAlerts} />
        </div>
      </div>
    </div>
  );
}
