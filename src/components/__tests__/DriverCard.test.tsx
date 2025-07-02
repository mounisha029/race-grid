import { render } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import { BrowserRouter } from 'react-router-dom';
import DriverCard from '../DriverCard';

const mockDriver = {
  id: '1',
  name: 'Max Verstappen',
  team: 'Red Bull Racing',
  position: 1,
  points: 575,
  nationality: 'Dutch',
  number: 1,
  teamColor: '#0600EF',
  lastRacePosition: 1,
  trend: 'up' as const
};

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('DriverCard', () => {
  test('renders driver information correctly', () => {
    renderWithRouter(<DriverCard driver={mockDriver} />);
    
    expect(screen.getByText('Max Verstappen')).toBeInTheDocument();
    expect(screen.getByText('Dutch')).toBeInTheDocument();
    expect(screen.getByText('575')).toBeInTheDocument();
  });

  test('displays driver number', () => {
    renderWithRouter(<DriverCard driver={mockDriver} />);
    
    expect(screen.getByText('#1 Max Verstappen')).toBeInTheDocument();
  });
});
