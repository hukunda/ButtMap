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

  // Render individual seat
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
          'rounded-xl p-3 min-h-[70px] flex flex-col justify-between',
          'shadow-md hover:shadow-lg backdrop-blur-sm',
          // Seat styling based on type and occupancy
          isOpsTeam && !isOccupied && 'bg-gradient-to-br from-purple-100 to-indigo-100 border-2 border-purple-300',
          isOpsTeam && isOccupied && 'bg-gradient-to-br from-purple-200 to-indigo-200 border-2 border-purple-400',
          !isOpsTeam && !isOccupied && 'bg-gradient-to-br from-emerald-50 to-green-50 border-2 border-emerald-200',
          !isOpsTeam && isOccupied && 'bg-gradient-to-br from-blue-100 to-cyan-100 border-2 border-blue-300',
          // Hover effects
          canEdit && 'hover:scale-105 hover:z-10',
          !canEdit && 'cursor-not-allowed opacity-70',
          selectedSeat === seat.id && 'ring-4 ring-orange-400 ring-opacity-50 scale-105 z-20'
        )}
        onClick={canEdit ? () => handleSeatClick(seat) : undefined}
        whileHover={canEdit ? { 
          scale: 1.05,
          transition: { duration: 0.2 }
        } : undefined}
        whileTap={canEdit ? { scale: 0.95 } : undefined}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: Math.random() * 0.1 }}
      >
        {/* Seat Surface */}
        <div className="absolute inset-0 bg-white/30 backdrop-blur-md rounded-xl border border-white/20"></div>
        
        {/* Seat Content */}
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-1">
            <span className={clsx(
              "px-2 py-1 rounded-full text-xs font-bold",
              isOpsTeam ? "bg-purple-500 text-white" : "bg-gray-600 text-white"
            )}>
              {coordinate}
            </span>
            {isOpsTeam && (
              <div className="bg-purple-600 text-white px-1 py-0.5 rounded text-xs font-bold">
                OPS
              </div>
            )}
          </div>
          
          {/* Person info */}
          <div>
            {isOccupied ? (
              <div className="bg-white/80 backdrop-blur-sm rounded-lg p-2 border border-white/30">
                <div className="flex items-center space-x-2">
                  <div className={clsx(
                    "w-2 h-2 rounded-full",
                    isOpsTeam ? "bg-purple-500" : "bg-blue-500"
                  )}></div>
                  <span className="text-xs font-semibold text-gray-800 truncate">
                    {seat.occupiedBy}
                  </span>
                </div>
              </div>
            ) : (
              <div className="bg-white/60 backdrop-blur-sm rounded-lg p-1.5 border border-white/20 text-center">
                <span className="text-xs text-gray-500 font-medium">Available</span>
              </div>
            )}
          </div>
        </div>

        {/* Status indicator dot */}
        <div className={clsx(
          "absolute top-2 right-2 w-2 h-2 rounded-full border border-white shadow-sm",
          isOccupied 
            ? (isOpsTeam ? "bg-purple-500" : "bg-green-500")
            : "bg-gray-300"
        )}></div>

        {/* Selected state glow */}
        {selectedSeat === seat.id && (
          <div className="absolute -inset-1 bg-gradient-to-r from-orange-400 to-red-400 rounded-xl blur opacity-75"></div>
        )}
      </motion.div>
    );
  };

  // Render a table with 2 seats
  const renderTable = (lineNumber: number, tableNumber: number, isOpsTeam = false) => {
    const seat1Coordinate = `${lineNumber}.${tableNumber * 2 - 1}`;
    const seat2Coordinate = `${lineNumber}.${tableNumber * 2}`;
    
    return (
      <motion.div
        key={`table-${lineNumber}-${tableNumber}`}
        className="relative"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, delay: (lineNumber * 0.1) + (tableNumber * 0.05) }}
      >
        {/* Table Base/Surface */}
        <div className={clsx(
          "rounded-3xl p-4 shadow-2xl border-4",
          isOpsTeam 
            ? "bg-gradient-to-br from-purple-200 via-indigo-200 to-purple-300 border-purple-400" 
            : "bg-gradient-to-br from-gray-200 via-slate-200 to-gray-300 border-gray-400"
        )}>
          {/* Table Top Surface */}
          <div className={clsx(
            "rounded-2xl p-4 mb-3 shadow-inner border-2",
            isOpsTeam
              ? "bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200"
              : "bg-gradient-to-br from-white to-gray-50 border-gray-200"
          )}>
            <div className="text-center mb-2">
              <span className={clsx(
                "px-3 py-1 rounded-full text-sm font-bold",
                isOpsTeam ? "bg-purple-600 text-white" : "bg-gray-600 text-white"
              )}>
                Table {tableNumber}
              </span>
            </div>
            
            {/* Two seats side by side */}
            <div className="grid grid-cols-2 gap-3">
              {renderSeat(seat1Coordinate, isOpsTeam)}
              {renderSeat(seat2Coordinate, isOpsTeam)}
            </div>
          </div>
          
          {/* Table Legs (decorative) */}
          <div className="flex justify-between px-4">
            <div className={clsx(
              "w-3 h-6 rounded-b-lg shadow-md",
              isOpsTeam ? "bg-purple-400" : "bg-gray-400"
            )}></div>
            <div className={clsx(
              "w-3 h-6 rounded-b-lg shadow-md",
              isOpsTeam ? "bg-purple-400" : "bg-gray-400"
            )}></div>
          </div>
        </div>
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
            <div className="flex flex-col items-center space-y-6">
              {/* AISLE Label (rotated) with modern styling */}
              <div 
                className="bg-gradient-to-b from-gray-600 to-gray-800 rounded-2xl p-3 flex items-center justify-center shadow-lg"
                style={{ 
                  writingMode: 'vertical-rl',
                  textOrientation: 'mixed',
                  height: '160px',
                  width: '60px'
                }}
              >
                <span className="font-bold text-white tracking-widest">AISLE</span>
              </div>

              {/* Office Layout Info */}
              <div className="space-y-3">
                <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl p-3 text-center shadow-lg text-white">
                  <div className="text-sm font-bold">Line 0</div>
                  <div className="text-xs">OPS Reserved</div>
                  <div className="text-xs">3 Tables</div>
                </div>
                
                <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl p-3 text-center shadow-lg text-white">
                  <div className="text-sm font-bold">Lines 1-5</div>
                  <div className="text-xs">General Access</div>
                  <div className="text-xs">15 Tables</div>
                </div>
              </div>
            </div>

            {/* Main Seating Grid with line numbers and tables */}
            <div className="flex-1">
              <div className="space-y-8">
                {/* Line 0 - OPS Team Reserved Area */}
                <div className="flex items-start gap-6">
                  {/* Line Number */}
                  <div className="flex flex-col items-center">
                    <div className="bg-gradient-to-br from-purple-500 to-purple-700 text-white rounded-2xl p-4 shadow-lg min-w-[80px]">
                      <div className="text-center">
                        <div className="text-2xl font-bold">0</div>
                        <div className="text-xs mt-1">LINE</div>
                      </div>
                    </div>
                    <div className="mt-3 text-center">
                      <span className="text-sm font-bold text-purple-700">OPS TEAM</span>
                      <div className="text-xs text-purple-600">Reserved</div>
                    </div>
                  </div>
                  
                  {/* Tables for Line 0 */}
                  <div className="flex-1 grid grid-cols-3 gap-6">
                    {[1, 2, 3].map(tableNum => renderTable(0, tableNum, true))}
                  </div>
                </div>

                {/* Lines 1-5 - General Seating Area */}
                {[1, 2, 3, 4, 5].map(lineNum => (
                  <div key={`line-${lineNum}`} className="flex items-start gap-6">
                    {/* Line Number */}
                    <div className="flex flex-col items-center">
                      <div className="bg-gradient-to-br from-blue-500 to-cyan-600 text-white rounded-2xl p-4 shadow-lg min-w-[80px]">
                        <div className="text-center">
                          <div className="text-2xl font-bold">{lineNum}</div>
                          <div className="text-xs mt-1">LINE</div>
                        </div>
                      </div>
                      <div className="mt-3 text-center">
                        <span className="text-sm font-bold text-blue-700">GENERAL</span>
                        <div className="text-xs text-blue-600">Available</div>
                      </div>
                    </div>
                    
                    {/* Tables for this line */}
                    <div className="flex-1 grid grid-cols-3 gap-6">
                      {[1, 2, 3].map(tableNum => renderTable(lineNum, tableNum, false))}
                    </div>
                  </div>
                ))}
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
            Office Analytics Dashboard
          </h3>
          <p className="text-gray-600">Real-time workspace and table utilization metrics</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {/* Total Tables */}
          <motion.div 
            className="bg-gradient-to-br from-indigo-400 to-purple-500 rounded-3xl p-6 text-center shadow-xl text-white"
            whileHover={{ scale: 1.05, rotateY: 5 }}
            transition={{ duration: 0.2 }}
          >
            <div className="text-4xl mb-2">🪑</div>
            <div className="text-3xl font-bold mb-1">18</div>
            <div className="text-indigo-100 font-medium">Total Tables</div>
            <div className="text-xs text-indigo-200 mt-1">6 lines × 3 tables</div>
          </motion.div>

          {/* Available Seats */}
          <motion.div 
            className="bg-gradient-to-br from-emerald-400 to-green-500 rounded-3xl p-6 text-center shadow-xl text-white"
            whileHover={{ scale: 1.05, rotateY: 5 }}
            transition={{ duration: 0.2 }}
          >
            <div className="text-4xl mb-2">✅</div>
            <div className="text-3xl font-bold mb-1">
              {currentLayout.seats.filter(s => !s.occupiedBy).length}
            </div>
            <div className="text-emerald-100 font-medium">Available Seats</div>
            <div className="text-xs text-emerald-200 mt-1">Ready to assign</div>
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
            <div className="text-blue-100 font-medium">Occupied Seats</div>
            <div className="text-xs text-blue-200 mt-1">Currently assigned</div>
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
            <div className="text-purple-100 font-medium">OPS Team Area</div>
            <div className="text-xs text-purple-200 mt-1">Line 0 reserved</div>
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
            <div className="text-xs text-orange-200 mt-1">Office occupancy</div>
            
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
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/30 shadow-lg">
            <h4 className="font-bold text-gray-800 mb-3">📋 Table Layout</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Line 0 (OPS):</span>
                <span className="font-semibold text-purple-600">3 Tables</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Lines 1-5 (General):</span>
                <span className="font-semibold text-blue-600">15 Tables</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Capacity:</span>
                <span className="font-semibold">36 Seats</span>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/30 shadow-lg">
            <h4 className="font-bold text-gray-800 mb-3">🎯 Area Usage</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">OPS Area (Line 0):</span>
                <span className="font-semibold">
                  {currentLayout.seats.filter(s => s.coordinate.startsWith('0.') && s.occupiedBy).length}/6 seats
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">General (Lines 1-5):</span>
                <span className="font-semibold">
                  {currentLayout.seats.filter(s => !s.coordinate.startsWith('0.') && s.occupiedBy).length}/{currentLayout.seats.filter(s => !s.coordinate.startsWith('0.')).length} seats
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/30 shadow-lg">
            <h4 className="font-bold text-gray-800 mb-3">📈 Status Legend</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>Available for assignment</span>
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
