// File: src/components/About.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import About from './About';

describe('About component', () => {
  test('renders and computes productivity', () => {
<<<<<<< Updated upstream
    render(<About />);
    expect(screen.getByText(/About — Team Performance/)).toBeInTheDocument();
=======
    render(<About simulationMode={true} />);
    expect(screen.getByText(/About.*Team Performance/)).toBeInTheDocument();
>>>>>>> Stashed changes

    // change years and verify computed output updates
    const yearsInput = screen.getByTestId('years-input');
    fireEvent.change(yearsInput, { target: { value: '5' } });
    expect(yearsInput).toHaveValue(5);

    const growthInput = screen.getByTestId('growth-input');
    fireEvent.change(growthInput, { target: { value: '0.2' } });
    expect(growthInput).toHaveValue(0.2);

    // change projects via blur to trigger parse
    const projectsInput = screen.getByTestId('projects-input');
    fireEvent.blur(projectsInput, { target: { value: '2,4,6,8,10' } });

    // after changing, expect a complexity score element to be present
    expect(screen.getByTestId('complexity-score')).toBeInTheDocument();
  });

  test('parses project CSV safely', () => {
    render(<About simulationMode={true} />);
    const projectsInput = screen.getByTestId('projects-input');
    fireEvent.blur(projectsInput, { target: { value: 'a, , 10, 20' } });

    // should not throw and should show anomaly list
    expect(screen.getByTestId('anomalies-list')).toBeInTheDocument();
  });
<<<<<<< Updated upstream
});
=======

  test('returns empty arrays/lists when simulationMode is false', () => {
    render(<About />); // simulationMode defaults to false
    // anomalies list should not be present if simulationMode is false
    expect(screen.queryByTestId('anomalies-list')).not.toBeInTheDocument();
    // complexity score still rendered as 0
    expect(screen.getByTestId('complexity-score')).toHaveTextContent('0.00');
  });

  test('updates weights and base when changing growth rate and years inputs', () => {
    render(<About simulationMode={true} />);
    const growthInput = screen.getByTestId('growth-input');
    fireEvent.change(growthInput, { target: { value: '0.1' } });
    expect(growthInput).toHaveValue(0.1);

    const yearsInput = screen.getByTestId('years-input');
    fireEvent.change(yearsInput, { target: { value: '3' } });
    expect(yearsInput).toHaveValue(3);
  });

  test('handles project input with no valid projects gracefully', () => {
    render(<About simulationMode={true} />);
    const projectsInput = screen.getByTestId('projects-input');
    fireEvent.blur(projectsInput, { target: { value: ' , , ' } });
    // complexity score should still be rendered but defaults since no valid projects
    expect(screen.getByTestId('complexity-score')).toBeInTheDocument();
  });

  test('validates anomaly list rendering with different project inputs', () => {
    render(<About simulationMode={true} />);
    const projectsInput = screen.getByTestId('projects-input');

    // valid projects, no anomalies
    fireEvent.blur(projectsInput, { target: { value: '10, 20, 30' } });
    expect(screen.queryByTestId('anomalies-list')).not.toBeInTheDocument();

    // invalid project input, anomalies should show
    fireEvent.blur(projectsInput, { target: { value: '10, x, 30' } });
    expect(screen.getByTestId('anomalies-list')).toBeInTheDocument();
  });
});
>>>>>>> Stashed changes
