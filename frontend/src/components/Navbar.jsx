import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import { Menu, X, LogOut, LayoutDashboard, Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AnimatedThemeToggler } from './ui/animated-theme-toggler';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const { isAuthenticated } = useSelector(state => state.auth);
    const dispatch = useDispatch();
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 60);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = ['Home', 'About', 'Services', 'Skills', 'Projects', 'Contact'];
    const isHome = location.pathname === '/';

    const handleScrollTo = (id) => {
        setIsOpen(false);
        document.getElementById(id.toLowerCase())?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <motion.nav
            initial={{ y: -80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="fixed w-full z-50 transition-all duration-500"
            style={{
                background: scrolled ? 'var(--bg-card)' : 'transparent',
                backdropFilter: scrolled ? 'blur(20px)' : 'none',
                borderBottom: scrolled ? '1px solid var(--border-subtle)' : 'none',
                boxShadow: scrolled ? '0 4px 30px rgba(0,0,0,0.1)' : 'none',
            }}
        >
            <div className="max-w-7xl mx-auto px-6 py-3 md:py-4 flex justify-between items-center">
                {/* Logo */}
                <Link to="/" className="text-lg md:text-2xl font-black tracking-tight">
                    <span className="gradient-text">Samprit</span>
                    <span className="opacity-30">.</span>
                </Link>

                {/* Desktop Links */}
                <div className="hidden md:flex items-center gap-8">
                    {isHome && navLinks.map((link) => (
                        <button
                            key={link}
                            onClick={() => handleScrollTo(link)}
                            className="text-base font-semibold tracking-wide transition-all duration-300 relative group"
                            style={{ color: 'var(--text-muted)' }}
                        >
                            {link}
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-300" style={{ background: 'linear-gradient(to right, var(--primary), var(--secondary))' }} />
                        </button>
                    ))}
                    {!isHome && <Link to="/" style={{ color: 'var(--text-muted)' }} className="text-base font-semibold">← Back Home</Link>}

                    {isAuthenticated ? (
                        <div className="flex items-center gap-3">
                            <AnimatedThemeToggler className="mr-2" variant="star" style={{ color: 'var(--text-main)' }} />
                            <Link to="/admin" className="btn-primary py-2 px-5 text-base flex items-center gap-2">
                                <LayoutDashboard size={15} /> Dashboard
                            </Link>
                            <button onClick={() => dispatch(logout())} className="p-2 rounded-lg transition-all" style={{ color: 'var(--text-muted)' }}
                                onMouseEnter={e => e.target.style.color = '#ef4444'}
                                onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}
                            >
                                <LogOut size={18} />
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-6">
                            <AnimatedThemeToggler variant="star" style={{ color: 'var(--text-main)' }} />
                            <Link to="/admin/login" className="text-sm tracking-widest uppercase hover:text-primary transition-colors" style={{ color: 'var(--text-muted)', opacity: 0.4 }}>Admin</Link>
                        </div>
                    )}
                </div>

                {/* Mobile Toggle */}
                <button
                    className="md:hidden p-2 rounded-lg"
                    style={{ color: 'var(--primary)' }}
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="md:hidden overflow-hidden"
                        style={{ background: 'var(--bg-main)', borderBottom: '1px solid var(--border-subtle)' }}
                    >
                        <div className="px-6 py-6 flex flex-col gap-5">
                            {isHome && navLinks.map(link => (
                                <button key={link} onClick={() => handleScrollTo(link)}
                                    className="text-left font-semibold text-lg"
                                    style={{ color: 'var(--text-main)' }}
                                >
                                    {link}
                                </button>
                            ))}
                            <div className="flex items-center gap-3 py-2 border-t border-black/5 dark:border-white/5">
                                <span className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>Appearance</span>
                                <AnimatedThemeToggler variant="star" style={{ color: 'var(--text-main)' }} />
                            </div>
                            {isAuthenticated && (
                                <>
                                    <Link to="/admin" onClick={() => setIsOpen(false)} className="font-bold text-lg" style={{ color: 'var(--primary)' }}>Dashboard</Link>
                                    <button onClick={() => { dispatch(logout()); setIsOpen(false); }} className="text-left font-bold text-lg" style={{ color: '#ef4444' }}>Logout</button>
                                </>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
};

export default Navbar;
