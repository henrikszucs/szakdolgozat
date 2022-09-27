"use strict";
{
    const DOM_COMPONENT_ID = "RobotKaposzta_TextManager";
    const HANDLER_CLASS = class TextManagerDOMHandler extends self.DOMHandler {
        constructor(iRuntime) {
            super(iRuntime, DOM_COMPONENT_ID);

            this._isSaveLang = false;

            this.AddRuntimeMessageHandlers([
                ["get-init", (e) => this._GetInit(e)],

                ["change-lang", (e) => this._ChangeLang(e)]
            ]);

            window.addEventListener('languagechange', () => this._OnDeviceLanguageChange());
        }

        _GetInit(e) {
            this._isSaveLang = e["is-save-lang"];
            if (this._isSaveLang) {
                const storedLanguage = localStorage.getItem(DOM_COMPONENT_ID);
                if (storedLanguage === null) {
                    localStorage.setItem(DOM_COMPONENT_ID, e["current-language"]);
                    return {
                        "current-language": e["current-language"]
                    };
                } else {
                    return {
                        "current-language": storedLanguage
                    };
                }
            }
            return {};
        }

        _OnDeviceLanguageChange() {
            this.PostToRuntime("on-device-language-change");
        }

        _ChangeLang(e) {
            document.getElementsByTagName("html")[0].setAttribute("lang", e["lang"]);
            if (this._isSaveLang) localStorage.setItem(DOM_COMPONENT_ID, e["lang"]);
        }
    };
    self.RuntimeInterface.AddDOMHandlerClass(HANDLER_CLASS);
};