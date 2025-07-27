import { ClockIcon, CheckCircleIcon, ExclamationCircleIcon, FireIcon } from "@heroicons/react/24/outline";

const stats = [
  { name: 'Total Requests', stat: '1,832', icon: FireIcon },
  { name: 'Resolved Today', stat: '215', icon: CheckCircleIcon },
  { name: 'Ongoing Emergencies', stat: '47', icon: ExclamationCircleIcon },
  { name: 'Avg. Response Time', stat: '12m 3s', icon: ClockIcon },
];

const accomplishments = [
  { title: "Record response time for a critical medical emergency in Downtown.", time: "2h ago" },
  { title: "Coordinated with 5 NGOs to provide shelter for 150 displaced individuals.", time: "Yesterday" },
  { title: "Successfully distributed 1,000 food packages in the North District.", time: "Yesterday" },
  { title: "New volunteer onboarding process reduced training time by 30%.", time: "3 days ago" },
];

const Dashboard = () => {
  return (
    <div>
      <h2 className="text-2xl font-semibold text-white mb-6">Dashboard Overview</h2>
      
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((item) => (
          <div key={item.name} className="bg-gray-800 overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <item.icon className="h-6 w-6 text-blue-400" aria-hidden="true" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-400 truncate">{item.name}</dt>
                    <dd className="text-2xl font-bold text-white">{item.stat}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-semibold text-white mb-4">Recent Accomplishments</h3>
        <div className="bg-gray-800 shadow rounded-lg p-6">
          <ul className="divide-y divide-gray-700">
            {accomplishments.map((accomplishment, index) => (
              <li key={index} className="py-4">
                <p className="text-gray-300">{accomplishment.title}</p>
                <p className="text-xs text-gray-500 mt-1">{accomplishment.time}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
