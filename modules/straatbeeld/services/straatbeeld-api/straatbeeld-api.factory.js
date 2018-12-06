(function () {
    'use strict';

    angular
        .module('dpStraatbeeld')
        .factory('straatbeeldApi', straatbeeldApiFactory);

    straatbeeldApiFactory.$inject = ['$q', 'STRAATBEELD_CONFIG', 'sharedConfig', 'geojson', 'api'];

    function straatbeeldApiFactory ($q, STRAATBEELD_CONFIG, sharedConfig, geojson, api) {
        const prefix = STRAATBEELD_CONFIG.STRAATBEELD_ENDPOINT_PREFIX;
        const suffix = STRAATBEELD_CONFIG.STRAATBEELD_ENDPOINT_SUFFIX;

        let cancel; // Promise to cancel any outstanding http requests

        return {
            getImageDataByLocation,
            getImageDataById
        };

        function getImageDataByLocation (location, history, key = 'panoramas') {
            if (!angular.isArray(location)) {
                return null;
            }
            const locationRange =
                `near=${location[1]},${location[0]}&srid=${STRAATBEELD_CONFIG.SRID}&newest_in_range=true`;
            const yearRange = (history.year)
                ? `mission_year=${history.year}&mission_type=${history.missionType}`
                : '';
            const radius = `radius=${STRAATBEELD_CONFIG.MAX_RADIUS}`;

            const q = $q.defer();
            const url = `${sharedConfig.API_ROOT}${prefix}/?${locationRange}&${yearRange}&${radius}`;
            api.getByUrl(url, undefined, cancel)
                .then((json) => json._embedded)
                .then((data) => (data && data[key]) ? data[key][0] : null)
                .then((item) => {
                    q.resolve(
                        getStraatbeeld(
                            `${item._links.adjacencies.href}?${yearRange}&newest_in_range=true`,
                            'adjacencies'
                        )
                    );
                })
                .finally(() => cancel = null);

            return q.promise;
        }

        function getImageDataById (id, history, key = 'adjacencies') {
            const yearRange = (history.year)
                ? `mission_year=${history.year}&mission_type=${history.missionType}`
                : 'newest_in_range=true';
            const radius = `radius=${STRAATBEELD_CONFIG.MAX_RADIUS}`;

            return getStraatbeeld(
                `${sharedConfig.API_ROOT}${prefix}/${id}/${suffix}/?${yearRange}&${radius}`,
                key
            );
        }

        function getStraatbeeld (url, key) {
            if (cancel) {
                // Cancel any outstanding requests
                cancel.resolve();
            }
            cancel = $q.defer();
            return api.getByUrl(url, undefined, cancel)
                .then((json) => json._embedded)
                .then((data) => (data) ? data[key] : null)
                .then(imageData)
                .finally(() => cancel = null);
        }

        function imageData (response) {
            const panorama = response && response[0];
            const adjacencies = response && response.filter((adjacency) => adjacency !== panorama);

            if (panorama && angular.isObject(panorama.geometry)) {
                const formattedGeometry = {
                    coordinates: [
                        panorama.geometry.coordinates[1],
                        panorama.geometry.coordinates[0]
                    ],
                    type: panorama.geometry.type
                };

                return {
                    date: new Date(panorama.timestamp),
                    id: panorama.pano_id,
                    hotspots: adjacencies.map(function (adjacency) {
                        return {
                            id: adjacency.pano_id,
                            heading: adjacency.direction,
                            distance: adjacency.distance,
                            year: parseInt(adjacency.timestamp.substring(0, 4))
                        };
                    }),
                    location: geojson.getCenter(formattedGeometry),
                    image: {
                        baseurl: panorama.cubic_img_baseurl,
                        pattern: panorama.cubic_img_pattern,
                        preview: panorama.cubic_img_preview
                    }
                };
            }
            return null;
        }
    }
})();
