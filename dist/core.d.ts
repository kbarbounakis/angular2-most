export declare class CodedError extends Error {
    code: string;
    constructor(message: string, code: string);
}
export declare class Args {
    static check(expr: boolean, message: string, code?: string): void;
    static notNull(obj: any, name: any): void;
    static notEmpty(obj: string, name: any): void;
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
