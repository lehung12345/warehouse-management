import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import LoginPage from './pages/LoginPage'
import AdminDashboard from './pages/admin/AdminDashboard'
import UserManagement from './pages/admin/UserManagement'
import StaffDashboard from './pages/staff/StaffDashboard'
import ProductPage from "./pages/admin/ProductPage";
import InventoryPage from "./pages/admin/InventoryPage";
import LocationPage from "./pages/admin/LocationPage";
import ReportPage from "./pages/admin/ReportPage";
import OrdersPage from "./pages/admin/OrdersPage";
import CreateImportPage from "./pages/admin/CreateImportPage";
import CreateExportPage from "./pages/admin/CreateExportPage";
import ExportDetailPage from './pages/admin/ExportDetailPage';
import ImportDetailPage from './pages/admin/ImportDetailPage';


function RootRedirect() {
  const { user, isLoading } = useAuth()
  if (isLoading) return <div className="loading-screen"><div className="loading-spinner" /></div>
  if (!user) return <Navigate to="/login" replace />
  return <Navigate to={user.role === 'ADMIN' ? '/admin' : '/staff'} replace />
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/login" element={<LoginPage />} />

          {/* Root redirect */}
          <Route path="/" element={<RootRedirect />} />

          {/* Admin routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/users"
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <UserManagement />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/products"
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <ProductPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/inventory"
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <InventoryPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/locations"
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <LocationPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/reports"
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <ReportPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/orders"
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <OrdersPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/orders/create-import"
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <CreateImportPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/orders/create-export"
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <CreateExportPage />
              </ProtectedRoute>
            }
          />


          <Route
            path="/admin/orders/import/:id"
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <ImportDetailPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/orders/export/:id"
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <ExportDetailPage />
              </ProtectedRoute>
            }
          />

          {/* Staff routes */}
          <Route path="/staff" element={
            <ProtectedRoute requiredRole="STAFF">
              <StaffDashboard />
            </ProtectedRoute>
          } />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
