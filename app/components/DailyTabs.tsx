'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Copy, Plus } from 'lucide-react';
import { useAppStore } from '../store/appStore';
import { DayOfWeek } from '../types';
import { clsx } from 'clsx';

const DAYS: { key: DayOfWeek; label: string; short: string }[] = [
  { key: 'monday', label: 'Monday', short: 'Mon' },
  { key: 'tuesday', label: 'Tuesday', short: 'Tue' },
  { key: 'wednesday', label: 'Wednesday', short: 'Wed' },
  { key: 'thursday', label: 'Thursday', short: 'Thu' },
  { key: 'friday', label: 'Friday', short: 'Fri' },
];

export interface DailyTabsProps {
  className?: string;
}

export const DailyTabs: React.FC<DailyTabsProps> = ({ className }) => {
  const {
    layouts,
    currentLayout,
    setCurrentLayout,
    duplicateLayout,
    config,
    updateConfig,
    currentUser,
    addLayout
  } = useAppStore();

  const currentDay = config.currentDay;

  // Get layout for a specific day
  const getLayoutForDay = (day: DayOfWeek) => {
    return layouts.find(layout => 
      layout.day === day && layout.week === config.currentWeek
    );
  };

  // Handle day tab click
  const handleDayClick = (day: DayOfWeek) => {
    const layout = getLayoutForDay(day);
    if (layout) {
      setCurrentLayout(layout);
    } else {
      setCurrentLayout(null);
    }
    updateConfig({ currentDay: day });
  };

  // Handle duplicate from previous day
  const handleDuplicateFromPreviousDay = (targetDay: DayOfWeek) => {
    if (!currentUser || currentUser.role !== 'admin') return;

    const dayIndex = DAYS.findIndex(d => d.key === targetDay);
    if (dayIndex <= 0) return; // Can't duplicate for Monday

    const previousDay = DAYS[dayIndex - 1].key;
    const previousLayout = getLayoutForDay(previousDay);
    
    if (previousLayout) {
      duplicateLayout(previousLayout.id, targetDay);
      // Switch to the newly created layout
      setTimeout(() => {
        const newLayout = getLayoutForDay(targetDay);
        if (newLayout) {
          setCurrentLayout(newLayout);
        }
      }, 100);
    }
  };

  // Handle create new layout
  const handleCreateNewLayout = (day: DayOfWeek) => {
    if (!currentUser || currentUser.role !== 'admin') return;

    // Create default seats matching Excel layout (0.1 to 5.6)
    const seats = [];
    for (let line = 0; line < 6; line++) {
      for (let col = 1; col <= 6; col++) {
        const coordinate = `${line}.${col}`;
        
        seats.push({
          id: crypto.randomUUID(),
          coordinate,
          line: line + 1, // Display line (1-6)
          column: col,
          isSpecialZone: false,
          isLocked: false
        });
      }
    }

    const newLayout = {
      day,
      week: config.currentWeek,
      seats,
      createdBy: currentUser.id,
      createdAt: new Date(),
      lastModified: new Date()
    };

    addLayout(newLayout);
    
    // Switch to the newly created layout
    setTimeout(() => {
      const createdLayout = getLayoutForDay(day);
      if (createdLayout) {
        setCurrentLayout(createdLayout);
      }
    }, 100);
  };

  // Check if current user can manage layouts
  const canManageLayouts = currentUser?.role === 'admin';

  return (
    <div className={clsx('pwc-card p-6 pwc-shadow-md', className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Calendar className="w-6 h-6 text-pwc-orange" />
          <h3 className="pwc-typography-h3 text-pwc-black">
            Week {config.currentWeek}
          </h3>
        </div>
        
        {canManageLayouts && (
          <div className="flex items-center gap-2 px-3 py-1 bg-pwc-orange text-pwc-white">
            <span className="pwc-typography-small font-semibold">Administrator</span>
          </div>
        )}
      </div>

      {/* Day Tabs */}
      <div className="flex flex-col lg:flex-row gap-3">
        {DAYS.map((day, index) => {
          const hasLayout = !!getLayoutForDay(day.key);
          const isActive = currentDay === day.key;
          const seatCount = getLayoutForDay(day.key)?.seats?.filter(s => s.occupiedBy).length || 0;
          
          return (
            <motion.div
              key={day.key}
              className="relative flex-1"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              {/* Main Tab Button */}
              <button
                onClick={() => handleDayClick(day.key)}
                className={clsx(
                  'w-full p-4 border-2 transition-all duration-200',
                  'flex flex-col items-center gap-2 relative',
                  isActive
                    ? 'bg-pwc-orange text-pwc-white border-pwc-orange pwc-shadow-md'
                    : hasLayout
                    ? 'bg-pwc-white text-pwc-black border-pwc-green hover:border-pwc-orange'
                    : 'bg-pwc-light text-pwc-gray border-pwc-medium-gray hover:border-pwc-gray'
                )}
              >
                {/* Day Label */}
                <div className="pwc-typography-body font-bold">
                  {day.short}
                </div>
                
                {/* Status Indicator */}
                {hasLayout ? (
                  <div className={clsx(
                    'pwc-typography-small',
                    isActive ? 'text-pwc-white' : 'text-pwc-green'
                  )}>
                    {seatCount} assigned
                  </div>
                ) : (
                  <div className="pwc-typography-small text-pwc-gray-light">
                    Not planned
                  </div>
                )}

                {/* Active Indicator */}
                {isActive && (
                  <motion.div
                    className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-3 h-1 bg-pwc-white"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring' }}
                  />
                )}
              </button>

              {/* Admin Controls */}
              {canManageLayouts && !hasLayout && (
                <div className="mt-2 flex gap-1">
                  {/* Duplicate from previous day */}
                  {index > 0 && getLayoutForDay(DAYS[index - 1].key) && (
                    <motion.button
                      onClick={() => handleDuplicateFromPreviousDay(day.key)}
                      className="flex-1 pwc-button-secondary px-3 py-1 pwc-typography-small flex items-center justify-center gap-1"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Copy className="w-3 h-3" />
                      Copy {DAYS[index - 1].short}
                    </motion.button>
                  )}
                  
                  {/* Create new layout */}
                  <motion.button
                    onClick={() => handleCreateNewLayout(day.key)}
                    className="flex-1 pwc-button-primary px-3 py-1 pwc-typography-small flex items-center justify-center gap-1"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Plus className="w-3 h-3" />
                    New
                  </motion.button>
                </div>
              )}

              {/* Layout Info */}
              {hasLayout && (
                <div className="mt-3 pwc-typography-small text-pwc-gray-light text-center">
                  Last updated:{' '}
                  {getLayoutForDay(day.key)?.lastModified?.toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Current Selection Info */}
      <div className="mt-6 p-4 bg-pwc-light border border-pwc-medium-gray">
        <div className="pwc-typography-body text-pwc-gray-dark">
          <span className="font-semibold text-pwc-black">Active:</span> {DAYS.find(d => d.key === currentDay)?.label}
          {currentLayout && (
            <span className="ml-3 text-pwc-gray">
              • {currentLayout.seats.filter(s => s.occupiedBy).length} assigned
              • {currentLayout.seats.filter(s => s.isLocked).length} restricted
            </span>
          )}
          {!currentLayout && (
            <span className="ml-3 text-pwc-red">• Layout not configured</span>
          )}
        </div>
      </div>
    </div>
  );
};
