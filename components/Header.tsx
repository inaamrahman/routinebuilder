
import React from 'react';
import { CalendarDaysIcon } from './icons/CalendarDaysIcon';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-6 flex items-center space-x-3">
        <CalendarDaysIcon className="h-10 w-10 text-sky-600" />
        <h1 className="text-3xl font-bold text-sky-700">Daily Routine Planner</h1>
      </div>
    </header>
  );
};

export default Header;
