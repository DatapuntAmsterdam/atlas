import removeMd from 'remove-markdown';

import { getSelectedLocation } from '../../../../src/map/ducks/map/map-selectors';
import { DETAIL_FULLSCREEN, SHOW_DETAIL } from '../../../../src/shared/ducks/detail/detail';

(function () {
    angular
        .module('dpDetail')
        .component('dpDetail', {
            bindings: {
                endpoint: '@',
                reload: '=',
                isLoading: '=',
                skippedSearchResults: '=',
                catalogFilters: '=',
                user: '<'
            },
            templateUrl: 'modules/detail/components/detail/detail.html',
            controller: DpDetailController,
            controllerAs: 'vm'
        });

    DpDetailController.$inject = [
        '$scope',
        'store',
        'api',
        'endpointParser',
        'geometry',
        'geojson',
        'crsConverter',
        'dataFormatter',
        'markdownParser'
    ];

    /* eslint-disable max-params */
    function DpDetailController (
        $scope,
        store,
        api,
        endpointParser,
        geometry,
        geojson,
        crsConverter,
        dataFormatter,
        markdownParser
    ) {
        /* eslint-enable max-params */
        var vm = this;

        // Reload the data when the reload flag has been set (endpoint has not
        // changed)
        $scope.$watch('vm.reload', reload => {
            if (reload) {
                getData(vm.endpoint);
            }
        });

        // (Re)load the data when the endpoint is set or gets changed
        $scope.$watch('vm.endpoint', getData);

        // Ensure the catalog filters for dcatd endpoints
        $scope.$watch('vm.catalogFilters', () => {
            if (vm.catalogFilters) {
                getData(vm.endpoint);
            }
        });

        // (Re)load the data when the user logs in or out or on a change of authorization level
        $scope.$watch('vm.user.scopes', (newValue, oldValue) => {
            if (newValue !== oldValue) {
                getData(vm.endpoint);
            }
        });

        vm.stripMarkdown = (val) => removeMd(val);

        function getData (endpoint) {
            vm.location = null;

            vm.includeSrc = endpointParser.getTemplateUrl(endpoint);

            const location = getSelectedLocation(store.getState());

            vm.geosearchButton = vm.skippedSearchResults ? [location.latitude, location.longitude] : false;

            const [category, subject] = endpointParser.getParts(endpoint);

            if ((category === 'brk' && subject === 'subject' && !vm.user.scopes.includes('BRK/RS')) ||
                (category === 'handelsregister' && !vm.user.scopes.includes('HR/R')) ||
                (category === 'grondexploitatie' && !vm.user.scopes.includes('GREX/R'))
            ) {
                // User is not authorized to view
                //   BRK Kadastrale Subjecten, nor
                //   handelsregister, nor
                //   grondexploitatie
                // so do not fetch data
                delete vm.apiData;
                errorHandler();
            } else if (category === 'dcatd' && subject === 'datasets' && !vm.catalogFilters) {
                // The catalogFilters data is not present so do not fetch data
                delete vm.apiData;
                errorHandler();
            } else {
                const endpointVersion = category === 'grondexploitatie' ? '?version=3' : '';
                api.getByUrl(`${endpoint}${endpointVersion}`).then(function (data) {
                    data = dataFormatter.formatData(data, subject, vm.catalogFilters);

                    if (category === 'dcatd' && subject === 'datasets') {
                        const fields = ['dct:description', 'overheid:grondslag', 'overheidds:doel'];
                        const markdownFields = fields.reduce((acc, field) => {
                            if (data[field]) {
                                acc[field] = markdownParser.parse(data[field]);
                            }
                            return acc;
                        }, {});

                        data = { ...data, ...markdownFields };

                        data.canEditDataset = vm.user.scopes.includes('CAT/W');
                    }

                    vm.apiData = {
                        results: data
                    };

                    vm.filterSelection = {
                        [subject]: vm.apiData.results.naam
                    };

                    geometry.getGeoJSON(endpoint).then(function (geoJSON) {
                        if (geoJSON !== null) {
                            const rd = geojson.getCenter(geoJSON);
                            vm.location = crsConverter.rdToWgs84([rd.x, rd.y]);
                        }

                        if (!vm.skippedSearchResults) {
                            store.dispatch({
                                type: DETAIL_FULLSCREEN,
                                payload: subject === 'api' || !geoJSON
                            });
                        }

                        store.dispatch({
                            type: SHOW_DETAIL,
                            payload: {
                                display: data._display,
                                geometry: geoJSON
                            }
                        });
                    }, errorHandler);
                }, errorHandler);
            }
        }

        function errorHandler () {
            store.dispatch({
                type: SHOW_DETAIL,
                payload: {}
            });
        }
    }
})();
