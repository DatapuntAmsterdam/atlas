const homepage = '.c-homepage';
const statusBarInfo = '.c-straatbeeld-status-bar__info-item';
const straatbeeld = '.c-straatbeeld';

describe('panorama module', () => {
  beforeEach(() => {
    cy.server();
    cy.route('/panorama/recente_opnames/alle/*').as('getResults');

    // go to the homepage
    cy.visit('/');
    // the homepage should be visible
    cy.get(homepage).should('be.visible');
    // check if the link is in the dom and visible
    cy.get('.qa-straatbeeld-link').should('exist').and('be.visible');
    // the straatbeeld should not exist yet
    cy.get(straatbeeld).should('not.exist');
    // click on the link to go to the map
    cy.get('.qa-straatbeeld-link').click();

    cy.wait('@getResults');
  });

  describe('user should be able to navigate to the panoram from the homepage', () => {
    it('should open the panorama viewer', () => {
      // the homepage should not be visible anymore
      cy.get(homepage).should('not.be.visible');
      // the map should be visible
      cy.get(straatbeeld).should('exist').and('be.visible');
    });
  });

  describe('user should be able to use the panorama viewer', () => {
    // TODO: activate, skipping now because canvas is never found when test runs from inside Docker
    // container
    it.skip('should render the marzipano viewer', () => {
      // the canvas inside de marzipano viewer should exist and be visible
      cy.get('.js-marzipano-viewer').find('canvas').should('exist').and('be.visible');
    });

    it('should be able to click a hotspot and change the coordinates', () => {
      cy.get(statusBarInfo).first()
      .then((coordinatesEl) => {
        const coordinates = coordinatesEl[0].innerText;

        cy.get(statusBarInfo).first()
          .contains(coordinates)
          .should('exist');

        // the click the first hotspot
        cy.get('.qa-hotspot-button:visible').first().click();

        cy.wait('@getResults');
        // the coordinates should be different
        cy.get(statusBarInfo).first()
          .contains(coordinates)
          .should('not.exist');
      });
    });
  });

  describe('user should be able to use the leaflet map', () => {
    it('should render the leaflet map and set the marker', () => {
      // the canvas inside de marzipano viewer should exist and be visible
      cy.get('.leaflet-marker-pane').find('img').should('exist').and('be.visible');
    });

    it('should set the panoramabeelden as active layers in the map-panel legenda', () => {
      // open the the map panel (closed initially)
      cy.get('.map-panel__toggle').click();
      // should contain the correct value
      cy.get('.map-legend__category-title')
        .contains('Panoramabeelden')
        .should('exist').and('be.visible');
    });

    it.skip('should set the layers in the leaflet map', () => {
      // should contain the correct value
      cy.get('.leaflet-image-layer').should('exist').and('be.visible');
    });

    it('should change the coordinates when clicked on the map', () => {
      cy.get(statusBarInfo).first()
      .then((coordinatesEl) => {
        const coordinates = coordinatesEl[0].innerText;

        cy.get(statusBarInfo).first()
          .contains(coordinates)
          .should('exist');

        // click on the leaflet map with a different position
        cy.get('.s-leaflet-draw').trigger('click', 20, 100);

        cy.wait('@getResults');
        // the coordinates should be different
        cy.get(statusBarInfo).first()
          .contains(coordinates)
          .should('not.exist');
      });
    });
  });

  describe.only('user should be able to interact with the panorama', () => {
    it('should remember the state when closing the pano, and update to search results when clicked in map', () => {
      const panoUrl = '/#?dte=bag%2Fverblijfsobject%2F03630003761571%2F&mpb=topografie&mpz=16&mpo=pano::T&mpv=52.373434:4.8936217&sbf=Cu&sbh=-Mh&sbi=TMX7315120208-000073_pano_0005_000460&sbl=ZRXE4:3JKXp&sbp=r&sby=5FK';
      let newUrl;

      cy.defineGeoSearchRoutes();
      // TODO: enable this (getTypeAhead) once fetch is supported by Cypress
      // https://github.com/cypress-io/cypress/issues/95
      // cy.route('/typeahead?q=dam+1').as('getTypeAhead');
      cy.route('/bag/verblijfsobject/*').as('getVerblijfsobject');
      cy.route('/panorama/thumbnail/*').as('getPanoThumbnail');

      cy.viewport(1000, 660);
      cy.get('.leaflet-marker-pane').find('img').should('exist').and('be.visible');
      cy.get('#auto-suggest__input').type('dam 1');

      // TODO: remove wait(500) and enably the route-wait
      cy.wait(500);
      // cy.wait('@getTypeAhead');
      cy.get('.auto-suggest').contains('Dam 1').click();

      cy.wait('@getVerblijfsobject');
      cy.wait('@getPanoThumbnail');
      cy.get('img.c-straatbeeld-thumbnail--img').should('exist').and('be.visible');
      cy.get('h2.qa-title').should('exist').and('be.visible').contains('Dam 1');
      cy.get('img.c-straatbeeld-thumbnail--img').click();

      // mimic user drag to right
      cy.visit(panoUrl);
      cy.wait('@getResults');
      let largestButtonSize = 0;
      let largestButton;
      cy.get('.qa-hotspot-rotation:visible').each((button) => {
        // get largest (e.g. closest by) navigation button
        cy.wrap(button).should('have.css', 'width').then((width) => {
          if (parseInt(width.replace('px', ''), 10) > largestButtonSize) {
            largestButtonSize = parseInt(width.replace('px', ''), 10);
            largestButton = button;
          }
        });
      }).then(() => {
        largestButton.click();
      });

      cy.wait('@getResults');
      // verify that something happened by comparing the url
      cy.location().then((loc) => {
        newUrl = loc.pathname + loc.hash;
        expect(newUrl).not.to.equal(panoUrl);
      });

      cy.get('button.c-straatbeeld__close').click();
      cy.get('img.c-straatbeeld-thumbnail--img').should('exist').and('be.visible');
      cy.get('h2.qa-title').should('exist').and('be.visible').contains('Dam 1');
      cy.get('img.c-straatbeeld-thumbnail--img').click();

      cy.get('.s-leaflet-draw').click(20, 100);

      cy.wait('@getResults');
      // verify that something happened by comparing the url
      cy.location().then((loc) => {
        const thisUrl = loc.pathname + loc.hash;
        expect(thisUrl).to.not.equal(newUrl);
      });
      cy.get('button.c-straatbeeld__close').click();

      cy.waitForGeoSearch();
      cy.get('h1.o-header__title').contains('Resultaten').should('exist').and('be.visible');
      cy.get('h2').contains('Openbare ruimte').should('exist').and('be.visible');
    });
  });
});
