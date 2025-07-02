
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import DriverCard from '../DriverCard';

const mockDriver = {
  id: '1',
  first_name: 'Max',
  last_name: 'Verstappen',
  nationality: 'Dutch',
  team_id: '1',
  driver_number: 1,
  points: 575,
  position: 1,
  profile_image_url: '/driver-1.jpg'
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
    expect(screen.getByText('P1')).toBeInTheDocument();
  });

  test('displays driver number', () => {
    renderWithRouter(<DriverCard driver={mockDriver} />);
    
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  test('renders profile image with correct alt text', () => {
    renderWithRouter(<DriverCard driver={mockDriver} />);
    
    const image = screen.getByAltText('Max Verstappen');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', '/driver-1.jpg');
  });
});
