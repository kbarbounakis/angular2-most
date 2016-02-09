System.register("angular2-most/core",[], function(exports_1) {
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var CodedError, Args, Base64, TextUtils;
    return {
        setters:[],
        execute: function() {
            CodedError = (function (_super) {
                __extends(CodedError, _super);
                function CodedError(message, code) {
                    _super.call(this, message);
                    this.code = code;
                }
                return CodedError;
            })(Error);
            exports_1("CodedError", CodedError);
            Args = (function () {
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
            exports_1("Args", Args);
            Base64 = (function () {
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
            TextUtils = (function () {
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
            exports_1("TextUtils", TextUtils);
        }
    }
});
//# sourceMappingURL=core.js.map
/**
 * Created by kbarbounakis on 2/6/16.
 */
System.register("angular2-most/client", ["angular2-most/core", 'angular2/core', 'angular2/http', 'rxjs/add/operator/map'], function(exports_1) {
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1, core_2, http_1;
    var ClientDataService, ClientQueryExpression, ClientDataQueryable, ClientDataModel, ClientDataContext;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (core_2_1) {
                core_2 = core_2_1;
            },
            function (http_1_1) {
                http_1 = http_1_1;
            },
            function (_1) {}],
        execute: function() {
            ClientDataService = (function () {
                /**
                 * Initializes a new instance of ClientDataService class
                 * @param {string} base - The base URI of the MOST Web Framework Application Server. The default value is '/' for accessing local services.
                 */
                function ClientDataService(base, http) {
                    this.base_ = base || "/";
                    this.http_ = http;
                }
                /**
                 * Gets a string which represents the base URI of the MOST Web Framework Application Server associated with this data service.
                 * @returns {string}
                 */
                ClientDataService.prototype.getBase = function () {
                    return this.base_;
                };
                /**
                 * Get a string which represents the HTTP cookie header that is going to be used for requesting data.
                 * @returns {string}
                 */
                ClientDataService.prototype.getCookie = function () {
                    return this.cookie_;
                };
                /**
                 * Sets a string represents the HTTP cookie header that is going to be used for requesting data.
                 * @param value
                 * @returns {ClientDataService}
                 */
                ClientDataService.prototype.setCookie = function (value) {
                    this.cookie_ = value;
                    return this;
                };
                ClientDataService.prototype.execute = function (options) {
                    var self = this;
                    //options defaults
                    options.method = options.method || "GET";
                    options.headers = options.headers || {};
                    //set content type
                    options.headers["Content-Type"] = "application/json";
                    //set HTTP cookie
                    if (this.getCookie()) {
                        options.headers["Cookie"] = this.getCookie();
                    }
                    //validate options URL
                    core_1.Args.notNull(options.url, "Request URL");
                    //validate URL format
                    core_1.Args.check(!/^https?:\/\//i.test(options.url), "Request URL may not be an absolute URI");
                    //validate request method
                    core_1.Args.check(/^GET|POST|PUT|DELETE$/i.test(options.method), "Invalid request method. Expected GET, POST, PUT or DELETE.");
                    //set URL parameter
                    var url_ = self.getBase() + options.url.replace(/^\//i, "");
                    var requestOptions = {
                        method: options.method,
                        headers: options.headers,
                        search: null,
                        body: null
                    };
                    //if request is a GET HTTP Request
                    if (/^GET$/i.test(requestOptions.method)) {
                        //set data as query params
                        requestOptions.search = core_1.TextUtils.toSearch(options.data);
                    }
                    else {
                        //otherwise set HTTP Request body
                        requestOptions.body = JSON.stringify(options.data);
                    }
                    /**
                     * ANGULAR 2 BETA (withCredentials support)
                     */
                    //if (!this.withCredentials_) {
                    //    let _backend = this.http_["_backend"], _build = _backend._browserXHR.build;
                    //    _backend._browserXHR.build = () => {
                    //        let _xhr =  _build();
                    //        _xhr.withCredentials = true;
                    //        return _xhr;
                    //    };
                    //    this.withCredentials_ = true;
                    //}
                    /**
                     * ANGULAR 2 BETA
                     */
                    return this.http_.request(url_, requestOptions).map(function (res) {
                        if (res.status === 204) {
                            return;
                        }
                        else {
                            return JSON.parse(res.text(), function (key, value) {
                                if (core_1.TextUtils.isDate(value)) {
                                    return new Date(value);
                                }
                                return value;
                            });
                        }
                    });
                };
                return ClientDataService;
            })();
            exports_1("ClientDataService", ClientDataService);
            ClientQueryExpression = (function () {
                function ClientQueryExpression() {
                }
                return ClientQueryExpression;
            })();
            ClientDataQueryable = (function () {
                function ClientDataQueryable(model, service) {
                    core_1.Args.notEmpty(model, "Model");
                    this.model_ = model;
                    core_1.Args.notNull(service, "Data Service");
                    this.service_ = service;
                    this.url_ = core_1.TextUtils.format("/%s/index.json", this.model_);
                    //init params
                    this.params_ = {};
                    //init privates
                    this.privates_ = new ClientQueryExpression();
                }
                /**
                 * @returns {ClientDataServiceBase}
                 */
                ClientDataQueryable.prototype.getService = function () {
                    return this.service_;
                };
                /**
                 * @returns {DataServiceQueryParams}
                 */
                ClientDataQueryable.prototype.getParams = function () {
                    return this.params_;
                };
                /**
                 * Gets a string which represents the name of the data model associated with this object.
                 * @returns {string}
                 */
                ClientDataQueryable.prototype.getModel = function () {
                    return this.model_;
                };
                /**
                 * Gets a string which represents the relative URL associated with this object.
                 * @returns {string}
                 */
                ClientDataQueryable.prototype.getUrl = function () {
                    return this.url_;
                };
                /**
                 * Sets the relative URL associated with this object.
                 * @param value - A string which represents a relative URI.
                 */
                ClientDataQueryable.prototype.setUrl = function (value) {
                    core_1.Args.notEmpty(value, "URL");
                    core_1.Args.check(/^\//.test(value), "URL must be a relative URI");
                    this.url_ = value;
                };
                ClientDataQueryable.create = function (model, service) {
                    return new ClientDataQueryable(model, service);
                };
                ClientDataQueryable.prototype.append_ = function () {
                    core_1.Args.notNull(this.privates_.left, "Left operand");
                    core_1.Args.notNull(this.privates_.op, "Comparison operator");
                    var expr;
                    if (Array.isArray(this.privates_.right)) {
                        core_1.Args.check((this.privates_.op === "eq") || (this.privates_.op === "ne"), "Wrong operator. Expected equal or not equal");
                        core_1.Args.check(this.privates_.right.length > 0, "Array may not be empty");
                        var arr = this.privates_.right.map(function (x) {
                            return this.privates_.left + " " + this.privates_.op + " " + this.escape_(this.privates_.right);
                        });
                        if (this.privates_.op === "eq") {
                            expr = "(" + arr.join(" or ") + ")";
                        }
                        else {
                            expr = "(" + arr.join(" or ") + ")";
                        }
                    }
                    else {
                        expr = this.privates_.left + " " + this.privates_.op + " " + this.escape_(this.privates_.right);
                    }
                    this.privates_.lop = this.privates_.lop || "and";
                    if (core_1.TextUtils.isNotEmptyString(this.params_.$filter)) {
                        this.params_.$filter = this.params_.$filter + " " + this.privates_.lop + " " + expr;
                    }
                    else {
                        this.params_.$filter = expr;
                    }
                    //clear object
                    this.privates_.left = null;
                    this.privates_.op = null;
                    this.privates_.right = null;
                    return this;
                };
                ClientDataQueryable.prototype.escape_ = function (val) {
                    if ((val == null) || (val == undefined)) {
                        return "null";
                    }
                    if (val instanceof Boolean) {
                        return (val) ? "true" : "false";
                    }
                    if (val instanceof Number) {
                        return val + "";
                    }
                    if (val instanceof Date) {
                        var dt = new Date(val);
                        var year = dt.getFullYear();
                        var month = core_1.TextUtils.zeroPad(dt.getMonth() + 1, 2);
                        var day = core_1.TextUtils.zeroPad(dt.getDate(), 2);
                        var hour = core_1.TextUtils.zeroPad(dt.getHours(), 2);
                        var minute = core_1.TextUtils.zeroPad(dt.getMinutes(), 2);
                        var second = core_1.TextUtils.zeroPad(dt.getSeconds(), 2);
                        var millisecond = core_1.TextUtils.zeroPad(dt.getMilliseconds(), 3);
                        //format timezone
                        var offset = (new Date()).getTimezoneOffset(), timezone = (offset >= 0 ? '+' : '') + core_1.TextUtils.zeroPad(Math.floor(offset / 60), 2) + ':' + core_1.TextUtils.zeroPad(offset % 60, 2);
                        return "'" + year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second + '.' + millisecond + timezone + "'";
                    }
                    if (val instanceof Array) {
                        var values = [];
                        val.forEach(function (x) {
                            this.escape_(x);
                        });
                        return values.join(',');
                    }
                    if (typeof val === "string") {
                        var res = val.replace(/[\0\n\r\b\t\\'"\x1a]/g, function (s) {
                            switch (s) {
                                case "\0": return "\\0";
                                case "\n": return "\\n";
                                case "\r": return "\\r";
                                case "\b": return "\\b";
                                case "\t": return "\\t";
                                case "\x1a": return "\\Z";
                                default: return "\\" + s;
                            }
                        });
                        return "'" + res + "'";
                    }
                    //otherwise get valueOf
                    if (val.hasOwnProperty("$name"))
                        return val["$name"];
                    else
                        return this.escape_(val.valueOf());
                };
                ClientDataQueryable.prototype.where = function (name) {
                    core_1.Args.notEmpty(name, "Left operand");
                    this.privates_.left = name;
                    return this;
                };
                ClientDataQueryable.prototype.and = function (name) {
                    core_1.Args.notEmpty(name, "Left operand");
                    this.privates_.left = name;
                    this.privates_.lop = "and";
                    return this;
                };
                ClientDataQueryable.prototype.andAlso = function (name) {
                    core_1.Args.notEmpty(name, "Left operand");
                    this.privates_.left = name;
                    this.privates_.lop = "and";
                    if (!core_1.TextUtils.isNullOrUndefined(this.params_.$filter)) {
                        this.params_.$filter = "(" + this.params_.$filter + ")";
                    }
                    return this;
                };
                ClientDataQueryable.prototype.or = function (name) {
                    core_1.Args.notEmpty(name, "Left operand");
                    this.privates_.left = name;
                    this.privates_.lop = "or";
                    return this;
                };
                ClientDataQueryable.prototype.orElse = function (name) {
                    core_1.Args.notEmpty(name, "Left operand");
                    this.privates_.left = name;
                    this.privates_.lop = "or";
                    if (!core_1.TextUtils.isNullOrUndefined(this.params_.$filter)) {
                        this.params_.$filter = "(" + this.params_.$filter + ")";
                    }
                    return this;
                };
                ClientDataQueryable.prototype.compare_ = function (op, value) {
                    core_1.Args.notNull(this.privates_.left, "The left operand");
                    this.privates_.op = op;
                    this.privates_.right = value;
                    return this.append_();
                };
                ClientDataQueryable.prototype.equal = function (value) {
                    return this.compare_("eq", value);
                };
                ClientDataQueryable.prototype.notEqual = function (value) {
                    return this.compare_("ne", value);
                };
                ClientDataQueryable.prototype.greaterThan = function (value) {
                    return this.compare_("gt", value);
                };
                ClientDataQueryable.prototype.greaterOrEqual = function (value) {
                    return this.compare_("ge", value);
                };
                ClientDataQueryable.prototype.lowerThan = function (value) {
                    return this.compare_("lt", value);
                };
                ClientDataQueryable.prototype.lowerOrEqual = function (value) {
                    return this.compare_("le", value);
                };
                /**
                 * @param {*} value1
                 * @param {*} value2
                 * @returns {ClientDataQueryable}
                 */
                ClientDataQueryable.prototype.between = function (value1, value2) {
                    core_1.Args.notNull(this.privates_.left, "The left operand");
                    //generate new filter
                    var s = ClientDataQueryable.create(this.getModel())
                        .where(this.privates_.left).greaterOrEqual(value1)
                        .and(this.privates_.left).lowerOrEqual(value2).toFilter();
                    this.privates_.lop = this.privates_.lop || "and";
                    if (this.params_.$filter) {
                        this.params_.$filter = "(" + this.params_.$filter + ") " + this.privates_.lop + " (" + s + ")";
                    }
                    else {
                        this.params_.$filter = "(" + s + ")";
                    }
                    //clear object
                    this.privates_.left = null;
                    this.privates_.op = null;
                    this.privates_.right = null;
                    this.privates_.lop = null;
                    return this;
                };
                ClientDataQueryable.prototype.toFilter = function () {
                    return this.params_.$filter;
                };
                ClientDataQueryable.prototype.contains = function (value) {
                    core_1.Args.notNull(this.privates_.left, "The left operand");
                    this.privates_.op = 'ge';
                    this.privates_.left = core_1.TextUtils.format('indexof(%s,%s)', this.privates_.left, this.escape_(value));
                    this.privates_.right = 0;
                    return this.append_();
                };
                ClientDataQueryable.prototype.aggregate_ = function (fn) {
                    core_1.Args.notNull(this.privates_.left, "The left operand");
                    this.privates_.left = core_1.TextUtils.format('%s(%s)', fn, this.privates_.left);
                    return this;
                };
                ClientDataQueryable.prototype.getDate = function () {
                    return this.aggregate_("date");
                };
                ClientDataQueryable.prototype.getDay = function () {
                    return this.aggregate_("day");
                };
                ClientDataQueryable.prototype.getMonth = function () {
                    return this.aggregate_("month");
                };
                ClientDataQueryable.prototype.getYear = function () {
                    return this.aggregate_("year");
                };
                ClientDataQueryable.prototype.getFullYear = function () {
                    return this.aggregate_("year");
                };
                ClientDataQueryable.prototype.getHours = function () {
                    return this.aggregate_("hour");
                };
                ClientDataQueryable.prototype.getMinutes = function () {
                    return this.aggregate_("minute");
                };
                ClientDataQueryable.prototype.getSeconds = function () {
                    return this.aggregate_("second");
                };
                ClientDataQueryable.prototype.length = function () {
                    return this.aggregate_("length");
                };
                ClientDataQueryable.prototype.trim = function () {
                    return this.aggregate_("trim");
                };
                ClientDataQueryable.prototype.toLocaleLowerCase = function () {
                    return this.aggregate_("tolower");
                };
                ClientDataQueryable.prototype.toLowerCase = function () {
                    return this.aggregate_("tolower");
                };
                ClientDataQueryable.prototype.toLocaleUpperCase = function () {
                    return this.aggregate_("toupper");
                };
                ClientDataQueryable.prototype.toUpperCase = function () {
                    return this.aggregate_("toupper");
                };
                ClientDataQueryable.prototype.round = function () {
                    return this.aggregate_("round");
                };
                ClientDataQueryable.prototype.floor = function () {
                    return this.aggregate_("floor");
                };
                ClientDataQueryable.prototype.ceil = function () {
                    return this.aggregate_("ceiling");
                };
                ClientDataQueryable.prototype.indexOf = function (s) {
                    core_1.Args.notNull(this.privates_.left, "The left operand");
                    this.privates_.left = core_1.TextUtils.format('indexof(%s,%s)', this.privates_.left, this.escape_(s));
                    return this;
                };
                ClientDataQueryable.prototype.substr = function (pos, length) {
                    core_1.Args.notNull(this.privates_.left, "The left operand");
                    this.privates_.left = core_1.TextUtils.format('substring(%s,%s,%s)', this.privates_.left, pos, length);
                    return this;
                };
                ClientDataQueryable.prototype.startsWith = function (s) {
                    core_1.Args.notNull(this.privates_.left, "The left operand");
                    this.privates_.left = core_1.TextUtils.format('startswith(%s,%s)', this.privates_.left, this.escape_(s));
                    return this;
                };
                ClientDataQueryable.prototype.endsWith = function (s) {
                    core_1.Args.notNull(this.privates_.left, "The left operand");
                    this.privates_.left = core_1.TextUtils.format('endswith(%s,%s)', this.privates_.left, this.escape_(s));
                    return this;
                };
                ClientDataQueryable.prototype.select = function () {
                    var attr = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        attr[_i - 0] = arguments[_i];
                    }
                    core_1.Args.notNull(attr, "Attributes");
                    core_1.Args.check(attr.length == 0, "Attributes may not be empty");
                    var arr = [];
                    for (var i = 0; i < attr.length; i++) {
                        core_1.Args.check(typeof attr[i] === "string", "Invalid attribute. Expected string.");
                        arr.push(attr[i]);
                    }
                    this.params_.$select = arr.join(",");
                    return this;
                };
                ClientDataQueryable.prototype.groupBy = function () {
                    var attr = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        attr[_i - 0] = arguments[_i];
                    }
                    core_1.Args.notNull(attr, "Attributes");
                    core_1.Args.check(attr.length == 0, "Attributes may not be empty");
                    var arr = [];
                    for (var i = 0; i < attr.length; i++) {
                        core_1.Args.check(typeof attr[i] === "string", "Invalid attribute. Expected string.");
                        arr.push(attr[i]);
                    }
                    this.params_.$groupby = arr.join(",");
                    return this;
                };
                ClientDataQueryable.prototype.expand = function () {
                    var attr = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        attr[_i - 0] = arguments[_i];
                    }
                    core_1.Args.notNull(attr, "Attributes");
                    core_1.Args.check(attr.length == 0, "Attributes may not be empty");
                    var arr = [];
                    for (var i = 0; i < attr.length; i++) {
                        core_1.Args.check(typeof attr[i] === "string", "Invalid attribute. Expected string.");
                        arr.push(attr[i]);
                    }
                    this.params_.$groupby = arr.join(",");
                    return this;
                };
                ClientDataQueryable.prototype.orderBy = function (attr) {
                    core_1.Args.notEmpty(attr, "Order by attribute");
                    this.params_.$orderby = attr.toString();
                    return this;
                };
                ClientDataQueryable.prototype.thenBy = function (attr) {
                    core_1.Args.notEmpty(attr, "Order by attribute");
                    this.params_.$orderby += (this.params_.$orderby ? ',' + attr.toString() : attr.toString());
                    return this;
                };
                ClientDataQueryable.prototype.orderByDescending = function (attr) {
                    core_1.Args.notEmpty(attr, "Order by attribute");
                    this.params_.$orderby = attr.toString() + " desc";
                    return this;
                };
                ClientDataQueryable.prototype.thenByDescending = function (attr) {
                    core_1.Args.notEmpty(attr, "Order by attribute");
                    this.params_.$orderby += (this.params_.$orderby ? ',' + attr.toString() : attr.toString()) + " desc";
                    return this;
                };
                ClientDataQueryable.prototype.skip = function (num) {
                    this.params_.$skip = num;
                    return this;
                };
                ClientDataQueryable.prototype.take = function (num) {
                    this.params_.$top = num;
                    return this;
                };
                ClientDataQueryable.prototype.first = function () {
                    delete this.params_.$top;
                    delete this.params_.$skip;
                    delete this.params_.$inlinecount;
                    this.params_.$first = true;
                    return this.getService().execute({
                        method: "GET",
                        url: this.getUrl(),
                        data: this.params_,
                        headers: []
                    });
                };
                ClientDataQueryable.prototype.list = function () {
                    delete this.params_.$first;
                    this.params_.$inlinecount = true;
                    return this.getService().execute({
                        method: "GET",
                        url: this.getUrl(),
                        data: this.params_,
                        headers: []
                    });
                };
                ClientDataQueryable.prototype.item = function () {
                    return this.first();
                };
                ClientDataQueryable.prototype.items = function () {
                    delete this.params_.$first;
                    this.params_.$inlinecount = false;
                    return this.getService().execute({
                        method: "GET",
                        url: this.getUrl(),
                        data: this.params_,
                        headers: []
                    });
                };
                return ClientDataQueryable;
            })();
            exports_1("ClientDataQueryable", ClientDataQueryable);
            ClientDataModel = (function () {
                function ClientDataModel(name, service) {
                    this.name_ = name;
                    this.service_ = service;
                }
                /**
                 * @returns {ClientDataServiceBase}
                 */
                ClientDataModel.prototype.getService = function () {
                    return this.service_;
                };
                ClientDataModel.prototype.getName = function () {
                    return this.name_;
                };
                ClientDataModel.prototype.asQueryable = function () {
                    return ClientDataQueryable.create(this.getName(), this.service_);
                };
                ClientDataModel.prototype.where = function (attr) {
                    return this.asQueryable().where(attr);
                };
                ClientDataModel.prototype.select = function () {
                    var attr = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        attr[_i - 0] = arguments[_i];
                    }
                    var q = this.asQueryable();
                    return q.select.apply(q, attr);
                };
                ClientDataModel.prototype.skip = function (num) {
                    return this.asQueryable().skip(num);
                };
                ClientDataModel.prototype.take = function (num) {
                    return this.asQueryable().take(num);
                };
                ClientDataModel.prototype.save = function (obj) {
                    return this.getService().execute({ method: "POST", url: core_1.TextUtils.format("/%s/index.json", this.getName()), data: obj, headers: [] });
                };
                ClientDataModel.prototype.schema = function (obj) {
                    return this.getService().execute({ method: "GET", url: core_1.TextUtils.format("/%s/schema.json", this.getName()), data: null, headers: [] });
                };
                ClientDataModel.prototype.remove = function (obj) {
                    return this.getService().execute({ method: "DELETE", url: core_1.TextUtils.format("/%s/index.json", this.getName()), data: obj, headers: [] });
                };
                return ClientDataModel;
            })();
            exports_1("ClientDataModel", ClientDataModel);
            ClientDataContext = (function () {
                function ClientDataContext(http) {
                    this.http = http;
                    this.service_ = new ClientDataService(this.getBase(), http);
                }
                /**
                 * Gets a string which represents the base URL of the MOST Web Application Server.
                 * @returns {string}
                 */
                ClientDataContext.prototype.getBase = function () {
                    return this.base_ || "/";
                };
                /**
                 * Sets a string which represents the base URL of the MOST Web Application Server.
                 */
                ClientDataContext.prototype.setBase = function (value) {
                    core_1.Args.notEmpty(value, "Base URL");
                    this.base_ = value;
                };
                /**
                 * Gets the instance of ClientDataService class which is associated with this data context.
                 * @returns {ClientDataServiceBase}
                 */
                ClientDataContext.prototype.getService = function () {
                    return this.service_;
                };
                /**
                 * Gets an instance of ClientDataModel class
                 * @param name - A string which represents the name of the data model.
                 * @returns {ClientDataModel}
                 */
                ClientDataContext.prototype.model = function (name) {
                    core_1.Args.notEmpty(name, "Model name");
                    return new ClientDataModel(name, this.getService());
                };
                /**
                 * @param {string} username
                 * @param {string} password
                 * @returns {Observable}
                 */
                ClientDataContext.prototype.authenticate = function (username, password) {
                    return this.getService().execute({
                        method: "GET",
                        url: "/User/index.json",
                        data: {
                            $filter: "id eq me()"
                        },
                        headers: {
                            Authorization: "Basic " + core_1.TextUtils.toBase64(username + ":" + password)
                        }
                    });
                };
                ;
                ClientDataContext = __decorate([
                    core_2.Injectable(), 
                    __metadata('design:paramtypes', [http_1.Http])
                ], ClientDataContext);
                return ClientDataContext;
            })();
            exports_1("ClientDataContext", ClientDataContext);
        }
    }
});
//# sourceMappingURL=client.js.map