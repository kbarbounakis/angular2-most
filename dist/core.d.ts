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
    /**
     * Encodes the given string to Base-64 format
     * @param {string} s - A string to encode
     * @returns {string}
     */
    static toBase64(s: string): string;
    /**
     * Decodes the given string from Base-64 format
     * @param {string} s - A base-64 encoded string
     * @returns {string}
     */
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
    /**
     * Gets a string which represents the base URL of the MOST Web application server
     */
    getBase(): string;
    /**
     * Get a string which represents the HTTP cookie header that is going to used for authenticating requests.
     */
    getCookie(): string;
    /**
     * Sets a string which represents the HTTP cookie header that is going to used for authenticating requests.
     * @param {string} value
     */
    setCookie(value: string): any;
    /**
     * Executes an HTTP request against the defined MOST Web application server
     * @param {DataServiceExecuteOptions} options
     */
    execute(options: DataServiceExecuteOptions): any;
}
export interface ClientDataContextBase {
    /**
     * Gets a string which represents the base URL of the MOST Web application server
     */
    getBase(): string;
    /**
     * Sets a string which represents the base URL of the MOST Web application server
     * @param {string} value - The base URL
     */
    setBase(value: string): any;
    /**
     * Gets the instance of ClientDataServiceBase class which is associated with this data context
     */
    getService(): ClientDataServiceBase;
}
