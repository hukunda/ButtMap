'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Star, Target, Users, Zap, Gift, ChevronDown } from 'lucide-react';
import { useAppStore } from '../store/appStore';
import { clsx } from 'clsx';

export interface GamificationPanelProps {
  className?: string;
}

export const GamificationPanel: React.FC<GamificationPanelProps> = ({ className }) => {
  const { 
    currentUser, 
    config, 
    challenges, 
    leaderboard,
    completeChallenge,
    updateLeaderboard 
  } = useAppStore();

  const [activeTab, setActiveTab] = useState<'badges' | 'challenges' | 'leaderboard'>('badges');
  const [isExpanded, setIsExpanded] = useState(false);

  React.useEffect(() => {
    updateLeaderboard();
  }, [updateLeaderboard]);

  if (!config.gamificationEnabled || !currentUser) {
    return null;
  }

  const handleChallengeComplete = (challengeId: string) => {
    if (currentUser) {
      completeChallenge(currentUser.id, challengeId);
    }
  };

  const tabs = [
    { id: 'badges' as const, label: 'Badges', icon: <Star className="w-4 h-4" /> },
    { id: 'challenges' as const, label: 'Challenges', icon: <Target className="w-4 h-4" /> },
    { id: 'leaderboard' as const, label: 'Leaderboard', icon: <Trophy className="w-4 h-4" /> }
  ];

  return (
    <motion.div 
      className={clsx('bg-white rounded-lg shadow-lg border border-gray-200', className)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <div 
        className="flex items-center justify-between p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">Gamification</h3>
            <p className="text-sm text-gray-600">{currentUser.points} points • {currentUser.badges.length} badges</p>
          </div>
        </div>
        
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-5 h-5 text-gray-400" />
        </motion.div>
      </div>

      {/* Expanded Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            {/* Tab Navigation */}
            <div className="flex border-b border-gray-200">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={clsx(
                    'flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors',
                    activeTab === tab.id
                      ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                  )}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="p-4">
              {/* Badges Tab */}
              {activeTab === 'badges' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-3"
                >
                  {currentUser.badges.length > 0 ? (
                    <div className="grid grid-cols-2 gap-3">
                      {currentUser.badges.map((badge) => (
                        <motion.div
                          key={badge.id}
                          className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg p-3 border border-yellow-200"
                          whileHover={{ scale: 1.02 }}
                        >
                          <div className="text-2xl mb-1">{badge.icon}</div>
                          <div className="font-semibold text-gray-800 text-sm">{badge.name}</div>
                          <div className="text-xs text-gray-600 mt-1">{badge.description}</div>
                          <div className="text-xs text-yellow-600 mt-1">
                            Unlocked {badge.unlockedAt.toLocaleDateString()}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Gift className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>No badges yet!</p>
                      <p className="text-sm">Complete challenges to earn your first badge</p>
                    </div>
                  )}
                </motion.div>
              )}

              {/* Challenges Tab */}
              {activeTab === 'challenges' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-3"
                >
                  {challenges.filter(c => c.isActive).map((challenge) => {
                    const isCompleted = challenge.completedBy.includes(currentUser.id);
                    
                    return (
                      <motion.div
                        key={challenge.id}
                        className={clsx(
                          'rounded-lg p-4 border',
                          isCompleted
                            ? 'bg-green-50 border-green-200'
                            : 'bg-white border-gray-200 hover:border-blue-200 transition-colors'
                        )}
                        whileHover={!isCompleted ? { scale: 1.01 } : undefined}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-2xl">{challenge.icon}</span>
                              <h4 className="font-semibold text-gray-800">{challenge.name}</h4>
                              {isCompleted && (
                                <div className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                                  Completed!
                                </div>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{challenge.description}</p>
                            <div className="flex items-center gap-4">
                              <div className="text-sm text-blue-600 font-medium">
                                +{challenge.pointsReward} points
                              </div>
                              <div className="text-sm text-gray-500">
                                {challenge.completedBy.length} completed
                              </div>
                            </div>
                          </div>
                          
                          {!isCompleted && (
                            <button
                              onClick={() => handleChallengeComplete(challenge.id)}
                              className="ml-4 px-3 py-1 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600 transition-colors"
                            >
                              Try Now
                            </button>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </motion.div>
              )}

              {/* Leaderboard Tab */}
              {activeTab === 'leaderboard' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-2"
                >
                  {leaderboard.length > 0 ? (
                    leaderboard.map((entry, index) => (
                      <motion.div
                        key={entry.userId}
                        className={clsx(
                          'flex items-center justify-between p-3 rounded-lg',
                          entry.userId === currentUser.id
                            ? 'bg-blue-50 border border-blue-200'
                            : 'bg-gray-50'
                        )}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <div className="flex items-center gap-3">
                          <div className={clsx(
                            'w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm',
                            index === 0 ? 'bg-yellow-100 text-yellow-800' :
                            index === 1 ? 'bg-gray-100 text-gray-800' :
                            index === 2 ? 'bg-orange-100 text-orange-800' :
                            'bg-gray-50 text-gray-600'
                          )}>
                            {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : index + 1}
                          </div>
                          <div>
                            <div className="font-medium text-gray-800">
                              {entry.userName}
                              {entry.userId === currentUser.id && ' (You)'}
                            </div>
                            <div className="text-sm text-gray-600">
                              {entry.badgeCount} badges
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className="font-bold text-blue-600">{entry.points}</div>
                          <div className="text-xs text-gray-500">points</div>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>No rankings yet!</p>
                      <p className="text-sm">Be the first to earn points</p>
                    </div>
                  )}
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
