import { render } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import { BrowserRouter } from 'react-router-dom';
import TeamCard from '../TeamCard';

const mockTeam = {
  id: '1',
  name: 'Red Bull Racing',
  position: 1,
  points: 860,
  color: '#0600EF',
  drivers: ['Max Verstappen', 'Sergio Perez'],
  wins: 12,
  podiums: 20
};

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('TeamCard', () => {
  test('renders team information correctly', () => {
    renderWithRouter(<TeamCard team={mockTeam} />);
    
    expect(screen.getByText('Red Bull Racing')).toBeInTheDocument();
    expect(screen.getByText('860')).toBeInTheDocument();
  });

  test('displays team drivers', () => {
    renderWithRouter(<TeamCard team={mockTeam} />);
    
    expect(screen.getByText('Max Verstappen')).toBeInTheDocument();
    expect(screen.getByText('Sergio Perez')).toBeInTheDocument();
  });
});
