(function () {
    angular
        .module('dpMap')
        .directive('dpMap', dpMapDirective);

    dpMapDirective.$inject = [
        'L',
        'mapConfig',
        'layers',
        'highlight',
        'panning',
        'zoom',
        'variableWidth',
        'searchByClick'
    ];

    function dpMapDirective (L, mapConfig, layers, highlight, panning, zoom, variableWidth, searchByClick) {
        return {
            restrict: 'E',
            scope: {
                mapState: '=',
                markers: '='
            },
            templateUrl: 'modules/map/components/map/map.html',
            link: linkFunction
        };

        function linkFunction (scope, element) {
            var leafletMap,
                container,
                options;

            container = element[0].querySelector('.js-leaflet-map');
            options = angular.merge(mapConfig.MAP_OPTIONS, {
                center: scope.mapState.viewCenter,
                zoom: scope.mapState.zoom
            });

            leafletMap = L.map(container, options);

            panning.initialize(leafletMap);
            zoom.initialize(leafletMap);
            variableWidth.initialize(container, leafletMap);
            searchByClick.initialize(leafletMap);

            scope.$watch('mapState.viewCenter', function (viewCenter) {
                panning.panTo(leafletMap, viewCenter);
            });

            scope.$watch('mapState.zoom', function (zoomLevel) {
                zoom.setZoom(leafletMap, zoomLevel);
            });

            scope.$watch('mapState.baseLayer', function (baseLayer) {
                layers.setBaseLayer(leafletMap, baseLayer);
            });

            scope.$watch('mapState.overlays', function (newOverlays, oldOverlays) {
                getRemovedOverlays(newOverlays, oldOverlays).forEach(function (overlay) {
                    layers.removeOverlay(leafletMap, overlay);
                });
                getAddedOverlays(newOverlays, oldOverlays).forEach(function (overlay) {
                    layers.addOverlay(leafletMap, overlay);
                });
            });

            scope.$watch('markers', function (newCollection, oldCollection) {
                if (angular.equals(newCollection, oldCollection)) {
                    //Initialisation
                    newCollection.forEach(function (item) {
                        highlight.add(leafletMap, item);
                    });
                } else {
                    //Change detected
                    getRemovedGeojson(newCollection, oldCollection).forEach(function (item) {
                        highlight.remove(leafletMap, item);
                    });

                    getAddedGeojson(newCollection, oldCollection).forEach(function (item) {
                        highlight.add(leafletMap, item);
                    });
                }
            }, true);
        }

        function getAddedOverlays (newOverlays, oldOverlays) {
            if (newOverlays === oldOverlays) {
                //scope.$watch is triggered on initialization with the new value equal to the old value
                return Object.keys(newOverlays);
            } else {
                var keys = [];
                for (var key in newOverlays) {
                    if (newOverlays.hasOwnProperty(key) && !(key in oldOverlays)) {
                        keys.push(key);
                    }
                }
                return keys;
            }
        }

        function getRemovedOverlays (newOverlays, oldOverlays) {
            var keys = [];
            for (var key in oldOverlays) {
                if (oldOverlays.hasOwnProperty(key) && !(key in newOverlays)) {
                    keys.push(key);
                }
            }
            return keys;
        }

        function getAddedGeojson (newCollection, oldCollection) {
            return newCollection.filter(function (newItem) {
                var hasBeenAdded,
                    hasChanged,
                    linkedOldItems;

                linkedOldItems = oldCollection.filter(function (oldItem) {
                    return oldItem.id === newItem.id;
                });

                hasBeenAdded = linkedOldItems.length === 0;
                hasChanged = !angular.equals(linkedOldItems[0], newItem);

                return hasBeenAdded || hasChanged;
            });
        }

        function getRemovedGeojson (newCollection, oldCollection) {
            return oldCollection.filter(function (oldItem) {
                var hasBeenRemoved,
                    hasChanged,
                    linkedNewItems;

                linkedNewItems = newCollection.filter(function (newItem) {
                    return newItem.id === oldItem.id;
                });

                hasBeenRemoved = linkedNewItems.length === 0;
                hasChanged = !angular.equals(linkedNewItems[0], oldItem);

                return hasBeenRemoved || hasChanged;
            });
        }
    }
})();
