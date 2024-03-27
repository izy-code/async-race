import type { Car } from '../interfaces';

const MANUFACTURERS = [
  'Toyota',
  'Honda',
  'Ford',
  'BMW',
  'Mercedes',
  'Chevrolet',
  'Audi',
  'Volkswagen',
  'Hyundai',
  'Nissan',
];

const MODELS = [
  'Corolla',
  'Camry',
  'RAV4',
  'Civic',
  'Accord',
  'CR-V',
  'F-150',
  'Focus',
  'Mustang',
  '3 Series',
  '5 Series',
  'X5',
  'C-Class',
  'E-Class',
  'S-Class',
  'Cruze',
  'Malibu',
  'Silverado',
  'A4',
  'A6',
  'Q7',
  'Golf',
  'Passat',
  'Tiguan',
  'Elantra',
  'Sonata',
  'Santa Fe',
  'Altima',
  'Maxima',
  'Rogue',
];

const createRandomName = (): string => {
  const manufacturer = MANUFACTURERS[Math.floor(Math.random() * MANUFACTURERS.length)];
  const model = MODELS[Math.floor(Math.random() * MODELS.length)];

  return `${manufacturer} ${model}`;
};

const createRandomHexColor = (): string => {
  const COLORS_COUNT = 256;

  const toHex = (num: number): string => num.toString(16).padStart(2, '0');

  const r = Math.floor(Math.random() * COLORS_COUNT);
  const g = Math.floor(Math.random() * COLORS_COUNT);
  const b = Math.floor(Math.random() * COLORS_COUNT);

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

const createRandomCar = (): Omit<Car, 'id'> => ({
  name: createRandomName(),
  color: createRandomHexColor(),
});

export default function createRandomCars(quantity: number): Omit<Car, 'id'>[] {
  return Array.from({ length: quantity }, createRandomCar);
}
