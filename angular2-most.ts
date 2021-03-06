/**
 * MOST Web Framework
 * A JavaScript Web Framework
 * http://themost.io
 * Created by Kyriakos Barbounakis<k.barbounakis@gmail.com> on 2016-01-29.
 *
 * Copyright (c) 2014, Kyriakos Barbounakis k.barbounakis@gmail.com
 Anthi Oikonomou anthioikonomou@gmail.com
 All rights reserved.
 Redistribution and use in source and binary forms, with or without
 modification, are permitted provided that the following conditions are met:
 * Redistributions of source code must retain the above copyright notice, this
 list of conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright notice,
 this list of conditions and the following disclaimer in the documentation
 and/or other materials provided with the distribution.
 * Neither the name of MOST Web Framework nor the names of its
 contributors may be used to endorse or promote products derived from
 this software without specific prior written permission.
 THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
 FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
 CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
 OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

/**
 * Angular 2 imports (beta)
 */
import {Injectable, EventEmitter, Component, Inject} from '@angular/core';
import {Http, Response} from '@angular/http';
import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/map';

export class CodedError extends Error {
    constructor(message:string, public code:string) {
        super(message);
    }
}

export class Args {

    static check(expr:boolean, message:string, code?:string):void {
        if (!expr) {
            throw new CodedError(message, code || "EARG");
        }
    }

    static notNull(obj:any, name):void {
        Args.check((obj != null) && (obj !== undefined), name + " may not be null or undefined", "ENULL");
    }

    static notEmpty(obj:string, name):void {
        Args.check((obj != null) && (obj !== undefined) && (obj.length > 0), name + " may not be empty", "ENULL");
    }

    static notNegative(obj:number, name):void {
        Args.check((typeof obj === 'number'), name + " may be a number", "ENUMBER");
        Args.check((obj>=0), name + " may not be negative", "ENUMBER");
    }

    static Positive(obj:number, name):void {
        Args.check((typeof obj === 'number'), name + " may be a number", "ENUMBER");
        Args.check((obj>0), name + " must be a positive number", "ENUMBER");
    }


}

class Base64 {
    private PADCHAR:string = '=';
    private ALPHA:string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

    private getByte(s:string, i:number):number {
        const x = s.charCodeAt(i);
        return x;
    }

    private getByte64(s:string, i:number):number {
        const idx = this.ALPHA.indexOf(s.charAt(i));
        return idx;
    }

    public decode(s:string):string {
        let pads = 0,
            i, b10, imax = s.length,
            x = [];

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
    }

    public encode(s:string):string {
        s = String(s);

        let i, b10, x = [],
            imax = s.length - s.length % 3;

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
    }

}

export class TextUtils {

    static isNotEmptyString(s:string):boolean {
        return (s != null) && (s != undefined) && (s.length > 0);
    }

    static isNullOrUndefined(s:string):boolean {
        return (s != null) && (s != undefined);
    }

    static zeroPad(num:number, length:number):string {
        num = num || 0;
        var res = num.toString();
        while (res.length < length) {
            res = '0' + res;
        }
        return res;
    }

    private static REG_DATETIME_ISO = /^(\d{4})(?:-?W(\d+)(?:-?(\d+)D?)?|(?:-(\d+))?-(\d+))(?:[T ](\d+):(\d+)(?::(\d+)(?:\.(\d+))?)?)?(?:Z(-?\d*))?([+-](\d+):(\d+))?$/;

    static isDate(s:string):boolean {
        if (typeof s === "string") {
            return TextUtils.REG_DATETIME_ISO.test(s);
        }
        return false;
    }

    static parseDate(s:string):Date {
        if (TextUtils.isDate(s)) {
            return new Date(s);
        }
        return;
    }

