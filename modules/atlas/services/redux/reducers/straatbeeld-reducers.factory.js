(function () {
    'use strict';

    angular
        .module('atlas')
        .factory('straatbeeldReducers', straatbeeldReducersFactory);

    straatbeeldReducersFactory.$inject = ['ACTIONS', 'straatbeeldConfig'];

    function straatbeeldReducersFactory (ACTIONS, straatbeeldConfig) {
        var reducers = {};

        reducers[ACTIONS.FETCH_STRAATBEELD] = fetchStraatbeeldReducer;
        reducers[ACTIONS.FETCH_STRAATBEELD_BY_LOCATION] = fetchStraatbeeldByLocationReducer;
        reducers[ACTIONS.SHOW_STRAATBEELD_INITIAL] = showStraatbeeldReducer;
        reducers[ACTIONS.SHOW_STRAATBEELD_SUBSEQUENT] = showStraatbeeldReducer;
        reducers[ACTIONS.SET_STRAATBEELD_ORIENTATION] = setOrientationReducer;

        return reducers;

        /**
         * @description If the oldState had an active straatbeeld it will remember the heading.
         *
         * @param {Object} oldState
         * @param {Object} payload - A straatbeeld ID (String)
         *
         * @returns {Object} newState
         */
        function fetchStraatbeeldReducer (oldState, payload) {
            var newState = angular.copy(oldState);

            newState.straatbeeld = newState.straatbeeld || {};
            initializeStraatbeeld(newState.straatbeeld);

            newState.straatbeeld.id = payload.id;
            newState.straatbeeld.heading = payload.heading ||
                (oldState.straatbeeld && oldState.straatbeeld.heading) ||
                0;
            newState.straatbeeld.isInitial = payload.isInitial;

            // If a straatbeeld is loaded by it's id
            // and detail is active
            // then inactivate detail
            if (angular.isObject(newState.detail)) {
                newState.detail.isInvisible = true;
            }

            newState.map.highlight = null;

            newState.search = null;
            newState.page = null;
            // newState.detail = null;

            newState.dataSelection = null;

            newState.map.isLoading = true;

            return newState;
        }

        /**
         * @param {Object} oldState
         * @param {Array} payload - A location, e.g. [52.123, 4.789]
         *
         * @returns {Object} newState
         */
        function fetchStraatbeeldByLocationReducer (oldState, payload) {
            var newState = angular.copy(oldState);

            newState.straatbeeld = newState.straatbeeld || {};
            initializeStraatbeeld(newState.straatbeeld);

            newState.straatbeeld.location = payload;
            newState.straatbeeld.targetLocation = payload;

            if (oldState.layerSelection || (oldState.map && oldState.map.isFullscreen)) {
                newState.map.viewCenter = payload;
            }

            newState.layerSelection = false;
            if (newState.map) {
                newState.map.showActiveOverlays = false;
                newState.map.isFullscreen = false;
            }
            newState.page = null;

            // If a straatbeeld is loaded by it's location
            // then clear any active detail
            newState.detail = null;
            newState.dataSelection = null;

            return newState;
        }

        function initializeStraatbeeld (straatbeeld) {
            delete straatbeeld.isInvisible;

            straatbeeld.id = null;
            straatbeeld.location = null;

            straatbeeld.isInitial = true;

            straatbeeld.date = null;
            straatbeeld.hotspots = [];

            straatbeeld.heading = null;
            straatbeeld.pitch = null;
            straatbeeld.fov = null;

            straatbeeld.image = null;

            straatbeeld.isLoading = true;
        }

        /**
         * @param {Object} oldState
         * @param {Object} payload -  data from straatbeeld-api
         *
         * @returns {Object} newState
         */
        function showStraatbeeldReducer (oldState, payload) {
            var newState = angular.copy(oldState);

            // Straatbeeld can be null if another action gets triggered between FETCH_STRAATBEELD and SHOW_STRAATBEELD
            if (angular.isObject(newState.straatbeeld)) {
                delete newState.straatbeeld.isInvisible;

                newState.straatbeeld.id = payload.id || newState.straatbeeld.id;
                newState.straatbeeld.date = payload.date;

                newState.straatbeeld.pitch = oldState.straatbeeld.pitch || 0;
                newState.straatbeeld.fov = oldState.straatbeeld.fov || straatbeeldConfig.DEFAULT_FOV;
                if (angular.isArray(newState.straatbeeld.targetLocation)) {
                    // Point at the target location
                    newState.straatbeeld.heading = getHeadingDegrees(
                        payload.location,
                        newState.straatbeeld.targetLocation);
                } else if (!angular.isNumber(oldState.straatbeeld.heading)) {
                    // No heading is known, center map on new viewCenter
                    newState.map.viewCenter = payload.location;
                }

                newState.straatbeeld.hotspots = payload.hotspots;
                newState.straatbeeld.isLoading = false;
                newState.straatbeeld.location = payload.location;
                newState.straatbeeld.image = payload.image;
                newState.map.isLoading = false;
            }

            return newState;
        }

        function setOrientationReducer (oldState, payload) {
            var newState = angular.copy(oldState);

            newState.straatbeeld.heading = payload.heading;
            newState.straatbeeld.pitch = payload.pitch;
            newState.straatbeeld.fov = payload.fov;

            return newState;
        }

        function getHeadingDegrees ([x1, y1], [x2, y2]) {
            return Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
        }
    }
})();
