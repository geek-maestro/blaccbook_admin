import React, { useEffect, useState } from "react";

const SplashScreen: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Start fading out after 2 seconds
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-blue-900 transition-opacity duration-1000 ${
        isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div className="text-center space-y-6 flex flex-col items-center">
        <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm animate-pulse">
          <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
        </div>
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-white tracking-wider">
            BLACC<span className="text-blue-200">BOOK</span>
          </h1>
          <p className="text-blue-200 text-sm tracking-widest uppercase">
            Connecting Communities
          </p>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
