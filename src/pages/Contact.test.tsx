import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
// Import the Contact component for this specific test suite
import Contact from './Contact';

// Define a fixed mock time for deterministic testing of time-sensitive logic (like 'recent' filter and scoring)
const MOCK_TIME = 1678886400000; // Monday, March 14, 2023 12:00:00 AM UTC

// Spy on Date.now() to control the 'current' time within the component
const dateNowSpy = jest.spyOn(Date, 'now').mockImplementation(() => MOCK_TIME);

describe('Contact Component - Message Management and Filtering', () => {

    // Restore the spy after all tests in this suite
    afterAll(() => {
        dateNowSpy.mockRestore();
    });
    
    // Helper to find the select element by its ARIA role (combobox)
    const getFilterSelect = () => screen.getByRole('combobox', { name: /filter/i });

    // Initial state check
    test('renders initial messages and calculated buckets correctly', () => {
        render(<Contact />);

        // Check for main heading
        expect(screen.getByRole('heading', { name: /Contact — Messages/i })).toBeInTheDocument();

        // Check initial message list (All messages visible by default)
        expect(screen.getAllByRole('listitem').length).toBe(3);

        // Check initial bucket counts (High: m2, Medium: m3, Low: m1)
        expect(screen.getByText(/High: 1/i)).toBeInTheDocument();
        expect(screen.getByText(/Medium: 1/i)).toBeInTheDocument();
        expect(screen.getByText(/Low: 1/i)).toBeInTheDocument();
    });

    // Test Case 1: Filtering to 'Recent' (age <= 24 hours)
    test('filters messages correctly based on recent selection (<= 24 hours)', () => {
        render(<Contact />);
        const select = getFilterSelect();

        // Change filter to 'Recent'.
        // m2 (1 hr old) and m3 (exactly 24 hrs old) should be visible.
        fireEvent.change(select, { target: { value: 'recent' } });

        // Expected: 2 messages visible
        expect(screen.getAllByRole('listitem').length).toBe(2);
        expect(screen.getByText('Urgent: server down')).toBeInTheDocument();
        expect(screen.getByText('Status update')).toBeInTheDocument();
        expect(screen.queryByText('Hello')).not.toBeInTheDocument();
    });
    
    // Test Case 2: Filtering to 'High importance' (> 0.8)
    test('filters messages correctly based on high importance selection', () => {
        render(<Contact />);
        const select = getFilterSelect();

        // Change filter to 'High importance'.
        // Only m2 (0.95) qualifies.
        fireEvent.change(select, { target: { value: 'high' } });

        // Expected: 1 message visible
        expect(screen.getAllByRole('listitem').length).toBe(1);
        expect(screen.getByText('Urgent: server down')).toBeInTheDocument();
        expect(screen.queryByText('Status update')).not.toBeInTheDocument();
        expect(screen.queryByText('Hello')).not.toBeInTheDocument();
    });

    // Test Case 3: Adding new messages and checking bucket counts
    test('adds new messages and updates the bucket counts', () => {
        render(<Contact />);

        // Initial High: 1
        expect(screen.getByText(/High: 1/i)).toBeInTheDocument();

        // Add critical (importance 0.98, should be High)
        fireEvent.click(screen.getByRole('button', { name: /Add critical/i }));

        // Check new bucket counts: High should be 2, others unchanged
        expect(screen.getByText(/High: 2/i)).toBeInTheDocument();
        
        // Add low (importance 0.3, should be Low)
        fireEvent.click(screen.getByRole('button', { name: /Add low/i }));

        // Check new bucket counts: Low should be 2
        expect(screen.getByText(/High: 2/i)).toBeInTheDocument();
        expect(screen.getByText(/Medium: 1/i)).toBeInTheDocument();
        expect(screen.getByText(/Low: 2/i)).toBeInTheDocument();
    });

    // Test Case 4: Deleting old messages
    test('deletes messages older than 2 days correctly', () => {
        render(<Contact />);

        // Initial messages: 3. m1 is 5 days old. m2/m3 are <= 1 day old.
        expect(screen.getAllByRole('listitem').length).toBe(3);
        expect(screen.getByText('Hello')).toBeInTheDocument(); // m1

        // Click delete button (threshold is 2 days)
        fireEvent.click(screen.getByRole('button', { name: /Delete older than 2 days/i }));

        // Only m1 should be deleted. Expected count: 2
        expect(screen.getAllByRole('listitem').length).toBe(2);
        expect(screen.queryByText('Hello')).not.toBeInTheDocument();
    });
    
    // Test Case 5: Verify CSV Export content (header and initial messages)
    test('displays correct CSV export header and initial content', () => {
        render(<Contact />);
        
        // Check for the Export header
        expect(screen.getByRole('heading', { name: /Export/i })).toBeInTheDocument();
        
        // Check if the CSV content includes the header and message contents
        const exportPre = screen.getByText('id,content,timestamp,importance,score').closest('pre');
        
        expect(exportPre).toHaveTextContent('id,content,timestamp,importance,score');
        expect(exportPre).toHaveTextContent('m1,"Hello"');
        expect(exportPre).toHaveTextContent('m2,"Urgent: server down"');
        expect(exportPre).toHaveTextContent('m3,"Status update"');
    });
});
