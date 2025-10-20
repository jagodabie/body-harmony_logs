import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  BrowserMultiFormatReader,
  type IScannerControls,
} from '@zxing/browser';
import type { Result } from '@zxing/library';
import { BarcodeFormat, DecodeHintType } from '@zxing/library';

import { CAMERA_LABELS, ERROR_MESSAGES, VIDEO_CONSTRAINTS } from '../constants';
import type {
  ScannerConfig,
  ScannerError,
  ScannerState,
  ScanResult,
} from '../types';
import { detectBarcodeType, validateBarcode } from '../utils/validation';

const DEFAULT_CONFIG: Required<ScannerConfig> = {
  autoStart: false,
  debounceMs: 1000,
  validateChecksum: true,
  supportedFormats: ['EAN-13', 'EAN-8', 'UPC-A', 'UPC-E'],
  onInvalidScan: () => {},
};

export const useHandleScanner = (
  onScanSuccess: (result: ScanResult) => void,
  config: ScannerConfig = {}
) => {
  const finalConfig = useMemo(
    () => ({ ...DEFAULT_CONFIG, ...config }),
    [config]
  );
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const controlsRef = useRef<IScannerControls | null>(null);
  const lastScanTimeRef = useRef(0);
  const isStoppingRef = useRef(false);

  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [deviceId, setDeviceId] = useState<string | undefined>(undefined);
  const [state, setState] = useState<ScannerState>('idle');
  const [error, setError] = useState<ScannerError | null>(null);
  const [torchAvailable, setTorchAvailable] = useState(false);
  const [torchOn, setTorchOn] = useState(false);
  const [showVideoArea, setShowVideoArea] = useState(true);

  // Initialize devices
  useEffect(() => {
    let mounted = true;

    const initializeDevices = async () => {
      try {
        const list = await navigator.mediaDevices.enumerateDevices();
        const cams = list.filter(d => d.kind === 'videoinput');

        if (!mounted) return;

        setDevices(cams);
        const backCamera = cams.find(c =>
          CAMERA_LABELS.BACK_PATTERN.test(c.label)
        );
        setDeviceId(backCamera?.deviceId || cams[0]?.deviceId);
      } catch (e) {
        console.debug('Device enumeration failed', e);
        if (mounted) {
          setError({
            type: 'DEVICE_NOT_FOUND',
            message: ERROR_MESSAGES.DEVICE_NOT_FOUND,
            originalError: e as Error,
          });
        }
      }
    };

    initializeDevices();
    return () => {
      mounted = false;
    };
  }, []);

  const stop = useCallback(() => {
    if (isStoppingRef.current) return;
    isStoppingRef.current = true;

    controlsRef.current?.stop();
    // controlsRef.current = null;
    setState('idle');

    const stream = videoRef.current?.srcObject as MediaStream | null;
    stream?.getTracks().forEach(t => t.stop());
    if (videoRef.current) videoRef.current.srcObject = null;

    setTorchOn(false);
  }, []);

  const closeVideoArea = useCallback(() => {
    stop();
    setShowVideoArea(false);
  }, [stop]);

  const openVideoArea = useCallback(() => {
    setShowVideoArea(true);
    isStoppingRef.current = false;
  }, []);

  // Handle scan result
  const handleScanResult = useCallback(
    (result: Result | undefined) => {
      if (!result) return;

      const now = Date.now();
      if (now - lastScanTimeRef.current < finalConfig.debounceMs) return;

      const code = result.getText();
      const type = detectBarcodeType(code);
      const isValid = validateBarcode(code, finalConfig.validateChecksum);

      if (!isValid) {
        finalConfig.onInvalidScan(code);
        return;
      }

      lastScanTimeRef.current = now;

      const scanResult: ScanResult = {
        code,
        type,
        isValid,
        timestamp: now,
      };

      onScanSuccess(scanResult);
      stop();
    },
    [finalConfig, onScanSuccess, stop]
  );

  const start = async () => {
    if (!videoRef.current) return;

    isStoppingRef.current = false;
    setState('initializing');
    setError(null);

    const hints = new Map();
    hints.set(DecodeHintType.POSSIBLE_FORMATS, [
      BarcodeFormat.EAN_13,
      BarcodeFormat.EAN_8,
      BarcodeFormat.UPC_A,
      BarcodeFormat.UPC_E,
    ]);
    hints.set(DecodeHintType.TRY_HARDER, true);

    try {
      const reader = new BrowserMultiFormatReader(hints);

      const constraints: MediaStreamConstraints = {
        video: deviceId
          ? {
              deviceId: { exact: deviceId },
              ...VIDEO_CONSTRAINTS,
            }
          : {
              facingMode: { ideal: 'environment' },
              ...VIDEO_CONSTRAINTS,
            },
        audio: false,
      };

      const controls = await reader.decodeFromConstraints(
        constraints,
        videoRef.current,
        handleScanResult
      );

      // Check if video element still exists after async operation
      if (!videoRef.current) {
        return;
      }

      // Check torch capability
      try {
        const stream = videoRef.current?.srcObject as MediaStream | null;
        const track = stream?.getVideoTracks?.()?.[0];
        const caps = track?.getCapabilities?.();
        setTorchAvailable(Boolean(caps?.torch));
      } catch (e) {
        console.debug('Torch capability check failed', e);
        setTorchAvailable(false);
      }

      // Refresh device list after successful start
      try {
        const listAfter = await navigator.mediaDevices.enumerateDevices();
        const camsAfter = listAfter.filter(d => d.kind === 'videoinput');
        setDevices(camsAfter);
      } catch (e) {
        console.debug('Device list refresh failed', e);
      }

      controlsRef.current = controls;
      setState('active');
    } catch (e) {
      console.error('Scanner start failed', e);
      setState('error');
      setError({
        type: 'SCANNER_INIT',
        message: ERROR_MESSAGES.SCANNER_INIT,
        originalError: e as Error,
      });
    }
  };

  const toggleTorch = useCallback(async () => {
    if (!torchAvailable) return;

    try {
      const stream = videoRef.current?.srcObject as MediaStream | null;
      const track = stream?.getVideoTracks?.()?.[0];
      if (!track) return;

      await track.applyConstraints({
        advanced: [{ torch: !torchOn }],
      });
      setTorchOn(prev => !prev);
    } catch (e) {
      console.debug('Torch toggle failed', e);
    }
  }, [torchAvailable, torchOn]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stop();
    };
  }, [stop]);

  return {
    videoRef,
    devices,
    deviceId,
    setDeviceId,
    state,
    error,
    torchAvailable,
    torchOn,
    start,
    stop,
    toggleTorch,
    closeVideoArea,
    openVideoArea,
    showVideoArea,
    isActive: state === 'active',
    isInitializing: state === 'initializing',
  };
};
