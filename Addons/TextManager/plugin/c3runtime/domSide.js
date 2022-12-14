"use strict";
{
    const DOM_COMPONENT_ID = "RobotKaposzta_TextManager";

    /**
     * @external DOMHandler
     * @desc This class run in the runtime side. <br><br> The DOMHandler interface is a base class for DOM-side scripts (typically in domSide.js). This means it does not have access to the runtime, since in Web Worker mode the runtime is hosted in a separate JavaScript context within the worker. However the DOM-side script does have access to the full DOM APIs, e.g. document, and using the messaging methods can communicate with the runtime. See DOM calls in the C3 runtime for more information.
     * @see https://www.construct.net/en/make-games/manuals/addon-sdk/runtime-reference/base-classes/domhandler
     */
    /**
     * @classdesc TextManager editor class.
     * @extends external:DOMHandler
     */
    class TextManagerRuntimeDOMHandler extends self.DOMHandler {
        constructor(iRuntime) {
            super(iRuntime, DOM_COMPONENT_ID);

            this._isSaveLang = false;

            this.AddRuntimeMessageHandlers([
                ["get-init", (e) => this._GetInit(e)],

                ["change-lang", (e) => this._ChangeLang(e)]
            ]);

            window.addEventListener("languagechange", () => this._OnDeviceLanguageChange());
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
    self.RuntimeInterface.AddDOMHandlerClass(TextManagerRuntimeDOMHandler);
};