// Standard lot sizes in forex trading
export const LOT_SIZES = {
  STANDARD: 100000, // 1 standard lot = 100,000 units
  MINI: 10000,      // 1 mini lot = 10,000 units
  MICRO: 1000,      // 1 micro lot = 1,000 units
  NANO: 100,        // 1 nano lot = 100 units (less common)
};

// Lot size labels for display
export const LOT_SIZE_LABELS = {
  STANDARD: 'Standard (100,000)',
  MINI: 'Mini (10,000)',
  MICRO: 'Micro (1,000)',
  NANO: 'Nano (100)',
  CUSTOM: 'Custom',
};

// Get units from lot type
export const getLotUnits = (lotType: keyof typeof LOT_SIZES): number => {
  return LOT_SIZES[lotType] || 0;
};