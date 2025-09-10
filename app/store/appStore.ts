import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { 
  User, 
  SeatingLayout, 
  Seat, 
  DayOfWeek, 
  AppConfig, 
  GridConfig, 
  Badge,
  MiniChallenge,
  LeaderboardEntry,
  EasterEgg
} from '../types';
import { v4 as uuidv4 } from 'uuid';
import { populateLayoutWithSampleData } from '../lib/sampleData';

interface AppState {
  // User management
  currentUser: User | null;
  users: User[];
  
  // Seating layouts
  layouts: SeatingLayout[];
  currentLayout: SeatingLayout | null;
  
  // App configuration
  config: AppConfig;
  gridConfig: GridConfig;
  
  // Gamification
  badges: Badge[];
  challenges: MiniChallenge[];
  leaderboard: LeaderboardEntry[];
  easterEggs: EasterEgg[];
  
  // Actions
  setCurrentUser: (user: User) => void;
  addUser: (user: Omit<User, 'id'>) => void;
  updateUser: (userId: string, updates: Partial<User>) => void;
  
  setCurrentLayout: (layout: SeatingLayout | null) => void;
  addLayout: (layout: Omit<SeatingLayout, 'id'>) => void;
  updateSeat: (layoutId: string, seatId: string, updates: Partial<Seat>) => void;
  duplicateLayout: (sourceLayoutId: string, targetDay: DayOfWeek) => void;
  
  updateConfig: (updates: Partial<AppConfig>) => void;
  updateGridConfig: (updates: Partial<GridConfig>) => void;
  
  // Gamification actions
  awardBadge: (userId: string, badgeId: string) => void;
  completeChallenge: (userId: string, challengeId: string) => void;
  updateLeaderboard: () => void;
  discoverEasterEgg: (eggId: string, userId: string) => void;
  
  // Utility actions
  initializeDefaultData: () => void;
  exportLayout: (layoutId: string, format: 'excel' | 'pdf') => void;
}

// Default grid configuration - matching Excel layout
const defaultGridConfig: GridConfig = {
  maxLines: 6, // 0.line through 5.line
  maxColumns: 6, // columns 1-6 
  specialZones: [
    {
      name: "Marek's office",
      coordinates: ['marek-office'],
      color: '#D1FAE5',
      icon: '🏢'
    },
    {
      name: 'OPS team',
      coordinates: ['ops-team'],
      color: '#F3E8FF',
      icon: '👥'
    }
  ]
};

// Default app configuration
const defaultConfig: AppConfig = {
  currentWeek: getISOWeek(new Date()),
  currentDay: getCurrentDay(),
  gamificationEnabled: true,
  allowUserSelfAssignment: true,
  showLeaderboard: true,
};

// Helper functions
function getISOWeek(date: Date): string {
  const year = date.getFullYear();
  const week = getWeek(date);
  return `${year}-W${week.toString().padStart(2, '0')}`;
}

function getWeek(date: Date): number {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
}

