// import detailReducer from '../../../../src/reducers/details';
import MapLayersReducer from '../../../../src/map/ducks/layers/map-layers';

(function () {
    'use strict';

    angular
        .module('atlas')
        .factory('reducer', reducerFactory);

    reducerFactory.$inject = [
        '$window',
        'urlReducers',
        'freeze',
        'homeReducers',
        'layerSelectionReducers',
        'mapReducers',
        'pageReducers',
        'searchReducers',
        'straatbeeldReducers',
        'dataSelectionReducers',
        'printReducers',
        'embedReducers',
        'environment'
    ];

    // eslint-disable-next-line max-params
    function reducerFactory ($window,
                             urlReducers,
                             freeze,
                             homeReducers,
                             layerSelectionReducers,
                             mapReducers,
                             pageReducers,
                             searchReducers,
                             straatbeeldReducers,
                             dataSelectionReducers,
                             printReducers,
                             embedReducers,
                             environment) {
        return function (oldState, action) {
            // TODO: Redux: replace
            // Warning: angular.merge is deprecated
            // -- https://docs.angularjs.org/api/ng/function/angular.merge

            const detailReducers = {
                FETCH_DETAIL: $window.reducers.detailReducer,
                SHOW_DETAIL: $window.reducers.detailReducer
            };

            const mapLayersReducer = {
                FETCH_MAP_LAYERS_FAILURE: MapLayersReducer,
                FETCH_MAP_LAYERS_REQUEST: MapLayersReducer,
                FETCH_MAP_LAYERS_SUCCESS: MapLayersReducer
            };

            var actions = angular.merge(
                urlReducers,
                detailReducers,
                mapLayersReducer,
                homeReducers,
                layerSelectionReducers,
                mapReducers,
                pageReducers,
                searchReducers,
                straatbeeldReducers,
                dataSelectionReducers,
                printReducers,
                embedReducers,
                environment
            );

            if (detailReducers.hasOwnProperty(action.type.id)) {
                action.payload = {
                    payload: action.payload,
                    type: action.type.id
                };
            }

            if (mapLayersReducer.hasOwnProperty(action.type)) {
                return MapLayersReducer(oldState, action);
            }

            if (angular.isObject(action) &&
                angular.isObject(action.type) &&
                angular.isFunction(actions[action.type.id])) {
                const result = actions[action.type.id](oldState, action.payload);
                if (environment.isDevelopment()) {
                    freeze.deepFreeze(result);
                }
                return result;
            } else {
                // TODO: Redux: throw error
                return oldState;
            }
        };
    }
})();
