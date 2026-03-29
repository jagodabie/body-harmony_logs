import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { OverlayLoader } from '../../../components/OverlayLoader/OverlayLoader';

describe('OverlayLoader', () => {
  it('renders overlay when isLoading is true', () => {
    const { container } = render(<OverlayLoader isLoading />);
    expect(container.querySelector('.overlay-loader')).toBeInTheDocument();
  });

  it('renders spinner inside overlay', () => {
    const { container } = render(<OverlayLoader isLoading />);
    expect(container.querySelector('.overlay-loader__spinner')).toBeInTheDocument();
  });

  it('renders nothing when isLoading is false', () => {
    const { container } = render(<OverlayLoader isLoading={false} />);
    expect(container.firstChild).toBeNull();
  });
});
