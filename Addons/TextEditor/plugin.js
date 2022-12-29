"use strict";
{
    const SDK = self.SDK;
    const PLUGIN_ID = "RobotKaposzta_TextEditor";
    const PLUGIN_VERSION = "1.0.0.1";

    /**
     * @external IPluginBase
     * @desc The main configuration for a plugin.
     * @see https://www.construct.net/en/make-games/manuals/addon-sdk/guide/configuring-plugins
     * @see https://www.construct.net/en/make-games/manuals/addon-sdk/reference/iplugininfo
     * @see https://www.construct.net/en/make-games/manuals/addon-sdk/reference/pluginproperty
     */
    /**
     * @classdesc TextEditor plugin configurator in editor.
     * @extends external:IPluginBase
     */
    class TextEditorEditorPlugin extends SDK.IPluginBase {
        /**
         * @desc Create plugin's basic editor settings.
         */
        constructor() {
            super(PLUGIN_ID);

            SDK.Lang.PushContext("plugins." + PLUGIN_ID.toLowerCase());

            this._info.SetName(self.lang(".name"));
            this._info.SetDescription(self.lang(".description"));
            this._info.SetVersion(PLUGIN_VERSION);
            this._info.SetCategory("form-controls");
            this._info.SetAuthor("Henrik Szűcs");
            this._info.SetHelpUrl(self.lang(".help-url"));
            this._info.SetPluginType("world");
            this._info.SetIsSingleGlobal(false);

            this._info.SetIsResizable(true);
            this._info.SetIsRotatable(false);
            this._info.SetIs3D(false);
            this._info.SetHasImage(false);
            this._info.SetIsTiled(false);
            this._info.SetSupportsZElevation(false);
            this._info.SetSupportsColor(false);
            this._info.SetSupportsEffects(false);
            this._info.SetMustPreDraw(false);

            this._info.AddCommonSizeACEs();
            this._info.AddCommonPositionACEs();

            this._info.SetDOMSideScripts(["c3runtime/domSide.js"]);

            this._info.AddFileDependency({
                "type": "external-dom-script",
                "filename": "c3runtime/quill/quill.min.js"
            });
            this._info.AddFileDependency({
                "type": "external-css",
                "filename": "c3runtime/quill/quill.min.css"
            });

            SDK.Lang.PushContext(".properties");
            this._info.SetProperties([
                new SDK.PluginProperty("longtext", "text", {
                    "initialValue": ""
                }),
                new SDK.PluginProperty("longtext", "text-html", {
                    "initialValue": ""
                }),
                new SDK.PluginProperty("text", "placeholder", {
                    "initialValue": ""
                }),
                new SDK.PluginProperty("text", "tooltip", {
                    "initialValue": ""
                }),
                new SDK.PluginProperty("check", "read-only", {
                    "initialValue": false
                }),
                new SDK.PluginProperty("check", "visible", {
                    "initialValue": true
                })
            ]);
            SDK.Lang.PopContext();

            SDK.Lang.PopContext();
        }
    };

    SDK.Plugins.RobotKaposzta_TextEditor = TextEditorEditorPlugin;
    TextEditorEditorPlugin.Register(PLUGIN_ID, TextEditorEditorPlugin);
};