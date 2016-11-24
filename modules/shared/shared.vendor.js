/* globals L, proj4, Redux, LZString */

(function () {
    'use strict';

    angular
        .module('dpShared')
        .config(configuration);

    configuration.$inject = ['$provide'];

    function configuration ($provide) {
        $provide.constant('L', L);
        $provide.constant('proj4', proj4);
        $provide.constant('Redux', Redux);
        $provide.constant('LZString', LZString);
    }
})();
