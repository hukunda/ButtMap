'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Sparkles, Trophy, Settings } from 'lucide-react';
import { UserRoleSelector } from './components/UserRoleSelector';
import { DailyTabs } from './components/DailyTabs';
import { SeatingGrid } from './components/SeatingGrid';
import { GamificationPanel } from './components/GamificationPanel';
import { useAppStore } from './store/appStore';

export default function Home() {
  const { currentUser, config } = useAppStore();

  return (
    <div className="min-h-screen bg-pwc-off-white">
      {/* Header */}
      <header className="pwc-header pwc-shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            {/* Logo and Title */}
            <motion.div
              className="flex items-center gap-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="bg-pwc-orange p-3 flex items-center justify-center">
                <MapPin className="w-7 h-7 text-pwc-white" />
              </div>
              
              <div>
                <h1 className="pwc-typography-h1 text-pwc-black">
                  ButtMap
                </h1>
                <p className="pwc-typography-body text-pwc-gray">Office Seating Management System</p>
              </div>
            </motion.div>

            {/* User Controls */}
            <motion.div
              className="flex items-center gap-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              {/* Gamification Status */}
              {currentUser && config.gamificationEnabled && (
                <div className="hidden sm:flex items-center gap-3 px-4 py-2 bg-pwc-white border border-pwc-medium-gray">
                  <Trophy className="w-4 h-4 text-pwc-orange" />
                  <div className="flex items-center gap-2">
                    <span className="pwc-typography-body font-semibold text-pwc-black">
                      {currentUser.points} points
                    </span>
                    {currentUser.badges.length > 0 && (
                      <span className="pwc-typography-small text-pwc-gray">
                        • {currentUser.badges.length} badges
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* User Selector */}
              <UserRoleSelector />
            </motion.div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Welcome Message */}
          {currentUser && (
            <motion.div
              className="pwc-card p-6 pwc-shadow-md"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="pwc-typography-h2 text-pwc-black mb-2">
                    Welcome back, {currentUser.name}
                  </h2>
                  <p className="pwc-typography-body text-pwc-gray">
                    {currentUser.role === 'admin' 
                      ? 'Manage seating layouts and optimize workspace allocation for your team.'
                      : 'Select your preferred seat and coordinate with your colleagues for the week ahead.'
                    }
                  </p>
                </div>
                
                {currentUser.role === 'admin' && (
                  <div className="flex items-center gap-2 px-4 py-2 bg-pwc-orange text-pwc-white">
                    <Settings className="w-4 h-4" />
                    <span className="pwc-typography-body font-semibold">Administrator</span>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Daily Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <DailyTabs />
          </motion.div>

          {/* Seating Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <SeatingGrid />
          </motion.div>

          {/* Gamification Panel */}
          {config.gamificationEnabled && currentUser && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.45 }}
            >
              <GamificationPanel />
            </motion.div>
          )}

          {/* Performance Metrics */}
          {config.gamificationEnabled && currentUser && (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              {/* Current Streak */}
              <div className="pwc-card p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-pwc-green flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-pwc-white" />
                  </div>
                  <h3 className="pwc-typography-h3 text-pwc-black">Weekly Streak</h3>
                </div>
                <div className="text-3xl font-bold text-pwc-green mb-2">3 days</div>
                <p className="pwc-typography-body text-pwc-gray">Consistent early seat selection</p>
              </div>

              {/* Latest Badge */}
              <div className="pwc-card p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-pwc-orange flex items-center justify-center">
                    <Trophy className="w-5 h-5 text-pwc-white" />
                  </div>
                  <h3 className="pwc-typography-h3 text-pwc-black">Recent Achievement</h3>
                </div>
                <div className="text-2xl mb-2">🐦</div>
                <div className="font-semibold text-pwc-black mb-1">Early Bird</div>
                <p className="pwc-typography-small text-pwc-gray">First to reserve seat this week</p>
              </div>

              {/* Team Challenge */}
              <div className="pwc-card p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-pwc-blue flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-pwc-white" />
                  </div>
                  <h3 className="pwc-typography-h3 text-pwc-black">Active Challenge</h3>
                </div>
                <div className="text-2xl mb-2">⬜</div>
                <div className="font-semibold text-pwc-black mb-1">Perfect Square</div>
                <p className="pwc-typography-small text-pwc-gray">Coordinate team seating arrangement</p>
              </div>
            </motion.div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-pwc-white border-t border-pwc-medium-gray mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="pwc-typography-body text-pwc-gray">
              PwC Workspace Management Solution
            </p>
            <div className="mt-3 flex items-center justify-center gap-4 pwc-typography-small text-pwc-gray-light">
              <span>Version 1.0</span>
              <span>•</span>
              <span>Enterprise Ready</span>
              <span>•</span>
              <span>Built with Next.js</span>
            </div>
            <div className="mt-4 pt-4 border-t border-pwc-medium-gray">
              <p className="pwc-typography-small text-pwc-gray-light">
                © 2025 PricewaterhouseCoopers. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
