"use strict";
{
    const C3 = self.C3;
    const DOM_COMPONENT_ID = "RobotKaposzta_DesktopBG";

    /**
     * @external SDKInstanceBase
     * @desc The SDKInstanceBase interface is used as the base class for runtime instances in the SDK. For "world" type plugins, instances instead derive from SDKWorldInstanceBase which itself derives from SDKInstanceBase.
     * @see https://www.construct.net/en/make-games/manuals/addon-sdk/runtime-reference/base-classes/sdkinstancebase
     */
    /**
     * @classdesc TextManager editor class. 1 UNDOCUMENTED FEATURE new C3.CompositeDisposable();
     * @extends external:SDKInstanceBase
     */
    class DesktopBGRuntimeInstance extends C3.SDKInstanceBase {
        constructor(inst, properties) {
            super(inst, DOM_COMPONENT_ID);

            this._text = properties[0];
            this._isEnabled = properties[1];

            this._UpdateState();
        }

        SaveToJson() {
            return [this._text, this._isEnabled];
        }
        LoadFromJson(o) {
            this._text = o[0];
            this._isEnabled = o[1];
        }
        GetDebuggerProperties() {
            const prefix = "plugins.robotkaposzta_desktopbg.debugger";
            return [{
                    "title": prefix + ".title",
                    "properties": [{
                            "name": prefix + ".text",
                            "value": this._text,
                            "onedit": v => this._SetText(v)
                        },
                        {
                            "name": prefix + ".is-enabled",
                            "value": this._isEnabled,
                            "onedit": v => this._SetEnabled(v)
                        }
                    ]
                },
            ];
        }

        _SetText(text) {
            this._text = text;
            this._UpdateState();
        }
        _SetEnabled(isEnable) {
            this._isEnabled = isEnable;
            this._UpdateState();
        }

        _UpdateState() {
            this.PostToDOM("update", [this._text, this._isEnabled]);
        }
    };
    C3.Plugins.RobotKaposzta_DesktopBG.Instance = DesktopBGRuntimeInstance;
};