"use strict";
{
    const SDK = self.SDK;

    const PLUGIN_ID = "RobotKaposzta_Desktop";
    const PLUGIN_VERSION = "0.0.1.0";
    const PLUGIN_CATEGORY = "platform-specific";
    const PLUGIN_CLASS = SDK.Plugins.RobotKaposzta_Desktop = class DesktopPlugin extends SDK.IPluginBase {
        constructor() {
            super(PLUGIN_ID);

            SDK.Lang.PushContext("plugins." + PLUGIN_ID.toLowerCase());

            this._info.SetName(SDK.Lang.Get(".name"));
            this._info.SetDescription(SDK.Lang.Get(".description"));
            this._info.SetVersion(PLUGIN_VERSION);
            this._info.SetCategory(PLUGIN_CATEGORY);
            this._info.SetAuthor("Szűcs Henrik");
            this._info.SetHelpUrl(SDK.Lang.Get(".help-url"));
            this._info.SetPluginType("object");
            this._info.SetIsSingleGlobal(true);
            this._info.SetDOMSideScripts(["c3runtime/domSide.js"]);

            SDK.Lang.PushContext(".properties");
            this._info.SetProperties([
                new SDK.PluginProperty("check", "window-frame", {"initialValue": true}),
                new SDK.PluginProperty("check", "instance-prevent", {"initialValue": false}),
                new SDK.PluginProperty("text", "url-load", {"initialValue": ""}),
                new SDK.PluginProperty("link", "export-start", {"linkCallback": ((e) => {e._Export();}), "callbackType": "for-each-instance"}),
            ]);
            SDK.Lang.PopContext();

            SDK.Lang.PopContext();
        }
    };

    PLUGIN_CLASS.Register(PLUGIN_ID, PLUGIN_CLASS);
};