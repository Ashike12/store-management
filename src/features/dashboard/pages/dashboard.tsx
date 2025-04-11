// Dashboard.tsx
import { Card, CardContent } from '@mui/material';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, BarChart, Bar, PieChart, Pie, Cell,
  ResponsiveContainer
} from 'recharts';
import CountUp from 'react-countup';

const dummySalesData = [
  { date: 'Apr 1', revenue: 2000 },
  { date: 'Apr 2', revenue: 3500 },
  { date: 'Apr 3', revenue: 1800 },
  { date: 'Apr 4', revenue: 3000 },
  { date: 'Apr 5', revenue: 4200 },
];

const topProducts = [
  { name: 'Product A', sales: 150 },
  { name: 'Product B', sales: 90 },
  { name: 'Product C', sales: 75 },
];

const wholesalerData = [
  { name: 'Wholesaler 1', value: 4000 },
  { name: 'Wholesaler 2', value: 2500 },
  { name: 'Wholesaler 3', value: 1500 },
];

const COLORS = ['#8884d8', '#82ca9d', '#ffc658'];

const Dashboard = () => {
  return (
    <div className="p-4 w-full flex flex-col gap-4">

      {/* KPI Cards */}
      <div className='flex flex-row gap-4'>
        <Card className='lg:basis-1/3 basis-full'>
          <CardContent>
            <p className="text-sm">Today's Revenue</p>
            <p className="text-2xl font-bold text-green-600">
              ₹<CountUp end={25000} duration={5} separator="," />
            </p>
          </CardContent>
        </Card>
        <Card className='lg:basis-1/3 basis-full'>
        <CardContent>
          <p className="text-sm">Total Invoices</p>
          <p className="text-2xl font-bold">
            <CountUp end={18} duration={5} />
          </p>
        </CardContent>
        </Card>
        <Card className='lg:basis-1/3 basis-full'>
        <CardContent>
          <p className="text-sm">Products Sold</p>
          <p className="text-2xl font-bold">
            <CountUp end={320} duration={5} />
          </p>
        </CardContent>
        </Card>
      </div>

      {/* Sales Overview Chart */}
      <Card className="col-span-1 md:col-span-2">
        <CardContent>
          <h2 className="text-lg font-bold mb-2">Sales Overview</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dummySalesData}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="revenue" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Top Selling Products */}
      <Card>
        <CardContent>
          <h2 className="text-lg font-bold mb-2">Top Selling Products</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={topProducts}>
              <YAxis type="number" />
              <XAxis dataKey="name" type="category" />
              <Tooltip />
              <Bar dataKey="sales" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className='flex flex-row gap-4'>
        {/* Wholesaler Contributions Pie Chart */}
        <Card className='lg:basis-1/2 basis-full'>
          <CardContent>
            <h2 className="text-lg font-bold mb-2">Wholesaler Contributions</h2>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={wholesalerData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {wholesalerData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Recent Transactions List */}
        <Card className='lg:basis-1/2 basis-full'>
          <CardContent>
            <h2 className="text-lg font-bold mb-2">Recent Invoices</h2>
            <div className="space-y-2">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex justify-between text-sm border-b pb-1">
                  <span>INV-00{i}</span>
                  <span>Wholesaler {i}</span>
                  <span>₹{i * 1500}</span>
                  <span>{`Apr ${i}`}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

    </div>
  );
};

export default Dashboard;
