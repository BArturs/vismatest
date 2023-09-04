describe('Visma vacancies', () => {
  it('Apply with unfulfilled form', () => {
    Cypress.on('uncaught:exception', (err, runnable) => {
      return false;
    });

    cy.intercept({
      method: 'POST',
      url: 'https://vismacc.teamtailor.com/applications',
    }).as('submit');

    cy.viewport(1920, 1080);
    cy.clearAllCookies();
    cy.visit('https://www.visma.lv/');
    cy.get('#onetrust-accept-btn-handler').click({ timeout: 10000 });
    cy.contains('Vakances').click();
    cy.get('.submenu-item__link').contains('Vakances').click();
    cy.get(
      ':nth-child(1) > .vacancy-list--item > :nth-child(2) > .vacancy--title'
    ).click();

    cy.origin('https://vismacc.teamtailor.com', () => {
      cy.get('[data-action="click->common--cookies--alert#acceptAll"]').click({
        timeout: 5000,
      });
      cy.get(
        '[data-action="click->careersite--jobs--form-overlay#showFormOverlay"]'
      )
        .first()
        .click();
      cy.get('#candidate_first_name').type('Arturs');
      cy.get('#candidate_last_name').type('Bruveris');
      cy.get('#candidate_email').type('arturs.bruveris@visma.com');
      cy.get('#job-application-form').submit();
      // fail option 1
      cy.get(
        '#job-application-form #upload_resume_field [data-name="error"]'
      ).should('not.be.visible');
      // fail option 2
      cy.wait('@submit').then((interception) => {
        assert.strictEqual(interception.response.statusCode, 200);
      });
    });
  });
});