"use strict";
{
    const DOM_COMPONENT_ID = "RobotKaposzta_DesktopBG";
    /**
     * @external DOMHandler
     * @desc This class run in the runtime side. <br><br> The DOMHandler interface is a base class for DOM-side scripts (typically in domSide.js). This means it does not have access to the runtime, since in Web Worker mode the runtime is hosted in a separate JavaScript context within the worker. However the DOM-side script does have access to the full DOM APIs, e.g. document, and using the messaging methods can communicate with the runtime. See DOM calls in the C3 runtime for more information.
     * @see https://www.construct.net/en/make-games/manuals/addon-sdk/runtime-reference/base-classes/domhandler
     */
    /**
     * @classdesc TextManager editor class.
     * @extends external:DOMHandler
     */
    class DesktopBGRuntimeDOMHandler extends self.DOMHandler {
        constructor(iRuntime) {
            super(iRuntime, DOM_COMPONENT_ID);

            this.text = "";
            this.isEnabled = false;
            this.AddRuntimeMessageHandlers([
                ["update", (o) => this.UpdateState(o)]
            ]);

            //start litener
            let SELF = this;
            self?.["nw"]?.["Window"]?.["get"]?.()?.["on"]("close", function () {
                if (SELF.isEnabled) {
                    //hide window
                    this["hide"]();

                    // Create a tray icon
                    let tray = new self["nw"]["Tray"]({ "title": "", "icon": "icons/icon-64.png" });
                    tray["on"]("click", function() {
                        let win = self["nw"]["Window"]["get"]();
                        win["show"]();
                        win["focus"]();
                        tray["remove"]();
                        tray = undefined;
                    });

                    // Give it a menu
                    let menu = new self["nw"]["Menu"]();
                    menu["append"](new self["nw"]["MenuItem"]({
                        "type": "normal",
                        "label": SELF.text,
                        "click": function() {
                            self["nw"]["Window"]["get"]()["close"](true);
                        }
                    }));
                    tray["menu"] = menu;
                } else {
                    //close window
                    this["close"](true);
                }
            });
        }
        UpdateState(o) {
            this.text = o[0];
            this.isEnabled = o[1];
        }
    };
    self.RuntimeInterface.AddDOMHandlerClass(DesktopBGRuntimeDOMHandler);
};