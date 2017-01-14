(function () {
    'use strict';

    angular
        .module('atlas')
        .factory('stateUrlConverter', stateUrlConverterFactory);

    stateUrlConverterFactory.$inject = ['STATE_URL_CONVERSION', 'dpBaseCoder'];

    function stateUrlConverterFactory (STATE_URL_CONVERSION, dpBaseCoder) {
        const URL_ARRAY_SEPARATOR = ':';    // Choose any of -._~:[]@!$'()*+,;`.
        const ARRAY_DENOTATOR = '[]';
        const MAIN_STATE = 'MAIN_STATE';
        const BOOLEAN_TRUE = 'T';
        const BOOLEAN_FALSE = 'F';
        const TYPENAME = {
            STRING: /^string$/,
            BOOLEAN: /^boolean$/,
            NUMBER: /^number$/,
            BASE62: /^base62$/,
            ARRAY: /\[\]$/
        };

        let base62Coder = dpBaseCoder.getCoderForBase(62);

        const DEFAULT_STATE = params2state({}, {});

        return {
            state2params,
            params2state,
            DEFAULT_STATE
        };

        function createObject (oldObj, key, params) {
            // create a state object by using its initial value (default {}) and pre method if defined
            let initialValues = STATE_URL_CONVERSION.initialValues,
                initialValue = initialValues[key] || {},
                pre = STATE_URL_CONVERSION.pre[key];

            let newObj = angular.copy(initialValue);
            if (angular.isFunction(pre)) {
                newObj = pre(oldObj, newObj, params, initialValues);
            }
            return newObj;
        }

        function getFullKey (key) {
            // decompose 'map.viewCenter' in {mainKey: 'map', subKey: 'viewCenter'}
            // or 'isPrintmode' in {mainKey: 'isPrintmode'}
            let dot = key.indexOf('.');
            if (dot >= 0) {
                return {
                    mainKey: key.substr(0, dot),
                    subKey: key.substr(dot + 1)
                };
            } else {
                return {
                    mainKey: key
                };
            }
        }

        function getNumberValue (n, precision) {
            // eg return 10.1 for 10.123
            return precision === null ? n : dpBaseCoder.toPrecision(n, precision);
        }

        function getValueForKey (obj, key) {
            // return 9 for obj={map: {zoom: 9}} and key = 'map.zoom', null when no value available
            let {mainKey, subKey} = getFullKey(key);
            if (subKey) {
                return angular.isObject(obj[mainKey]) ? getValueForKey(obj[mainKey], subKey) : null;
            } else {
                return obj[mainKey] || null;
            }
        }

        function setValueForKey (obj, oldObj, key, value) {
            // set obj:{map: {zoom: 9}} to {map: {zoom: 8}} for key 'map.zoom' and value 8
            // the old object is used for createObject() in case of any pre method for the state object
            let {mainKey, subKey} = getFullKey(key);
            if (subKey) {
                obj[mainKey] = obj[mainKey] || createObject(oldObj[mainKey], mainKey);
                setValueForKey(obj[mainKey], oldObj[mainKey] || {}, subKey, value);
            } else {
                obj[mainKey] = value;
            }
        }

        function asUrlValue (value, typeName, precision = null, separator = URL_ARRAY_SEPARATOR) {
            // returns the value as a valid url value (URI-encoded string representation)
            let urlValue = '';

            if (typeName.match(TYPENAME.STRING)) {
                urlValue = value;
            } else if (typeName.match(TYPENAME.NUMBER)) {
                urlValue = getNumberValue(value, precision);
            } else if (typeName.match(TYPENAME.BASE62)) {
                urlValue = base62Coder.encode(value, precision);
            } else if (typeName.match(TYPENAME.BOOLEAN)) {
                urlValue = value ? BOOLEAN_TRUE : BOOLEAN_FALSE;
            } else if (typeName.match(TYPENAME.ARRAY)) {
                let baseType = typeName.substr(0, typeName.length - ARRAY_DENOTATOR.length);
                urlValue = value
                    .map(v => asUrlValue(v, baseType, precision, separator + URL_ARRAY_SEPARATOR))
                    .join(separator);
            }

            return encodeURI(urlValue.toString());
        }

        function asStateValue (decodedValue, typeName, precision = null, separator = URL_ARRAY_SEPARATOR) {
            // returns the value as a state value by using the URI-decoded string representation
            let value = decodeURI(decodedValue);
            let stateValue = null;

            if (typeName.match(TYPENAME.STRING)) {
                stateValue = value;
            } else if (typeName.match(TYPENAME.NUMBER)) {
                stateValue = getNumberValue(Number(value), precision);
            } else if (typeName.match(TYPENAME.BASE62)) {
                stateValue = base62Coder.decode(value, precision);
            } else if (typeName.match(TYPENAME.BOOLEAN)) {
                stateValue = value === BOOLEAN_TRUE;
            } else if (typeName.match(TYPENAME.ARRAY)) {
                let baseType = typeName.substr(0, typeName.length - ARRAY_DENOTATOR.length);
                // Split the array, replace the split char by a tmp split char because org split char can repeat
                const TMP_SPLIT_CHAR = '|';
                let surroundBy = '([^' + URL_ARRAY_SEPARATOR + '])';
                let splitOn = new RegExp(surroundBy + separator + surroundBy, 'g');
                value = value.replace(splitOn, '$1' + TMP_SPLIT_CHAR + '$2');
                stateValue = value
                    .split(TMP_SPLIT_CHAR)
                    .map(v => asStateValue(v, baseType, precision, separator + URL_ARRAY_SEPARATOR));
            }

            return stateValue;
        }

        function state2params (state) {
            // Converts a state to a params object that is stored in the url
            return Object.keys(STATE_URL_CONVERSION.stateVariables).reduce((result, key) => {
                let attribute = STATE_URL_CONVERSION.stateVariables[key];
                let value = getValueForKey(state, attribute.name);
                if (value !== null) {
                    // store value in url
                    if (angular.isFunction(attribute.getValue)) {
                        value = attribute.getValue(value);
                    }
                    value = asUrlValue(value, attribute.type, attribute.precision);
                    if (value) {
                        result[key] = value;
                    }
                }
                return result;
            }, {});
        }

        function params2state (oldState, params) {
            // Converts a params object (payload or url value) to a new state object
            let newState = createObject (oldState, MAIN_STATE, params);

            newState = Object.keys(STATE_URL_CONVERSION.stateVariables).reduce((result, key) => {
                let attribute = STATE_URL_CONVERSION.stateVariables[key];
                let value = params[key];
                if (angular.isDefined(value)) {
                    // store value in state
                    value = asStateValue(value, attribute.type, attribute.precision);
                    if (angular.isFunction(attribute.setValue)) {
                        value = attribute.setValue(value);
                    }
                    if (value !== null) {
                        setValueForKey(result, oldState, attribute.name, value);
                    }
                }
                return result;
            }, newState);

            // Set any missing state objects to null
            Object.keys(STATE_URL_CONVERSION.initialValues).forEach(key => {
                if (key !== MAIN_STATE && !angular.isObject(newState[key])) {
                    newState[key] = null;
                }
            });

            // Execute the post processing methods
            Object.keys(STATE_URL_CONVERSION.post).forEach(key => {
                if (angular.isObject(newState[key])) {
                    STATE_URL_CONVERSION.post[key](oldState[key], newState[key]);
                }
            });

            return newState;
        }
    }
})();
