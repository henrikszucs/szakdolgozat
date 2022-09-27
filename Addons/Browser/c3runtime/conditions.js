"use strict";
{
    //!!!! 1 UNDOCUMENTED this._runtime.GetCanvasManager().IsDocumentFullscreen()
    const C3 = self.C3;
    C3.Plugins.RobotKaposzta_Browser2.Cnds = {
        OnBack() {
            return true;
        },
        IsPortraitLandscape(p) {
            const Width = this._runtime.GetCanvasCssWidth();
            const Height = this._runtime.GetCanvasCssHeight();
            const current = Width <= Height ? 0 : 1;
            return current === p;
        },
        OnOnline() {
            return true;
        },
        OnOffline() {
            return true;
        },
        IsOnline() {
            return this._isOnline;
        },
        IsBrowserType(type) {
            return type === this._browserType;
        },

        OnOfflineReady() {
            return true;
        },
        OnUpdateFound() {
            return true;
        },
        OnUpdateReady() {
            return true;
        },
        OnColorSchemeChange() {
            return true;
        },
        IsColorScheme(mode) {
            if (mode === 0) {
                return this._colorScheme === "light";
            } else {
                return this._colorScheme === "dark";
            }
        },
        OnClosePrevent() {
            return true;
        },
        IsClosePrevent() {
            return this._isClosePrevent;
        },
        OnExecJs() {
            return true;
        },

        OnNavigation() {
            return true;
        },
        IsScrollRestoration(scrollrestoration) {
            if (scrollrestoration === 0) {
                return this._scrollRestoration === "auto";
            } else {
                return this._scrollRestoration === "manual";
            }
        },
        IsUrl(url) {
            try {
                const check = new URL(url);
            } catch (error) {
                return false;
            }
            return true;
        },

        OnResize() {
            return true;
        },
        IsFullscreen() {
            return this._runtime.GetCanvasManager().IsDocumentFullscreen()
        }
    };
};