import AdminLayout from '../../components/AdminLayout';
import withAuth from '../../components/withAuth';

function Dashboard() {
  return (
    <AdminLayout>
      <h1>Admin Dashboard</h1>
      <p>Welcome to the admin dashboard. Manage the site here.</p>
    </AdminLayout>
  );
}

export default withAuth(Dashboard);
