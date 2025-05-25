import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, CreditCard } from 'lucide-react';
import { Button } from '../ui/Button';
import { useTreeContext } from '../../context/TreeContext';
import { useOptionalCapabilityCardContext } from '../../context/CapabilityCardContext';

interface BurgerMenuProps {
  className?: string;
}

const BurgerMenu: React.FC<BurgerMenuProps> = ({ className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { nodes } = useTreeContext();
  const capabilityCardContext = useOptionalCapabilityCardContext();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Find the root node (node with no parent)
  const rootNode = nodes.find(node => node.parent === null);

  const handleViewRootCapabilityCard = () => {
    if (rootNode && capabilityCardContext?.onOpenCapabilityCard) {
      capabilityCardContext.onOpenCapabilityCard(rootNode);
      setIsOpen(false); // Close menu after opening capability card
    }
  };

  const menuVariants = {
    closed: {
      x: '-100%',
      opacity: 0,
      transition: { duration: 0.3, ease: 'easeInOut' }
    },
    open: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.3, ease: 'easeInOut' }
    }
  };
  const overlayVariants = {
    closed: {
      opacity: 0,
      visibility: 'hidden' as const,
      transition: { duration: 0.3 }
    },
    open: {
      opacity: 0.5,
      visibility: 'visible' as const,
      transition: { duration: 0.3 }
    }
  };
  const menuItems = [
    { label: 'Home', path: '/' },
    { label: 'About', path: '/about' }
    // Note: We're using relative paths here since React Router's Link component 
    // automatically handles the base path from the router configuration
  ];

  return (
    <>
      {/* Burger menu toggle button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleMenu}
        className={`relative z-50 p-2 text-gray-800 hover:text-gray-600 hover:bg-gray-100 ${className}`}
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>      {/* Overlay */}
      <motion.div 
        className="fixed inset-0 bg-black z-40 burger-menu-overlay"
        initial="closed"
        animate={isOpen ? 'open' : 'closed'}
        variants={overlayVariants}
        onClick={toggleMenu}
      />

      {/* Slide-out menu */}
      <motion.div 
        className="fixed top-0 left-0 bottom-0 w-full max-w-72 sm:w-64 bg-white shadow-xl z-50 flex flex-col burger-menu"
        initial="closed"
        animate={isOpen ? 'open' : 'closed'}
        variants={menuVariants}
      >
        <div className="p-4 sm:p-5 flex justify-between items-center border-b">
          <h2 className="text-xl font-semibold">Menu</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMenu}
            className="p-2 text-gray-800 hover:text-gray-600"
            aria-label="Close menu"
          >
            <X className="h-6 w-6" />
          </Button>
        </div>        <nav className="mt-4">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <li key={item.path}>
                  <Link 
                    to={item.path} 
                    className={`block px-5 py-2 text-lg transition-colors duration-200 nav-link ${isActive ? 'active' : ''}`}
                    onClick={toggleMenu}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
            
            {/* Capability Card for Root Node */}
            {rootNode && capabilityCardContext?.onOpenCapabilityCard && (
              <li>
                <button
                  onClick={handleViewRootCapabilityCard}
                  className="w-full text-left px-5 py-2 text-lg transition-colors duration-200 nav-link flex items-center gap-2 hover:bg-gray-100"
                >
                  <CreditCard className="h-5 w-5" />
                  Root Capability Card
                </button>
              </li>
            )}
          </ul>
        </nav>
      </motion.div>
    </>
  );
};

export default BurgerMenu;
