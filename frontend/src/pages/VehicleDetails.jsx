import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { MapPin, Calendar, Heart, ShieldCheck, CheckCircle, ChevronLeft } from 'lucide-react';

const VehicleDetails = () => {
  const { id } = useParams();
  const { user, updateFavorites } = useAuth();
  const navigate = useNavigate();

  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Booking stats
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [pickupTime, setPickupTime] = useState('10:00');
  const [dropoffTime, setDropoffTime] = useState('10:00');
  const [totalPrice, setTotalPrice] = useState(0);
  const [bookingError, setBookingError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        const { data } = await api.get(`/vehicles/${id}`);
        setVehicle(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchVehicle();
  }, [id]);

  useEffect(() => {
    if (startDate && endDate && vehicle) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays > 0) {
        setTotalPrice(diffDays * vehicle.pricePerDay);
      } else {
        setTotalPrice(0);
      }
    }
  }, [startDate, endDate, vehicle]);

  const toggleFavorite = async () => {
    if (!user) return navigate('/login');
    const isFavorite = user.favorites?.includes(id);
    try {
      const { data } = isFavorite 
        ? await api.delete(`/users/favorites/${id}`)
        : await api.post(`/users/favorites/${id}`);
      
      updateFavorites(data.favorites);
    } catch (err) {
      console.error(err);
    }
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!user) return navigate('/login');
    
    setBookingError('');
    try {
      await api.post('/bookings', {
        vehicleId: id,
        startDate,
        endDate,
        pickupTime,
        dropoffTime,
        totalPrice
      });
      setSuccess(true);
      setTimeout(() => navigate('/mybookings'), 2000);
    } catch (err) {
      setBookingError(err.response?.data?.message || 'Failed to book');
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '100px' }}>Loading...</div>;
  if (!vehicle) return <div style={{ textAlign: 'center', padding: '100px' }}>Vehicle not found</div>;

  return (
    <div className="details-container">
      <button onClick={() => navigate(-1)} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', marginBottom: '30px', background: 'none' }}>
        <ChevronLeft size={20} /> Back to results
      </button>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '50px' }}>
        
        {/* Left: Info */}
        <section>
          <div style={{ height: '450px', background: '#334155', borderRadius: '24px', overflow: 'hidden', marginBottom: '40px' }}>
             {vehicle.images?.[0] ? (
                 <img src={vehicle.images[0]} alt={vehicle.model} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
             ) : (
                 <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10rem', opacity: 0.1 }}>🚗</div>
             )}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '30px' }}>
            <div>
              <h1 style={{ fontSize: '3rem', marginBottom: '10px' }}>{vehicle.make} {vehicle.model}</h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)' }}>
                    <MapPin size={18} /> {vehicle.location}
                 </div>
                 <div style={{ fontWeight: '600', color: 'var(--primary)' }}>Production {vehicle.year}</div>
              </div>
            </div>
            <button onClick={toggleFavorite} className="glass" style={{ padding: '15px', borderRadius: '50%', color: user?.favorites?.includes(id) ? 'var(--danger)' : 'white' }}>
                <Heart size={24} fill={user?.favorites?.includes(id) ? 'var(--danger)' : 'none'} />
            </button>
          </div>

          <div style={{ marginBottom: '40px' }}>
            <h3 style={{ marginBottom: '20px' }}>Premium Features</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px' }}>
              {vehicle.features?.map((feat, i) => (
                <div key={i} className="card" style={{ padding: '15px 25px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1rem' }}>
                   <CheckCircle size={18} color="var(--success)" /> {feat}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Right: Booking Card */}
        <aside>
          <div className="card glass animate-fade" style={{ position: 'sticky', top: '100px', border: '1px solid var(--primary)' }}>
            <h2 style={{ marginBottom: '5px' }}>Reserve Now</h2>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '5px', marginBottom: '30px' }}>
              <span style={{ fontSize: '1.8rem', fontWeight: '800' }}>₹ {vehicle.pricePerDay}</span>
              <span style={{ color: 'var(--text-muted)' }}>/ day</span>
            </div>

            {success ? (
                <div style={{ textAlign: 'center', padding: '40px 0' }}>
                    <div style={{ width: '60px', height: '60px', background: 'var(--success)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                        <CheckCircle size={32} color="white" />
                    </div>
                    <h3>Booking Confirmed!</h3>
                    <p style={{ color: 'var(--text-muted)', marginTop: '10px' }}>Redirecting to your bookings...</p>
                </div>
            ) : (
                <form onSubmit={handleBooking} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {bookingError && <div style={{ color: 'var(--danger)', fontSize: '0.9rem' }}>{bookingError}</div>}
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                        <div>
                            <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>Start Date</label>
                            <input type="date" required value={startDate} onChange={e => setStartDate(e.target.value)} min={new Date().toISOString().split('T')[0]} style={{ width: '100%' }} />
                        </div>
                        <div>
                            <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>Pick-up Time</label>
                            <input type="time" required value={pickupTime} onChange={e => setPickupTime(e.target.value)} style={{ width: '100%' }} />
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                        <div>
                            <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>End Date</label>
                            <input type="date" required value={endDate} onChange={e => setEndDate(e.target.value)} min={startDate || new Date().toISOString().split('T')[0]} style={{ width: '100%' }} />
                        </div>
                        <div>
                            <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>Drop-off Time</label>
                            <input type="time" required value={dropoffTime} onChange={e => setDropoffTime(e.target.value)} style={{ width: '100%' }} />
                        </div>
                    </div>

                    {totalPrice > 0 && (
                        <div style={{ padding: '20px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                <span>Total Price</span>
                                <span style={{ fontWeight: 800, fontSize: '1.2rem' }}>₹ {totalPrice}</span>
                            </div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>* Price includes all fees and taxes</div>
                        </div>
                    )}

                    <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '16px', fontSize: '1.1rem' }}>
                        Confirm Booking
                    </button>
                    
                    <div style={{ textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        <ShieldCheck size={16} /> Secure Payment & Verified Vehicle
                    </div>
                </form>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
};

export default VehicleDetails;
