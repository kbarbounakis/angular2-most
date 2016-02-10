/**
 * Created by kbarbounakis on 2/6/16.
 */


import {ClientDataServiceBase} from "./core";
import {Args,TextUtils,DataServiceQueryParams,DataServiceExecuteOptions,ClientDataContextBase} from "./core";

/**
 * Angular 2 imports
 */
import {Injectable} from 'angular2/core';
import {Http, Response, BaseRequestOptions, RequestOptions} from 'angular2/http';
import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/map';

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

    first():any {
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

    list():any {
        delete this.params_.$first;
        this.params_.$inlinecount = true;
        return this.getService().execute({
            method:"GET",
            url:this.getUrl(),
            data:this.params_,
            headers:[]
        });
    }

    item():any {
        return this.first();
    }

    items():any {
        delete this.params_.$first;
        this.params_.$inlinecount = false;
        return this.getService().execute({
            method:"GET",
            url:this.getUrl(),
            data:this.params_,
            headers:[]
        });
    }

    filter(s:string):ClientDataQueryable {
        Args.notEmpty("s","Filter expression");
            this.params_.$filter = s;
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

}

@Injectable()
export class ClientDataContext implements ClientDataContextBase {

    private base_:string;

    private service_:ClientDataServiceBase;

    constructor(private http:Http) {
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