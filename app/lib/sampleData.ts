import { Seat } from '../types';

/**
 * Sample data that matches the Excel layout shown in the image
 */

export const sampleNames = {
  '0.1': 'Lucie',
  '0.2': 'Emma',
  '0.4': 'Veronika',
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
  '4.4': 'Andrea Cecrdlova',
  '5.1': 'Ales Riha',
  '5.2': 'Karel H.',
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
