import { useState, useEffect } from 'react';
import api from '../utils/api';
import { Check, X, Shield, User } from 'lucide-react';

const BookingManagement = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    setLoading(true);
    const { data } = await api.get('/bookings');
    setBookings(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/bookings/${id}`, { status });
      fetchBookings();
    } catch (err) {
      alert('Error updating booking');
    }
  };

  return (
    <div>
      <h1 style={{ marginBottom: '40px' }}>Global <span className="gradient-text">Bookings</span> Monitoring</h1>

      <div className="table-container animate-fade">
        <table>
          <thead>
            <tr>
              <th>User</th>
              <th>Vehicle</th>
              <th>Dates</th>
              <th>Total</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map(b => (
              <tr key={b._id}>
                <td>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontWeight: 600 }}>{b.user?.name}</span>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{b.user?.email}</span>
                    </div>
                </td>
                <td>{b.vehicle?.make} {b.vehicle?.model}</td>
                <td style={{ fontSize: '0.85rem' }}>
                    {new Date(b.startDate).toLocaleDateString()} ({b.pickupTime}) - <br/>
                    {new Date(b.endDate).toLocaleDateString()} ({b.dropoffTime})
                </td>
                <td style={{ fontWeight: 700 }}>₹ {b.totalPrice}</td>
                <td><span className={`badge badge-${b.status}`}>{b.status}</span></td>
                <td>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    {b.status === 'pending' && (
                        <button onClick={() => updateStatus(b._id, 'confirmed')} style={{ color: 'var(--success)', background: 'none' }} title="Confirm"><Check size={18} /></button>
                    )}
                    {b.status !== 'cancelled' && b.status !== 'completed' && (
                        <>
                            <button onClick={() => updateStatus(b._id, 'completed')} style={{ color: 'var(--primary)', background: 'none' }} title="Mark as Completed"><Shield size={18} /></button>
                            <button onClick={() => updateStatus(b._id, 'cancelled')} style={{ color: 'var(--danger)', background: 'none' }} title="Cancel"><X size={18} /></button>
                        </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BookingManagement;
