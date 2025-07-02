
declare global {
  namespace Cypress {
    interface Chainable {
      login(email: string, password: string): Chainable<void>;
      mockF1Api(): Chainable<void>;
    }
  }
}

Cypress.Commands.add('login', (email: string, password: string) => {
  cy.visit('/login');
  cy.get('[data-testid="email-input"]').type(email);
  cy.get('[data-testid="password-input"]').type(password);
  cy.get('[data-testid="login-button"]').click();
});

Cypress.Commands.add('mockF1Api', () => {
  cy.intercept('GET', '/api/drivers', { fixture: 'drivers.json' }).as('getDrivers');
  cy.intercept('GET', '/api/teams', { fixture: 'teams.json' }).as('getTeams');
  cy.intercept('GET', '/api/races', { fixture: 'races.json' }).as('getRaces');
});
