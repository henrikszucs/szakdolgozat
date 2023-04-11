"use strict";
{
    const SDK = self.SDK;
    const PLUGIN_ID = "RobotKaposzta_Mail";
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
    class MailEditorPlugin extends SDK.IPluginBase {
        constructor() {
            super(PLUGIN_ID);

            SDK.Lang.PushContext("plugins." + PLUGIN_ID.toLowerCase());

            this._info.SetName(SDK.Lang.Get(".name"));
            this._info.SetDescription(SDK.Lang.Get(".description"));
            this._info.SetVersion(PLUGIN_VERSION);
            this._info.SetCategory("web");
            this._info.SetAuthor("Szűcs Henrik");
            this._info.SetHelpUrl(SDK.Lang.Get(".help-url"));
            this._info.SetPluginType("object");
            this._info.SetIsSingleGlobal(true);
            this._info.SetDOMSideScripts(["c3runtime/domSide.js"]);
            this._info.AddFileDependency({
                "type": "copy-to-output",
                "filename": "c3runtime/nodemailer.js",
                "fileType": "text/javascript"
            });
            this._info.AddCordovaPluginReference({
                "id": "construct-mobile-smtp"
            });

            SDK.Lang.PushContext(".properties");
            this._info.SetProperties([

            ]);
            SDK.Lang.PopContext();

            SDK.Lang.PopContext();

        }
    };
    SDK.Plugins.RobotKaposzta_Mail = MailEditorPlugin;
    MailEditorPlugin.Register(PLUGIN_ID, MailEditorPlugin);
}