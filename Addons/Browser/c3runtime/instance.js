"use strict";
{
    // 3 UNDOCUMENTED FEATURE this._runtime.GetExportType(), new C3.CompositeDisposable(); this._runtime.GetCanvasManager().IsDocumentFullscreen();
    const C3 = self.C3;
    const DOM_COMPONENT_ID = "RobotKaposzta_Browser2";
    C3.Plugins.RobotKaposzta_Browser2.Instance = class Browser2Instance extends C3.SDKInstanceBase {
        constructor(inst) {
            super(inst, DOM_COMPONENT_ID);

            this._exportType = this._runtime.GetExportType(); //!!!!Undocumented (for system)

            //device
            this._isOnline = false;
            this._browserType = "";
            this._vendor = "";
            //document
            this._title = "";
            this._colorScheme = "";
            this._themeColor = "";
            this._isClosePrevent = false;
            this._execJsResult = "";
            //navigation
            this._historyLength = 0;
            this._href = "";
            this._scrollRestoration = "";

            //for in communication
            this.AddDOMMessageHandlers([
                ["on-back", () => this._OnBack()],
                ["on-online", () => this._OnOnline()],
                ["on-offline", () => this._OnOffline()],

                ["sw-message", (e) => this._OnSWMessage(e)],
                ["on-color-scheme-change", (e) => this._OnColorSchemeChange(e)],
                ["on-close-prevent", () => this._OnClosePrevent()],

                ["on-navigation", (e) => this._OnNavigation(e)]
            ]);

            //for startup
            this._runtime.AddLoadPromise(
                this.PostToDOMAsync("get-initial-state", {
                    "exportType": this._exportType
                }).then((data) => {
                    this._isOnline = data["isOnline"];
                    this._browserType = data["browser-type"];
                    this._vendor = data["vendor"];

                    this._title = data["title"];
                    this._colorScheme = data["colorScheme"];
                    this._themeColor = data["themeColor"];

                    this._historyLength = data["historyLength"];
                    this._href = data["href"];
                    this._scrollRestoration = data["scrollRestoration"];
                })
            );

            //!!!!Undocumented (for special events)
            const rt = this._runtime.Dispatcher();
            this._disposables = new C3.CompositeDisposable(
                C3.Disposable.From(
                    rt,
                    "afterfirstlayoutstart",
                    () => this._OnAfterFirstLayoutStart()
                ),
                C3.Disposable.From(
                    rt,
                    "window-resize",
                    () => this._OnResize()
                )
            );
        }

        Release() {
            super.Release()
        }

        GetDebuggerProperties() {
            const prefix = "plugins.robotkaposzta_browser2.debugger";
            return [{
                "title": prefix + ".name",
                "properties": [{
                    "name": prefix + ".user-agent",
                    "value": self.navigator.userAgent
                },
                {
                    "name": prefix + ".is-online",
                    "value": this._isOnline
                },
                {
                    "name": prefix + ".is-fullscreen",
                    "value": this._runtime.GetCanvasManager().IsDocumentFullscreen()
                },
                {
                    "name": prefix + ".is-prevent-close",
                    "value": this._isClosePrevent
                },
                {
                    "name": prefix + ".browser-type",
                    "value": ["Chrome", "Edge", "Firefox", "Safari", "Opera", "Other"][this._browserType]
                }]
            }];
        }

        //device
        _OnBack() {
            this.Trigger(C3.Plugins.RobotKaposzta_Browser2.Cnds.OnBack);
        }
        _OnOnline() {
            this.Trigger(C3.Plugins.RobotKaposzta_Browser2.Cnds.OnOnline);
        }
        _OnOffline() {
            this.Trigger(C3.Plugins.RobotKaposzta_Browser2.Cnds.OnOffline);
        }

        //document
        _OnAfterFirstLayoutStart() {
            this.PostToDOM("ready-for-sw-messages");
        }
        _OnSWMessage(e) {
            const messageType = e["type"];
            if (messageType === "downloading-update") this.Trigger(C3.Plugins.RobotKaposzta_Browser2.Cnds.OnUpdateFound);
            else if (messageType === "update-ready" || messageType === "update-pending") this.Trigger(C3.Plugins.RobotKaposzta_Browser2.Cnds.OnUpdateReady);
            else if (messageType === "offline-ready") this.Trigger(C3.Plugins.RobotKaposzta_Browser2.Cnds.OnOfflineReady)
        }
        _OnColorSchemeChange(e) {
            this._colorScheme = e["color-scheme"];
            this.Trigger(C3.Plugins.RobotKaposzta_Browser2.Cnds.OnColorSchemeChange);
        }
        _OnClosePrevent() {
            this.Trigger(C3.Plugins.RobotKaposzta_Browser2.Cnds.OnClosePrevent);
        }

        //navigation
        _OnNavigation(e) {
            this._historyLength = e["historyLength"];
            this._href = e["href"];
            this._scrollRestoration = e["scrollRestoration"];
            this.Trigger(C3.Plugins.RobotKaposzta_Browser2.Cnds.OnNavigation);
        }
        _URLManager(method, href, replace) {
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
            if (typeof (replace) !== "undefined") {
                url[method] = replace;
                return url.toString();
            } else {
                return url[method];
            }
        }

        //window
        _OnResize() {
            this.Trigger(C3.Plugins.RobotKaposzta_Browser2.Cnds.OnResize)
        }
    };
};