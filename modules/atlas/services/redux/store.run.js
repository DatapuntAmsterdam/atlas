import stateUrlConverter from '../../../../src/shared/services/routing/state-url-converter';

import rootReducerInit from '../../../../src/reducers/root';

(function () {
    angular
        .module('atlas')
        .run(runBlock);

    runBlock.$inject = [
        '$timeout',
        '$rootScope',
        'applicationState',
        'freeze',
        'contextMiddleware',
        'stateToUrlMiddleware',
        'environment'
    ];

    function runBlock (
            $timeout,
            $rootScope,
            applicationState,
            freeze,
            contextMiddleware,
            stateToUrlMiddleware,
            environment) {
        const urlDefaultState = stateUrlConverter.getDefaultState();
        const initialState = environment.isDevelopment() ? freeze.deepFreeze(urlDefaultState) : urlDefaultState;

        const rootReducer = rootReducerInit($timeout, $rootScope);

        applicationState.initialize(
            rootReducer,
            initialState,
            contextMiddleware,
            stateToUrlMiddleware);
    }
})();
