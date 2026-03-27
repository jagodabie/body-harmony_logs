import { beforeEach, describe, expect, it } from 'vitest';

import { useUIStore } from '../../../stores/useUIStore';

const reset = () => useUIStore.setState({ snackbar: null });

describe('useUIStore', () => {
  beforeEach(reset);

  describe('initial state', () => {
    it('snackbar is null by default', () => {
      expect(useUIStore.getState().snackbar).toBeNull();
    });
  });

  describe('showSnackbar', () => {
    it('sets snackbar message and type', () => {
      useUIStore.getState().showSnackbar('Hello', 'success');
      expect(useUIStore.getState().snackbar).toEqual({
        message: 'Hello',
        type: 'success',
      });
    });

    it('defaults to type "info" when no type is provided', () => {
      useUIStore.getState().showSnackbar('Info message');
      expect(useUIStore.getState().snackbar?.type).toBe('info');
    });

    it('supports all snackbar types', () => {
      const types = ['success', 'error', 'info', 'warning'] as const;
      for (const type of types) {
        useUIStore.getState().showSnackbar('msg', type);
        expect(useUIStore.getState().snackbar?.type).toBe(type);
      }
    });

    it('overwrites a previous snackbar', () => {
      useUIStore.getState().showSnackbar('First', 'info');
      useUIStore.getState().showSnackbar('Second', 'error');
      expect(useUIStore.getState().snackbar).toEqual({
        message: 'Second',
        type: 'error',
      });
    });
  });

  describe('hideSnackbar', () => {
    it('sets snackbar back to null', () => {
      useUIStore.getState().showSnackbar('Visible', 'success');
      useUIStore.getState().hideSnackbar();
      expect(useUIStore.getState().snackbar).toBeNull();
    });

    it('is safe to call when snackbar is already null', () => {
      expect(() => useUIStore.getState().hideSnackbar()).not.toThrow();
      expect(useUIStore.getState().snackbar).toBeNull();
    });
  });
});
