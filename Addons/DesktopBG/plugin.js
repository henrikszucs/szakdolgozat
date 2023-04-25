"use strict";
{
    const SDK = self.SDK;
    const PLUGIN_ID = "RobotKaposzta_DesktopBG";
    const PLUGIN_VERSION = "0.0.0.1";

    /**
     * @external IPluginBase
     * @desc The main configuration for a plugin.
     * @see https://www.construct.net/en/make-games/manuals/addon-sdk/guide/configuring-plugins
     * @see https://www.construct.net/en/make-games/manuals/addon-sdk/reference/iplugininfo
     * @see https://www.construct.net/en/make-games/manuals/addon-sdk/reference/pluginproperty
     */
    /**
     * @classdesc TextManager plugin configurator.
     * @extends external:IPluginBase
     */
    class DesktopBGEditorPlugin extends SDK.IPluginBase {
        constructor() {
            super(PLUGIN_ID);

            SDK.Lang.PushContext("plugins." + PLUGIN_ID.toLowerCase());

            this._info.SetName(SDK.Lang.Get(".name"));
            this._info.SetDescription(SDK.Lang.Get(".description"));
            this._info.SetVersion(PLUGIN_VERSION);
            this._info.SetCategory("platform-specific");
            this._info.SetAuthor("Szűcs Henrik");
            this._info.SetHelpUrl(SDK.Lang.Get(".help-url"));
            this._info.SetPluginType("object");
            this._info.SetIsSingleGlobal(true);
            this._info.SetDOMSideScripts(["c3runtime/domSide.js"]);

            SDK.Lang.PushContext(".properties");
            this._info.SetProperties([
                new SDK.PluginProperty("text", "text", {"initialValue": SDK.Lang.Get(".text.value")}),
				new SDK.PluginProperty("check", "is-enabled", {"initialValue": "true"})
            ]);
            SDK.Lang.PopContext();

            SDK.Lang.PopContext();

        }
    };
    SDK.Plugins.RobotKaposzta_DesktopBG = DesktopBGEditorPlugin;
    DesktopBGEditorPlugin.Register(PLUGIN_ID, DesktopBGEditorPlugin);
}