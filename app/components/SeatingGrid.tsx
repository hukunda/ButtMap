'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users } from 'lucide-react';
import { useAppStore } from '../store/appStore';
import { Seat } from '../types';
import { clsx } from 'clsx';

export interface SeatingGridProps {
  className?: string;
}

export const SeatingGrid: React.FC<SeatingGridProps> = ({ className }) => {
  const { 
    currentLayout, 
    currentUser,
    updateSeat 
  } = useAppStore();

  const [selectedSeat, setSelectedSeat] = useState<string | null>(null);
  const [showNameInput, setShowNameInput] = useState(false);
  const [inputName, setInputName] = useState('');

  if (!currentLayout) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        <div className="text-center">
          <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No seating layout available</p>
          <p className="text-sm">Please create or select a layout</p>
        </div>
      </div>
    );
  }

  const handleSeatClick = (seat: Seat) => {
    if (seat.isLocked && currentUser?.role !== 'admin') {
      return;
    }
    setSelectedSeat(seat.id);
    setInputName(seat.occupiedBy || '');
    setShowNameInput(true);
  };

  const handleNameSubmit = () => {
    if (selectedSeat) {
      updateSeat(currentLayout.id, selectedSeat, {
        occupiedBy: inputName.trim() || undefined,
        occupiedById: currentUser?.id,
      });
    }
    setShowNameInput(false);
    setSelectedSeat(null);
    setInputName('');
  };

  const handleNameCancel = () => {
    setShowNameInput(false);
    setSelectedSeat(null);
    setInputName('');
  };

  // Helper function to get seat by coordinate
  const getSeatByCoordinate = (coordinate: string) => {
    return currentLayout.seats.find(seat => seat.coordinate === coordinate);
  };

  // Render individual seat cell with modern table design
  const renderSeat = (coordinate: string, isOpsTeam = false) => {
    const seat = getSeatByCoordinate(coordinate);
    if (!seat) return null;

    const canEdit = !seat.isLocked || currentUser?.role === 'admin';
    const isOccupied = !!seat.occupiedBy;

    return (
      <motion.div
        key={seat.id}
        className={clsx(
          'relative cursor-pointer transition-all duration-300 group',
          'rounded-2xl p-4 min-h-[80px] flex flex-col justify-between',
          'shadow-lg hover:shadow-xl backdrop-blur-sm',
          // OPS Team styling
          isOpsTeam && !isOccupied && 'bg-gradient-to-br from-purple-100 to-indigo-100 border-2 border-purple-300',
          isOpsTeam && isOccupied && 'bg-gradient-to-br from-purple-200 to-indigo-200 border-2 border-purple-400',
          // Available seat styling
          !isOpsTeam && !isOccupied && 'bg-gradient-to-br from-emerald-50 to-green-50 border-2 border-emerald-200',
          // Occupied seat styling
          !isOpsTeam && isOccupied && 'bg-gradient-to-br from-blue-100 to-cyan-100 border-2 border-blue-300',
          // Hover effects
          canEdit && 'hover:scale-105 hover:rotate-1 hover:z-10',
          !canEdit && 'cursor-not-allowed opacity-70',
          selectedSeat === seat.id && 'ring-4 ring-orange-400 ring-opacity-50 scale-105 z-20'
        )}
        onClick={canEdit ? () => handleSeatClick(seat) : undefined}
        whileHover={canEdit ? { 
          scale: 1.05, 
          rotateZ: 1,
          transition: { duration: 0.2 }
        } : undefined}
        whileTap={canEdit ? { scale: 0.95 } : undefined}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: Math.random() * 0.2 }}
      >
        {/* Desk Surface with glassmorphism effect */}
        <div className="absolute inset-0 bg-white/30 backdrop-blur-md rounded-2xl border border-white/20"></div>
        
        {/* Desk Label */}
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-2">
            <span className={clsx(
              "px-2 py-1 rounded-full text-xs font-bold",
              isOpsTeam ? "bg-purple-500 text-white" : "bg-gray-600 text-white"
            )}>
              {coordinate}
            </span>
            {isOpsTeam && (
              <div className="bg-purple-600 text-white px-2 py-1 rounded-full text-xs font-bold">
                OPS
              </div>
            )}
          </div>
          
          {/* Person info */}
          <div className="space-y-1">
            {isOccupied ? (
              <div className="bg-white/80 backdrop-blur-sm rounded-lg p-2 border border-white/30">
                <div className="flex items-center space-x-2">
                  <div className={clsx(
                    "w-3 h-3 rounded-full",
                    isOpsTeam ? "bg-purple-500" : "bg-blue-500"
                  )}></div>
                  <span className="text-sm font-semibold text-gray-800 truncate">
                    {seat.occupiedBy}
                  </span>
                </div>
              </div>
            ) : (
              <div className="bg-white/60 backdrop-blur-sm rounded-lg p-2 border border-white/20 text-center">
                <span className="text-xs text-gray-500 font-medium">
                  {isOpsTeam ? "OPS Available" : "Available"}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Hover effect overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-orange-400/0 to-orange-400/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        {/* Status indicator dot */}
        <div className={clsx(
          "absolute top-2 right-2 w-3 h-3 rounded-full border-2 border-white shadow-sm",
          isOccupied 
            ? (isOpsTeam ? "bg-purple-500" : "bg-green-500")
            : "bg-gray-300"
        )}></div>

        {/* Selected state glow */}
        {selectedSeat === seat.id && (
          <div className="absolute -inset-1 bg-gradient-to-r from-orange-400 to-red-400 rounded-2xl blur opacity-75"></div>
        )}
      </motion.div>
    );
  };

  return (
    <div className={clsx('relative', className)}>
      {/* Modern Office Layout Container */}
      <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-3xl p-8 shadow-2xl overflow-auto border border-white/20">
        <div className="min-w-max">
          {/* Marek's Office - Top Section with modern styling */}
          <div className="mb-8">
            <div className="bg-gradient-to-r from-emerald-400 to-green-500 rounded-2xl p-6 text-center shadow-lg">
              <div className="flex items-center justify-center space-x-3">
                <span className="text-2xl">🏢</span>
                <span className="text-xl font-bold text-white">Marek&apos;s Office</span>
                <span className="text-2xl">🏢</span>
              </div>
            </div>
          </div>

          {/* Main Layout Container */}
          <div className="flex gap-8">
            {/* Left Side - AISLE label with modern design */}
            <div className="flex flex-col items-center space-y-4">
              {/* AISLE Label (rotated) with modern styling */}
              <div 
                className="bg-gradient-to-b from-gray-600 to-gray-800 rounded-2xl p-3 flex items-center justify-center shadow-lg"
                style={{ 
                  writingMode: 'vertical-rl',
                  textOrientation: 'mixed',
                  height: '200px',
                  width: '60px'
                }}
              >
                <span className="font-bold text-white tracking-widest">AISLE</span>
              </div>

              {/* Available for Users indicator */}
              <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl p-4 text-center shadow-lg">
                <div className="text-white font-bold text-sm">Lines 1-5</div>
                <div className="text-white text-xs mt-1">Available for Users</div>
              </div>
            </div>

            {/* Main Seating Grid with modern spacing */}
            <div className="flex-1">
              <div className="space-y-4">
                {/* OPS Team Section - Row 0 */}
                <div className="mb-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <span className="text-lg">👥</span>
                    <h3 className="text-lg font-bold text-purple-700">OPS Team Reserved Area</h3>
                  </div>
                  <div className="grid grid-cols-6 gap-4">
                    {[1, 2, 3, 4, 5, 6].map(col => renderSeat(`0.${col}`, true))}
                  </div>
                </div>

                {/* General Seating Area - Rows 1-5 */}
                <div>
                  <div className="flex items-center space-x-2 mb-4">
                    <span className="text-lg">💺</span>
                    <h3 className="text-lg font-bold text-blue-700">General Seating Area</h3>
                  </div>
                  <div className="space-y-4">
                    {/* Row 1 (1.1 to 1.6) */}
                    <div className="grid grid-cols-6 gap-4">
                      {[1, 2, 3, 4, 5, 6].map(col => renderSeat(`1.${col}`, false))}
                    </div>
                    
                    {/* Row 2 (2.1 to 2.6) */}
                    <div className="grid grid-cols-6 gap-4">
                      {[1, 2, 3, 4, 5, 6].map(col => renderSeat(`2.${col}`, false))}
                    </div>
                    
                    {/* Row 3 (3.1 to 3.6) */}
                    <div className="grid grid-cols-6 gap-4">
                      {[1, 2, 3, 4, 5, 6].map(col => renderSeat(`3.${col}`, false))}
                    </div>
                    
                    {/* Row 4 (4.1 to 4.6) */}
                    <div className="grid grid-cols-6 gap-4">
                      {[1, 2, 3, 4, 5, 6].map(col => renderSeat(`4.${col}`, false))}
                    </div>
                    
                    {/* Row 5 (5.1 to 5.6) */}
                    <div className="grid grid-cols-6 gap-4">
                      {[1, 2, 3, 4, 5, 6].map(col => renderSeat(`5.${col}`, false))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Windows with modern design */}
            <div className="flex items-center">
              <div 
                className="bg-gradient-to-b from-sky-200 to-blue-300 rounded-2xl p-3 flex items-center justify-center shadow-lg border-2 border-sky-300"
                style={{ 
                  writingMode: 'vertical-rl',
                  textOrientation: 'mixed',
                  height: '500px',
                  width: '60px'
                }}
              >
                <div className="flex flex-col items-center space-y-4">
                  <span className="text-2xl">🪟</span>
                  <span className="font-bold text-blue-800 tracking-widest">WINDOWS</span>
                  <span className="text-2xl">🪟</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Name Input Modal */}
      <AnimatePresence>
        {showNameInput && selectedSeat && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleNameCancel}
          >
            <motion.div
              className="bg-white/95 backdrop-blur-xl rounded-3xl p-8 w-96 mx-4 shadow-2xl border border-white/30"
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-red-500 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg">
                  <span className="text-2xl">💺</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  Desk Assignment
                </h3>
                <p className="text-gray-600">
                  Seat {currentLayout.seats.find(s => s.id === selectedSeat)?.coordinate}
                </p>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Employee Name
                  </label>
                  <input
                    type="text"
                    value={inputName}
                    onChange={(e) => setInputName(e.target.value)}
                    className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-orange-200 focus:border-orange-400 transition-all duration-200"
                    placeholder="Enter employee name..."
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleNameSubmit();
                      } else if (e.key === 'Escape') {
                        handleNameCancel();
                      }
                    }}
                  />
                </div>
                
                <div className="flex gap-3">
                  <button
                    onClick={handleNameCancel}
                    className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-2xl font-semibold hover:bg-gray-200 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleNameSubmit}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-400 to-red-500 text-white rounded-2xl font-semibold hover:from-orange-500 hover:to-red-600 transition-all duration-200 shadow-lg"
                  >
                    Save
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modern Workspace Analytics */}
      <div className="mt-12">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Workspace Analytics
          </h3>
          <p className="text-gray-600">Real-time office utilization metrics</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Available Seats */}
          <motion.div 
            className="bg-gradient-to-br from-emerald-400 to-green-500 rounded-3xl p-6 text-center shadow-xl text-white"
            whileHover={{ scale: 1.05, rotateY: 5 }}
            transition={{ duration: 0.2 }}
          >
            <div className="text-4xl mb-2">🪑</div>
            <div className="text-3xl font-bold mb-1">
              {currentLayout.seats.filter(s => !s.occupiedBy).length}
            </div>
            <div className="text-emerald-100 font-medium">Available Desks</div>
          </motion.div>

          {/* Occupied Seats */}
          <motion.div 
            className="bg-gradient-to-br from-blue-400 to-indigo-500 rounded-3xl p-6 text-center shadow-xl text-white"
            whileHover={{ scale: 1.05, rotateY: 5 }}
            transition={{ duration: 0.2 }}
          >
            <div className="text-4xl mb-2">👤</div>
            <div className="text-3xl font-bold mb-1">
              {currentLayout.seats.filter(s => s.occupiedBy).length}
            </div>
            <div className="text-blue-100 font-medium">Occupied Desks</div>
          </motion.div>

          {/* OPS Team Usage */}
          <motion.div 
            className="bg-gradient-to-br from-purple-400 to-violet-500 rounded-3xl p-6 text-center shadow-xl text-white"
            whileHover={{ scale: 1.05, rotateY: 5 }}
            transition={{ duration: 0.2 }}
          >
            <div className="text-4xl mb-2">👥</div>
            <div className="text-3xl font-bold mb-1">
              {currentLayout.seats.filter(s => s.coordinate.startsWith('0.') && s.occupiedBy).length}/6
            </div>
            <div className="text-purple-100 font-medium">OPS Team</div>
          </motion.div>

          {/* Utilization Rate */}
          <motion.div 
            className="bg-gradient-to-br from-orange-400 to-red-500 rounded-3xl p-6 text-center shadow-xl text-white relative overflow-hidden"
            whileHover={{ scale: 1.05, rotateY: 5 }}
            transition={{ duration: 0.2 }}
          >
            <div className="text-4xl mb-2">📊</div>
            <div className="text-3xl font-bold mb-1">
              {Math.round((currentLayout.seats.filter(s => s.occupiedBy).length / currentLayout.seats.length) * 100)}%
            </div>
            <div className="text-orange-100 font-medium">Utilization Rate</div>
            
            {/* Progress bar */}
            <div className="absolute bottom-0 left-0 h-2 bg-white/30 w-full">
              <div 
                className="h-full bg-white/60 transition-all duration-1000"
                style={{ 
                  width: `${Math.round((currentLayout.seats.filter(s => s.occupiedBy).length / currentLayout.seats.length) * 100)}%` 
                }}
              />
            </div>
          </motion.div>
        </div>

        {/* Additional insights */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/30 shadow-lg">
            <h4 className="font-bold text-gray-800 mb-3">🎯 Quick Stats</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">General Area (Lines 1-5):</span>
                <span className="font-semibold">
                  {currentLayout.seats.filter(s => !s.coordinate.startsWith('0.') && s.occupiedBy).length}/{currentLayout.seats.filter(s => !s.coordinate.startsWith('0.')).length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">OPS Reserved Area:</span>
                <span className="font-semibold">
                  {currentLayout.seats.filter(s => s.coordinate.startsWith('0.') && s.occupiedBy).length}/6
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/30 shadow-lg">
            <h4 className="font-bold text-gray-800 mb-3">📈 Status Overview</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>Available for immediate use</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span>OPS Team reserved area</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span>Currently occupied</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
