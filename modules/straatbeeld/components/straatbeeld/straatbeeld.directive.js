(function () {
    'use strict';

    angular
        .module('dpStraatbeeld')
        .directive('dpStraatbeeld', dpStraatbeeldDirective);

    dpStraatbeeldDirective.$inject = ['$rootScope', 'store', 'ACTIONS', 'marzipanoService', 'earthmine', 'orientation'];

    function dpStraatbeeldDirective ($rootScope, store, ACTIONS, marzipanoService, earthmine, orientation) {
        return {
            restrict: 'E',
            scope: {
                state: '=',
                isPrintMode: '='
            },
            templateUrl: 'modules/straatbeeld/components/straatbeeld/straatbeeld.html',
            link: linkFunction
        };

        function linkFunction (scope, element) {
            var container,
                viewer;

            container = element[0].querySelector('.js-marzipano-viewer');
            viewer = marzipanoService.initialize(container);
            console.log('scope in dir', scope);
            
            scope.updateOrientation = function () {
                if (!scope.state.isLoading) {
                    orientation.update(viewer, scope.state.heading);
                }
            };

            //Fetch scene
            scope.$watch('state.id', function (id) {
                if (angular.isString(id)) {
                    earthmine.getImageDataById(id).then(function (earthmineData) {
                         console.log('earthmindData in directive', earthmineData);
                         marzipanoService.loadScene(
                             earthmineData['pano_id'],
                             earthmineData.images.equirectangular,
                             earthmineData.heading,
                             []
                           
                        );
                        if (scope.state.isInitial) {
                            store.dispatch({
                                type: ACTIONS.SHOW_STRAATBEELD_INITIAL,
                                payload: earthmineData
                            });
                        } else {
                            store.dispatch({
                                type: ACTIONS.SHOW_STRAATBEELD_SUBSEQUENT,
                                payload: earthmineData
                            });
                        }
                       
                    });
                }
            });

           

            //Re-render the Marzipano viewer if the size changes (through an added parent CSS class)
            scope.$watch('isPrintMode', function () {
                $rootScope.$applyAsync(function () {
                    viewer.updateSize();
                });
            });
        }
    }
})();