    static toSearch(object:any):string {
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
                } else if (typeof( value ) !== 'object') {
                    value = encodeURIComponent(key) + '=' + encodeURIComponent(value);
                } else {
                    value = TextUtils.toSearch(value);
                }
                stack.push(value);
            }
        }
        return stack.join('&');
    }

    /**
     * Encodes the given string to Base-64 format
     * @param {string} s - A string to encode
     * @returns {string}
     */
    static toBase64(s:string):string {
        var cv = new Base64();
        return cv.encode(s);
    }

    /**
     * Decodes the given string from Base-64 format
     * @param {string} s - A base-64 encoded string
     * @returns {string}
     */
    static fromBase64(s:string):string {
        var cv = new Base64();
        return cv.decode(s);
    }

    static format(s:string, ...p:any[]):string {
        var i = 0;
        return s.replace(/%[sdfj%]/g, function (x) {
            if (x === "%%") return "%";
            if (i >= p.length) return x;
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
    }
}

export interface DataServiceQueryParams {
    $filter:string;
    $groupby:string;
    $select:string;
    $orderby:string;
    $inlinecount:boolean;
    $top:number;
    $skip:number;
    $first:boolean;
    $levels:number;
}

export interface DataServiceExecuteOptions {
    method:string;
    url:string;
    data:any;
    headers:any;
}

export interface ClientDataServiceBase {
    /**
     * Gets a string which represents the base URL of the MOST Web application server
     */
    getBase():string
    /**
     * Get a string which represents the HTTP cookie header that is going to used for authenticating requests.
     */
    getCookie():string
    /**
     * Sets a string which represents the HTTP cookie header that is going to used for authenticating requests.
     * @param {string} value
     */
    setCookie(value:string)
    /**
     * Executes an HTTP request against the defined MOST Web application server
     * @param {DataServiceExecuteOptions} options
     */
    execute(options:DataServiceExecuteOptions):any
}

export interface ClientDataContextBase {
    /**
     * Gets a string which represents the base URL of the MOST Web application server
     */
    getBase():string,
    /**
     * Sets a string which represents the base URL of the MOST Web application server
     * @param {string} value - The base URL
     */
    setBase(value:string),
    /**
     * Gets the instance of ClientDataServiceBase class which is associated with this data context
     */
    getService():ClientDataServiceBase
}

export class ClientDataService implements ClientDataServiceBase {

    private base_:string;
    private http_:Http;
    private cookie_:string;
    private withCredentials_:boolean;

    /**
     * Initializes a new instance of ClientDataService class
     * @param {string} base - The base URI of the MOST Web Framework Application Server. The default value is '/' for accessing local services.
     */
    constructor(base:string, http:Http) {
        this.base_ = base || "/";
        this.http_ = http;
    }

    /**
     * Gets a string which represents the base URI of the MOST Web Framework Application Server associated with this data service.
     * @returns {string}
     */
    getBase(): string {
        return this.base_;
    }

    /**
     * Get a string which represents the HTTP cookie header that is going to be used for requesting data.
     * @returns {string}
     */
    getCookie(): string {
        return this.cookie_;
    }

    /**
     * Sets a string represents the HTTP cookie header that is going to be used for requesting data.
     * @param value
     * @returns {ClientDataService}
     */
    setCookie(value:string): ClientDataService {
        this.cookie_ = value;
        return this;
    }

    execute(options:DataServiceExecuteOptions):Observable<any> {
        var self = this;
        //options defaults
        options.method = options.method || "GET";
        options.headers = options.headers || { };
        //set content type
        options.headers["Content-Type"] = "application/json";
        //set HTTP cookie
        if (this.getCookie()) { options.headers["Cookie"] = this.getCookie(); }
        //validate options URL
        Args.notNull(options.url,"Request URL");
        //validate URL format
        Args.check(!/^https?:\/\//i.test(options.url),"Request URL may not be an absolute URI");
        //validate request method
        Args.check(/^GET|POST|PUT|DELETE$/i.test(options.method),"Invalid request method. Expected GET, POST, PUT or DELETE.");
        //set URL parameter
        var url_ = self.getBase() + options.url.replace(/^\//i,"");
        let requestOptions = {
            method: options.method,
            headers:options.headers,
            search:null,
            body:null
        };
        //if request is a GET HTTP Request
        if (/^GET$/i.test(requestOptions.method)) {
            //set data as query params
            requestOptions.search = TextUtils.toSearch(options.data);
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
        return this.http_.request(url_, requestOptions).map(
            (res:Response) => {
                if (res.status===204) {
                    return;
                }
                else {
                    return JSON.parse(res.text(), function(key,value) {
                        if (TextUtils.isDate(value)) {
                            return new Date(value);
                        }
                        return value;
                    })
                }
            }
        );
    }

}

class ClientQueryExpression {
    public left:any;
    public op:string;
    public lop:string;
    public right:any;
}

export class ClientDataQueryable {

    private model_:string;
    private url_:string;
    private service_:ClientDataServiceBase;
    private params_:any;
    private privates_:ClientQueryExpression;

    constructor(model:string, service: ClientDataServiceBase) {
        Args.notEmpty(model, "Model");
        this.model_ = model;
        Args.notNull(service, "Data Service");
        this.service_ = service;
        this.url_ = TextUtils.format("/%s/index.json", this.model_);
        //init params
        this.params_ = { };
        //init privates
        this.privates_ = new ClientQueryExpression();
    }

    /**
     * @returns {ClientDataServiceBase}
     */
    getService(): ClientDataServiceBase {
        return this.service_;
    }

    /**
     * @returns {DataServiceQueryParams}
     */
    getParams(): DataServiceQueryParams {
        return this.params_;
    }

    /**
     * @returns {ClientDataQueryable}
     */
    setParam(name:string, value:any): ClientDataQueryable {
        if (/^\$/.test(name)) {
            this.params_[name] = value;
        }
        else {
            this.params_["$" + name] = value;
        }
        return this;
    }

    /**
     * Gets a string which represents the name of the data model associated with this object.
     * @returns {string}
     */
    getModel(): string {
        return this.model_;
    }

    /**
     * Gets a string which represents the relative URL associated with this object.
     * @returns {string}
     */
    getUrl():string {
        return this.url_;
    }

    /**
     * Sets the relative URL associated with this object.
     * @param value - A string which represents a relative URI.
     */
    setUrl(value:string) {
        Args.notEmpty(value,"URL");
        Args.check(/^\//.test(value), "URL must be a relative URI");
        this.url_ = value;
    }

    static create(model:string, service?: ClientDataServiceBase):ClientDataQueryable {
        return new ClientDataQueryable(model, service);
    }

    private append_() {
        Args.notNull(this.privates_.left,"Left operand");
        Args.notNull(this.privates_.op,"Comparison operator");
        var expr;
        if (Array.isArray(this.privates_.right)) {
            Args.check((this.privates_.op==="eq") || (this.privates_.op==="ne"),"Wrong operator. Expected equal or not equal");
            Args.check(this.privates_.right.length>0,"Array may not be empty");
            var arr = this.privates_.right.map(function(x) {
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
        if (TextUtils.isNotEmptyString(this.params_.$filter)) {
            this.params_.$filter = this.params_.$filter + " " + this.privates_.lop + " " + expr;
        }
        else {
            this.params_.$filter = expr;
        }
        //clear object
        this.privates_.left = null; this.privates_.op = null; this.privates_.right = null;
        return this;
    }



    private escape_(val:any) {
        if ((val == null) || (val==undefined)) {
            return "null";
        }
        if (val instanceof Boolean) {
            return (val) ? "true" : "false";
        }
        if (val instanceof Number) {
            return val+"";
        }
        if (val instanceof Date) {
            var dt = new Date(val);
            var year   = dt.getFullYear();
            var month  = TextUtils.zeroPad(dt.getMonth() + 1, 2);
            var day    = TextUtils.zeroPad(dt.getDate(), 2);
            var hour   = TextUtils.zeroPad(dt.getHours(), 2);
            var minute = TextUtils.zeroPad(dt.getMinutes(), 2);
            var second = TextUtils.zeroPad(dt.getSeconds(), 2);
            var millisecond = TextUtils.zeroPad(dt.getMilliseconds(), 3);
            //format timezone
            var offset = (new Date()).getTimezoneOffset(),
                timezone = (offset>=0 ? '+' : '') + TextUtils.zeroPad(Math.floor(offset/60),2) + ':' + TextUtils.zeroPad(offset%60,2);
            return "'" + year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second + '.' + millisecond + timezone + "'";
        }
        if (val instanceof Array) {
            var values = [];
            val.forEach(function(x) {
                this.escape_(x);
            });
            return values.join(',');
        }
        if (typeof val === "string") {
            var res = val.replace(/[\0\n\r\b\t\\'"\x1a]/g, function(s) {
                switch(s) {
                    case "\0": return "\\0";
                    case "\n": return "\\n";
                    case "\r": return "\\r";
                    case "\b": return "\\b";
                    case "\t": return "\\t";
                    case "\x1a": return "\\Z";
                    default: return "\\"+s;
                }
            });
            return "'" + res + "'";
        }
        //otherwise get valueOf
        if (val.hasOwnProperty("$name"))
            return val["$name"];
        else
            return this.escape_(val.valueOf());
    }

    where(name:string):ClientDataQueryable {
        Args.notEmpty(name,"Left operand");
        this.privates_.left = name;
        return this;
    }

    and(name:string):ClientDataQueryable {
        Args.notEmpty(name,"Left operand");
        this.privates_.left = name;
        this.privates_.lop = "and";
        return this;
    }

    andAlso(name:string):ClientDataQueryable {
        Args.notEmpty(name,"Left operand");
        this.privates_.left = name;
        this.privates_.lop = "and";
        if (!TextUtils.isNullOrUndefined(this.params_.$filter)) {
            this.params_.$filter = "(" + this.params_.$filter + ")";
        }
        return this;
    }

    or(name:string):ClientDataQueryable {
        Args.notEmpty(name,"Left operand");
        this.privates_.left = name;
        this.privates_.lop = "or";
        return this;
    }

    orElse(name:string):ClientDataQueryable {
        Args.notEmpty(name,"Left operand");
        this.privates_.left = name;
        this.privates_.lop = "or";
        if (!TextUtils.isNullOrUndefined(this.params_.$filter)) {
            this.params_.$filter = "(" + this.params_.$filter + ")";
        }
        return this;
    }

    private compare_(op, value):ClientDataQueryable {
        Args.notNull(this.privates_.left,"The left operand");
        this.privates_.op = op;
        this.privates_.right = value; return this.append_();
    }

    equal(value:any):ClientDataQueryable {
        return this.compare_("eq", value);
    }

    notEqual(value:any):ClientDataQueryable {
        return this.compare_("ne", value);
    }

    greaterThan(value:any):ClientDataQueryable {
        return this.compare_("gt", value);
    }

    greaterOrEqual(value:any):ClientDataQueryable {
        return this.compare_("ge", value);
    }

    lowerThan(value:any):ClientDataQueryable {
        return this.compare_("lt", value);
    }

    lowerOrEqual(value:any):ClientDataQueryable {
        return this.compare_("le", value);
    }

    /**
     * @param {*} value1
     * @param {*} value2
     * @returns {ClientDataQueryable}
     */
    between(value1:any, value2:any):ClientDataQueryable {
        Args.notNull(this.privates_.left,"The left operand");
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
        this.privates_.left = null; this.privates_.op = null; this.privates_.right = null; this.privates_.lop = null;
        return this;
    }

    toFilter():string {
        return this.params_.$filter;
    }

    contains(value:any):ClientDataQueryable {
        Args.notNull(this.privates_.left,"The left operand");
        this.privates_.op = 'ge';
        this.privates_.left = TextUtils.format('indexof(%s,%s)', this.privates_.left, this.escape_(value));
        this.privates_.right = 0;
        return this.append_();
    }

    private aggregate_(fn:string): ClientDataQueryable {
        Args.notNull(this.privates_.left,"The left operand");
        this.privates_.left = TextUtils.format('%s(%s)', fn, this.privates_.left);
        return this;
    }

    getDate():ClientDataQueryable {
        return this.aggregate_("date");
    }

    getDay():ClientDataQueryable {
        return this.aggregate_("day");
    }

    getMonth():ClientDataQueryable {
        return this.aggregate_("month");
    }

    getYear():ClientDataQueryable {
        return this.aggregate_("year");
    }

    getFullYear():ClientDataQueryable {
        return this.aggregate_("year");
    }

    getHours():ClientDataQueryable {
        return this.aggregate_("hour");
    }

    getMinutes():ClientDataQueryable {
        return this.aggregate_("minute");
    }

    getSeconds():ClientDataQueryable {
        return this.aggregate_("second");
    }

    length():ClientDataQueryable {
        return this.aggregate_("length");
    }

    trim():ClientDataQueryable {
        return this.aggregate_("trim");
    }

    toLocaleLowerCase():ClientDataQueryable {
        return this.aggregate_("tolower");
    }

    toLowerCase():ClientDataQueryable {
        return this.aggregate_("tolower");
    }

    toLocaleUpperCase():ClientDataQueryable {
        return this.aggregate_("toupper");
    }

    toUpperCase():ClientDataQueryable {
        return this.aggregate_("toupper");
    }

    round():ClientDataQueryable {
        return this.aggregate_("round");
    }

    floor():ClientDataQueryable {
        return this.aggregate_("floor");
    }

    ceil():ClientDataQueryable {
        return this.aggregate_("ceiling");
    }

    indexOf(s:string):ClientDataQueryable {
        Args.notNull(this.privates_.left,"The left operand");
        this.privates_.left = TextUtils.format('indexof(%s,%s)', this.privates_.left, this.escape_(s));
        return this;
    }

    substr(pos:number,length:number):ClientDataQueryable {
        Args.notNull(this.privates_.left,"The left operand");
        this.privates_.left = TextUtils.format('substring(%s,%s,%s)',this.privates_.left, pos, length);
        return this;
    }

    startsWith(s:string):ClientDataQueryable {
        Args.notNull(this.privates_.left,"The left operand");
        this.privates_.left = TextUtils.format('startswith(%s,%s)',this.privates_.left, this.escape_(s));
        return this;
    }

    endsWith(s:string):ClientDataQueryable {
        Args.notNull(this.privates_.left,"The left operand");
        this.privates_.left = TextUtils.format('endswith(%s,%s)',this.privates_.left, this.escape_(s));
        return this;
    }

    select(...attr:string[]):ClientDataQueryable {
        Args.notNull(attr, "Attributes");
        Args.check(attr.length>0,"Attributes may not be empty");
        var arr = [];
        for (var i = 0; i < attr.length; i++) {
            Args.check(typeof attr[i] === "string", "Invalid attribute. Expected string.");
            arr.push(attr[i]);
        }
        this.params_.$select = arr.join(",");
        return this;
    }

    groupBy(...attr:string[]):ClientDataQueryable {
        Args.notNull(attr, "Attributes");
        Args.check(attr.length>0,"Attributes may not be empty");
        var arr = [];
        for (var i = 0; i < attr.length; i++) {
            Args.check(typeof attr[i] === "string", "Invalid attribute. Expected string.");
            arr.push(attr[i]);
        }
        this.params_.$groupby = arr.join(",");
        return this;
    }

    expand(...attr:string[]):ClientDataQueryable {
        Args.notNull(attr, "Attributes");
        Args.check(attr.length>0,"Attributes may not be empty");
        var arr = [];
        for (var i = 0; i < attr.length; i++) {
            Args.check(typeof attr[i] === "string", "Invalid attribute. Expected string.");
            arr.push(attr[i]);
        }
        this.params_.$expand = arr.join(",");
        return this;
    }

    orderBy(attr:string):ClientDataQueryable {
        Args.notEmpty(attr,"Order by attribute");
        this.params_.$orderby = attr.toString();
        return this;
    }

    thenBy(attr:string):ClientDataQueryable {
        Args.notEmpty(attr,"Order by attribute");
        this.params_.$orderby += (this.params_.$orderby ? ',' + attr.toString() : attr.toString());
        return this;
    }

    orderByDescending(attr:string):ClientDataQueryable {
        Args.notEmpty(attr,"Order by attribute");
        this.params_.$orderby = attr.toString() + " desc";
        return this;
    }

    thenByDescending(attr:string):ClientDataQueryable {
        Args.notEmpty(attr,"Order by attribute");
        this.params_.$orderby += (this.params_.$orderby ? ',' + attr.toString() : attr.toString()) + " desc";
        return this;
    }

    skip(num:number):ClientDataQueryable {
        this.params_.$skip = num;
        return this;
    }

    take(num:number):ClientDataQueryable {
        this.params_.$top = num;
        return this;
    }

    first():Observable<any> {
        delete this.params_.$top;
        delete this.params_.$skip;
        delete this.params_.$inlinecount;
        this.params_.$first = true;
        return this.getService().execute({
            method:"GET",
            url:this.getUrl(),
            data:this.params_,
            headers:[]
        });
    }

    list():Observable<any> {
        delete this.params_.$first;
        this.params_.$inlinecount = true;
        return this.getService().execute({
            method:"GET",
            url:this.getUrl(),
            data:this.params_,
            headers:[]
        });
    }

    item():Observable<any> {
        return this.first();
    }

    getItem():Observable<any> {
        return this.first();
    }

    items():Observable<any> {
        delete this.params_.$first;
        this.params_.$inlinecount = false;
        return this.getService().execute({
            method:"GET",
            url:this.getUrl(),
            data:this.params_,
            headers:[]
        });
    }

    getItems():Observable<any> {
        return this.items();
    }

    getList():Observable<any> {
        return this.list();
    }

    filter(s:string):ClientDataQueryable {
        Args.notEmpty("s","Filter expression");
            this.params_.$filter = s;
        return this;
    }

    levels(n:number):ClientDataQueryable {
        Args.Positive(n, 'Levels');
        this.params_.$levels = n;
        return this;
    }

}


export class ClientDataModel {

    private name_:string;
    private service_:ClientDataServiceBase;

    constructor(name:string, service:ClientDataServiceBase) {
        this.name_ = name;
        this.service_ = service;
    }

    /**
     * @returns {ClientDataServiceBase}
     */
    getService(): ClientDataServiceBase {
        return this.service_;
    }

    getName(): string {
        return this.name_;
    }

    asQueryable():ClientDataQueryable {
        return ClientDataQueryable.create(this.getName(), this.service_);
    }

    where(attr:string):ClientDataQueryable {
        return this.asQueryable().where(attr);
    }

    select(...attr:string[]):ClientDataQueryable {
        var q = this.asQueryable();
        return q.select.apply(q,attr);
    }

    skip(num:number):ClientDataQueryable {
        return this.asQueryable().skip(num);
    }

    take(num:number):ClientDataQueryable {
        return this.asQueryable().take(num);
    }

    save(obj:any):Observable<any> {
        return this.getService().execute({ method:"POST", url:TextUtils.format("/%s/index.json", this.getName()),data:obj, headers:[] });
    }

    schema(obj:any):Observable<any> {
        return this.getService().execute({ method:"GET", url:TextUtils.format("/%s/schema.json", this.getName()),data:null, headers:[] });
    }

    remove(obj:any):Observable<any> {
        return this.getService().execute({ method:"DELETE", url:TextUtils.format("/%s/index.json", this.getName()),data:obj, headers:[] });
    }

    levels(n:number):ClientDataQueryable {
        Args.Positive(n, 'Levels');
        return this.asQueryable().levels(n);
    }

}

export interface ClientDataContextConfig {
    base:string
}

export const DATA_CONTEXT_CONFIG:ClientDataContextConfig = {
    base: '/'
};

@Injectable()
export class ClientDataContext implements ClientDataContextBase {

    private base_:string;

    private service_:ClientDataServiceBase;

    constructor(private http:Http, @Inject(DATA_CONTEXT_CONFIG) config:ClientDataContextConfig) {
        this.base_ = config.base;
        this.service_ = new ClientDataService(this.getBase(), http);
    }

    /**
     * Gets a string which represents the base URL of the MOST Web Application Server.
     * @returns {string}
     */
    getBase(): string {
        return this.base_ || "/";
    }

    /**
     * Sets a string which represents the base URL of the MOST Web Application Server.
     */
    setBase(value:string):void {
        Args.notEmpty(value,"Base URL");
        this.base_ = value;
    }

    /**
     * Gets the instance of ClientDataService class which is associated with this data context.
     * @returns {ClientDataServiceBase}
     */
    getService(): ClientDataServiceBase {
        return this.service_;
    }

    /**
     * Gets an instance of ClientDataModel class
     * @param name - A string which represents the name of the data model.
     * @returns {ClientDataModel}
     */
    model(name:string): ClientDataModel {
        Args.notEmpty(name,"Model name");
        return new ClientDataModel(name, this.getService());
    }

    /**
     * @param {string} username
     * @param {string} password
     * @returns {Observable}
     */
    authenticate(username:string, password:string):Observable<any> {
        return this.getService().execute({
            method:"GET",
            url:"/User/index.json",
            data: {
                $filter:"id eq me()"
            },
            headers: {
                Authorization:"Basic " + TextUtils.toBase64(username + ":" + password)
            }
        });
    };

}

@Component({
    selector: 'most-data',
    template:``,
    inputs:["model", "filter", "top", "skip", "inlinecount", "order", "group", "select", "expand" ],
    outputs:["items"]
})
export class DataComponent {

    public items:EventEmitter<any> = new EventEmitter<any>();
    public model:string;
    public filter:string;
    public top:number;
    public skip:number;
    public inlinecount:boolean;
    public order:string;
    public group:string;
    public select:string;
    public expand:string;

    ngOnInit() {
        this.next();
    }
    private next() {
        let self = this;
        //init client data queryable
        let q = self.context.model(this.model).asQueryable();
        //set parameters
        q.setParam("filter", this.filter)
            .setParam("select", this.select)
            .setParam("order", this.order)
            .setParam("expand", this.expand)
            .setParam("group", this.group)
            .setParam("top", this.top)
            .setParam("inlinecount", this.inlinecount)
            .setParam("skip", this.skip);
        //if top = 1 get only first item
        if (this.top == 1) {
            return q.first().subscribe(
                data => { this.items.emit(data); },
                err => { console.log(err); }
            );
        }
        else {
            //if inline count is true get list (total and records)
            if (this.inlinecount) {
                q.list().subscribe(
                    data => { this.items.emit(data); },
                    err => { console.log(err); }
                );
            }
            //otherwise get array of items
            else {
                q.getItems().subscribe(
                    data => { this.items.emit(data); },
                    err => { console.log(err); }
                );
            }
        }
    }
    constructor(private context: ClientDataContext) { }
}

export interface IDataComponentWatcher {
    watch(target:string,value:any)
}

export class DataComponentWatcher implements IDataComponentWatcher {
    /**
     * @param {string} target
     * @param {*} value
     */
    watch(target:string,value:any) {
        Args.notEmpty(target,"Target");
        this[target] = value;
    }
}

@Component({
    selector: 'most-content',
    template:`<ng-content></ng-content>`,
    directives:[DataComponent]
})
export class DataContentComponent extends DataComponentWatcher {
    //
}