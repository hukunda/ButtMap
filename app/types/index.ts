export type UserRole = 'admin' | 'user';

export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  points: number;
  badges: Badge[];
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt: Date;
}

export interface Seat {
  id: string;
  coordinate: string; // e.g., "0.1", "1.2"
  line: number; // line number (1, 2, 3, etc.)
  column: number; // column position
  isSpecialZone: boolean;
  specialZoneName?: string; // e.g., "OPS team", "Marek's office"
  occupiedBy?: string; // user name
  occupiedById?: string; // user id
  isLocked: boolean; // admin can lock/unlock seats
  lastUpdated?: Date;
}

export interface SeatingLayout {
  id: string;
  day: DayOfWeek;
  week: string; // ISO week string, e.g., "2025-W37"
  seats: Seat[];
  createdBy: string; // admin user id
  createdAt: Date;
  lastModified: Date;
}

export interface MiniChallenge {
  id: string;
  name: string;
  description: string;
  pointsReward: number;
  icon: string;
  isActive: boolean;
  completedBy: string[]; // user ids who completed it
}

export interface AppConfig {
  currentWeek: string;
  currentDay: DayOfWeek;
  gamificationEnabled: boolean;
  allowUserSelfAssignment: boolean;
  showLeaderboard: boolean;
}

// Grid layout configuration
export interface GridConfig {
  maxLines: number;
  maxColumns: number;
  specialZones: SpecialZone[];
}

export interface SpecialZone {
  name: string;
  coordinates: string[]; // array of seat coordinates
  color: string; // background color
  icon?: string;
}

// Gamification types
export interface LeaderboardEntry {
  userId: string;
  userName: string;
  points: number;
  badgeCount: number;
  weeklyStreak: number;
}

export interface EasterEgg {
  id: string;
  name: string;
  pattern: string[]; // array of seat coordinates that trigger the easter egg
  animation: string;
  pointsReward: number;
  discovered: boolean;
}


