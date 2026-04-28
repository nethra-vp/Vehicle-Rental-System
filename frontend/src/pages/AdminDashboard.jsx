import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { Users, Car, CreditCard, TrendingUp, ChevronRight, Calendar, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalBookings: 0,
    activeUsers: 0,
    totalRevenue: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get('/bookings/stats');
        setStats(data);
      } catch (err) {
        console.error('Stats fetch error:', err);
        // Fallback to zeros if forbidden or error
        setStats({ totalBookings: 0, activeUsers: 0, totalRevenue: 0 });
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div style={{ textAlign: 'center', padding: '100px' }}>Loading analytics...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <h1>Admin <span className="gradient-text">Overview</span></h1>
        <div className="glass" style={{ padding: '10px 20px', borderRadius: '12px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            System Integrity: <span style={{ color: 'var(--success)', fontWeight: 'bold' }}>Active</span>
        </div>
      </div>

      {/* Admin Profile Section */}
      <div className="card glass animate-fade" style={{ marginBottom: '40px', display: 'flex', alignItems: 'center', gap: '25px', padding: '30px' }}>
          <div style={{ width: '80px', height: '80px', background: 'linear-gradient(135deg, var(--primary), var(--secondary))', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 20px rgba(59, 130, 246, 0.2)' }}>
              <User size={40} color="white" />
          </div>
          <div>
              <h2 style={{ fontSize: '1.8rem', marginBottom: '5px' }}>Welcome, {user?.name}</h2>
              <p style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {user?.email} • <span className="badge badge-confirmed" style={{ fontSize: '0.7rem' }}>System Administrator</span>
              </p>
          </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px', marginBottom: '50px' }}>
        <div className="card glass">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '10px' }}>Total Revenue</p>
                    <h2 style={{ fontSize: '2.5rem' }}>₹ {stats.totalRevenue}</h2>
                </div>
                <div style={{ background: 'rgba(34, 197, 94, 0.1)', padding: '12px', borderRadius: '12px', color: 'var(--success)' }}>
                    <TrendingUp size={24} />
                </div>
            </div>
            <div style={{ marginTop: '20px', fontSize: '0.8rem', color: 'var(--success)' }}>+12.5% from last month</div>
        </div>

        <div className="card glass">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '10px' }}>Total Bookings</p>
                    <h2 style={{ fontSize: '2.5rem' }}>{stats.totalBookings}</h2>
                </div>
                <div style={{ background: 'rgba(59, 130, 246, 0.1)', padding: '12px', borderRadius: '12px', color: 'var(--primary)' }}>
                    <CreditCard size={24} />
                </div>
            </div>
            <div style={{ marginTop: '20px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>Real-time transactional data</div>
        </div>

        <div className="card glass">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '10px' }}>Active Users</p>
                    <h2 style={{ fontSize: '2.5rem' }}>{stats.activeUsers}</h2>
                </div>
                <div style={{ background: 'rgba(139, 92, 246, 0.1)', padding: '12px', borderRadius: '12px', color: 'var(--secondary)' }}>
                    <Users size={24} />
                </div>
            </div>
            <div style={{ marginTop: '20px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>Excluding administrative accounts</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
          <Link to="/admin/vehicles" className="card glass" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '30px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <div style={{ background: 'var(--primary)', color: 'white', padding: '15px', borderRadius: '12px' }}>
                      <Car size={24} />
                  </div>
                  <div>
                      <h3 style={{ fontSize: '1.2rem' }}>Vehicle Management</h3>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Add, edit, or remove fleet inventory</p>
                  </div>
              </div>
              <ChevronRight size={24} color="var(--text-muted)" />
          </Link>

          <Link to="/admin/bookings" className="card glass" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '30px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <div style={{ background: 'var(--secondary)', color: 'white', padding: '15px', borderRadius: '12px' }}>
                      <Calendar size={24} />
                  </div>
                  <div>
                      <h3 style={{ fontSize: '1.2rem' }}>Booking Monitoring</h3>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Oversee all platform activity</p>
                  </div>
              </div>
              <ChevronRight size={24} color="var(--text-muted)" />
          </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;
