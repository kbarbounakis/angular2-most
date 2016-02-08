
export class CodedError extends Error {
    constructor(message: string, public code: string) {
        super(message);
    }
}

export class Args {

    static check(expr:boolean,message:string,code?:string):void {
        if (!expr) {
            throw new CodedError(message, code || "EARG");
        }
    }

    static notNull(obj:any, name):void {
        Args.check((obj != null) && (obj !== undefined), name + " may not be null or undefined", "ENULL");
    }

    static notEmpty(obj:string, name):void {
        Args.check((obj != null) && (obj !== undefined) && (obj.length>0), name + " may not be empty", "ENULL");
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
        return (s!=null) && (s!=undefined) && (s.length>0);
    }

    static isNullOrUndefined(s:string):boolean {
        return (s!=null) && (s!=undefined);
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
            if (object.length==0)
                return  encodeURIComponent(key) + '=';
        }
        for (key in object) {
            if (object.hasOwnProperty(key)) {
                value = object[ key ];
                if (typeof value==='undefined' || value == null) {
                    value = encodeURIComponent(key) + '=';
                }  else if (typeof( value ) !== 'object') {
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

    static format(s:string,...p:any[]):string {
        var i = 0;
        return s.replace(/%[sdfj%]/g, function (x) {
            if (x === "%%") return "%";
            if (i >= p.length) return x;
            var p1 = p[i++];
            if (((p1==null) && (p1==undefined))) { return ""; }
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
