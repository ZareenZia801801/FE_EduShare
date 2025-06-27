import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import FormValidation from './FormValidation';
import UploadedFilesList from './UploadedFilesList';
import Header from './Header';
import Footer from './Footer';
import './App.css';
import FileDetails from './FileDetails';
import UserProfile from './UserProfile';
import Login from './login';
import Signup from './Signup';
import { AuthProvider } from './AuthContext';
import ProtectedRoute from './ProtectedRoute';


function LayoutWrapper({ children }) {
  const location = useLocation();
  const isUploadPage = location.pathname === '/';

  return (
    <main style={{ padding: '20px', minHeight: '80vh' }}>
      {isUploadPage ? <div className="App">{children}</div> : children}
    </main>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="page-layout">
          <Header />
          <Routes>
            {/* Protected Routes */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <LayoutWrapper>
                    <FormValidation />
                  </LayoutWrapper>
                </ProtectedRoute>
              }
            />

            <Route
              path="/files"
              element={
                <ProtectedRoute>
                  <LayoutWrapper>
                    <UploadedFilesList />
                  </LayoutWrapper>
                </ProtectedRoute>
              }
            />

            <Route
              path="/file/:id"
              element={
                <ProtectedRoute>
                  <LayoutWrapper>
                    <FileDetails />
                  </LayoutWrapper>
                </ProtectedRoute>
              }
            />

            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <LayoutWrapper>
                    <UserProfile />
                  </LayoutWrapper>
                </ProtectedRoute>
              }
            />

            {/* Public Routes */}
            <Route
              path="/login"
              element={
                <LayoutWrapper>
                  <Login />
                </LayoutWrapper>
              }
            />

            <Route
              path="/signup"
              element={
                <LayoutWrapper>
                  <Signup />
                </LayoutWrapper>
              }
            />
          </Routes>
          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
