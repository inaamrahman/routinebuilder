
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white shadow-t mt-auto">
      <div className="container mx-auto px-4 py-4 text-center text-sm text-slate-600">
        &copy; {new Date().getFullYear()} Daily Routine Planner. Plan your day, your way.
      </div>
    </footer>
  );
};

export default Footer;
