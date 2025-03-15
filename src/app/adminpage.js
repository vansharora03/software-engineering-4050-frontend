
import Link from 'next/link';
import AdminLayout from '../../components/AdminLayout';
import withAuth from '../../components/withAuth';

function AdminHome() {
  return (
    <AdminLayout>
      <h1>Admin Dashboard</h1>
      <ul>
        <li>
          <Link href="/admin/manage-movies">Manage Movies</Link>
        </li>
        <li>
          <Link href="/admin/manage-users">Manage Users</Link>
        </li>
        <li>
          <Link href="/admin/manage-promotions">Manage Promotions</Link>
        </li>
      </ul>
    </AdminLayout>
  );
}

export default withAuth(AdminHome);

