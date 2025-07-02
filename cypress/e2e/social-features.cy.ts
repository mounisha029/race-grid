
describe('Social Features', () => {
  beforeEach(() => {
    cy.mockF1Api();
  });

  it('should display social page for authenticated users', () => {
    cy.login('test@example.com', 'password123');
    cy.visit('/social');
    
    cy.get('h1').should('contain', 'F1 Social Hub');
    cy.get('[data-testid="profile-tab"]').should('be.visible');
    cy.get('[data-testid="discussions-tab"]').should('be.visible');
    cy.get('[data-testid="sharing-tab"]').should('be.visible');
    cy.get('[data-testid="polls-tab"]').should('be.visible');
  });

  it('should allow posting comments', () => {
    cy.login('test@example.com', 'password123');
    cy.visit('/social');
    
    cy.get('[data-testid="discussions-tab"]').click();
    cy.get('[data-testid="comment-textarea"]').type('Great race discussion!');
    cy.get('[data-testid="post-comment-button"]').click();
    
    cy.get('[data-testid="comment-success"]').should('be.visible');
  });

  it('should allow creating polls', () => {
    cy.login('test@example.com', 'password123');
    cy.visit('/social');
    
    cy.get('[data-testid="polls-tab"]').click();
    cy.get('[data-testid="create-poll-button"]').click();
    
    cy.get('[data-testid="poll-question"]').type('Who will win the next race?');
    cy.get('[data-testid="poll-option-0"]').type('Max Verstappen');
    cy.get('[data-testid="poll-option-1"]').type('Lewis Hamilton');
    
    cy.get('[data-testid="create-poll-submit"]').click();
    cy.get('[data-testid="poll-success"]').should('be.visible');
  });
});
