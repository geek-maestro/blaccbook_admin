import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.svg';

const SplashScreen = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/login');
    }, 2000); // Navigate to login after 2 seconds

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-white">
      <div className="text-center animate-fade-in-scale w-64 h-64">
        <img 
          src={logo} 
          alt="BlaccBook Logo" 
          className="w-full h-full object-contain"
        />
      </div>
    </div>
  );
};

export default SplashScreen; 