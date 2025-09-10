'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Lock, Crown, Users, Sparkles } from 'lucide-react';
import { Seat, User } from '../types';
import { clsx } from 'clsx';

export interface SeatCellProps {
  seat: Seat;
  onClick: () => void;
  isSelected: boolean;
  currentUser: User | null;
}

export const SeatCell: React.FC<SeatCellProps> = ({
  seat,
  onClick,
  isSelected,
  currentUser
}) => {
  // Determine seat status and styling
  const isOccupied = !!seat.occupiedBy;
  const isLocked = seat.isLocked;
  const isSpecialZone = seat.isSpecialZone;
  const canEdit = !isLocked || currentUser?.role === 'admin';

  // Get background color based on status
  const getBackgroundColor = () => {
    if (isLocked) return 'bg-gray-200 border-gray-400';
    if (isSpecialZone) {
      if (isOccupied) return 'bg-purple-300 border-purple-500';
      return 'bg-purple-100 border-purple-300';
    }
    if (isOccupied) return 'bg-blue-200 border-blue-400';
    return 'bg-green-100 border-green-300';
  };

  // Get text color
  const getTextColor = () => {
    if (isLocked) return 'text-gray-600';
    if (isSpecialZone) return 'text-purple-800';
    if (isOccupied) return 'text-blue-800';
    return 'text-green-800';
  };

  // Get hover effects
  const getHoverEffects = () => {
    if (!canEdit) return '';
    if (isSpecialZone) return 'hover:bg-purple-200 hover:border-purple-400';
    if (isOccupied) return 'hover:bg-blue-300 hover:border-blue-500';
    return 'hover:bg-green-200 hover:border-green-400';
  };

  // Seat icon based on status
  const getSeatIcon = () => {
    if (isLocked) return <Lock className="w-3 h-3" />;
    if (isSpecialZone && seat.specialZoneName?.includes('office')) return <Crown className="w-3 h-3" />;
    if (isSpecialZone) return <Users className="w-3 h-3" />;
    if (isOccupied) return <Sparkles className="w-3 h-3" />;
    return null;
  };

  return (
    <motion.div
      className={clsx(
        'relative w-12 h-12 border-2 rounded-lg cursor-pointer transition-all duration-200',
        'flex flex-col items-center justify-center text-xs font-medium',
        getBackgroundColor(),
        getTextColor(),
        canEdit && getHoverEffects(),
        !canEdit && 'cursor-not-allowed opacity-75',
        isSelected && 'ring-2 ring-blue-500 ring-offset-2'
      )}
      onClick={canEdit ? onClick : undefined}
      whileHover={canEdit ? { scale: 1.05 } : undefined}
      whileTap={canEdit ? { scale: 0.95 } : undefined}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
    >
      {/* Coordinate label */}
      <div className="text-[8px] leading-none opacity-70">
        {seat.coordinate}
      </div>

      {/* Seat content */}
      <div className="flex-1 flex items-center justify-center">
        {isOccupied ? (
          <motion.div
            className="text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <div className="text-[9px] leading-tight font-semibold truncate max-w-10">
              {seat.occupiedBy}
            </div>
          </motion.div>
        ) : (
          <div className="text-center">
            {getSeatIcon()}
            {isSpecialZone && !getSeatIcon() && (
              <div className="text-[8px] leading-none opacity-60">
                Zone
              </div>
            )}
          </div>
        )}
      </div>

      {/* Special effects for easter eggs or achievements */}
      {isOccupied && (
        <motion.div
          className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full opacity-0"
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}

      {/* Locked overlay */}
      {isLocked && (
        <div className="absolute inset-0 bg-gray-400 bg-opacity-20 rounded-lg flex items-center justify-center">
          <Lock className="w-4 h-4 text-gray-500" />
        </div>
      )}

      {/* Selection indicator */}
      {isSelected && (
        <motion.div
          className="absolute inset-0 border-2 border-blue-500 rounded-lg bg-blue-100 bg-opacity-30"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        />
      )}

      {/* Tooltip on hover */}
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
        <div className="bg-gray-800 text-white text-xs rounded px-2 py-1 whitespace-nowrap">
          <div>Seat {seat.coordinate}</div>
          {seat.occupiedBy && <div>👤 {seat.occupiedBy}</div>}
          {seat.isSpecialZone && <div>🏢 {seat.specialZoneName}</div>}
          {seat.isLocked && <div>🔒 Locked</div>}
          {!seat.isLocked && !seat.occupiedBy && <div>✨ Available</div>}
        </div>
        <div className="w-2 h-2 bg-gray-800 transform rotate-45 mx-auto -mt-1"></div>
      </div>
    </motion.div>
  );
};


