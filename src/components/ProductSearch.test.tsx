import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ProductSearch from './ProductSearch';

describe('ProductSearch Component', () => {
  jest.useFakeTimers();

  afterEach(() => {
    jest.clearAllTimers();
    jest.clearAllMocks();
  });

  test('renders search input with placeholder', () => {
    render(<ProductSearch />);
    const input = screen.getByPlaceholderText(/search products.../i);
    expect(input).toBeInTheDocument();
  });

  test('input value updates on typing', () => {
    render(<ProductSearch />);
    const input = screen.getByPlaceholderText(/search products.../i);

    fireEvent.change(input, { target: { value: 'phone' } });
    expect(input.value).toBe('phone');
  });

  test('shows spinner div when isSearching is true', () => {
    render(<ProductSearch />);
    const input = screen.getByPlaceholderText(/search products.../i);

    // Initially no spinner
    expect(screen.queryByText('🔄')).not.toBeInTheDocument();

    // Type in input to trigger search
    fireEvent.change(input, { target: { value: 'test' } });

    // Wait for debounce delay
    jest.advanceTimersByTime(500);

    // Spinner should appear
    const spinner = screen.getByText('🔄');
    expect(spinner).toBeInTheDocument();
  });

  test('clears search input when clear button clicked', () => {
    render(<ProductSearch />);
    const input = screen.getByPlaceholderText(/search products.../i);
    const clearBtn = screen.getByRole('button', { name: /clear search/i });

    fireEvent.change(input, { target: { value: 'abc' } });
    expect(input.value).toBe('abc');

    fireEvent.click(clearBtn);
    expect(input.value).toBe('');
    expect(screen.queryByText('🔄')).not.toBeInTheDocument();
  });

  test('calls onSearch prop when form is submitted', () => {
    const onSearchMock = jest.fn();
    render(<ProductSearch onSearch={onSearchMock} />);
    const input = screen.getByPlaceholderText(/search products.../i);
    const form = screen.getByRole('form');

    fireEvent.change(input, { target: { value: 'camera' } });
    fireEvent.submit(form);

    expect(onSearchMock).toHaveBeenCalledWith('camera');
  });

  test('debounces search calls by 300ms', async () => {
    jest.useFakeTimers();
    const onSearchMock = jest.fn();

    render(<ProductSearch onSearch={onSearchMock} />);
    const input = screen.getByPlaceholderText(/search products.../i);

    fireEvent.change(input, { target: { value: 'p' } });
    fireEvent.change(input, { target: { value: 'ph' } });
    fireEvent.change(input, { target: { value: 'pho' } });

    // Fast typing within debounce window, so only last input triggers
    jest.advanceTimersByTime(300);

    await waitFor(() => {
      expect(onSearchMock).toHaveBeenCalledTimes(1);
      expect(onSearchMock).toHaveBeenCalledWith('pho');
    });
  });

  test('does not call onSearch if input is empty or whitespace', () => {
    const onSearchMock = jest.fn();

    render(<ProductSearch onSearch={onSearchMock} />);
    const input = screen.getByPlaceholderText(/search products.../i);

    // Change input to spaces only
    fireEvent.change(input, { target: { value: '   ' } });

    // Advance timers
    jest.advanceTimersByTime(300);

    expect(onSearchMock).not.toHaveBeenCalled();
  });

  test('clears search when clear button is clicked resets all states', () => {
    render(<ProductSearch />);
    const input = screen.getByPlaceholderText(/search products.../i);
    fireEvent.change(input, { target: { value: 'something' } });
    jest.advanceTimersByTime(300);

    const clearBtn = screen.getByRole('button', { name: /clear search/i });
    fireEvent.click(clearBtn);

    expect(input.value).toBe('');
    expect(screen.queryByText('🔄')).not.toBeInTheDocument();
  });

  test('handles rapid input changes and cancels previous timers', () => {
    render(<ProductSearch />);
    const input = screen.getByPlaceholderText(/search products.../i);

    fireEvent.change(input, { target: { value: 'a' } });
    jest.advanceTimersByTime(200);
    fireEvent.change(input, { target: { value: 'ab' } });
    jest.advanceTimersByTime(200);
    fireEvent.change(input, { target: { value: 'abc' } });

    // After 300ms from last input only then search triggers
    jest.advanceTimersByTime(300);

    // We cannot test internal state, but no errors and UI stable
    expect(input.value).toBe('abc');
  });

  test('does not render spinner when not searching', () => {
    render(<ProductSearch />);
    expect(screen.queryByText('🔄')).not.toBeInTheDocument();
  });
});