"use strict";
{
    const C3 = self.C3;
    C3.Plugins.RobotKaposzta_Browser2.Exps = {
        Platform() {
            return navigator.platform;
        },
        UserAgent() {
            return navigator.userAgent;
        },
        Vendor() {
            return this._vendor;
        },

        Title() {
            return this._title;
        },
        ThemeColor() {
            return this._themeColor;
        },
        ExecJsResult() {
            return this._execJsResult;
        },

        HistoryLength() {
            return this._historyLength;
        },
        Url() {
            return this._href;
        },
        UrlHash(href, replace) {
            return this._URLManager("hash", href, replace);
        },
        UrlHost(href, replace) {
            return this._URLManager("host", href, replace);
        },
        UrlHostname(href, replace) {
            return this._URLManager("hostname", href, replace);
        },
        UrlUsername(href, replace) {
            return this._URLManager("username", href, replace);
        },
        UrlPassword(href, replace) {
            return this._URLManager("password", href, replace);
        },
        UrlPathname(href, replace) {
            return this._URLManager("pathname", href, replace);
        },
        UrlPort(href, replace) {
            return this._URLManager("port", href, replace);
        },
        UrlProtocol(href, replace) {
            return this._URLManager("protocol", href, replace);
        },
        UrlSearch(href, replace) {
            return this._URLManager("search", href, replace);
        },
        UrlSearchCount(href) {
            let url;
            if (typeof (href) !== "undefined" && href != '') {
                try {
                    url = new URL(href);
                } catch (error) {
                    console.error("Wrong url format" + error)
                    url = new URL(this._href);
                }
            } else {
                url = new URL(this._href);
            }
            let count = 0;
            url.searchParams.forEach(() => {
                count++;
            });
            console.log(count);
            return count;
        },
        UrlSearchParamKeyAt(href, at) {
            let url;
            if (typeof (href) !== "undefined" && href != '') {
                try {
                    url = new URL(href);
                } catch (error) {
                    console.error("Wrong url format" + error)
                    url = new URL(this._href);
                }
            } else {
                url = new URL(this._href);
            }
            let params = [];
            url.searchParams.forEach((value, key) => {
                params.push(key);
            });
            return (typeof (params[at]) !== "undefined" ? params[at] : "");
        },
        UrlSearchParamString(href, key, replace) {
            let url;
            if (typeof (href) !== "undefined" && href != '') {
                try {
                    url = new URL(href);
                } catch (error) {
                    console.error("Wrong url format" + error)
                    url = new URL(this._href);
                }
            } else {
                url = new URL(this._href);
            }
            if (typeof (replace) === "undefined") {
                let params = {};
                url.searchParams.forEach((value, key) => {
                    params[key] = value;
                });
                return (typeof (params[key]) !== "undefined" ? params[key] : "");
            } else if (replace == "") {
                url.searchParams.delete(key);
            } else {
                url.searchParams.set(key, replace);
            }
            return url;
        }
    };
};