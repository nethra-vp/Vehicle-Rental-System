import { useState, useEffect } from 'react';
import api from '../utils/api';
import { Calendar, Tag, Clock, XCircle, MapPin } from 'lucide-react';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      const { data } = await api.get('/bookings/mybookings');
      setBookings(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancel = async (id) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
        try {
            await api.put(`/bookings/${id}`, { status: 'cancelled' });
            fetchBookings();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to cancel');
        }
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '100px' }}>Loading your journeys...</div>;

  return (
    <div>
      <h1 style={{ marginBottom: '40px' }}>My <span className="gradient-text">Bookings</span></h1>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {bookings.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '80px' }}>
                <Calendar size={60} style={{ opacity: 0.1, marginBottom: '20px' }} />
                <h3>No bookings yet.</h3>
                <p style={{ color: 'var(--text-muted)' }}>Your future adventures will appear here.</p>
            </div>
        ) : (
            bookings.map(booking => (
                <div key={booking._id} className="card glass animate-fade" style={{ display: 'grid', gridTemplateColumns: '200px 1fr auto', gap: '30px', alignItems: 'center' }}>
                    <div style={{ height: '120px', background: '#334155', borderRadius: '12px', overflow: 'hidden' }}>
                        {booking.vehicle.images?.[0] ? (
                            <img src={booking.vehicle.images[0]} alt={booking.vehicle.model} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🚗</div>
                        )}
                    </div>

                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '5px' }}>
                            <h3 style={{ fontSize: '1.4rem' }}>{booking.vehicle.make} {booking.vehicle.model}</h3>
                            <span className={`badge badge-${booking.status}`}>{booking.status}</span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><Calendar size={14} /> {new Date(booking.startDate).toLocaleDateString()} ({booking.pickupTime}) - {new Date(booking.endDate).toLocaleDateString()} ({booking.dropoffTime})</div>
                            </div>
                            <div style={{ display: 'flex', gap: '20px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><MapPin size={14} /> {booking.vehicle.location}</div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><Tag size={14} /> ₹ {booking.totalPrice}</div>
                            </div>
                        </div>
                    </div>

                    <div>
                        {(booking.status === 'pending' || booking.status === 'confirmed') && (
                            <button onClick={() => handleCancel(booking._id)} className="glass" style={{ color: 'var(--danger)', display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 15px', borderRadius: '8px' }}>
                                <XCircle size={18} /> Cancel
                            </button>
                        )}
                    </div>
                </div>
            ))
        )}
      </div>
    </div>
  );
};

export default MyBookings;
