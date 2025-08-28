// src/components/dashboard/components/Sidebar.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = ({ onLogout }) => {
  return (
    <aside className="w-56 bg-yellow-100 rounded-2xl p-4 sticky top-6 self-start min-h-[calc(100vh-6rem)] max-h-[calc(100vh-6rem)] overflow-auto ">
      <nav className="space-y-2">
        <NavLink
          to="/dashboard"
          end
          className={({ isActive }) =>
            `block px-4 py-3 rounded-lg transition-colors text-sm font-medium ${
              isActive 
                ? 'bg-orange-400 text-white' 
                : 'hover:bg-yellow-200 text-gray-700'
            }`
          }
        >
          Dashboard
        </NavLink>
        
        <NavLink
          to="/dashboard/account"
          className={({ isActive }) =>
            `block px-4 py-3 rounded-lg transition-colors text-sm font-medium ${
              isActive 
                ? 'bg-orange-400 text-white' 
                : 'hover:bg-yellow-200 text-gray-700'
            }`
          }
        >
          Info Account
        </NavLink>
        
        <button
          onClick={onLogout}
          className="w-full text-left px-4 py-3 rounded-lg hover:bg-yellow-200 text-gray-700 transition-colors text-sm font-medium"
        >
          Log Out
        </button>
      </nav>
    </aside>
  );
};

export default Sidebar;