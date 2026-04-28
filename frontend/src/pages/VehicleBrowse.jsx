import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { Search, Filter, MapPin, Gauge, Car, Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const VehicleBrowse = () => {
  const { user, updateFavorites } = useAuth();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    location: '',
    minPrice: '',
    maxPrice: '',
    startDate: '',
    endDate: ''
  });

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams(filters).toString();
      const { data } = await api.get(`/vehicles?${queryParams}`);
      setVehicles(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const toggleFavorite = async (vehicleId) => {
    if (!user) return;
    try {
      const isFavorite = user.favorites?.includes(vehicleId);
      const method = isFavorite ? 'delete' : 'post';
      const { data } = await api[method](`/users/favorites/${vehicleId}`);
      updateFavorites(data.favorites);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="browse-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <h1 style={{ fontSize: '2.5rem' }}>Explore Our <span className="gradient-text">Fleet</span></h1>
        <div style={{ display: 'flex', gap: '15px' }}>
            <span style={{ color: 'var(--text-muted)' }}>{vehicles.length} Vehicles found</span>
        </div>
      </div>

      {/* Filter Sidebar & Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '40px' }}>
        
        {/* Filters */}
        <aside className="card glass" style={{ height: 'fit-content', position: 'sticky', top: '100px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '25px' }}>
            <Filter size={20} className="gradient-text" />
            <h3 style={{ fontSize: '1.2rem' }}>Filters</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>Location</label>
              <div style={{ position: 'relative' }}>
                <MapPin size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input name="location" placeholder="City or area..." value={filters.location} onChange={handleFilterChange} style={{ width: '100%', paddingLeft: '38px', fontSize: '0.9rem' }} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>Min Price</label>
                <input name="minPrice" type="number" placeholder="0" value={filters.minPrice} onChange={handleFilterChange} style={{ width: '100%', fontSize: '0.9rem' }} />
              </div>
              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>Max Price</label>
                <input name="maxPrice" type="number" placeholder="500+" value={filters.maxPrice} onChange={handleFilterChange} style={{ width: '100%', fontSize: '0.9rem' }} />
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>Dates (Availability)</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <input name="startDate" type="date" value={filters.startDate} onChange={handleFilterChange} style={{ width: '100%', fontSize: '0.9rem' }} />
                <input name="endDate" type="date" value={filters.endDate} onChange={handleFilterChange} style={{ width: '100%', fontSize: '0.9rem' }} />
              </div>
            </div>

            <button onClick={fetchVehicles} className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '10px' }}>
              <Search size={18} /> Apply Filters
            </button>
          </div>
        </aside>

        {/* Vehicle Grid */}
        <div>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '100px' }}>Loading vehicles...</div>
          ) : (
            <>
              {vehicles.length > 0 ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '30px' }}>
                  {vehicles.map(vehicle => (
                    <div key={vehicle._id} className="card animate-fade" style={{ padding: '0', overflow: 'hidden' }}>
                        <div style={{ height: '220px', background: '#334155', position: 'relative' }}>
                            {vehicle.images?.[0] ? (
                                <img src={vehicle.images[0]} alt={vehicle.model} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Car size={64} color="var(--border)" />
                                </div>
                            )}
                            <div style={{ position: 'absolute', top: '15px', left: '15px', display: 'flex', gap: '5px' }}>
                                <button 
                                    onClick={(e) => { e.preventDefault(); toggleFavorite(vehicle._id); }} 
                                    className="glass" 
                                    style={{ padding: '8px', borderRadius: '50%', color: user?.favorites?.includes(vehicle._id) ? 'var(--danger)' : 'white' }}
                                >
                                    <Heart size={18} fill={user?.favorites?.includes(vehicle._id) ? 'var(--danger)' : 'none'} />
                                </button>
                            </div>

                            <div style={{ position: 'absolute', top: '15px', right: '15px', background: 'rgba(15, 23, 42, 0.8)', padding: '5px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '600' }}>
                               ₹ {vehicle.pricePerDay}/day
                            </div>
                        </div>
                        
                        <div style={{ padding: '24px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                                <div>
                                    <h3 style={{ fontSize: '1.3rem' }}>{vehicle.make} {vehicle.model}</h3>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '5px' }}>
                                        <MapPin size={14} /> {vehicle.location}
                                    </div>
                                </div>
                                <div style={{ color: 'var(--text-muted)', fontWeight: '600' }}>{vehicle.year}</div>
                            </div>

                            <div style={{ display: 'flex', gap: '15px', marginTop: '20px', marginBottom: '25px' }}>
                                {vehicle.features?.slice(0, 2).map((feat, i) => (
                                    <div key={i} className="glass" style={{ padding: '5px 12px', borderRadius: '6px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                        {feat}
                                    </div>
                                ))}
                            </div>

                            <Link to={`/vehicle/${vehicle._id}`} className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                                View Details
                            </Link>
                        </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="card glass animate-fade" style={{ textAlign: 'center', padding: '100px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
                    <Car size={80} style={{ opacity: 0.2 }} color="var(--primary)" />
                    <h2 style={{ color: 'var(--text-muted)' }}>No cars available</h2>
                    <p style={{ color: 'var(--text-muted)' }}>Try adjusting your filters or search criteria.</p>
                    <button onClick={() => { setFilters({ location: '', minPrice: '', maxPrice: '', startDate: '', endDate: '' }); setTimeout(fetchVehicles, 10); }} className="btn-primary" style={{ marginTop: '10px' }}>
                        Clear All Filters
                    </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default VehicleBrowse;
