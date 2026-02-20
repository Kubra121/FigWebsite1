import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import NavBar from './components/NavBar';
import Analytics from './components/Analytics';
import Cards from './components/Cards';
import Footer from './components/Footer';
import Newsletter from './components/Newsletter';
import ContactPage from './pages/ContactPage';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/user/RegisterPage';
import PrivateRoute from './components/PrivateRoute';
import ProfilePage from './pages/ProfilePage';
import CartPage from './pages/user/CartPage';
import { ShoppingCartProvider } from './contexts/ShoppingCartContext';
import PurchasePage from './pages/user/PurchasePage';
import AdminPage from './pages/admin/AdminPage';
import Checkout from './utils/Checkout';
// import PaymentPage from './pages/user/PaymentPage';
import AdminCarousel from './pages/admin/AdminCarousel';
import PaymentErrorBoundary from './components/PaymentErrorBoundary';
import PaymentResult from './pages/user/PaymentResult';
import PaymentWaiting from './pages/user/PaymentWaiting';
import UserProfilePage from './pages/user/UserProfilePage';
import AdminProfilePage from './pages/admin/AdminProfilePage';

function App() {
  return (
    <Router>
      <ShoppingCartProvider>
        <NavBar />
        <Routes>
          {/* Public Routes */}
          <Route path='/' element={<HomePage />} />
          <Route path='/contact' element={<ContactPage />} />{' '}
          {/* contact route */}
          <Route path='/products' element={<ProductsPage />} />{' '}
          <Route path='/product/:id' element={<ProductDetailPage />} />
          <Route path='/login' element={<LoginPage />} />{' '}
          <Route path='/register' element={<RegisterPage />} />{' '}
          {/* User Routes */}
          <Route
            path='/user/cart'
            element={
              <PrivateRoute role='user'>
                <CartPage />
              </PrivateRoute>
            }
          />
          <Route
            path='/user/checkout'
            element={
              <PrivateRoute role='user'>
                <Checkout />
              </PrivateRoute>
            }
          />
          <Route
            path='/payment-result'
            element={
              <PrivateRoute role='user'>
                <PaymentResult />
              </PrivateRoute>
            }
          />
          <Route
            path='/payment-waiting'
            element={
              <PrivateRoute role='user'>
                <PaymentWaiting />
              </PrivateRoute>
            }
          />
          {/* <Route
            path='/user/payment'
            element={
              <PrivateRoute role='user'>
                <PaymentErrorBoundary>
                  <PaymentPage />
                </PaymentErrorBoundary>
              </PrivateRoute>
            }
          /> */}
          <Route
            path='/user/profile'
            element={
              <PrivateRoute role='user'>
                <UserProfilePage />
              </PrivateRoute>
            }
          />
          <Route
            path='/admin/profile'
            element={
              <PrivateRoute role='admin'>
                <AdminProfilePage />
              </PrivateRoute>
            }
          />
          {/* Admin Routes */}
          <Route
            path='/admin'
            element={
              <PrivateRoute role='admin'>
                <HomePage />
              </PrivateRoute>
            }
          />
          <Route
            path='/admin/products'
            element={
              <PrivateRoute role='admin'>
                <AdminPage /> {/* Ürün yönetimi komponenti */}
              </PrivateRoute>
            }
          />
          <Route
            path='/admin/orders'
            element={
              <PrivateRoute role='admin'>
                <AdminPage /> {/* Sipariş yönetimi komponenti */}
              </PrivateRoute>
            }
          />
          <Route
            path='/admin/users'
            element={
              <PrivateRoute role='admin'>
                <AdminPage /> {/* Kullanıcı yönetimi komponenti */}
              </PrivateRoute>
            }
          />
        </Routes>
        <Footer />
      </ShoppingCartProvider>
    </Router>
  );
}

export default App;
