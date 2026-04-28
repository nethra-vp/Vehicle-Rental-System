import { Link } from 'react-router-dom';
import { Shield, Zap, MapPin, Star } from 'lucide-react';

const Home = () => {
  return (
    <div className="home-container">
      {/* Hero Section */}
      <section style={{ textAlign: 'center', padding: '100px 0 60px' }}>
        <h1 style={{ fontSize: '4rem', marginBottom: '20px' }}>
          Drive Your <span className="gradient-text">Dreams</span> Today
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', maxWidth: '700px', margin: '0 auto 40px' }}>
          Experience ultimate luxury and performance. Choose from our curated fleet of premium vehicles for your next journey.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
          <Link to="/browse" className="btn-primary" style={{ fontSize: '1.1rem', padding: '16px 40px' }}>
            Book a Ride Now
          </Link>
        </div>
      </section>

      {/* Features */}
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px', padding: '80px 0' }}>
        <div className="card">
          <Shield size={40} color="var(--primary)" style={{ marginBottom: '20px' }} />
          <h3>Fully Insured</h3>
          <p style={{ color: 'var(--text-muted)' }}>Drive with peace of mind. All our rentals include comprehensive premium insurance.</p>
        </div>
        <div className="card">
          <Zap size={40} color="var(--primary)" style={{ marginBottom: '20px' }} />
          <h3>Instant Booking</h3>
          <p style={{ color: 'var(--text-muted)' }}>No paperwork, no waiting. Secure your dream car in under 60 seconds.</p>
        </div>
        <div className="card">
          <MapPin size={40} color="var(--primary)" style={{ marginBottom: '20px' }} />
          <h3>Multiple Locations</h3>
          <p style={{ color: 'var(--text-muted)' }}>Pick up and drop off at convenient locations across the city.</p>
        </div>
      </section>

      {/* Social Proof */}
      <section className="glass" style={{ borderRadius: '24px', padding: '60px', textAlign: 'center', marginTop: '40px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '5px', marginBottom: '20px' }}>
            {[1,2,3,4,5].map(i => <Star key={i} size={20} fill="var(--warning)" color="var(--warning)" />)}
          </div>
          <h2 style={{ marginBottom: '15px' }}>"Best car rental experience I've ever had."</h2>
          <p style={{ color: 'var(--text-muted)' }}>- Michael Chen, verified customer</p>
      </section>
    </div>
  );
};

export default Home;
