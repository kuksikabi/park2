import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import AttractionsList from './pages/AttractionsList';
import TicketPurchase from './pages/TicketPurchase';
import Scanner from './pages/Scanner';
import AdminReports from './pages/AdminReports';
import { useParkStore } from './hooks/useParkStore';

import { AuthProvider, useAuth } from './hooks/useAuth';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAdmin } = useAuth();
  return isAdmin ? <>{children}</> : <Navigate to="/attractions" replace />;
};

function AppContent() {
  const parkData = useParkStore();

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<ProtectedRoute><Dashboard parkData={parkData} /></ProtectedRoute>} />
        <Route path="/attractions" element={<AttractionsList parkData={parkData} />} />
        <Route path="/tickets" element={<TicketPurchase parkData={parkData} />} />
        <Route path="/scanner" element={<Scanner parkData={parkData} />} />
        <Route path="/admin" element={<ProtectedRoute><AdminReports parkData={parkData} /></ProtectedRoute>} />
      </Routes>
    </Layout>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
