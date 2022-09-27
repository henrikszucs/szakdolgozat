"use strict";
{
    // 2 UNDOCUMENTED FEATURE self.RuntimeInterface._SetWrapperIsFullscreenFlag(); this._iRuntime._SendWrapperMessage();
    const DOM_COMPONENT_ID = "RobotKaposzta_Browser2";
    const HANDLER_CLASS = class Browser2DOMHandler extends self.DOMHandler {
        constructor(iRuntime) {
            super(iRuntime, DOM_COMPONENT_ID);

            this.AddRuntimeMessageHandlers([
                ["get-initial-state", (e) => this._GetInitialState(e)],

                ["vibrate", (e) => this._Vibrate(e)],

                ["ready-for-sw-messages", () => this._OnReadyForSWMessages()],
                ["set-title", (e) => this._SetTitle(e)],
                ["set-favicon", (e) => this._SetFavicon(e)],
                ["set-theme-color", (e) => this._SetThemeColor(e)],
                ["set-close-prevent", (e) => this._SetClosePrevent(e)],
                ["load-stylesheet", (e) => this._LoadStylesheet(e)],
                ["unload-stylesheet", (e) => this._UnloadStylesheet(e)],
                ["exec-js", (e) => this._ExecJs(e)],

                ["go", (e) => this._Go(e)],
                ["push-url", (e) => this._PushURL(e)],
                ["replace-url", (e) => this._ReplaceURL(e)],
                ["open-url", (e) => this._OpenURL(e)],
                ["set-scroll-restoration", (e) => this._SetScrollRestoration(e)],

                ["close", (e) => this._Close(e)],
                ["reload", () => this._Reload()],
                ["focus", (e) => this._Focus(e)],
                ["blur", (e) => this._Blur(e)],
                ["request-fullscreen", (e) => this._RequestFullscreen(e)],
                ["cancel-fullscreen", () => this._CancelFullscreen()],
                ["lock-orientation", (e) => this._LockOrientation(e)],
                ["unlock-orientation", () => this._UnlockOrientation()]
            ]);
        }
        _GetInitialState(e) {
            this._exportType = e["exportType"];

            //device
            document.addEventListener("backbutton", () => this._OnBack());
            window.addEventListener("online", () => this._OnOnline());
            window.addEventListener("offline", () => this._OnOffline());

            //document
            this._title = document.title;
            this._colorScheme = "light";
            window.matchMedia("(prefers-color-scheme: light)").addEventListener("change", (e) => this._OnColorSchemeChange(e));
            this._isThemeColor = false;
            this._themeColor = "#ffffff";
            this._InitSystemColors();
            this._isClosePrevent = false;
            window.addEventListener('beforeunload', (e) => this._OnClosePrevent(e));

            //navigation
            window.addEventListener('popstate', () => this._OnNavigation());

            //windwow
            this._openedWindows = {};

            return {
                "isOnline": !!navigator.onLine,
                "browser-type": this._InitBrowserType(),
                "vendor": navigator.vendor,

                "title": document.title,
                "colorScheme": this._colorScheme,
                "themeColor": this._themeColor,

                "historyLength": history.length,
                "href": location.toString(),
                "scrollRestoration": history.scrollRestoration
            };
        }
        _InitSystemColors() {
            if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                this._colorScheme = "dark";
            }
            const el = document.querySelector("meta[name='theme-color']");
            if (!el) {
                const new_el = document.createElement('meta');
                new_el.setAttribute("name", "theme-color");
                new_el.setAttribute("content", "");
                document.getElementsByTagName('head')[0].appendChild(new_el);
                this._themeColor = "";
            } else {
                this._themeColor = el.getAttribute("content");
            }
        }
        _InitBrowserType() {
            // Chrome 1 - 79
            const isChrome = !!window["chrome"] && (!!window["chrome"]["webstore"] || !!window["chrome"]["runtime"]);

            // Edge (based on chromium) detection
            const isEdge = isChrome && (window.navigator.userAgent.indexOf("Edg") != -1);

            // Firefox 1.0+
            const isFirefox = typeof window["InstallTrigger"] !== "undefined";

            // Safari 3.0+ "[object HTMLElementConstructor]" 
            const isSafari = /constructor/i.test(window["HTMLElement"]) || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window["safari"] || (typeof window["safari"] !== "undefined" && window["safari"]["pushNotification"]));

            // Opera 8.0+
            const isOpera = (!!window["opr"] && !!window["opr"]["addons"]) || !!window["opera"] || window.navigator.userAgent.indexOf(' OPR/') >= 0;

            // Blink engine detection
            const isBlink = (isChrome || isOpera) && !!window["CSS"];

            if (isChrome) {
                return 0;
            } else if (isEdge) {
                return 1;
            } else if (isFirefox) {
                return 2;
            } else if (isSafari) {
                return 3;
            } else if (isOpera) {
                return 4;
            } else  {
                return 5;
            }
        }

        //device
        _Vibrate(e) {
            if (navigator["vibrate"]) navigator["vibrate"](e["pattern"]);
        }
        _OnBack() {
            this.PostToRuntime("on-back");
        }
        _OnOnline() {
            this.PostToRuntime("on-online");
        }
        _OnOffline() {
            this.PostToRuntime("on-offline");
        }

        //document
        _OnReadyForSWMessages() {
            //!!!!!unsupported
            if (!window["C3_RegisterSW"] || !window["OfflineClientInfo"]) return;
            window["OfflineClientInfo"]["SetMessageCallback"]((e) => {
                this.PostToRuntime("sw-message", e["data"])
            });
        }
        _SetTitle(e) {
            document["title"] = e["title"];
        }
        _SetFavicon(e) {
            const type = e["type"];
            const url = e["url"];
            const TYPES = [
                "link[rel='icon']",
                "link[rel='apple-touch-icon'][sizes='128x128']",
                "link[rel='apple-touch-icon'][sizes='256x256']",
                "link[rel='apple-touch-icon'][sizes='512x512']"
            ];
            document.querySelector(TYPES[type]).setAttribute("href", url);
        }
        _SetThemeColor(e) {
            document.querySelector("meta[name='theme-color']").setAttribute("content", e["theme-color"]);
        }
        _SetClosePrevent(e) {
            this._isClosePrevent = !!e["prevent"]
        }
        _LoadStylesheet(e) {
            const el = document.querySelector("link[rel='stylesheet'][href='" + e["url"] + "']");
            if (!el) {
                const styleSheet = document.createElement("link");
                styleSheet.setAttribute("rel", "stylesheet");
                console.log(e["url"]);
                styleSheet.setAttribute("href", e["url"]);
                document.getElementsByTagName("head")[0].appendChild(styleSheet);
            }
        }
        _UnloadStylesheet(e) {
            const el = document.querySelector("link[rel='stylesheet'][href='" + e["url"] + "']");
            if (el) {
                el.remove();
            }
        }
        async _ExecJs(e) {
            return await eval(e["code"]);
        }
        _OnColorSchemeChange(event) {
            const newScheme = event.matches ? "light" : "dark";
            if (this._colorScheme !== newScheme) {
                this._colorScheme = newScheme;
                this.PostToRuntime("on-color-scheme-change", {
                    "color-scheme": this._colorScheme
                });
            }
        }
        _OnClosePrevent(e) {
            if (this._isClosePrevent) {
                e.preventDefault();
                e.returnValue = '';
                this.PostToRuntime("on-close-prevent");
            }
        }

        //navigation
        _Go(e) {
            if (e["direction"] === 0 && e["amount"] !== 0) {
                window.history.go(e["amount"]);
            } else if (e["direction"] === 1 && e["amount"] > 0) {
                window.history.go(e["amount"] * -1);
            } else if (e["direction"] === 2 && e["amount"] > 0) {
                window.history.go(e["amount"]);
            }
        }
        _PushURL(e) {
            window.history.pushState({}, "", e["url"]);
            return {
                "historyLength": history.length,
                "href": location.toString(),
                "scrollRestoration": history.scrollRestoration
            };
        }
        _ReplaceURL(e) {
            window.history.replaceState({}, "", e["url"]);
            return {
                "historyLength": history.length,
                "href": location.toString(),
                "scrollRestoration": history.scrollRestoration
            };
        }
        _OpenURL(e) {
            if (e["target"] === 1 || e["name"] === "_parent") {
                window.open(e["url"], "_parent");
            } else if (e["target"] === 2 || e["name"] === "_self") {
                window.open(e["url"], "_self");
            } else if (e["target"] === 3 || e["name"] === "_top") {
                window.open(e["url"], "_top");
            } else {
                this._openedWindows[e["name"]] = window.open(e["url"], e["name"]);
            }
        }
        _SetScrollRestoration(e) {
            if (e["mode"] === 0) {
                history.scrollRestoration = 'auto';
            } else if (e["mode"] === 1) {
                history.scrollRestoration = 'manual';
            }
        }
        _OnNavigation() {
            this.PostToRuntime("on-navigation", {
                "historyLength": history.length,
                "href": location.toString(),
                "scrollRestoration": history.scrollRestoration
            });
        }

        //window
        _Close(e) {
            if (e["target"] === 0) {
                if (typeof (this._openedWindows[e["name"]]["close"]) === "function") this._openedWindows[e["name"]]["close"]();
                delete this._openedWindows[e["name"]];
            } else if (e["target"] === 1) {
                window.parent.close();
            } else if (e["target"] === 2) {
                window.close();
            } else if (e["target"] === 3) {
                window.top.close();
            }
        }
        _Reload() {
            location.reload();
        }
        _Focus(e) {
            if (e["target"] === 0) {
                if (typeof (this._openedWindows[e["name"]]["focus"]) === "undefined") {
                    delete this._openedWindows[e["name"]]["focus"];
                } else {
                    this._openedWindows[e["name"]]["focus"]();
                }
            } else if (e["target"] === 1) {
                window.parent.focus();
            } else if (e["target"] === 2) {
                if (this._exportType === "nwjs") {
                    const win = this.GetNWjsWindow();
                    win["focus"]();
                } else {
                    window.focus();
                }
            } else if (e["target"] === 3) {
                window.top.focus();
            }
        }
        _Blur(e) {
            if (e["target"] === 0) {
                if (typeof (this._openedWindows[e["name"]]["blur"]) === "undefined") {
                    delete this._openedWindows[e["name"]]["blur"];
                } else {
                    this._openedWindows[e["name"]]["blur"]();
                }
            } else if (e["target"] === 1) {
                window.parent.blur();
            } else if (e["target"] === 2) {
                if (this._exportType === "nwjs") {
                    const win = this.GetNWjsWindow();
                    win["blur"]();
                } else {
                    window.blur();
                }
            } else if (e["target"] === 3) {
                window.top.blur();
            }
        }
        _RequestFullscreen(e) {
            if (this._exportType === "windows-webview2" || this._exportType === "macos-wkwebview") {
                self.RuntimeInterface._SetWrapperIsFullscreenFlag(true);
                this._iRuntime._SendWrapperMessage({
                    "type": "set-fullscreen",
                    "fullscreen": true
                });
            } else {
                const opts = {
                    "navigationUI": "auto"
                };
                const navUI = e["navUI"];
                if (navUI === 1) opts["navigationUI"] = "hide";
                else if (navUI === 2) opts["navigationUI"] = "show";
                const elem = document.documentElement;
                if (elem["requestFullscreen"]) elem["requestFullscreen"](opts);
                else if (elem["mozRequestFullScreen"]) elem["mozRequestFullScreen"](opts);
                else if (elem["msRequestFullscreen"]) elem["msRequestFullscreen"](opts);
                else if (elem["webkitRequestFullScreen"])
                    if (typeof (Element["ALLOW_KEYBOARD_INPUT"]) !== "undefined") elem["webkitRequestFullScreen"](Element["ALLOW_KEYBOARD_INPUT"]);
                    else elem["webkitRequestFullScreen"]()
            }
        }
        _CancelFullscreen() {
            if (this._exportType === "windows-webview2" || this._exportType === "macos-wkwebview") {
                self.RuntimeInterface._SetWrapperIsFullscreenFlag(false);
                this._iRuntime._SendWrapperMessage({
                    "type": "set-fullscreen",
                    "fullscreen": false
                })
            } else if (document["exitFullscreen"]) document["exitFullscreen"]();
            else if (document["mozCancelFullScreen"]) document["mozCancelFullScreen"]();
            else if (document["msExitFullscreen"]) document["msExitFullscreen"]();
            else if (document["webkitCancelFullScreen"]) document["webkitCancelFullScreen"]()
        }
        _LockOrientation(e) {
            const orientation = e["orientation"];
            if (screen["orientation"] && screen["orientation"]["lock"]) {
                screen["orientation"]["lock"](orientation).catch((err) => {
                    console.warn("[Construct 3] Failed to lock orientation: ", err);
                });
            } else {
                try {
                    let result = false;
                    if (screen["lockOrientation"]) result = screen["lockOrientation"](orientation);
                    else if (screen["webkitLockOrientation"]) result = screen["webkitLockOrientation"](orientation);
                    else if (screen["mozLockOrientation"]) result = screen["mozLockOrientation"](orientation);
                    else if (screen["msLockOrientation"]) result = screen["msLockOrientation"](orientation);
                    if (!result) console.warn("[Construct 3] Failed to lock orientation")
                } catch (err) {
                    console.warn("[Construct 3] Failed to lock orientation: ", err)
                }
            }
        }
        _UnlockOrientation() {
            try {
                if (screen["orientation"] && screen["orientation"]["unlock"]) screen["orientation"]["unlock"]();
                else if (screen["unlockOrientation"]) screen["unlockOrientation"]();
                else if (screen["webkitUnlockOrientation"]) screen["webkitUnlockOrientation"]();
                else if (screen["mozUnlockOrientation"]) screen["mozUnlockOrientation"]();
                else if (screen["msUnlockOrientation"]) screen["msUnlockOrientation"]()
            } catch (err) {}
        }
    };
    self.RuntimeInterface.AddDOMHandlerClass(HANDLER_CLASS);
};