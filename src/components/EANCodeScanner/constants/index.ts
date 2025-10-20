export const VIDEO_CONSTRAINTS = {
  width: { ideal: 1280 },
  height: { ideal: 720 },
  aspectRatio: { ideal: 16 / 9 },
} as const;

export const CAMERA_LABELS = {
  BACK_PATTERN: /back|rear|environment/i,
  DEFAULT_LABEL: 'Camera',
} as const;

export const SCANNER_STATES = {
  IDLE: 'idle',
  INITIALIZING: 'initializing',
  ACTIVE: 'active',
  ERROR: 'error',
} as const;

export const ERROR_MESSAGES = {
  CAMERA_ACCESS: 'Could not access camera',
  DEVICE_NOT_FOUND: 'No camera devices found',
  SCANNER_INIT: 'Failed to initialize scanner',
  TORCH_TOGGLE: 'Torch toggle failed',
} as const;
