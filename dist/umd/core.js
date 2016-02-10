var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    var CodedError = (function (_super) {
        __extends(CodedError, _super);
        function CodedError(message, code) {
            _super.call(this, message);
            this.code = code;
        }
        return CodedError;
    })(Error);
    exports.CodedError = CodedError;
    var Args = (function () {
        function Args() {
        }
        Args.check = function (expr, message, code) {
            if (!expr) {
                throw new CodedError(message, code || "EARG");
            }
        };
        Args.notNull = function (obj, name) {
            Args.check((obj != null) && (obj !== undefined), name + " may not be null or undefined", "ENULL");
        };
        Args.notEmpty = function (obj, name) {
            Args.check((obj != null) && (obj !== undefined) && (obj.length > 0), name + " may not be empty", "ENULL");
        };
        return Args;
    })();
    exports.Args = Args;
    var Base64 = (function () {
        function Base64() {
            this.PADCHAR = '=';
            this.ALPHA = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
        }
        Base64.prototype.getByte = function (s, i) {
            var x = s.charCodeAt(i);
            return x;
        };
        Base64.prototype.getByte64 = function (s, i) {
            var idx = this.ALPHA.indexOf(s.charAt(i));
            return idx;
        };
        Base64.prototype.decode = function (s) {
            var pads = 0, i, b10, imax = s.length, x = [];
            s = String(s);
            if (imax === 0) {
                return s;
            }
            if (s.charAt(imax - 1) === this.PADCHAR) {
                pads = 1;
                if (s.charAt(imax - 2) === this.PADCHAR) {
                    pads = 2;
                }
                imax -= 4;
            }
            for (i = 0; i < imax; i += 4) {
                b10 = (this.getByte64(s, i) << 18) | (this.getByte64(s, i + 1) << 12) | (this.getByte64(s, i + 2) << 6) | this.getByte64(s, i + 3);
                x.push(String.fromCharCode(b10 >> 16, (b10 >> 8) & 255, b10 & 255));
            }
            switch (pads) {
                case 1:
                    b10 = (this.getByte64(s, i) << 18) | (this.getByte64(s, i + 1) << 12) | (this.getByte64(s, i + 2) << 6);
                    x.push(String.fromCharCode(b10 >> 16, (b10 >> 8) & 255));
                    break;
                case 2:
                    b10 = (this.getByte64(s, i) << 18) | (this.getByte64(s, i + 1) << 12);
                    x.push(String.fromCharCode(b10 >> 16));
                    break;
            }
            return x.join('');
        };
        Base64.prototype.encode = function (s) {
            s = String(s);
            var i, b10, x = [], imax = s.length - s.length % 3;
            if (s.length === 0) {
                return s;
            }
            for (i = 0; i < imax; i += 3) {
                b10 = (this.getByte(s, i) << 16) | (this.getByte(s, i + 1) << 8) | this.getByte(s, i + 2);
                x.push(this.ALPHA.charAt(b10 >> 18));
                x.push(this.ALPHA.charAt((b10 >> 12) & 63));
                x.push(this.ALPHA.charAt((b10 >> 6) & 63));
                x.push(this.ALPHA.charAt(b10 & 63));
            }
            switch (s.length - imax) {
                case 1:
                    b10 = this.getByte(s, i) << 16;
                    x.push(this.ALPHA.charAt(b10 >> 18) + this.ALPHA.charAt((b10 >> 12) & 63) + this.PADCHAR + this.PADCHAR);
                    break;
                case 2:
                    b10 = (this.getByte(s, i) << 16) | (this.getByte(s, i + 1) << 8);
                    x.push(this.ALPHA.charAt(b10 >> 18) + this.ALPHA.charAt((b10 >> 12) & 63) + this.ALPHA.charAt((b10 >> 6) & 63) + this.PADCHAR);
                    break;
            }
            return x.join('');
        };
        return Base64;
    })();
    var TextUtils = (function () {
        function TextUtils() {
        }
        TextUtils.isNotEmptyString = function (s) {
            return (s != null) && (s != undefined) && (s.length > 0);
        };
        TextUtils.isNullOrUndefined = function (s) {
            return (s != null) && (s != undefined);
        };
        TextUtils.zeroPad = function (num, length) {
            num = num || 0;
            var res = num.toString();
            while (res.length < length) {
                res = '0' + res;
            }
            return res;
        };
        TextUtils.isDate = function (s) {
            if (typeof s === "string") {
                return TextUtils.REG_DATETIME_ISO.test(s);
            }
            return false;
        };
        TextUtils.parseDate = function (s) {
            if (TextUtils.isDate(s)) {
                return new Date(s);
            }
            return;
        };
        TextUtils.toSearch = function (object) {
            var stack = [];
            var value;
            var key;
            if (Array.isArray(object)) {
                if (object.length == 0)
                    return encodeURIComponent(key) + '=';
            }
            for (key in object) {
                if (object.hasOwnProperty(key)) {
                    value = object[key];
                    if (typeof value === 'undefined' || value == null) {
                        value = encodeURIComponent(key) + '=';
                    }
                    else if (typeof (value) !== 'object') {
                        value = encodeURIComponent(key) + '=' + encodeURIComponent(value);
                    }
                    else {
                        value = TextUtils.toSearch(value);
                    }
                    stack.push(value);
                }
            }
            return stack.join('&');
        };
        /**
         * Encodes the given string to Base-64 format
         * @param {string} s - A string to encode
         * @returns {string}
         */
        TextUtils.toBase64 = function (s) {
            var cv = new Base64();
            return cv.encode(s);
        };
        /**
         * Decodes the given string from Base-64 format
         * @param {string} s - A base-64 encoded string
         * @returns {string}
         */
        TextUtils.fromBase64 = function (s) {
            var cv = new Base64();
            return cv.decode(s);
        };
        TextUtils.format = function (s) {
            var p = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                p[_i - 1] = arguments[_i];
            }
            var i = 0;
            return s.replace(/%[sdfj%]/g, function (x) {
                if (x === "%%")
                    return "%";
                if (i >= p.length)
                    return x;
                var p1 = p[i++];
                if (((p1 == null) && (p1 == undefined))) {
                    return "";
                }
                switch (x) {
                    case "%s":
                        return p1.toString();
                    case "%d":
                        return parseInt(p1);
                    case "%f":
                        return parseFloat(p1);
                    case "%j":
                        return JSON.stringify(p1);
                    default:
                        return x;
                }
            });
        };
        TextUtils.REG_DATETIME_ISO = /^(\d{4})(?:-?W(\d+)(?:-?(\d+)D?)?|(?:-(\d+))?-(\d+))(?:[T ](\d+):(\d+)(?::(\d+)(?:\.(\d+))?)?)?(?:Z(-?\d*))?([+-](\d+):(\d+))?$/;
        return TextUtils;
    })();
    exports.TextUtils = TextUtils;
});
//# sourceMappingURL=core.js.map