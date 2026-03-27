import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Macros } from '../../../views/MealLogs/components/Macros/Macros';

describe('Macros', () => {
  const defaultProps = {
    calories: 450,
    protein: 25,
    carbohydrates: 60,
    fat: 12,
  };

  it('renders calories value', () => {
    render(<Macros {...defaultProps} />);
    expect(screen.getByText('450 kcal')).toBeInTheDocument();
  });

  it('renders protein value', () => {
    render(<Macros {...defaultProps} />);
    expect(screen.getByText('Protein: 25 g')).toBeInTheDocument();
  });

  it('renders carbohydrates value', () => {
    render(<Macros {...defaultProps} />);
    expect(screen.getByText('Carbs: 60 g')).toBeInTheDocument();
  });

  it('renders fat value', () => {
    render(<Macros {...defaultProps} />);
    expect(screen.getByText('Fat: 12 g')).toBeInTheDocument();
  });

  it('applies custom className to wrapper', () => {
    const { container } = render(<Macros {...defaultProps} className="custom" />);
    expect(container.firstChild).toHaveClass('macros', 'custom');
  });

  it('applies default "macros" class without custom className', () => {
    const { container } = render(<Macros {...defaultProps} />);
    expect(container.firstChild).toHaveClass('macros');
  });

  it('renders zero values correctly', () => {
    render(<Macros calories={0} protein={0} carbohydrates={0} fat={0} />);
    expect(screen.getByText('0 kcal')).toBeInTheDocument();
    expect(screen.getByText('Protein: 0 g')).toBeInTheDocument();
    expect(screen.getByText('Carbs: 0 g')).toBeInTheDocument();
    expect(screen.getByText('Fat: 0 g')).toBeInTheDocument();
  });
});
