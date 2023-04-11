"use strict";
{
    const SDK = self.SDK;
    const PLUGIN_ID = "RobotKaposzta_CSV";
    const PLUGIN_VERSION = "0.0.0.2";

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
    class CSVEditorPlugin extends SDK.IPluginBase {
        /**
         * @desc Create plugin's basic editor settings.
         */
        constructor() {
            super(PLUGIN_ID);

            SDK.Lang.PushContext("plugins." + PLUGIN_ID.toLowerCase());

            this._info.SetName(SDK.Lang.Get(".name"));
            this._info.SetDescription(SDK.Lang.Get(".description"));
            this._info.SetVersion(PLUGIN_VERSION);
            this._info.SetCategory("data-and-storage");
            this._info.SetAuthor("Henrik Szűcs");
            this._info.SetHelpUrl(SDK.Lang.Get(".help-url"));
            this._info.SetPluginType("object");
            this._info.SetIsSingleGlobal(true);

            SDK.Lang.PopContext();
        }
    };

    SDK.Plugins.RobotKaposzta_CSV = CSVEditorPlugin;
    CSVEditorPlugin.Register(PLUGIN_ID, CSVEditorPlugin);
};