import React from 'react';
import { render, screen } from '@testing-library/react';
import LoadingSpinner from './LoadingSpinner';

describe('LoadingSpinner Component', () => {
  it('renders with default props', () => {
    render(<LoadingSpinner />);
    const container = screen.getByRole('region');
    expect(container).toHaveClass('loading-spinner-container');
    const spinner = container.querySelector('div');
    expect(spinner).toHaveStyle({
      width: '40px',
      height: '40px',
      border: '3px solid #007bff20',
      borderTop: '3px solid #007bff'
    });
    expect(screen.queryByText(/./)).toBeNull(); // No text rendered by default
  });

  it('renders small size correctly', () => {
    render(<LoadingSpinner size="small" />);
    const spinner = screen.getByRole('region').firstChild;
    expect(spinner).toHaveStyle({ width: '20px', height: '20px' });
  });

  it('renders medium size correctly', () => {
    render(<LoadingSpinner size="medium" />);
    const spinner = screen.getByRole('region').firstChild;
    expect(spinner).toHaveStyle({ width: '40px', height: '40px' });
  });

  it('renders large size correctly', () => {
    render(<LoadingSpinner size="large" />);
    const spinner = screen.getByRole('region').firstChild;
    expect(spinner).toHaveStyle({ width: '60px', height: '60px' });
  });

  it('renders custom color correctly', () => {
    render(<LoadingSpinner color="#123456" />);
    const spinner = screen.getByRole('region').firstChild;
    expect(spinner).toHaveStyle('border: 3px solid #12345620');
    expect(spinner).toHaveStyle('border-top: 3px solid #123456');
  });

  it('renders text when provided', () => {
    const text = 'Loading data...';
    render(<LoadingSpinner text={text} />);
    expect(screen.getByText(text)).toBeInTheDocument();
  });

  it('handles fullScreen prop true', () => {
    render(<LoadingSpinner fullScreen={true} />);
    const container = screen.getByRole('region');
    expect(container).toHaveClass('loading-spinner-fullscreen');
  });

  it('handles fullScreen prop false', () => {
    render(<LoadingSpinner fullScreen={false} />);
    const container = screen.getByRole('region');
    expect(container).toHaveClass('loading-spinner-container');
  });

  it('matches snapshot', () => {
    const { container } = render(<LoadingSpinner size="large" color="red" text="Wait..." fullScreen />);
    expect(container).toMatchSnapshot();
  });

  // Edge case: invalid size prop falls back to default medium size style
  it('falls back to default size if invalid size prop is passed', () => {
    // @ts-expect-error Testing invalid prop
    render(<LoadingSpinner size="invalid" />);
    const spinner = screen.getByRole('region').firstChild;
    expect(spinner).toHaveStyle({ width: '40px', height: '40px' });
  });

  // Edge case: color is empty string falls back to default
  it('falls back to default color if empty string is passed', () => {
    render(<LoadingSpinner color="" />);
    const spinner = screen.getByRole('region').firstChild;
    expect(spinner).toHaveStyle('border: 3px solid #007bff20');
  });
});
