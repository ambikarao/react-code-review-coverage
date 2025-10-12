import { render } from '@testing-library/react';
import About from './About';

describe('About Component - minimal coverage', () => {
  test('renders without crashing', () => {
    render(<About />);
  });
});
