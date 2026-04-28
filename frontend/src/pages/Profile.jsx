import { useAuth } from '../context/AuthContext';
import { User, Mail, Shield, ShieldCheck } from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div style={{ maxWidth: '600px', margin: '40px auto' }}>
        <h1 style={{ marginBottom: '40px' }}>User <span className="gradient-text">Profile</span></h1>
        
        <div className="card glass animate-fade" style={{ textAlign: 'center', padding: '60px 40px' }}>
            <div style={{ width: '120px', height: '120px', background: 'linear-gradient(135deg, var(--primary), var(--secondary))', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 30px', boxShadow: '0 0 30px rgba(59, 130, 246, 0.3)' }}>
                <User size={60} color="white" />
            </div>

            <h2 style={{ fontSize: '2rem', marginBottom: '10px' }}>{user.name}</h2>
            <div className="badge badge-confirmed" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '6px 15px', marginBottom: '40px' }}>
                <ShieldCheck size={14} /> Verified {user.role}
            </div>

            <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div className="glass" style={{ padding: '20px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <Mail color="var(--primary)" />
                    <div>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Email Address</p>
                        <p style={{ fontWeight: 600 }}>{user.email}</p>
                    </div>
                </div>

                <div className="glass" style={{ padding: '20px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <Shield color="var(--primary)" />
                    <div>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Account ID</p>
                        <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>{user._id}</p>
                    </div>
                </div>
            </div>
            
            <p style={{ marginTop: '40px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                Member since {new Date().toLocaleDateString()}
            </p>
        </div>
    </div>
  );
};

export default Profile;
