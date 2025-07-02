
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import TeamCard from '../TeamCard';

const mockTeam = {
  id: '1',
  name: 'Red Bull Racing',
  full_name: 'Oracle Red Bull Racing',
  points: 860,
  position: 1,
  logo_url: '/team-1.jpg',
  primary_color: '#0600EF',
  secondary_color: '#DC143C'
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
    expect(screen.getByText('P1')).toBeInTheDocument();
  });

  test('renders team logo with correct alt text', () => {
    renderWithRouter(<TeamCard team={mockTeam} />);
    
    const image = screen.getByAltText('Red Bull Racing');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', '/team-1.jpg');
  });
});
