import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Hero from './components/Hero';
import NavBar from './components/NavBar';
import Analytics from './components/Analytics';
import Cards from './components/Cards';
import Footer from './components/Footer';
import Newsletter from './components/Newsletter';
import ContactPage from './pages/ContactPage';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

function App() {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/contact' element={<ContactPage />} />{' '}
        {/* contact route */}
        <Route path='/products' element={<ProductsPage />} />{' '}
        <Route path='/login' element={<LoginPage />} />{' '}
        <Route path='/register' element={<RegisterPage />} />{' '}
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
