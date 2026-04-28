import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Header from './components/Header';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import VehicleBrowse from './pages/VehicleBrowse';
import VehicleDetails from './pages/VehicleDetails';
import Profile from './pages/Profile';
import MyBookings from './pages/MyBookings';
import Favorites from './pages/Favorites';
import AdminDashboard from './pages/AdminDashboard';
import VehicleManagement from './pages/VehicleManagement';
import BookingManagement from './pages/BookingManagement';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  return user ? children : <Navigate to="/login" />;
};

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  return user && user.role === 'admin' ? children : <Navigate to="/" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Header />
        <main className="container animate-fade" style={{ padding: '40px 20px' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/browse" element={<VehicleBrowse />} />
            <Route path="/vehicle/:id" element={<VehicleDetails />} />
            
            {/* User Routes */}
            <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
            <Route path="/mybookings" element={<PrivateRoute><MyBookings /></PrivateRoute>} />
            <Route path="/favorites" element={<PrivateRoute><Favorites /></PrivateRoute>} />

            {/* Admin Routes */}
            <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
            <Route path="/admin/vehicles" element={<AdminRoute><VehicleManagement /></AdminRoute>} />
            <Route path="/admin/bookings" element={<AdminRoute><BookingManagement /></AdminRoute>} />
          </Routes>
        </main>
      </Router>
    </AuthProvider>
  );
}

export default App;
