(function () {
    'use strict';

    angular
        .module('dpShared')
        .factory('dpBaseCoder', dpBaseCoder);

    class BaseCoder {
        constructor (base) {
            this.CHARSET = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');

            if (this.isInt(base) && 2 <= base && base <= this.CHARSET.length) {
                this._base = base;
            } else {
                throw `BaseCoder: base ${base} not within 2 and ${this.CHARSET.length}`;
            }
        }

        isInt (n) {
            return angular.isNumber(n) && n % 1 === 0;
        }

        characterValue (c) {
            let i = this.CHARSET.indexOf(c);
            if (0 <= i && i < this._base) {
                return i;
            } else {
                throw `BaseCoder: illegal character ${c} for base ${this._base}`;
            }
        }

        precisionFactor (nDecimals) {
            if (this.isInt(nDecimals) && nDecimals !== 0) {
                if (nDecimals > 0) {
                    return Math.pow(10, nDecimals);
                } else {
                    throw `BaseCoder: negative decimals ${nDecimals} not allowed`;
                }
            } else {
                throw `BaseCoder: non integer decimals ${nDecimals} not allowed`;
            }
        }

        encodeNumber (n) {
            if (n >= this._base) {
                let quotient = Math.trunc(n / this._base);
                let remainder = n % this._base;
                return this.encodeNumber(quotient) +
                    this.encodeNumber(remainder);
            } else {
                return this.CHARSET[n];
            }
        }

        decodeString (s, len = s.length) {
            if (len > 1) {
                let quotient = s.substr(0, len - 1);
                let remainder = s.charAt(len - 1);
                return this._base *
                    this.decodeString(quotient, len - 1) +
                    this.decodeString(remainder, 1);
            } else {
                return this.characterValue(s);
            }
        }

        encodeFromString (expr, nDecimals = 0) {
            return this.encode(Number(expr), nDecimals);
        }

        encode (expr, nDecimals = 0) {
            if (angular.isNumber(expr)) {
                if (nDecimals === 0 && !this.isInt(expr)) {
                    return undefined;
                } else if (nDecimals !== 0) {
                    expr = Math.round(expr * this.precisionFactor(nDecimals));
                }
                let sign = '';
                if (expr < 0) {
                    sign = '-';
                    expr = -expr;
                }
                return sign + this.encodeNumber(expr);
            } else if (angular.isArray(expr)) {
                return expr.map(e => this.encode(e, nDecimals));
            }
        }

        decode (expr, nDecimals = 0) {
            if (angular.isString(expr)) {
                let sign = 1;
                if (expr.charAt(0) === '-') {
                    sign = -1;
                    expr = expr.substr(1);
                }
                let result = sign * this.decodeString(expr);
                if (nDecimals !== 0) {
                    result = Number((result / this.precisionFactor(nDecimals)).toFixed(nDecimals));
                }
                return result;
            } else if (angular.isArray(expr)) {
                return expr.map(e => this.decode(e, nDecimals));
            }
        }
    }

    function dpBaseCoder () {
        return {
            getCoderForBase
        };

        function getCoderForBase (base) {
            return new BaseCoder(base);
        }
    }
})();
