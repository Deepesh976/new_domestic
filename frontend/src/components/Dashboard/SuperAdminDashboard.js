import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import axios from '../../utils/axiosConfig';
import SuperAdminNavbar from '../../components/Navbar/SuperAdminNavbar';

/* =========================
   STYLES
========================= */
const Page = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const TopRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Filters = styled.div`
  display: flex;
  gap: 12px;
`;

const Select = styled.select`
  padding: 10px;
  border-radius: 6px;
  border: 1px solid #cbd5e1;
  width: 180px;
`;

const StatsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
`;

const Card = styled.div`
  background: white;
  padding: 20px;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
`;

const ChartGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
`;

const MONTHS = [
  '',
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

const SuperAdminDashboard = () => {
  const currentYear = new Date().getFullYear();

  const [organizations, setOrganizations] = useState([]);
  const [selectedOrg, setSelectedOrg] = useState('');
  const [selectedYear, setSelectedYear] = useState(currentYear);

  const [stats, setStats] = useState({
    totalAdmins: 0,
    totalCustomers: 0,
    customerGrowth: [],
    revenue: [],
  });

  /* =========================
     LOAD ORGANIZATIONS
  ========================= */
  useEffect(() => {
    axios.get('/api/superadmin/organizations').then((res) => {
      setOrganizations(res.data || []);
    });
  }, []);

  /* =========================
     LOAD DASHBOARD DATA
  ========================= */
  useEffect(() => {
    if (!selectedOrg) return;

    axios
      .get('/api/superadmin/dashboard/stats', {
        params: {
          organizationId: selectedOrg,
          year: selectedYear,
        },
      })
      .then((res) => setStats(res.data));
  }, [selectedOrg, selectedYear]);

  /* =========================
     CUSTOMER CHART DATA
  ========================= */
  const customerChartData = useMemo(() => {
    const map = {};
    stats.customerGrowth.forEach((i) => {
      map[i._id] = i.count;
    });

    return Array.from({ length: 12 }, (_, i) => ({
      month: MONTHS[i + 1],
      customers: map[i + 1] || 0,
    }));
  }, [stats.customerGrowth]);

  /* =========================
     REVENUE CHART DATA
  ========================= */
  const revenueChartData = useMemo(() => {
    const map = {};
    stats.revenue.forEach((i) => {
      map[i._id] = i.total;
    });

    return Array.from({ length: 12 }, (_, i) => ({
      month: MONTHS[i + 1],
      revenue: map[i + 1] || 0,
    }));
  }, [stats.revenue]);

  return (
    <SuperAdminNavbar>
      <Page>
        <TopRow>
          <h2>Super Admin Dashboard</h2>

          <Filters>
            <Select
              value={selectedOrg}
              onChange={(e) => setSelectedOrg(e.target.value)}
            >
              <option value="">Select Organization</option>
              {organizations.map((o) => (
                <option key={o._id} value={o._id}>
                  {o.organizationName}
                </option>
              ))}
            </Select>

            <Select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
            >
              {[currentYear, currentYear - 1, currentYear - 2].map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </Select>
          </Filters>
        </TopRow>

        <StatsRow>
          <Card>
            <h1>{stats.totalAdmins}</h1>
            <p>Total Admins & Head Admins</p>
          </Card>

          <Card>
            <h1>{stats.totalCustomers}</h1>
            <p>Total Customers</p>
          </Card>
        </StatsRow>

        <ChartGrid>
          <Card>
            <h3>Customer Growth ({selectedYear})</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={customerChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="customers" fill="#2563eb" />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <Card>
            <h3>Revenue ({selectedYear})</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#16a34a"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </ChartGrid>
      </Page>
    </SuperAdminNavbar>
  );
};

export default SuperAdminDashboard;
