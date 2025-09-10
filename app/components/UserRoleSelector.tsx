'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Shield, Crown, LogIn, UserPlus, Settings } from 'lucide-react';
import { useAppStore } from '../store/appStore';
import { UserRole } from '../types';
import { clsx } from 'clsx';

export interface UserRoleSelectorProps {
  className?: string;
}

export const UserRoleSelector: React.FC<UserRoleSelectorProps> = ({ className }) => {
  const { 
    currentUser, 
    users, 
    setCurrentUser, 
    addUser,
    initializeDefaultData 
  } = useAppStore();

  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showAddUser, setShowAddUser] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserRole, setNewUserRole] = useState<UserRole>('user');

  // Initialize data if no users exist
  React.useEffect(() => {
    if (users.length === 0) {
      initializeDefaultData();
    }
  }, [users.length, initializeDefaultData]);

  const handleUserSelect = (user: typeof users[0]) => {
    setCurrentUser(user);
    setShowUserMenu(false);
  };

  const handleAddUser = () => {
    if (newUserName.trim()) {
      addUser({
        name: newUserName.trim(),
        role: newUserRole,
        points: 0,
        badges: []
      });
      setNewUserName('');
      setNewUserRole('user');
      setShowAddUser(false);
    }
  };

  const getRoleIcon = (role: UserRole) => {
    return role === 'admin' ? <Crown className="w-4 h-4" /> : <User className="w-4 h-4" />;
  };

  const getRoleColor = (role: UserRole) => {
    return role === 'admin' ? 'text-purple-600' : 'text-blue-600';
  };

  const getRoleBadge = (role: UserRole) => {
    return role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800';
  };

  return (
    <div className={clsx('relative', className)}>
      {/* Current User Display */}
      <button
        onClick={() => setShowUserMenu(!showUserMenu)}
        className="flex items-center gap-3 p-4 pwc-card pwc-shadow-sm hover:pwc-shadow-md transition-all duration-200"
      >
        {currentUser ? (
          <>
            <div className={clsx('p-2', currentUser.role === 'admin' ? 'bg-pwc-orange' : 'bg-pwc-blue')}>
              {getRoleIcon(currentUser.role)}
            </div>
            <div className="text-left">
              <div className="pwc-typography-body font-semibold text-pwc-black">{currentUser.name}</div>
              <div className="pwc-typography-small text-pwc-gray flex items-center gap-1">
                <span className="text-pwc-gray-dark">
                  {currentUser.role === 'admin' ? 'Administrator' : 'Employee'}
                </span>
                {currentUser.points > 0 && (
                  <>
                    <span>•</span>
                    <span className="text-pwc-orange">{currentUser.points} pts</span>
                  </>
                )}
              </div>
            </div>
            <Settings className="w-4 h-4 text-pwc-gray-light ml-auto" />
          </>
        ) : (
          <>
            <div className="p-2 bg-pwc-light">
              <User className="w-4 h-4 text-pwc-gray" />
            </div>
            <div className="text-left">
              <div className="pwc-typography-body font-semibold text-pwc-black">Select User</div>
              <div className="pwc-typography-small text-pwc-gray">Choose your profile</div>
            </div>
            <LogIn className="w-4 h-4 text-pwc-gray-light ml-auto" />
          </>
        )}
      </button>

      {/* User Menu Dropdown */}
      <AnimatePresence>
        {showUserMenu && (
          <motion.div
            className="absolute top-full left-0 right-0 mt-2 pwc-card pwc-shadow-lg z-50 overflow-hidden"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {/* Existing Users */}
            <div className="max-h-64 overflow-y-auto">
              {users.map((user) => (
                <motion.button
                  key={user.id}
                  onClick={() => handleUserSelect(user)}
                  className={clsx(
                    'w-full flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0',
                    currentUser?.id === user.id && 'bg-blue-50'
                  )}
                  whileHover={{ x: 4 }}
                >
                  <div className={clsx('p-2 rounded-full', getRoleBadge(user.role))}>
                    {getRoleIcon(user.role)}
                  </div>
                  <div className="text-left flex-1">
                    <div className="font-medium text-gray-800">{user.name}</div>
                    <div className="text-sm text-gray-600 flex items-center gap-2">
                      <span className={getRoleColor(user.role)}>
                        {user.role === 'admin' ? 'Admin' : 'User'}
                      </span>
                      {user.points > 0 && (
                        <>
                          <span>•</span>
                          <span className="text-yellow-600">{user.points} pts</span>
                        </>
                      )}
                      {user.badges.length > 0 && (
                        <>
                          <span>•</span>
                          <span className="text-green-600">{user.badges.length} badges</span>
                        </>
                      )}
                    </div>
                  </div>
                  {currentUser?.id === user.id && (
                    <Shield className="w-4 h-4 text-blue-500" />
                  )}
                </motion.button>
              ))}
            </div>

            {/* Add New User */}
            <div className="border-t border-gray-200">
              {!showAddUser ? (
                <button
                  onClick={() => setShowAddUser(true)}
                  className="w-full flex items-center gap-3 p-3 text-green-600 hover:bg-green-50 transition-colors"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Add New User</span>
                </button>
              ) : (
                <div className="p-3 space-y-3">
                  <input
                    type="text"
                    value={newUserName}
                    onChange={(e) => setNewUserName(e.target.value)}
                    placeholder="Enter name..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    autoFocus
                  />
                  
                  <div className="flex gap-2">
                    <select
                      value={newUserRole}
                      onChange={(e) => setNewUserRole(e.target.value as UserRole)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setShowAddUser(false);
                        setNewUserName('');
                        setNewUserRole('user');
                      }}
                      className="flex-1 px-3 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAddUser}
                      disabled={!newUserName.trim()}
                      className="flex-1 px-3 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Add User
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Click overlay to close menu */}
      {showUserMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowUserMenu(false)}
        />
      )}
    </div>
  );
};

