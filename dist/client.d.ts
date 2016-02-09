/**
 * Created by kbarbounakis on 2/6/16.
 */
import { ClientDataServiceBase } from "./core";
import { DataServiceQueryParams, DataServiceExecuteOptions, ClientDataContextBase } from "./core";
import { Http } from 'angular2/http';
import { Observable } from 'rxjs/Rx';
export declare class ClientDataService implements ClientDataServiceBase {
    private base_;
    private http_;
    private cookie_;
    private withCredentials_;
    /**
     * Initializes a new instance of ClientDataService class
     * @param {string} base - The base URI of the MOST Web Framework Application Server. The default value is '/' for accessing local services.
     */
    constructor(base: string, http: Http);
    /**
     * Gets a string which represents the base URI of the MOST Web Framework Application Server associated with this data service.
     * @returns {string}
     */
    getBase(): string;
    /**
     * Get a string which represents the HTTP cookie header that is going to be used for requesting data.
     * @returns {string}
     */
    getCookie(): string;
    /**
     * Sets a string represents the HTTP cookie header that is going to be used for requesting data.
     * @param value
     * @returns {ClientDataService}
     */
    setCookie(value: string): ClientDataService;
    execute(options: DataServiceExecuteOptions): Observable<any>;
}
export declare class ClientDataQueryable {
    private model_;
    private url_;
    private service_;
    private params_;
    private privates_;
    constructor(model: string, service: ClientDataServiceBase);
    /**
     * @returns {ClientDataServiceBase}
     */
    getService(): ClientDataServiceBase;
    /**
     * @returns {DataServiceQueryParams}
     */
    getParams(): DataServiceQueryParams;
    /**
     * Gets a string which represents the name of the data model associated with this object.
     * @returns {string}
     */
    getModel(): string;
    /**
     * Gets a string which represents the relative URL associated with this object.
     * @returns {string}
     */
    getUrl(): string;
    /**
     * Sets the relative URL associated with this object.
     * @param value - A string which represents a relative URI.
     */
    setUrl(value: string): void;
    static create(model: string, service?: ClientDataServiceBase): ClientDataQueryable;
    private append_();
    private escape_(val);
    where(name: string): ClientDataQueryable;
    and(name: string): ClientDataQueryable;
    andAlso(name: string): ClientDataQueryable;
    or(name: string): ClientDataQueryable;
    orElse(name: string): ClientDataQueryable;
    private compare_(op, value);
    equal(value: any): ClientDataQueryable;
    notEqual(value: any): ClientDataQueryable;
    greaterThan(value: any): ClientDataQueryable;
    greaterOrEqual(value: any): ClientDataQueryable;
    lowerThan(value: any): ClientDataQueryable;
    lowerOrEqual(value: any): ClientDataQueryable;
    /**
     * @param {*} value1
     * @param {*} value2
     * @returns {ClientDataQueryable}
     */
    between(value1: any, value2: any): ClientDataQueryable;
    toFilter(): string;
    contains(value: any): ClientDataQueryable;
    private aggregate_(fn);
    getDate(): ClientDataQueryable;
    getDay(): ClientDataQueryable;
    getMonth(): ClientDataQueryable;
    getYear(): ClientDataQueryable;
    getFullYear(): ClientDataQueryable;
    getHours(): ClientDataQueryable;
    getMinutes(): ClientDataQueryable;
    getSeconds(): ClientDataQueryable;
    length(): ClientDataQueryable;
    trim(): ClientDataQueryable;
    toLocaleLowerCase(): ClientDataQueryable;
    toLowerCase(): ClientDataQueryable;
    toLocaleUpperCase(): ClientDataQueryable;
    toUpperCase(): ClientDataQueryable;
    round(): ClientDataQueryable;
    floor(): ClientDataQueryable;
    ceil(): ClientDataQueryable;
    indexOf(s: string): ClientDataQueryable;
    substr(pos: number, length: number): ClientDataQueryable;
    startsWith(s: string): ClientDataQueryable;
    endsWith(s: string): ClientDataQueryable;
    select(...attr: string[]): ClientDataQueryable;
    groupBy(...attr: string[]): ClientDataQueryable;
    expand(...attr: string[]): ClientDataQueryable;
    orderBy(attr: string): ClientDataQueryable;
    thenBy(attr: string): ClientDataQueryable;
    orderByDescending(attr: string): ClientDataQueryable;
    thenByDescending(attr: string): ClientDataQueryable;
    skip(num: number): ClientDataQueryable;
    take(num: number): ClientDataQueryable;
    first(): any;
    list(): any;
    item(): any;
    items(): any;
}
export declare class ClientDataModel {
    private name_;
    private service_;
    constructor(name: string, service: ClientDataServiceBase);
    /**
     * @returns {ClientDataServiceBase}
     */
    getService(): ClientDataServiceBase;
    getName(): string;
    asQueryable(): ClientDataQueryable;
    where(attr: string): ClientDataQueryable;
    select(...attr: string[]): ClientDataQueryable;
    skip(num: number): ClientDataQueryable;
    take(num: number): ClientDataQueryable;
    save(obj: any): Observable<any>;
    schema(obj: any): Observable<any>;
    remove(obj: any): Observable<any>;
}
export declare class ClientDataContext implements ClientDataContextBase {
    private http;
    private base_;
    private service_;
    constructor(http: Http);
    /**
     * Gets a string which represents the base URL of the MOST Web Application Server.
     * @returns {string}
     */
    getBase(): string;
    /**
     * Sets a string which represents the base URL of the MOST Web Application Server.
     */
    setBase(value: string): void;
    /**
     * Gets the instance of ClientDataService class which is associated with this data context.
     * @returns {ClientDataServiceBase}
     */
    getService(): ClientDataServiceBase;
    /**
     * Gets an instance of ClientDataModel class
     * @param name - A string which represents the name of the data model.
     * @returns {ClientDataModel}
     */
    model(name: string): ClientDataModel;
    /**
     * @param {string} username
     * @param {string} password
     * @returns {Observable}
     */
    authenticate(username: string, password: string): Observable<any>;
}
