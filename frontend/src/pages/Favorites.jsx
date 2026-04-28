import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { Heart, MapPin, Car } from 'lucide-react';

const Favorites = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFavorites = async () => {
    try {
      const { data } = await api.get('/users/profile');
      setVehicles(data.favorites || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  const removeFavorite = async (e, id) => {
    e.preventDefault();
    try {
      await api.delete(`/users/favorites/${id}`);
      fetchFavorites();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '100px' }}>Loading favorites...</div>;

  return (
    <div>
      <h1 style={{ marginBottom: '40px' }}>My <span className="gradient-text">Favorites</span></h1>

      {vehicles.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '80px' }}>
              <Heart size={60} style={{ opacity: 0.1, marginBottom: '20px' }} />
              <h3>Your wishlist is empty.</h3>
              <p style={{ color: 'var(--text-muted)' }}>Browse vehicles and like them to save here.</p>
          </div>
      ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '30px' }}>
              {vehicles.map(vehicle => (
                <Link to={`/vehicle/${vehicle._id}`} key={vehicle._id} className="card animate-fade" style={{ padding: '0', overflow: 'hidden' }}>
                    <div style={{ height: '180px', background: '#334155', position: 'relative' }}>
                        {vehicle.images?.[0] && <img src={vehicle.images[0]} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                        <button onClick={(e) => removeFavorite(e, vehicle._id)} style={{ position: 'absolute', top: '15px', right: '15px', background: 'rgba(239, 68, 68, 0.9)', padding: '10px', borderRadius: '50%', color: 'white', display: 'flex' }}>
                           <Heart size={18} fill="white" />
                        </button>
                    </div>
                    <div style={{ padding: '20px' }}>
                        <h3 style={{ fontSize: '1.2rem' }}>{vehicle.make} {vehicle.model}</h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '5px' }}>
                            <MapPin size={14} /> {vehicle.location}
                        </div>
                        <div style={{ marginTop: '15px', fontWeight: '800', color: 'var(--primary)' }}>₹ {vehicle.pricePerDay}/day</div>
                    </div>
                </Link>
              ))}
          </div>
      )}
    </div>
  );
};

export default Favorites;
