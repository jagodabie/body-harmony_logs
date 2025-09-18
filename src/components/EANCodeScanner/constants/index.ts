export const EAN_REGEX = /^\d{8,14}$/;

export const VIDEO_CONSTRAINTS = {
  WIDTH: { ideal: 1280 },
  HEIGHT: { ideal: 720 },
  ASPECT_RATIO: { ideal: 16 / 9 },
} as const;

export const CAMERA_LABELS = {
  BACK_PATTERN: /back|rear|environment/i,
  DEFAULT_LABEL: 'Camera',
} as const;

export const ERROR_MESSAGES = {
  SCANNER_START: 'Error starting scanner',
  TORCH_TOGGLE: 'Torch toggle failed',
  DEVICE_ENUMERATION: 'enumerateDevices failed',
} as const;
