import { NameValuePair } from "request";
import { JwtToken } from "./contracts/jwtToken";
import { js } from "js-beautify";

export class Utils {
    public static getResourceName(resource: string, fullId: string, resultType = "name"): string {
        const regexp = new RegExp(`\/${resource}\/(.*)`);
        const matches = regexp.exec(fullId);

        if (matches && matches.length > 1) {
            switch (resultType) {
                case "name":
                    return matches[1];

                case "shortId":
                    return `/${resource}/${matches[1]}`;

                default:
                    throw new Error(`Unknown resultType: ${resultType}`);
            }
        } else {
            throw new Error("Could not parse ID.");
        }
    }

    public static groupBy<T>(array: T[], valueAccessor: (item: T) => string): T[][] {
        const grouping = array.reduce((groups, item) => {
            let val = valueAccessor(item);

            if (!val) {
                val = "__ungrouped__";
            }

            groups[val] = groups[val] || [];
            groups[val].push(item);

            return groups;
        }, {});

        return Object.keys(grouping).map(x => grouping[x]);
    }

    public static ensureLeadingSlash(url: string): string {
        if (!url.startsWith("/")) {
            url = "/" + url;
        }

        return url;
    }

    public static getQueryParams(queryString: string): any {
        const queryValues = {};
        queryString.split("&").forEach((item) => {
            const queryParam = item.split("=");
            queryValues[queryParam[0]] = queryParam[1];
        });
        return queryValues;
    }

    public static getUrlTemplateParams(uriTemplate: string): string[] {
        const result = [];
        const matches = uriTemplate.match(/{\*?[a-zA-Z0-9_$\-]*}/gm);

        if (matches) {
            matches.forEach((match) => {
                if (result.indexOf(match) === -1) {
                    result.push(match);
                }
            });
        }
        return result;
    }

    public static formatXml(xml: string): string {
        const original = xml;

        try {
            let formatted = "";
            const reg = /(>)(<)(\/*)/g;

            xml = xml.replace(reg, "$1\r\n$2$3");
            let pad = 0;

            xml.split("\r\n").forEach((node) => {
                let indent = 0;
                if (node.match(/.+<\/\w[^>]*>$/)) {
                    indent = 0;
                } else if (node.match(/^<\/\w/)) {
                    if (pad !== 0) {
                        pad -= 1;
                    }
                } else if (node.match(/^<\w[^>]*[^\/]>.*$/)) {
                    indent = 1;
                } else {
                    indent = 0;
                }

                let padding = "";
                for (let i = 0; i < pad; i++) {
                    padding += "    ";
                }

                formatted += padding + node + "\r\n";
                pad += indent;
            });

            return formatted;
        }
        catch (error) {
            return original;
        }
    }

    public static formatJson(json: string): string {
        const original = json;

        try {
            const formatted = js(json, { indent_size: 4 });

            return formatted;
        }
        catch (error) {
            return original;
        }
    }

    public static parseHeaderString(headerString: string): NameValuePair[] {
        if (!headerString) {
            return [];
        }

        const headers = [];
        const headerPairs = headerString.split("\u000d\u000a");

        for (let i = 0; i < headerPairs.length; i++) {
            const headerPair = headerPairs[i];
            const index = headerPair.indexOf("\u003a\u0020");

            if (index > 0) {
                const name = headerPair.substring(0, index);
                const value = headerPair.substring(index + 2);

                const header: NameValuePair = {
                    name: name,
                    value: value
                };

                headers.push(header);
            }
        }
        return headers;
    }

    public static addQueryParameter(uri: string, name: string, value?: string): string {
        uri += `${uri.indexOf("?") >= 0 ? "&" : "?"}${name}`;
        if (value) {
            uri += `=${value}`;
        }
        return uri;
    }

    public static escapeValueForODataFilter(value: string): string {
        value = value
            .replace(/\%/g, "%25")
            .replace(/\"/g, `"`)
            .replace(/\+/g, "%2B")
            .replace(/\//g, "%2F")
            .replace(/\?/g, "%3F")
            .replace(/#/g, "%23")
            .replace(/\&/g, "%26");

        return value;
    }

    public static getBsonObjectId(): string {
        const timestamp = (new Date().getTime() / 1000 | 0).toString(16);

        return timestamp + "xxxxxxxxxxxxxxxx".replace(/[x]/g, () => {
            return (Math.random() * 16 | 0).toString(16);
        }).toLowerCase();
    }

    public static parseJwt(jwtToken: string): JwtToken {
        const base64Url = jwtToken.split(".")[1];
        const base64 = base64Url.replace("-", "+").replace("_", "/");

        return JSON.parse(window.atob(base64));
    }

    public static scrollTo(id: string): void {            
        const e = document.getElementById(id);

        if (!!e && e.scrollIntoView) {
            e.scrollIntoView();
        }             
    }
}