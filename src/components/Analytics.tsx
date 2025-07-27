import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const intentData = [
  { name: 'Medical', value: 400 },
  { name: 'Shelter', value: 300 },
  { name: 'Food', value: 300 },
  { name: 'Safety', value: 200 },
  { name: 'Document', value: 100 },
];

const locationData = [
  { name: 'Downtown', requests: 45 },
  { name: 'Northside', requests: 28 },
  { name: 'Southside', requests: 34 },
  { name: 'West End', requests: 19 },
  { name: 'East End', requests: 25 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const Analytics = () => {
  return (
    <div>
      <h2 className="text-2xl font-semibold text-white mb-6">Analytics</h2>
      <p className="text-sm text-gray-400 mb-8">
        This data is for demonstration purposes and is not live.
      </p>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-white mb-4">Requests by Intent</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={intentData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${percent ? (percent * 100).toFixed(0) : 0}%`}
              >
                {intentData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-white mb-4">Requests by Location</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={locationData}>
              <XAxis dataKey="name" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip wrapperClassName="bg-gray-700 !border-gray-600" />
              <Legend />
              <Bar dataKey="requests" fill="#00C49F" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
