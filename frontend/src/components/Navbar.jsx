import { useState, useEffect, useCallback } from 'react';
import Modal from './Modal';
import InputForm from './InputForm';
import { NavLink, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import {
  FaHome,
  FaBookOpen,
  FaHeart,
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaSignInAlt,
} from 'react-icons/fa';

function Navbar() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });
  const [mobileOpen, setMobileOpen] = useState(false);
  const isLoggedIn = Boolean(token);

  const syncAuthState = useCallback(() => {
    setToken(localStorage.getItem('token'));
    const stored = localStorage.getItem('user');
    setUser(stored ? JSON.parse(stored) : null);
  }, []);

  useEffect(() => {
    window.addEventListener('storage', syncAuthState);
    window.addEventListener('auth-change', syncAuthState);
    return () => {
      window.removeEventListener('storage', syncAuthState);
      window.removeEventListener('auth-change', syncAuthState);
    };
  }, [syncAuthState]);

  const handleAuthAction = () => {
    if (isLoggedIn) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      syncAuthState();
      window.dispatchEvent(new Event('auth-change'));
      navigate('/');
    } else {
      setIsOpen(true);
    }
  };

  const handleProtectedNav = (path) => {
    if (!isLoggedIn) {
      setIsOpen(true);
      return;
    }
    navigate(path);
  };

  return (
    <>
      <div className="md:hidden fixed top-3 left-1/2 transform -translate-x-1/2 z-[60] pointer-events-none">
        <div className="py-1 px-4  rounded-full bg-gradient-to-r from-[#22C55E] to-[#F97316] text-white text-sm font-semibold shadow-lg">
          Food Recipes
        </div>
      </div>

      <nav className='fixed top-4 left-0 right-0 z-40'>
        <div className="md:hidden flex items-center justify-between px-4 h-14 bg-transparent">
         

          <div className="flex items-center gap-2">
            <button
              onClick={() => setMobileOpen(p => !p)}
              aria-label='menu'
              className='p-2 rounded-md bg-white/10 backdrop-blur border border-white/10'
            >
              {mobileOpen ? (
                <svg className="w-6 h-6 text-text-main" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6 text-text-main" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M4 8h16M4 16h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-10 bg-section/60 backdrop-blur-md rounded-xl px-4 py-2 border border-orange/10 shadow-md absolute left-1/2 transform -translate-x-1/2">
          <img src={logo} alt="logo" className="w-10 h-10" />
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? 'text-primary font-medium' : 'text-text-main hover:text-primary'
            }
          >
            Home
          </NavLink>
          <NavLink
            to={isLoggedIn ? '/myRecipe' : '#'}
            onClick={(event) => {
              if (!isLoggedIn) {
                event.preventDefault();
                setIsOpen(true);
              }
            }}
            className={({ isActive }) =>
              isActive ? 'text-primary font-medium' : 'text-text-main hover:text-primary'
            }
          >
            My Recipe
          </NavLink>
          <NavLink
            to={isLoggedIn ? '/favouriteRecipe' : '#'}
            onClick={(event) => {
              if (!isLoggedIn) {
                event.preventDefault();
                setIsOpen(true);
              }
            }}
            className={({ isActive }) =>
              isActive ? 'text-primary font-medium' : 'text-text-main hover:text-primary'
            }
          >
            Favourites
          </NavLink>
          <button
            onClick={handleAuthAction}
            className="mt-2 rounded-md bg-primary px-3 py-2 text-sm text-white hover:bg-primary-hover"
            aria-label="login-logout"
          >
            {isLoggedIn
              ? `Logout${user?.email ? ` (${user.email.split('@')[0]})` : ''}`
              : 'Login'}
          </button>
        </div>
        <div aria-hidden={!mobileOpen} className={`${mobileOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
          <div
            onClick={() => setMobileOpen(false)}
            className={`fixed inset-0 bg-black/40 transition-opacity duration-300 z-40 ${mobileOpen ? 'opacity-100' : 'opacity-0'}`}
          />
          <aside
            className={`fixed top-0 left-0 bottom-0 z-50 w-72 max-w-full bg-white/95 backdrop-blur-md shadow-xl transform transition-transform duration-300 ease-in-out
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}
          >
            <div className="h-16 flex items-center px-4 border-b border-white/10">
              <img src={logo} alt="logo" className='w-10 h-10 mr-2' />
              <button onClick={() => setMobileOpen(false)} aria-label="Close menu" className="ml-auto p-2 rounded-md bg-white/10">
                <svg className="w-5 h-5 text-text-main" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="px-4 py-4">
              <div className="relative">
                <input type="search" placeholder="Search recipes..." className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#22C55E]/30" />
                <button className="absolute right-2 top-2 text-sm text-[#22C55E] px-2 py-1 rounded-md">Go</button>
              </div>
            </div>

            <nav className="px-4 py-4 flex flex-col gap-3">
              <NavLink
                to="/"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 text-text-main hover:text-primary"
              >
                <FaHome className="text-sm" /> <span>Home</span>
              </NavLink>
              <button
                onClick={() => {
                  setMobileOpen(false);
                  handleProtectedNav('/myRecipe');
                }}
                className="flex items-center gap-3 text-text-main hover:text-primary"
              >
                <FaBookOpen className="text-sm" /> <span>My Recipe</span>
              </button>
              <button
                onClick={() => {
                  setMobileOpen(false);
                  handleProtectedNav('/favouriteRecipe');
                }}
                className="flex items-center gap-3 text-text-main hover:text-primary"
              >
                <FaHeart className="text-sm" /> <span>Favourites</span>
              </button>
              <button
                onClick={() => {
                  setMobileOpen(false);
                  handleAuthAction();
                }}
                className="mt-2 flex items-center justify-center gap-2 rounded-md bg-primary px-3 py-2 text-sm text-white hover:bg-primary-hover"
              >
                <FaSignInAlt /> {isLoggedIn ? 'Logout' : 'Login'}
              </button>
            </nav>

            <div className="px-4 py-4 border-t border-white/10">
              <div className="text-xs font-semibold text-text-muted mb-2">Categories</div>
              <div className="flex flex-wrap gap-2">
                {['Breakfast', 'Lunch', 'Dinner', 'Dessert'].map((category) => (
                  <button
                    key={category}
                    className="px-3 py-1 bg-white border border-gray-200 text-sm rounded-full text-text-main"
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-auto px-4 py-6 border-t border-white/10">
              <div className="flex items-center justify-between">
                <div className="text-xs text-text-muted">© {new Date().getFullYear()} FoodRecipe</div>
                <div className="flex gap-2">
                  <a href="#" className="p-2 rounded-full bg-white/10 hover:bg-[#22C55E] text-white transition"><FaFacebookF size={14} /></a>
                  <a href="#" className="p-2 rounded-full bg-white/10 hover:bg-[#F97316] text-white transition"><FaInstagram size={14} /></a>
                  <a href="#" className="p-2 rounded-full bg-white/10 hover:bg-[#22C55E] text-white transition"><FaTwitter size={14} /></a>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </nav>
      {isOpen && (
        <Modal onClose={() => setIsOpen(false)}>
          <InputForm setIsOpen={() => setIsOpen(false)} />
        </Modal>
      )}
    </>
  )
}
export default Navbar;