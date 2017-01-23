'use strict';

const dataSelection = require('./data-selection');

module.exports = function (page) {
    expect(page.title()).toBe('Dataset Catalogus - Atlas');

    expect(page.dashboard().rightColumn().dataSelection().header().title()).toContain('datasets');
    //expect(page.dashboard().rightColumn().dataSelection().availableFilters().categories(0).heading()).toBe('Thema\'s');

    dataSelection(page);
};
