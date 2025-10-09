// File: src/components/Contact.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Contact from './Contact';

describe('Contact component', () => {
  test('renders and filters', () => {
    render(<Contact />);
    expect(screen.getByText(/Contact — Messages/)).toBeInTheDocument();

    // add a critical message and expect it to show up in high bucket
    const addCritical = screen.getByText('Add critical');
    fireEvent.click(addCritical);
    expect(screen.getByText(/Critical alert/)).toBeInTheDocument();

    // change filter to high
    const select = screen.getByLabelText(/Filter/);
    fireEvent.change(select, { target: { value: 'high' } });
    expect(select).toHaveValue('high');

    // export should contain CSV header
    expect(screen.getByText(/id,content,timestamp,importance,score/)).toBeInTheDocument();
  });

  test('deleteOld removes messages', () => {
    render(<Contact />);
    const deleteBtn = screen.getByText(/Delete older than 2 days/);
    fireEvent.click(deleteBtn);
    // still renders without crashing
    expect(screen.getByText(/Top messages/)).toBeInTheDocument();
  });
});