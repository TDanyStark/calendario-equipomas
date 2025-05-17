import { useDashboardStats } from '@/hooks/useDashboardStats';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import Skeleton from '@/components/Loader/Skeleton';

const Dashboard = () => { 
  const JWT = useSelector((state: RootState) => state.auth.JWT);

  const { data: stats, isLoading, error } = useDashboardStats(JWT);

  console.log('Dashboard stats:', stats);

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
        <p className="text-red-500">Error loading dashboard data</p>
        {stats?.error && <p className="text-red-500">Server error: {stats.error}</p>}
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">
        Admin Dashboard {stats?.activePeriodName && `(${stats.activePeriodName})`}
      </h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Card 1: Enrollments */}
        <div className="bg-gray-900 shadow-md rounded-lg p-6">
          <div className="mb-4">
            <h2 className="text-xl font-semibold">Matriculas</h2>
            <p className="text-sm text-gray-500">Periodo Academico Activo</p>
          </div>
          <div>
            {isLoading ? (
              <Skeleton className="h-[36px] w-24" />
            ) : (
              <p className="text-3xl font-bold">{stats?.activePeriodEnrollmentCount ?? 'N/A'}</p>
            )}
          </div>
        </div>

        {/* Card 2: Registered Professors */}
        <div className="bg-gray-900 shadow-md rounded-lg p-6">
          <div className="mb-4">
            <h2 className="text-xl font-semibold">Profesores Registrados</h2>
            <p className="text-sm text-gray-500">Periodo Academico Activo</p>
          </div>
          <div>
            {isLoading ? (
              <Skeleton className="h-[36px] w-24" />
            ) : (
              <p className="text-3xl font-bold">{stats?.activePeriodProfessorCount ?? 'N/A'}</p>
            )}
          </div>
        </div>

        {/* You can add more cards here later */}
      </div>
    </div>
  );
};

export default Dashboard;