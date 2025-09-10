import { Seat } from '../types';

/**
 * Sample data that matches the Excel layout shown in the image
 */

export const sampleNames = {
  // OPS Team Reserved Area (0.1-0.6) 
  '0.1': 'Alex Chen (OPS)',
  '0.2': 'Sarah Kim (OPS)',
  '0.3': 'Mike Rodriguez (OPS)',
  '0.5': 'Lisa Zhang (OPS)',
  
  // General Seating Area (1.1-5.6)
  '1.2': 'Lynne Wang',
  '1.3': 'Shahir',
  '1.4': 'Henry Ye',
  '1.6': 'Jeremy B',
  '1.5': 'Filip',
  '2.1': 'Miroslav L',
  '2.2': 'Dan Sarnek',
  '2.3': 'MartinK',
  '2.4': 'Vojtech Spacir',
  '2.5': 'Tamara M',
  '2.6': 'Jacopo',
  '3.1': 'Berg Z',
  '3.2': 'Martin S.',
  '3.3': 'Jirka',
  '3.4': 'Marie',
  '3.6': 'Martin F',
  '4.1': 'JirkaT',
  '4.2': 'Emma',
  '4.4': 'Andrea Cecrdlova',
  '4.5': 'Lucie',
  '5.1': 'Ales Riha',
  '5.2': 'Karel H.',
  '5.3': 'Veronika',
  '5.4': 'Kuchto',
  '5.5': 'Maria'
};

export const populateLayoutWithSampleData = (seats: Seat[]): Seat[] => {
  const now = new Date();
  return seats.map(seat => {
    const sampleName = sampleNames[seat.coordinate as keyof typeof sampleNames];
    if (sampleName) {
      return {
        ...seat,
        occupiedBy: sampleName,
        occupiedById: 'sample-user',
        lastUpdated: now
      };
    }
    return seat;
  });
};
