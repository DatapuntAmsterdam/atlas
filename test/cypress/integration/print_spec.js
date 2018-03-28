describe('print module', () => {
  beforeEach(() => {
    // go to the homepage
    cy.visit('/');
  });

  it('should show a print version of the page when the user click on the print button', () => {
    cy.server();
    cy.route('/typeahead?q=10581111').as('getTypeAhead');
    cy.route('/meetbouten/meetbout/*').as('getResults');
    cy.route('/meetbouten/meting/?meetbout=*').as('getMeeting');
    cy.route('/panorama/thumbnail/?*').as('getPanoThumbnail');

    cy.get('#global-search').type('10581111');

    cy.wait('@getTypeAhead');
    cy.get('.c-autocomplete').contains('10581111').click();

    cy.wait('@getResults');
    cy.wait('@getMeeting');
    cy.wait('@getPanoThumbnail');
    cy.get('img.c-straatbeeld-thumbnail--img').should('exist').and('be.visible');
    cy.get('h2.qa-title').should('exist').and('be.visible').contains('10581111');

    cy.get('button.qa-menu__link').click();
    cy.get('a.c-menu__subitem').contains('Printen').click();
    cy.get('h1.c-print-header__title').should('exist').and('be.visible');
    cy.get('.c-print-header__close').click();
    cy.get('h1.c-print-header__title').should('not.exist').and('not.be.visible');
    cy.get('img.c-straatbeeld-thumbnail--img').should('exist').and('be.visible');
    cy.get('h2.qa-title').should('exist').and('be.visible').contains('10581111');
  });
});
