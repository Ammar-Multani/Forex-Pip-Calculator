// Standard lot sizes in forex trading (default values)
export const DEFAULT_LOT_SIZES = {
  STANDARD: 100000, // 1 standard lot = 100,000 units
  MINI: 10000,      // 1 mini lot = 10,000 units
  MICRO: 1000,      // 1 micro lot = 1,000 units
  NANO: 100,        // 1 nano lot = 100 units (less common)
};

// Lot size labels for display
export const LOT_SIZE_LABELS = {
  STANDARD: 'Standard',
  MINI: 'Mini',
  MICRO: 'Micro',
  NANO: 'Nano',
  CUSTOM: 'Custom',
};

// Editable lot sizes (will be updated by user)
export let LOT_SIZES = { ...DEFAULT_LOT_SIZES };

// Get units from lot type
export const getLotUnits = (lotType: keyof typeof LOT_SIZES): number => {
  return LOT_SIZES[lotType] || 0;
};

// Update lot size value
export const updateLotSize = (lotType: keyof typeof LOT_SIZES, value: number): void => {
  if (lotType !== 'CUSTOM') {
    LOT_SIZES[lotType] = value;
  }
};

// Reset lot sizes to defaults
export const resetLotSizes = (): void => {
  LOT_SIZES = { ...DEFAULT_LOT_SIZES };
};
