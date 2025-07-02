
describe('Navigation', () => {
  beforeEach(() => {
    cy.mockF1Api();
    cy.visit('/');
  });

  it('should navigate to drivers page', () => {
    cy.get('[data-testid="drivers-link"]').click();
    cy.url().should('include', '/drivers');
    cy.get('h1').should('contain', 'Drivers');
  });

  it('should navigate to teams page', () => {
    cy.get('[data-testid="teams-link"]').click();
    cy.url().should('include', '/teams');
    cy.get('h1').should('contain', 'Teams');
  });

  it('should navigate to races page', () => {
    cy.get('[data-testid="races-link"]').click();
    cy.url().should('include', '/races');
    cy.get('h1').should('contain', 'Races');
  });

  it('should navigate to calendar page', () => {
    cy.get('[data-testid="calendar-link"]').click();
    cy.url().should('include', '/calendar');
    cy.get('h1').should('contain', 'Calendar');
  });
});
