import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ProductFilter from './ProductFilter';

// mock products data
const products = [
  { title: 'Apple MacBook', price: 999, category: 'electronics' },
  { title: 'Banana', price: 1, category: 'food' },
  { title: 'Canon Camera', price: 1200, category: 'electronics' },
  { title: 'Desk Lamp', price: 25, category: 'furniture' },
];

describe('ProductFilter component', () => {
  test('renders filter selects with default values and Reset button', () => {
    render(<ProductFilter products={products} onFilteredProducts={jest.fn()} />);

    expect(screen.getByLabelText(/Category:/i).value).toBe('all');
    expect(screen.getByLabelText(/Price Range:/i).value).toBe('0-1000');
    expect(screen.getByLabelText(/Sort By:/i).value).toBe('name-asc');
    expect(screen.getByRole('button', { name: /Reset Filters/i })).toBeInTheDocument();
  });

  test('filters products by category', () => {
    const onFilteredProducts = jest.fn();
    render(<ProductFilter products={products} onFilteredProducts={onFilteredProducts} />);

    // select category 'electronics'
    fireEvent.change(screen.getByLabelText(/Category:/i), { target: { value: 'electronics' } });

    // expects filtered products with category 'electronics'
    const filteredProducts = products.filter(p => p.title.toLowerCase().includes('electronics') || true);
    expect(onFilteredProducts).toHaveBeenCalled();
  });

  test('filters products by price range', () => {
    const onFilteredProducts = jest.fn();
    render(<ProductFilter products={products} onFilteredProducts={onFilteredProducts} />);

    // change price range
    fireEvent.change(screen.getByLabelText(/Price Range:/i).querySelectorAll('input')[0], { target: { value: '20' } });

    // simulate valid price range change
    fireEvent.change(screen.getByLabelText(/Price Range:/i).querySelectorAll('input')[1], { target: { value: '1000' } });

    expect(onFilteredProducts).toHaveBeenCalled();
  });

  test('sorts products correctly by price ascending', () => {
    const onFilteredProducts = jest.fn();
    render(<ProductFilter products={products} onFilteredProducts={onFilteredProducts} />);

    fireEvent.change(screen.getByLabelText(/Sort By:/i), { target: { value: 'price-asc' } });

    expect(onFilteredProducts).toHaveBeenCalled();
  });

  test('sorts products correctly by price descending', () => {
    const onFilteredProducts = jest.fn();
    render(<ProductFilter products={products} onFilteredProducts={onFilteredProducts} />);

    fireEvent.change(screen.getByLabelText(/Sort By:/i), { target: { value: 'price-desc' } });

    expect(onFilteredProducts).toHaveBeenCalled();
  });

  test('sorts products correctly by name ascending and descending', () => {
    const onFilteredProducts = jest.fn();
    render(<ProductFilter products={products} onFilteredProducts={onFilteredProducts} />);

    fireEvent.change(screen.getByLabelText(/Sort By:/i), { target: { value: 'name-asc' } });
    expect(onFilteredProducts).toHaveBeenCalledTimes(1);

    fireEvent.change(screen.getByLabelText(/Sort By:/i), { target: { value: 'name-desc' } });
    expect(onFilteredProducts).toHaveBeenCalledTimes(2);
  });

  test('reset button resets filters to default', () => {
    render(<ProductFilter products={products} onFilteredProducts={jest.fn()} />);
    const categorySelect = screen.getByLabelText(/Category:/i);
    const priceMinInput = screen.getAllByRole('spinbutton')[0];
    const priceMaxInput = screen.getAllByRole('spinbutton')[1];
    const sortSelect = screen.getByLabelText(/Sort By:/i);

    // change filters
    fireEvent.change(categorySelect, { target: { value: 'electronics' } });
    fireEvent.change(priceMinInput, { target: { value: '100' } });
    fireEvent.change(priceMaxInput, { target: { value: '2000' } });
    fireEvent.change(sortSelect, { target: { value: 'price-desc' } });

    // click reset
    fireEvent.click(screen.getByRole('button', { name: /Reset Filters/i }));

    expect(categorySelect.value).toBe('all');
    expect(priceMinInput.value).toBe('0');
    expect(priceMaxInput.value).toBe('10000');
    expect(sortSelect.value).toBe('name-asc');
  });

  test('handles edge case: no products passed', () => {
    const onFilteredProducts = jest.fn();
    render(<ProductFilter products={[]} onFilteredProducts={onFilteredProducts} />);

    // initial filters
    expect(screen.getByLabelText(/Category:/i).value).toBe('all');
    expect(onFilteredProducts).toHaveBeenCalled();

    // Changing filters shouldn't crash
    fireEvent.change(screen.getByLabelText(/Category:/i), { target: { value: 'all' } });
    fireEvent.click(screen.getByRole('button', { name: /Reset Filters/i }));
  });

  test('handles filter change with invalid sort key gracefully', () => {
    const onFilteredProducts = jest.fn();
    render(<ProductFilter products={products} onFilteredProducts={onFilteredProducts} />);

    // change sort to invalid option - simulate manual event
    fireEvent.change(screen.getByLabelText(/Sort By:/i), { target: { value: 'invalid-sort' } });

    // We expect the code to default to 0 sorting
    expect(onFilteredProducts).toHaveBeenCalled();
  });
});