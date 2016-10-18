import { EventEmitter } from 'angular2/core';
import { Http } from 'angular2/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
export declare class CodedError extends Error {
    code: string;
    constructor(message: string, code: string);
}
export declare class Args {
    static check(expr: boolean, message: string, code?: string): void;
    static notNull(obj: any, name: any): void;
    static notEmpty(obj: string, name: any): void;
    static notNegative(obj: number, name: any): void;
}
export declare class TextUtils {
    static isNotEmptyString(s: string): boolean;
    static isNullOrUndefined(s: string): boolean;
    static zeroPad(num: number, length: number): string;
    private static REG_DATETIME_ISO;
    static isDate(s: string): boolean;
    static parseDate(s: string): Date;
    static toSearch(object: any): string;
    static toBase64(s: string): string;
    static fromBase64(s: string): string;
    static format(s: string, ...p: any[]): string;
}
export interface DataServiceQueryParams {
    $filter: string;
    $groupby: string;
    $select: string;
    $orderby: string;
    $inlinecount: boolean;
    $top: number;
    $skip: number;
    $first: boolean;
}
export interface DataServiceExecuteOptions {
    method: string;
    url: string;
    data: any;
    headers: any;
}
export interface ClientDataServiceBase {
    getBase(): string;
    getCookie(): string;
    setCookie(value: string): any;
    execute(options: DataServiceExecuteOptions): any;
}
export interface ClientDataContextBase {
    getBase(): string;
    setBase(value: string): any;
    getService(): ClientDataServiceBase;
}
export declare class ClientDataService implements ClientDataServiceBase {
    private base_;
    private http_;
    private cookie_;
    private withCredentials_;
    constructor(base: string, http: Http);
    getBase(): string;
    getCookie(): string;
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
    getService(): ClientDataServiceBase;
    getParams(): DataServiceQueryParams;
    setParam(name: string, value: any): ClientDataQueryable;
    getModel(): string;
    getUrl(): string;
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
    first(): Observable<any>;
    list(): Observable<any>;
    item(): Observable<any>;
    getItem(): Observable<any>;
    items(): Observable<any>;
    getItems(): Observable<any>;
    filter(s: string): ClientDataQueryable;
}
export declare class ClientDataModel {
    private name_;
    private service_;
    constructor(name: string, service: ClientDataServiceBase);
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
    getBase(): string;
    setBase(value: string): void;
    getService(): ClientDataServiceBase;
    model(name: string): ClientDataModel;
    authenticate(username: string, password: string): Observable<any>;
}
export declare class DataComponent {
    private context;
    items: EventEmitter<any>;
    model: string;
    filter: string;
    top: number;
    skip: number;
    inlinecount: boolean;
    order: string;
    group: string;
    select: string;
    expand: string;
    ngOnInit(): void;
    private next();
    constructor(context: ClientDataContext);
}
export interface IDataComponentWatcher {
    watch(target: string, value: any): any;
}
export declare class DataComponentWatcher implements IDataComponentWatcher {
    watch(target: string, value: any): void;
}
export declare class DataContentComponent extends DataComponentWatcher {
}