function getCurrentDay(): DayOfWeek {
  const day = new Date().getDay();
  const days: DayOfWeek[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
  // Handle weekends by defaulting to monday
  return day === 0 || day === 6 ? 'monday' : days[day - 1];
}

// Create default badges
const defaultBadges: Badge[] = [
  {
    id: 'early-bird',
    name: 'Early Bird',
    description: 'First to choose a seat this week',
    icon: '🐦',
    unlockedAt: new Date()
  },
  {
    id: 'desk-decorator',
    name: 'Desk Decorator',
    description: 'Consistently sits in the same spot',
    icon: '🎨',
    unlockedAt: new Date()
  },
  {
    id: 'team-player',
    name: 'Team Player',
    description: 'Helped organize a team seating arrangement',
    icon: '🤝',
    unlockedAt: new Date()
  },
  {
    id: 'social-butterfly',
    name: 'Social Butterfly',
    description: 'Sat next to 5 different people this week',
    icon: '🦋',
    unlockedAt: new Date()
  }
];

// Create default challenges
const defaultChallenges: MiniChallenge[] = [
  {
    id: 'perfect-square',
    name: 'Perfect Square',
    description: 'Arrange your team in a perfect square formation',
    pointsReward: 50,
    icon: '⬜',
    isActive: true,
    completedBy: []
  },
  {
    id: 'diagonal-line',
    name: 'Diagonal Champions',
    description: 'Create a diagonal line across the office',
    pointsReward: 30,
    icon: '↗️',
    isActive: true,
    completedBy: []
  }
];

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial state
      currentUser: null,
      users: [],
      layouts: [],
      currentLayout: null,
      config: defaultConfig,
      gridConfig: defaultGridConfig,
      badges: defaultBadges,
      challenges: defaultChallenges,
      leaderboard: [],
      easterEggs: [],

      // User actions
      setCurrentUser: (user) => set({ currentUser: user }),
      
      addUser: (userData) => {
        const newUser: User = {
          ...userData,
          id: uuidv4(),
        };
        set((state) => ({
          users: [...state.users, newUser]
        }));
      },
      
      updateUser: (userId, updates) => {
        set((state) => ({
          users: state.users.map(user =>
            user.id === userId ? { ...user, ...updates } : user
          )
        }));
      },

      // Layout actions
      setCurrentLayout: (layout) => set({ currentLayout: layout }),
      
      addLayout: (layoutData) => {
        const newLayout: SeatingLayout = {
          ...layoutData,
          id: uuidv4(),
        };
        set((state) => ({
          layouts: [...state.layouts, newLayout]
        }));
      },
      
      updateSeat: (layoutId, seatId, updates) => {
        set((state) => ({
          layouts: state.layouts.map(layout =>
            layout.id === layoutId
              ? {
                  ...layout,
                  seats: layout.seats.map(seat =>
                    seat.id === seatId
                      ? { ...seat, ...updates, lastUpdated: new Date() }
                      : seat
                  ),
                  lastModified: new Date()
                }
              : layout
          ),
          currentLayout: state.currentLayout?.id === layoutId
            ? {
                ...state.currentLayout,
                seats: state.currentLayout.seats.map(seat =>
                  seat.id === seatId
                    ? { ...seat, ...updates, lastUpdated: new Date() }
                    : seat
                ),
                lastModified: new Date()
              }
            : state.currentLayout
        }));
      },
      
      duplicateLayout: (sourceLayoutId, targetDay) => {
        const sourceLayout = get().layouts.find(l => l.id === sourceLayoutId);
        if (sourceLayout) {
          const newLayout: SeatingLayout = {
            ...sourceLayout,
            id: uuidv4(),
            day: targetDay,
            createdAt: new Date(),
            lastModified: new Date(),
            seats: sourceLayout.seats.map(seat => ({
              ...seat,
              id: uuidv4(),
              occupiedBy: undefined,
              occupiedById: undefined,
              lastUpdated: undefined
            }))
          };
          set((state) => ({
            layouts: [...state.layouts, newLayout]
          }));
        }
      },

      // Config actions
      updateConfig: (updates) => {
        set((state) => ({
          config: { ...state.config, ...updates }
        }));
      },
      
      updateGridConfig: (updates) => {
        set((state) => ({
          gridConfig: { ...state.gridConfig, ...updates }
        }));
      },

      // Gamification actions
      awardBadge: (userId, badgeId) => {
        const badge = get().badges.find(b => b.id === badgeId);
        if (badge) {
          set((state) => ({
            users: state.users.map(user =>
              user.id === userId
                ? {
                    ...user,
                    badges: user.badges.some(b => b.id === badgeId)
                      ? user.badges
                      : [...user.badges, { ...badge, unlockedAt: new Date() }]
                  }
                : user
            )
          }));
        }
      },
      
      completeChallenge: (userId, challengeId) => {
        const challenge = get().challenges.find(c => c.id === challengeId);
        if (challenge && !challenge.completedBy.includes(userId)) {
          set((state) => ({
            challenges: state.challenges.map(c =>
              c.id === challengeId
                ? { ...c, completedBy: [...c.completedBy, userId] }
                : c
            ),
            users: state.users.map(user =>
              user.id === userId
                ? { ...user, points: user.points + challenge.pointsReward }
                : user
            )
          }));
        }
      },
      
      updateLeaderboard: () => {
        const users = get().users;
        const leaderboard: LeaderboardEntry[] = users
          .map(user => ({
            userId: user.id,
            userName: user.name,
            points: user.points,
            badgeCount: user.badges.length,
            weeklyStreak: 0 // TODO: Calculate actual streak
          }))
          .sort((a, b) => b.points - a.points)
          .slice(0, 10);
        
        set({ leaderboard });
      },
      
      discoverEasterEgg: (eggId, userId) => {
        const egg = get().easterEggs.find(e => e.id === eggId);
        if (egg && !egg.discovered) {
          set((state) => ({
            easterEggs: state.easterEggs.map(e =>
              e.id === eggId ? { ...e, discovered: true } : e
            ),
            users: state.users.map(user =>
              user.id === userId
                ? { ...user, points: user.points + egg.pointsReward }
                : user
            )
          }));
        }
      },

      // Utility actions
      initializeDefaultData: () => {
        // Create default admin user if none exists
        const users = get().users;
        if (users.length === 0) {
          const adminUser: User = {
            id: uuidv4(),
            name: 'Admin',
            role: 'admin',
            points: 0,
            badges: []
          };
          set(() => ({
            users: [adminUser],
            currentUser: adminUser
          }));
        }
        
        // Create default layout for current week if none exists
        const layouts = get().layouts;
        const currentWeek = get().config.currentWeek;
        if (layouts.length === 0) {
          // Generate default seats matching Excel layout
          let seats: Seat[] = [];
          
          // Generate seats for the main grid (0.1 to 5.6)
          for (let line = 0; line < get().gridConfig.maxLines; line++) {
            for (let col = 1; col <= get().gridConfig.maxColumns; col++) {
              const coordinate = `${line}.${col}`;
              
              seats.push({
                id: uuidv4(),
                coordinate,
                line: line + 1, // Display line (1-6)
                column: col,
                isSpecialZone: false,
                isLocked: false
              });
            }
          }
          
          // Populate with sample data from the Excel layout
          seats = populateLayoutWithSampleData(seats);
          
          const defaultLayout: SeatingLayout = {
            id: uuidv4(),
            day: 'monday',
            week: currentWeek,
            seats,
            createdBy: get().currentUser?.id || '',
            createdAt: new Date(),
            lastModified: new Date()
          };
          
          set(() => ({
            layouts: [defaultLayout],
            currentLayout: defaultLayout
          }));
        }
      },
      
      exportLayout: (layoutId, format) => {
        // TODO: Implement export functionality
        console.log(`Exporting layout ${layoutId} as ${format}`);
      }
    }),
    {
      name: 'buttmap-storage',
      storage: createJSONStorage(() => localStorage),
      // Only persist essential data
      partialize: (state) => ({
        users: state.users,
        layouts: state.layouts,
        config: state.config,
        currentUser: state.currentUser
      })
    }
  )
);
