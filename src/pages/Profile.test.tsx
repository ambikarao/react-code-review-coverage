import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
// Assuming the component is named Profile.tsx and is exported as default
import Profile from './Profile';

// Mock window.alert as the component uses it for the payroll calculation result
const mockAlert = jest.spyOn(window, 'alert').mockImplementation(() => {});

// Helper function to mock the structure returned by document.querySelector('[data-testid="base-rate"]')
const mockQuerySelectorValue = (value) => ({
    value: value.toString(),
});

describe('Profile Component', () => {

    // Clean up mock after tests
    afterAll(() => {
        mockAlert.mockRestore();
    });

    // Test Case 1: Initial Render Check and Derived Best Skill
    test('renders initial skills and identifies the best skill correctly', () => {
        render(<Profile />);

        // Check for the main heading
        expect(screen.getByRole('heading', { name: /Developer Profile Dashboard/i })).toBeInTheDocument();

        // Check for all three initial skills
        expect(screen.getByText(/React/i)).toBeInTheDocument();
        expect(screen.getByText(/TypeScript/i)).toBeInTheDocument();
        expect(screen.getByText(/Testing/i)).toBeInTheDocument();

        // Best skill should be React initially due to highest level/endorsements
        const bestSkillSection = screen.getByRole('heading', { name: /Highest Scored Skill/i }).nextElementSibling;
        expect(bestSkillSection).toHaveTextContent(/React/i);
    });

    // Test Case 2: State Update via Endorse Button
    test('updates endorsements and re-calculates skill scores when endorsed', () => {
        render(<Profile />);

        // 1. Find the list item for 'Testing'. Initial endorsements: 18
        const initialTestingText = screen.getByText(/endorsements 18/i);
        expect(initialTestingText).toBeInTheDocument();

        // 2. Click the Endorse button for Testing (find it by traversing from the skill text)
        // Note: We use queryByRole to find the specific button within the Testing skill's list item parent
        const testingListItem = initialTestingText.closest('li');
        const endorseButton = testingListItem.querySelector('button');
        
        fireEvent.click(endorseButton);

        // 3. Verify endorsement count is updated to 19 (state update)
        expect(testingListItem).toHaveTextContent('endorsements 19');
        
        // 4. Verify the Best Skill remains React (one endorsement shouldn't change the complex score dramatically)
        const bestSkillSection = screen.getByRole('heading', { name: /Highest Scored Skill/i }).nextElementSibling;
        expect(bestSkillSection).toHaveTextContent(/React/i);
    });
    
    // Test Case 3: Unit test for the complex calculatePayroll function via UI interaction
    test('calculatePayroll function handles overtime, tax brackets, and bonus correctly', () => {
        render(<Profile />);
        
        // Initial state hoursLogged: [40, 35, 45, 38, 50]. Total Hours: 208.
        // Base Rate: 100 (as mocked below)
        
        // Mock document.querySelector to simulate input value '100' for the base rate
        const querySelectorSpy = jest.spyOn(document, 'querySelector')
            .mockImplementation(() => mockQuerySelectorValue(100));

        fireEvent.click(screen.getByRole('button', { name: /Compute Payroll/i }));

        // Detailed Calculation Verification (Base Rate $100, 208 total hours, multiplier 1.1):
        // 1. Gross Pay: 
        //    - Regular (160h): 160 * $100 = $16,000
        //    - Overtime (48h): 48 * $100 * 1.5 = $7,200
        //    - Total Gross: $23,200.00
        // 2. Tax Calculation on $23,200:
        //    - $1000 * 0.05 = $50
        //    - $2000 * 0.10 = $200
        //    - $5000 * 0.20 = $1,000
        //    - Remaining: $23200 - 8000 = $15,200
        //    - Remaining * 0.30: $15,200 * 0.30 = $4,560
        //    - Total Tax: $50 + $200 + $1000 + $4560 = $5,810.00
        // 3. Bonus:
        //    - Avg Weekly Hours: 208 / 4 = 52
        //    - Bonus Hours: 52 - 40 = 12
        //    - Bonus Value: 12 * $100 * 0.2 * 1.1 (multiplier) = $264.00
        // 4. Net Pay: $23200 - $5810 + $264 = $17,654.00

        const expectedResult = {
            gross: 23200.00,
            tax: 5810.00,
            bonus: 264.00,
            net: 17654.00
        };

        // The alert content should match the calculated JSON string
        expect(mockAlert).toHaveBeenCalledWith(JSON.stringify(expectedResult, null, 2));
        
        // Restore spy
        querySelectorSpy.mockRestore();
    });

    // Test Case 4: Advanced Diagnostics Toggle
    test('toggles the visibility of the Advanced Diagnostics section', () => {
        render(<Profile />);

        // Initial state: Advanced section should be hidden
        expect(screen.queryByText(/Advanced Analytics/i)).not.toBeInTheDocument();

        // Click the show button
        fireEvent.click(screen.getByRole('button', { name: /Show Advanced Diagnostics/i }));

        // Advanced section should now be visible
        expect(screen.getByText(/Advanced Analytics/i)).toBeInTheDocument();
        expect(screen.getByText(/Future 10-Year Avg Earnings/i)).toBeInTheDocument();
        
        // Click the hide button
        fireEvent.click(screen.getByRole('button', { name: /Hide Advanced Diagnostics/i }));

        // Advanced section should be hidden again
        expect(screen.queryByText(/Advanced Analytics/i)).not.toBeInTheDocument();
    });
});
