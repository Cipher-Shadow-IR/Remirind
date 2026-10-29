import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import LoadingSpinner from '../components/LoadingSpinner';
import ProtectedRoute from '../components/ProtectedRoute';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Dashboard from '../pages/Dashboard';
import ExamList from '../pages/ExamList';
import ExamTake from '../pages/ExamTake';
import ExamReport from '../pages/ExamReport';
import ExamHistory from '../pages/ExamHistory';
import NotFound from '../pages/NotFound';

function PublicRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <LoadingSpinner />;
  if (user) return <Navigate to="/dashboard" replace />;
  return children;
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/exams"
        element={
          <ProtectedRoute>
            <ExamList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/assessments"
        element={<Navigate to="/exams" replace />}
      />
      <Route
        path="/exams/:id/take"
        element={
          <ProtectedRoute>
            <ExamTake />
          </ProtectedRoute>
        }
      />
      <Route
        path="/exams/results/:id"
        element={
          <ProtectedRoute>
            <ExamReport />
          </ProtectedRoute>
        }
      />
      <Route
        path="/exams/history"
        element={
          <ProtectedRoute>
            <ExamHistory />
          </ProtectedRoute>
        }
      />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
