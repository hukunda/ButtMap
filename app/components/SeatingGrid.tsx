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

  // Render individual seat cell
  const renderSeat = (coordinate: string, isLarge = false) => {
    const seat = getSeatByCoordinate(coordinate);
    if (!seat) return null;

    const canEdit = !seat.isLocked || currentUser?.role === 'admin';

    return (
      <motion.div
        key={seat.id}
        className={clsx(
          'pwc-seat relative cursor-pointer transition-all duration-200',
          'flex flex-col justify-between p-2 text-xs',
          seat.occupiedBy ? 'occupied' : 'available',
          canEdit && seat.occupiedBy && 'hover:border-pwc-gray',
          canEdit && !seat.occupiedBy && 'hover:border-pwc-orange',
          !canEdit && 'cursor-not-allowed opacity-60',
          selectedSeat === seat.id && 'selected',
          isLarge ? 'h-16' : 'h-12'
        )}
        onClick={canEdit ? () => handleSeatClick(seat) : undefined}
        whileHover={canEdit ? { scale: 1.02 } : undefined}
        whileTap={canEdit ? { scale: 0.98 } : undefined}
      >
        <div className="font-semibold text-pwc-gray-dark">{coordinate}</div>
        <div className="pwc-typography-small text-pwc-gray">
          name: <span className="font-medium text-pwc-black">{seat.occupiedBy || ''}</span>
        </div>
      </motion.div>
    );
  };

  return (
    <div className={clsx('relative', className)}>
      {/* Office Layout Container */}
      <div className="pwc-card p-6 pwc-shadow-lg overflow-auto">
        <div className="min-w-max">
          {/* Marek's Office - Top Section */}
          <div className="mb-6">
            <div className="bg-pwc-light border-2 border-pwc-black p-4 text-center">
              <span className="pwc-typography-h3 text-pwc-black font-bold">Marek&apos;s Office</span>
            </div>
          </div>

          {/* Main Layout Container */}
          <div className="flex gap-6">
            {/* Left Side - AISLE label and OPS team */}
            <div className="flex flex-col items-center">
              {/* AISLE Label (rotated) */}
              <div 
                className="bg-pwc-white border-2 border-pwc-black p-2 mb-6 flex items-center justify-center"
                style={{ 
                  writingMode: 'vertical-rl',
                  textOrientation: 'mixed',
                  height: '200px',
                  width: '50px'
                }}
              >
                <span className="font-bold text-sm tracking-wider text-pwc-black">AISLE</span>
              </div>

              {/* OPS team boxes */}
              <div className="space-y-2">
                {[1, 2, 3, 4, 5].map((lineNum) => (
                  <div 
                    key={lineNum}
                    className="bg-pwc-orange border-2 border-pwc-black p-3 w-24 h-16 flex flex-col items-center justify-center text-xs font-bold text-center"
                  >
                    <div className="text-pwc-white">OPS team</div>
                    <div className="mt-1 text-pwc-white">{lineNum}. line</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Main Seating Grid */}
            <div className="flex-1">
              <div className="grid grid-cols-6 gap-0 border-2 border-pwc-black">
                {/* Row 0 (0.1 to 0.6) */}
                <div className="contents">
                  {[1, 2, 3, 4, 5, 6].map(col => renderSeat(`0.${col}`))}
                </div>
                
                {/* Row 1 (1.1 to 1.6) */}
                <div className="contents">
                  {[1, 2, 3, 4, 5, 6].map(col => renderSeat(`1.${col}`))}
                </div>
                
                {/* Row 2 (2.1 to 2.6) */}
                <div className="contents">
                  {[1, 2, 3, 4, 5, 6].map(col => renderSeat(`2.${col}`))}
                </div>
                
                {/* Row 3 (3.1 to 3.6) */}
                <div className="contents">
                  {[1, 2, 3, 4, 5, 6].map(col => renderSeat(`3.${col}`))}
                </div>
                
                {/* Row 4 (4.1 to 4.6) */}
                <div className="contents">
                  {[1, 2, 3, 4, 5, 6].map(col => renderSeat(`4.${col}`))}
                </div>
                
                {/* Row 5 (5.1 to 5.6) */}
                <div className="contents">
                  {[1, 2, 3, 4, 5, 6].map(col => renderSeat(`5.${col}`))}
                </div>
              </div>
            </div>

            {/* Right Side - Windows */}
            <div className="flex items-center">
              <div 
                className="bg-pwc-light border-2 border-pwc-black p-2 flex items-center justify-center"
                style={{ 
                  writingMode: 'vertical-rl',
                  textOrientation: 'mixed',
                  height: '400px',
                  width: '50px'
                }}
              >
                <span className="font-bold text-sm tracking-wider text-pwc-black">Windows</span>
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
              className="pwc-card p-6 w-80 mx-4 pwc-shadow-lg"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="pwc-typography-h3 text-pwc-black mb-4">
                Edit Seat {currentLayout.seats.find(s => s.id === selectedSeat)?.coordinate}
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block pwc-typography-body font-medium text-pwc-gray-dark mb-2">
                    Employee Name
                  </label>
                  <input
                    type="text"
                    value={inputName}
                    onChange={(e) => setInputName(e.target.value)}
                    className="pwc-input w-full px-3 py-2"
                    placeholder="Enter name..."
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
                
                <div className="flex justify-end gap-3 pt-2">
                  <button
                    onClick={handleNameCancel}
                    className="pwc-button-secondary px-4 py-2"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleNameSubmit}
                    className="pwc-button-primary px-4 py-2"
                  >
                    Save
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Workspace Analytics */}
      <div className="mt-8 grid grid-cols-2 md:grid-cols-3 gap-6 text-center">
        <div className="pwc-card p-6">
          <div className="text-3xl font-bold text-pwc-blue mb-2">
            {currentLayout.seats.filter(s => !s.occupiedBy).length}
          </div>
          <div className="pwc-typography-body text-pwc-gray">Available Seats</div>
        </div>
        <div className="pwc-card p-6">
          <div className="text-3xl font-bold text-pwc-green mb-2">
            {currentLayout.seats.filter(s => s.occupiedBy).length}
          </div>
          <div className="pwc-typography-body text-pwc-gray">Occupied Seats</div>
        </div>
        <div className="pwc-card p-6">
          <div className="text-3xl font-bold text-pwc-orange mb-2">
            {Math.round((currentLayout.seats.filter(s => s.occupiedBy).length / currentLayout.seats.length) * 100)}%
          </div>
          <div className="pwc-typography-body text-pwc-gray">Utilization Rate</div>
        </div>
      </div>
    </div>
  );
};
