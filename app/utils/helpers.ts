import { Seat, User, MiniChallenge, SeatingLayout } from '../types';

/**
 * Utility functions for the ButtMap application
 */

export const formatCoordinate = (line: number, column: number): string => {
  return `${line - 1}.${column}`;
};

export const parseCoordinate = (coordinate: string): { line: number; column: number } => {
  const [lineStr, columnStr] = coordinate.split('.');
  return {
    line: parseInt(lineStr, 10) + 1,
    column: parseInt(columnStr, 10)
  };
};

export const getSeatsInPattern = (seats: Seat[], pattern: string[]): Seat[] => {
  return seats.filter(seat => pattern.includes(seat.coordinate));
};

export const checkSquarePattern = (seats: Seat[], occupiedSeats: Seat[]): boolean => {
  // Check if occupied seats form a square pattern
  if (occupiedSeats.length < 4) return false;
  
  const coords = occupiedSeats.map(seat => seat.coordinate).sort();
  
  // Simple square patterns (2x2)
  const squarePatterns = [
    ['0.1', '0.2', '1.1', '1.2'], // Top-left 2x2
    ['1.1', '1.2', '2.1', '2.2'], // Next row 2x2
    ['2.2', '2.3', '3.2', '3.3'], // Another 2x2
    // Add more patterns as needed
  ];
  
  return squarePatterns.some(pattern => 
    pattern.every(coord => coords.includes(coord)) && 
    coords.length >= pattern.length
  );
};

export const checkDiagonalPattern = (seats: Seat[], occupiedSeats: Seat[]): boolean => {
  // Check if occupied seats form a diagonal line
  if (occupiedSeats.length < 3) return false;
  
  const coords = occupiedSeats.map(seat => {
    const parsed = parseCoordinate(seat.coordinate);
    return { line: parsed.line, column: parsed.column };
  });
  
  // Sort by line
  coords.sort((a, b) => a.line - b.line);
  
  // Check if they form a diagonal (line increases by 1, column increases by 1)
  for (let i = 1; i < coords.length; i++) {
    const prev = coords[i - 1];
    const curr = coords[i];
    
    if (curr.line - prev.line !== 1 || curr.column - prev.column !== 1) {
      return false;
    }
  }
  
  return true;
};

export const calculateUserPoints = (user: User, actions: string[]): number => {
  let points = user.points;
  
  actions.forEach(action => {
    switch (action) {
      case 'early_seat_selection':
        points += 10;
        break;
      case 'help_teammate':
        points += 15;
        break;
      case 'consistent_seating':
        points += 5;
        break;
      case 'pattern_completion':
        points += 25;
        break;
      default:
        break;
    }
  });
  
  return points;
};

export const shouldAwardBadge = (user: User, badgeType: string, context?: Record<string, unknown>): boolean => {
  const userBadgeIds = user.badges.map(badge => badge.id);
  
  switch (badgeType) {
    case 'early-bird':
      return !userBadgeIds.includes('early-bird') && Boolean(context?.isFirstThisWeek);
    
    case 'desk-decorator':
      return !userBadgeIds.includes('desk-decorator') && (context?.consistentSeatDays as number) >= 3;
    
    case 'team-player':
      return !userBadgeIds.includes('team-player') && (context?.helpedTeammates as number) >= 1;
    
    case 'social-butterfly':
      return !userBadgeIds.includes('social-butterfly') && (context?.differentNeighbors as number) >= 5;
    
    default:
      return false;
  }
};

export const checkChallengeCompletion = (challenge: MiniChallenge, seats: Seat[]): boolean => {
  const occupiedSeats = seats.filter(seat => seat.occupiedBy);
  
  switch (challenge.id) {
    case 'perfect-square':
      return checkSquarePattern(seats, occupiedSeats);
    
    case 'diagonal-line':
      return checkDiagonalPattern(seats, occupiedSeats);
    
    default:
      return false;
  }
};

export const getAdjacentSeats = (seat: Seat, allSeats: Seat[]): Seat[] => {
  const { line, column } = parseCoordinate(seat.coordinate);
  
  const adjacentCoords = [
    formatCoordinate(line - 1, column), // Above
    formatCoordinate(line + 1, column), // Below
    formatCoordinate(line, column - 1), // Left
    formatCoordinate(line, column + 1), // Right
  ];
  
  return allSeats.filter(s => adjacentCoords.includes(s.coordinate));
};

export const exportToExcel = async (layout: SeatingLayout, filename: string): Promise<void> => {
  // This would integrate with xlsx library
  console.log('Exporting to Excel:', filename, layout);
  // Implementation would go here using xlsx
};

export const exportToPDF = async (layout: SeatingLayout, filename: string): Promise<void> => {
  // This would integrate with jsPDF and html2canvas
  console.log('Exporting to PDF:', filename, layout);
  // Implementation would go here using jsPDF
};

export const generateEasterEggPattern = (): string[] => {
  const patterns = [
    ['0.1', '0.2', '0.3', '1.2'], // Smiley face top
    ['2.1', '2.3', '3.1', '3.2', '3.3'], // Smiley face bottom
    ['1.1', '2.2', '3.3', '4.4'], // Diagonal
    ['0.5', '1.5', '2.5', '3.5'], // Vertical line
  ];
  
  return patterns[Math.floor(Math.random() * patterns.length)];
};

export const animationVariants = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 }
  },
  
  slideUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  },
  
  scaleIn: {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.8 }
  },
  
  bounceIn: {
    initial: { opacity: 0, scale: 0.3 },
    animate: { 
      opacity: 1, 
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20
      }
    },
    exit: { opacity: 0, scale: 0.3 }
  }
};
