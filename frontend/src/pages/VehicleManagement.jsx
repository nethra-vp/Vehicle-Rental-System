import { useState, useEffect } from 'react';
import api from '../utils/api';
import { Plus, Edit, Trash2, X, Image as ImageIcon } from 'lucide-react';

const VehicleManagement = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [formData, setFormData] = useState({
    make: '',
    model: '',
    year: new Date().getFullYear(),
    pricePerDay: '',
    location: '',
    images: '',
    features: ''
  });

  const fetchVehicles = async () => {
    setLoading(true);
    const { data } = await api.get('/vehicles');
    setVehicles(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
        ...formData,
        images: formData.images.split(',').map(s => s.trim()).filter(s => s),
        features: formData.features.split(',').map(s => s.trim()).filter(s => s)
    };

    try {
      if (editingId) {
        await api.put(`/vehicles/${editingId}`, payload);
      } else {
        await api.post('/vehicles', payload);
      }
      setShowModal(false);
      fetchVehicles();
      resetForm();
    } catch (err) {
      alert('Error saving vehicle');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure?')) {
      await api.delete(`/vehicles/${id}`);
      fetchVehicles();
    }
  };

  const resetForm = () => {
    setFormData({ make: '', model: '', year: 2024, pricePerDay: '', location: '', images: '', features: '' });
    setEditingId(null);
  };

  const openForm = (v = null) => {
    if (v) {
        setEditingId(v._id);
        setFormData({
            make: v.make,
            model: v.model,
            year: v.year,
            pricePerDay: v.pricePerDay,
            location: v.location,
            images: v.images.join(', '),
            features: v.features.join(', ')
        });
    } else {
        resetForm();
    }
    setShowModal(true);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
          <h1>Vehicle <span className="gradient-text">Fleet</span></h1>
          <button onClick={() => openForm()} className="btn-primary">
              <Plus size={20} /> Add Vehicle
          </button>
      </div>

      <div className="table-container animate-fade">
        <table>
          <thead>
            <tr>
              <th>Vehicle</th>
              <th>Year</th>
              <th>Price/Day</th>
              <th>Location</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {vehicles.map(v => (
              <tr key={v._id}>
                <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <div style={{ width: '50px', height: '40px', background: '#334155', borderRadius: '4px', overflow: 'hidden' }}>
                            {v.images?.[0] && <img src={v.images[0]} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                        </div>
                        <span style={{ fontWeight: '600' }}>{v.make} {v.model}</span>
                    </div>
                </td>
                <td>{v.year}</td>
                <td>₹ {v.pricePerDay}</td>
                <td>{v.location}</td>
                <td>
                  <div style={{ display: 'flex', gap: '15px' }}>
                    <button onClick={() => openForm(v)} style={{ color: 'var(--primary)', background: 'none' }}><Edit size={18} /></button>
                    <button onClick={() => handleDelete(v._id)} style={{ color: 'var(--danger)', background: 'none' }}><Trash2 size={18} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
            <div className="card glass animate-fade" style={{ width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '25px' }}>
                    <h2>{editingId ? 'Edit' : 'Add'} Vehicle</h2>
                    <button onClick={() => setShowModal(false)} style={{ background: 'none', color: 'var(--text-muted)' }}><X size={24} /></button>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                        <div>
                            <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>Make</label>
                            <input required value={formData.make} onChange={e => setFormData({...formData, make: e.target.value})} />
                        </div>
                        <div>
                            <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>Model</label>
                            <input required value={formData.model} onChange={e => setFormData({...formData, model: e.target.value})} />
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                        <div>
                            <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>Year</label>
                            <input type="number" required value={formData.year} onChange={e => setFormData({...formData, year: e.target.value})} />
                        </div>
                        <div>
                            <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>Price/Day (₹)</label>
                            <input type="number" required value={formData.pricePerDay} onChange={e => setFormData({...formData, pricePerDay: e.target.value})} />
                        </div>
                    </div>

                    <div>
                        <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>Location</label>
                        <input required value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
                    </div>

                    <div>
                        <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>Image URLs (comma separated)</label>
                        <textarea value={formData.images} onChange={e => setFormData({...formData, images: e.target.value})} rows="2" />
                    </div>

                    <div>
                        <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>Features (comma separated)</label>
                        <textarea value={formData.features} onChange={e => setFormData({...formData, features: e.target.value})} rows="2" />
                    </div>

                    <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '14px', marginTop: '10px' }}>
                        {editingId ? 'Update Vehicle' : 'Create Vehicle'}
                    </button>
                </form>
            </div>
        </div>
      )}
    </div>
  );
};

export default VehicleManagement;
