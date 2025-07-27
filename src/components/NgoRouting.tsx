import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { MapPinIcon } from "@heroicons/react/24/outline";

export default function NgoRouting() {
  const ngos = useQuery(api.ngos.getAllNgos);
  const analytics = useQuery(api.requests.getAnalytics);

  if (!ngos || !analytics) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">NGO Routing & Coverage</h2>
        <p className="text-gray-400">Manage and view NGO network and request distribution.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* NGO List */}
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">Registered NGOs</h3>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {ngos.map((ngo) => (
              <div key={ngo._id} className="bg-gray-700 p-4 rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-white">{ngo.name}</p>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <MapPinIcon className="w-4 h-4" />
                      <span>{ngo.location}</span>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs text-white ${ngo.isActive ? 'bg-green-500' : 'bg-red-500'}`}>
                    {ngo.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className="mt-3">
                  <p className="text-xs text-gray-400 mb-1">Specialties:</p>
                  <div className="flex flex-wrap gap-2">
                    {ngo.specialties.map((spec) => (
                      <span key={spec} className="px-2 py-1 bg-blue-600 text-white text-xs rounded-md">{spec}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Location Coverage */}
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">Request Volume by Location</h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {analytics.topCities.map(([city, count]: [string, number]) => (
              <div key={city} className="flex justify-between items-center bg-gray-700 p-4 rounded-lg">
                <div className="flex items-center gap-3">
                  <MapPinIcon className="w-5 h-5 text-blue-400" />
                  <span className="text-gray-300 font-medium">{city}</span>
                </div>
                <div className="text-right">
                  <span className="text-white font-bold">{count}</span>
                  <p className="text-xs text-gray-400">requests</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
