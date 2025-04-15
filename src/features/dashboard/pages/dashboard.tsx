// Dashboard.tsx
import { Card, CardContent } from '@mui/material';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, BarChart, Bar, PieChart, Pie, Cell,
  ResponsiveContainer
} from 'recharts';
import CountUp from 'react-countup';
import { useGetDashboardDataQuery } from '@core/store/api/invoiceApi';
import { useEffect } from 'react';
import CustomTable from '@components/table/CustomTable';
import { InvoiceColumns } from '@features/invoice/pages/invoice';

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

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#d0ed57', '#a4de6b', '#8dd1e1', '#83a6ed', '#8dd1e1'];

const Dashboard = () => {
  const { data, isLoading, refetch } = useGetDashboardDataQuery({ pageNumber: 1, pageSize: 10, itemId: '' });
  const dashBoardData = data?.Data;
  useEffect(() => {
    // Refetch when component mounts
    refetch();
  }, [refetch]);
  return (
    <div className="p-4 w-full flex flex-col gap-4">

      {/* KPI Cards */}
      <div className='flex flex-row gap-4'>
        <Card className='lg:basis-1/3 basis-full'>
          <CardContent>
            <p className="text-sm">This month revenue</p>
            <p className="text-2xl font-bold text-green-600">
              ₹<CountUp end={dashBoardData?.ThisMonthRevenue ?? 0} duration={5} separator="," />
            </p>
          </CardContent>
        </Card>
        <Card className='lg:basis-1/3 basis-full'>
          <CardContent>
            <p className="text-sm">Total Invoices</p>
            <p className="text-2xl font-bold">
              <CountUp end={dashBoardData?.ThisMonthTotalInvoice ?? 0} duration={5} />
            </p>
          </CardContent>
        </Card>
        <Card className='lg:basis-1/3 basis-full'>
          <CardContent>
            <p className="text-sm">Products Sold</p>
            <p className="text-2xl font-bold">
              <CountUp end={dashBoardData?.ThisMonthTotalSell ?? 0} duration={5} />
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Sales Overview Chart */}
      <Card className="col-span-1 md:col-span-2">
        <CardContent>
          <h2 className="text-lg font-bold mb-2">Sales Overview</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dashBoardData?.SalesData ?? dummySalesData}>
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
            <BarChart data={dashBoardData?.ProductSalesInfo ?? topProducts}>
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
                  data={dashBoardData?.WholesalerData ?? wholesalerData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {(dashBoardData?.WholesalerData ?? wholesalerData).map((entry, index) => (
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
              {dashBoardData && dashBoardData.RecentInvoiceData && dashBoardData.RecentInvoiceData.length > 0 && (<div className="p-10 w-full">
                <CustomTable
                  isRowClickable={false}
                  columns={InvoiceColumns}
                  hidePagination={true}
                  data={dashBoardData.RecentInvoiceData || []}
                  rowsPerPage={10} />
              </div>)}
            </div>
          </CardContent>
        </Card>
      </div>

    </div>
  );
};

export default Dashboard;
