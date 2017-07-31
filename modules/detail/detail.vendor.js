/* globals d3, BBGA */

((() => {
    'use strict';

    angular
        .module('dpDetail')
        .config(configuration);

    configuration.$inject = ['$provide'];

    function configuration ($provide) {
        $provide.constant('BBGA', BBGA);
        $provide.constant('d3', d3);
    }
}))();
