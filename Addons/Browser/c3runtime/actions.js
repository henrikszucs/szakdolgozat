"use strict";
{
    // 1 UNDOCUMENTED FEATURE (RequestFullscreen())
    const C3 = self.C3;
    const ORIENTATIONS = ["portrait", "landscape", "portrait-primary", "portrait-secondary", "landscape-primary", "landscape-secondary"];
    C3.Plugins.RobotKaposzta_Browser2.Acts = {
        Log(type, message, style) {
            try {
                style = JSON.parse(style);
            } catch (e) {}
            if (type === 0) {
                if (typeof (style) === "object") {
                    console.log(message, ...style);
                } else if (style !== "") {
                    console.log(message, style);
                } else {
                    console.log(message);
                }
            } else if (type === 1) {
                if (typeof (style) === "object") {
                    console.info(message, ...style);
                } else if (style !== "") {
                    console.info(message, style);
                } else {
                    console.info(message);
                }
            } else if (type === 2) {
                if (typeof (style) === "object") {
                    console.warn(message, ...style);
                } else if (style !== "") {
                    console.warn(message, style);
                } else {
                    console.warn(message);
                }
            } else if (type === 3) {
                if (typeof (style) === "object") {
                    console.error(message, ...style);
                } else if (style !== "") {
                    console.error(message, style);
                } else {
                    console.error(message);
                }
            }
        },
        Count(label) {
            console.count(label);
        },
        CountReset(label) {
            console.countReset(label);
        },
        TimeStart(label) {
            console.time(label);
        },
        TimeLog(label) {
            console.timeLog(label);
        },
        TimeEnd(label) {
            console.timeEnd(label);
        },
        Table(json) {
            try {
                json = JSON.parse(json);
            } catch (err) {
                console.error("Error pharsing Json: ", err);
            }
            console.table(json);
        },
        StartGroup(label, collapse) {
            if (collapse === 0) console.group(label);
            else console.groupCollapsed(label);
        },
        EndGroup() {
            console.groupEnd();
        },
        Clear() {
            console.clear();
        },

        Vibrate(pattern) {
            const arr = pattern.split(",");
            for (let i = 0, len = arr.length; i < len; ++i) {
                arr[i] = parseInt(arr[i], 10);
            }
            this.PostToDOM("vibrate", {
                "pattern": arr
            });
        },

        SetTitle(title) {
            this._title = title;
            this.PostToDOM("set-title", {
                "title": title
            });
        },
        SetFavicon(type, url) {
            this._runtime.GetAssetManager().GetProjectFileUrl(url).then((url) => {
                this.PostToDOM("set-favicon", {
                    "type": type,
                    "url": url
                });
            });
        },
        SetThemeColor(color) {
            this._themeColor = color;
            this.PostToDOM("set-theme-color", {
                "theme-color": color
            });
        },
        SetClosePrevent(prevent) {
            this._isClosePrevent = (prevent === 0);
            this.PostToDOM("set-close-prevent", {
                "prevent": this._isClosePrevent
            });
        },
        LoadStylesheet(url) {
            this._runtime.GetAssetManager().GetProjectFileUrl(url).then((url) => {
                this.PostToDOM("load-stylesheet", {
                    "url": url
                });
            });
        },
        UnloadStylesheet(url) {
            this._runtime.GetAssetManager().GetProjectFileUrl(url).then((url) => {
                this.PostToDOM("unload-stylesheet", {
                    "url": url
                });
            });
        },
        async ExecJs(context, code) {
            if (context === 0) {
                this._execJsResult = await this.PostToDOMAsync("exec-js", {
                    "code": code
                });
            } else {
                this._execJsResult = await eval(code);
            }
            this.Trigger(C3.Plugins.RobotKaposzta_Browser2.Cnds.OnExecJs);
        },

        Go(direction, amount) {
            this.PostToDOM("go", {
                "direction": direction,
                "amount": amount
            });
        },
        async PushURL(url) {
            const e = await this.PostToDOMAsync("push-url", {
                "url": url
            });
            this._historyLength = e["historyLength"];
            this._href = e["href"];
            this._scrollRestoration = e["scrollRestoration"];
            this.Trigger(C3.Plugins.RobotKaposzta_Browser2.Cnds.OnNavigation);
        },
        async ReplaceURL(url) {
            const e = await this.PostToDOMAsync("replace-url", {
                "url": url
            });
            this._historyLength = e["historyLength"];
            this._href = e["href"];
            this._scrollRestoration = e["scrollRestoration"];
            this.Trigger(C3.Plugins.RobotKaposzta_Browser2.Cnds.OnNavigation);
        },
        OpenURL(url, target, name) {
            this.PostToDOM("open-url", {
                "url": url,
                "target": target,
                "name": name
            });
        },
        SetScrollRestoration(mode) {
            this._scrollRestoration = (mode === 0 ? "auto" : "manual");
            this.PostToDOM("set-scroll-restoration", {
                "mode": mode,
            });
        },

        Close(target, name) {
            this.PostToDOM("close", {
                "target": target,
                "name": name
            });
        },
        Reload() {
            this.PostToDOM("reload");
        },
        Focus(target, name) {
            this.PostToDOM("focus", {
                "target": target,
                "name": name
            });
        },
        Blur(target, name) {
            this.PostToDOM("blur", {
                "target": target,
                "name": name
            });
        },
        RequestFullscreen(mode, navUI) {
            if (mode >= 2) mode += 1;
            if (mode === 6) mode = 2;
            if (mode === 1) mode = 0;
            const modeStr = C3.CanvasManager._FullscreenModeNumberToString(mode); //!!!undocumented
            this._runtime.GetCanvasManager().SetDocumentFullscreenMode(modeStr); //!!!undocumented
            this.PostToDOM("request-fullscreen", {
                "navUI": navUI
            });
        },
        CancelFullscreen() {
            this.PostToDOM("cancel-fullscreen");
        },
        LockOrientation(o) {
            o = Math.floor(o);
            if (o < 0 || o >= ORIENTATIONS.length) return;
            const orientation = ORIENTATIONS[o];
            this.PostToDOM("lock-orientation", {
                "orientation": orientation
            });
        },
        UnlockOrientation() {
            this.PostToDOM("unlock-orientation");
        }
    };
};