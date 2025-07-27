import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState, lazy, Suspense } from "react";
import { toast } from "sonner";

const Map = lazy(() => import("./Map"));

interface LiveRequestsProps {
  onNewRequest: () => void;
}

export default function LiveRequests({ onNewRequest }: LiveRequestsProps) {
  const requests = useQuery(api.requests.getAllRequests);
  const ngos = useQuery(api.ngos.getAllNgos);
  const assignRequest = useMutation(api.requests.assignRequestToNgo);
  const markResolved = useMutation(api.requests.markRequestResolved);

  const [selectedRequest, setSelectedRequest] = useState<string | null>(null);
  const [showAssignModal, setShowAssignModal] = useState(false);

  const handleAssignNgo = async (ngoName: string) => {
    if (!selectedRequest) return;
    try {
      await assignRequest({ requestId: selectedRequest as any, ngoName });
      toast.success(`Request assigned to ${ngoName}`);
      setShowAssignModal(false);
      setSelectedRequest(null);
    } catch (error) {
      toast.error("Failed to assign request");
    }
  };

  const handleMarkResolved = async (requestId: string) => {
    try {
      await markResolved({ requestId: requestId as any });
      toast.success("Request marked as resolved");
    } catch (error) {
      toast.error("Failed to mark request as resolved");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-500";
      case "assigned": return "bg-blue-500";
      case "resolved": return "bg-green-500";
      default: return "bg-gray-500";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical": return "bg-red-500 animate-pulse";
      case "high": return "bg-orange-500";
      case "medium": return "bg-yellow-500";
      case "low": return "bg-green-500";
      default: return "bg-gray-500";
    }
  };

  const getIntentColor = (intent: string) => {
    switch (intent) {
      case "FOOD": return "bg-green-600";
      case "SHELTER": return "bg-blue-600";
      case "SAFETY": return "bg-red-600";
      case "MEDICAL": return "bg-purple-600";
      case "DOCUMENT": return "bg-yellow-600";
      default: return "bg-gray-600";
    }
  };

  if (!requests) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Live Requests Feed</h2>
          <p className="text-gray-400">Real-time emergency requests with location data</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-400">Total Requests</p>
          <p className="text-2xl font-bold text-blue-400">{requests.length}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {requests.map((request) => (
          <div key={request._id} className="bg-gray-800 rounded-lg border border-gray-700 p-6 flex flex-col gap-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-white">{request.callerId}</h3>
                <p className="text-sm text-gray-400">📍 {request.location}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-xs text-white ${getStatusColor(request.status)}`}>
                  {request.status.toUpperCase()}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs text-white ${getPriorityColor(request.priority)}`}>
                  {request.priority.toUpperCase()}
                </span>
              </div>
            </div>

            <div className="h-48 w-full bg-gray-700 rounded-lg">
              <Suspense fallback={<div className="w-full h-full flex items-center justify-center text-gray-400">Loading Map...</div>}>
                {request.coordinates ? (
                  <Map lat={request.coordinates.lat} lng={request.coordinates.lng} locationName={request.location} />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-700 rounded-lg"><p className="text-gray-400">Map not available</p></div>
                )}
              </Suspense>
            </div>

            <div className="bg-gray-700 p-3 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <span className={`px-2 py-1 rounded-full text-xs text-white ${getIntentColor(request.intent)}`}>
                  {request.intent}
                </span>
                <span className="text-sm text-gray-400">Initial Voice Input:</span>
              </div>
              <p className="text-gray-300 italic">"{request.voiceInput}"</p>
            </div>

            {(request as any).aiAnalysis && (
              <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-3">
                <h5 className="text-sm font-medium text-blue-300 mb-2">AI Summary:</h5>
                <p className="text-xs text-blue-100">{(request as any).aiAnalysis.summary}</p>
              </div>
            )}

            <div className="flex items-center justify-between mt-auto">
              <div className="text-sm text-gray-400">
                <span>🕒 {new Date(request._creationTime).toLocaleString()}</span>
                {request.assignedNgo && (
                  <span className="ml-4">🏢 {request.assignedNgo}</span>
                )}
              </div>
              <div className="flex gap-2">
                {request.status === "pending" && (
                  <button
                    onClick={() => { setSelectedRequest(request._id); setShowAssignModal(true); }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    Assign
                  </button>
                )}
                {request.status === "assigned" && (
                  <button
                    onClick={() => handleMarkResolved(request._id)}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                  >
                    Resolve
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {showAssignModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4">Assign to NGO</h3>
            <div className="space-y-2 mb-6">
              {ngos?.map((ngo) => (
                <button
                  key={ngo._id}
                  onClick={() => handleAssignNgo(ngo.name)}
                  className="w-full text-left p-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                >
                  <div className="text-white font-medium">{ngo.name}</div>
                  <div className="text-sm text-gray-400">
                    📍 {ngo.location} • {ngo.specialties.join(", ")}
                  </div>
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowAssignModal(false)}
              className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
