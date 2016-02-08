var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "./core", "./core", 'angular2/core', 'rxjs/add/operator/map'], function (require, exports, core_1, core_2, core_3) {
    var ClientDataService = (function () {
        function ClientDataService(base, http) {
            this.base_ = base || "/";
            this.http_ = http;
        }
        ClientDataService.prototype.getBase = function () {
            return this.base_;
        };
        ClientDataService.prototype.getCookie = function () {
            return this.cookie_;
        };
        ClientDataService.prototype.setCookie = function (value) {
            this.cookie_ = value;
            return this;
        };
        ClientDataService.prototype.execute = function (options) {
            var self = this;
            options.method = options.method || "GET";
            options.headers = options.headers || {};
            options.headers["Content-Type"] = "application/json";
            if (this.getCookie()) {
                options.headers["Cookie"] = this.getCookie();
            }
            core_1.Args.notNull(options.url, "Request URL");
            core_1.Args.check(!/^https?:\/\//i.test(options.url), "Request URL may not be an absolute URI");
            core_1.Args.check(/^GET|POST|PUT|DELETE$/i.test(options.method), "Invalid request method. Expected GET, POST, PUT or DELETE.");
            var url_ = self.getBase() + options.url.replace(/^\//i, "");
            var requestOptions = {
                method: options.method,
                headers: options.headers,
                search: null,
                body: null
            };
            if (/^GET$/i.test(requestOptions.method)) {
                requestOptions.search = core_2.TextUtils.toSearch(options.data);
            }
            else {
                requestOptions.body = JSON.stringify(options.data);
            }
            return this.http_.request(url_, requestOptions).map(function (res) {
                if (res.status === 204) {
                    return;
                }
                else {
                    return JSON.parse(res.text(), function (key, value) {
                        if (core_2.TextUtils.isDate(value)) {
                            return new Date(value);
                        }
                        return value;
                    });
                }
            });
        };
        return ClientDataService;
    })();
    exports.ClientDataService = ClientDataService;
    var ClientQueryExpression = (function () {
        function ClientQueryExpression() {
        }
        return ClientQueryExpression;
    })();
    var ClientDataQueryable = (function () {
        function ClientDataQueryable(model, service) {
            core_1.Args.notEmpty(model, "Model");
            this.model_ = model;
            core_1.Args.notNull(service, "Data Service");
            this.service_ = service;
            this.url_ = core_2.TextUtils.format("/%s/index.json", this.model_);
            this.params_ = {};
            this.privates_ = new ClientQueryExpression();
        }
        ClientDataQueryable.prototype.getService = function () {
            return this.service_;
        };
        ClientDataQueryable.prototype.getParams = function () {
            return this.params_;
        };
        ClientDataQueryable.prototype.getModel = function () {
            return this.model_;
        };
        ClientDataQueryable.prototype.getUrl = function () {
            return this.url_;
        };
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
            if (core_2.TextUtils.isNotEmptyString(this.params_.$filter)) {
                this.params_.$filter = this.params_.$filter + " " + this.privates_.lop + " " + expr;
            }
            else {
                this.params_.$filter = expr;
            }
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
                var month = core_2.TextUtils.zeroPad(dt.getMonth() + 1, 2);
                var day = core_2.TextUtils.zeroPad(dt.getDate(), 2);
                var hour = core_2.TextUtils.zeroPad(dt.getHours(), 2);
                var minute = core_2.TextUtils.zeroPad(dt.getMinutes(), 2);
                var second = core_2.TextUtils.zeroPad(dt.getSeconds(), 2);
                var millisecond = core_2.TextUtils.zeroPad(dt.getMilliseconds(), 3);
                var offset = (new Date()).getTimezoneOffset(), timezone = (offset >= 0 ? '+' : '') + core_2.TextUtils.zeroPad(Math.floor(offset / 60), 2) + ':' + core_2.TextUtils.zeroPad(offset % 60, 2);
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
            if (!core_2.TextUtils.isNullOrUndefined(this.params_.$filter)) {
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
            if (!core_2.TextUtils.isNullOrUndefined(this.params_.$filter)) {
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
        ClientDataQueryable.prototype.between = function (value1, value2) {
            core_1.Args.notNull(this.privates_.left, "The left operand");
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
            this.privates_.left = core_2.TextUtils.format('indexof(%s,%s)', this.privates_.left, this.escape_(value));
            this.privates_.right = 0;
            return this.append_();
        };
        ClientDataQueryable.prototype.aggregate_ = function (fn) {
            core_1.Args.notNull(this.privates_.left, "The left operand");
            this.privates_.left = core_2.TextUtils.format('%s(%s)', fn, this.privates_.left);
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
            this.privates_.left = core_2.TextUtils.format('indexof(%s,%s)', this.privates_.left, this.escape_(s));
            return this;
        };
        ClientDataQueryable.prototype.substr = function (pos, length) {
            core_1.Args.notNull(this.privates_.left, "The left operand");
            this.privates_.left = core_2.TextUtils.format('substring(%s,%s,%s)', this.privates_.left, pos, length);
            return this;
        };
        ClientDataQueryable.prototype.startsWith = function (s) {
            core_1.Args.notNull(this.privates_.left, "The left operand");
            this.privates_.left = core_2.TextUtils.format('startswith(%s,%s)', this.privates_.left, this.escape_(s));
            return this;
        };
        ClientDataQueryable.prototype.endsWith = function (s) {
            core_1.Args.notNull(this.privates_.left, "The left operand");
            this.privates_.left = core_2.TextUtils.format('endswith(%s,%s)', this.privates_.left, this.escape_(s));
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
    exports.ClientDataQueryable = ClientDataQueryable;
    var ClientDataModel = (function () {
        function ClientDataModel(name, service) {
            this.name_ = name;
            this.service_ = service;
        }
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
        ClientDataModel.prototype.save = function (obj) {
            return this.getService().execute({ method: "POST", url: core_2.TextUtils.format("/%s/index.json", this.getName()), data: obj, headers: [] });
        };
        ClientDataModel.prototype.schema = function (obj) {
            return this.getService().execute({ method: "GET", url: core_2.TextUtils.format("/%s/schema.json", this.getName()), data: null, headers: [] });
        };
        ClientDataModel.prototype.remove = function (obj) {
            return this.getService().execute({ method: "DELETE", url: core_2.TextUtils.format("/%s/index.json", this.getName()), data: obj, headers: [] });
        };
        return ClientDataModel;
    })();
    exports.ClientDataModel = ClientDataModel;
    var ClientDataContext = (function () {
        function ClientDataContext(http) {
            this.http = http;
            this.service_ = new ClientDataService(this.getBase(), http);
        }
        ClientDataContext.prototype.getBase = function () {
            return this.base_ || "/";
        };
        ClientDataContext.prototype.setBase = function (value) {
            core_1.Args.notEmpty(value, "Base URL");
            this.base_ = value;
        };
        ClientDataContext.prototype.getService = function () {
            return this.service_;
        };
        ClientDataContext.prototype.model = function (name) {
            core_1.Args.notEmpty(name, "Model name");
            return new ClientDataModel(name, this.getService());
        };
        ClientDataContext.prototype.authenticate = function (username, password) {
            return this.getService().execute({
                method: "GET",
                url: "/User/index.json",
                data: {
                    $filter: "id eq me()"
                },
                headers: {
                    Authorization: "Basic " + core_2.TextUtils.toBase64(username + ":" + password)
                }
            });
        };
        ;
        ClientDataContext = __decorate([
            core_3.Injectable()
        ], ClientDataContext);
        return ClientDataContext;
    })();
    exports.ClientDataContext = ClientDataContext;
});
//# sourceMappingURL=client.js.map