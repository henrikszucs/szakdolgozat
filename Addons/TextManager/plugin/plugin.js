"use strict";
{
	const SDK = self.SDK;
	const PLUGIN_ID = "RobotKaposzta_TextManager";
	const PLUGIN_VERSION = "0.0.1.0";
	const PLUGIN_CATEGORY = "other";

	/**
	 * @external IPluginBase
	 * @see https://www.construct.net/en/make-games/manuals/addon-sdk/reference/iplugininfo
	 * @see https://www.construct.net/en/make-games/manuals/addon-sdk/reference/pluginproperty
	 */
	/**
	 * @classdesc TextManager plugin configurator.
	 * @extends external:IPluginBase
	 */
	class TextManagerEditorPlugin extends SDK.IPluginBase {
		/**
		 * @desc create class.
		 */
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
				new SDK.PluginProperty("longtext", "all-language", {"initialValue": "en-US"}),
				new SDK.PluginProperty("text", "default-language", {"initialValue": "en-US"}),
				new SDK.PluginProperty("check", "save-language", {"initialValue": "true"}),
				new SDK.PluginProperty("check", "save-state", {"initialValue": ""}),

				new SDK.PluginProperty("group", "import-group"),
				new SDK.PluginProperty("combo", "import-format", {"initialValue": "array", "items": ["json-single", "json-multiple", "csv", "dictionary", "array"]}),
				new SDK.PluginProperty("combo", "import-mode", {"initialValue": "file", "items": ["file", "data"]}),
				new SDK.PluginProperty("longtext", "import-source", {"initialValue": ""}),
				new SDK.PluginProperty("longtext", "import-language", {"initialValue": ""}),
				new SDK.PluginProperty("longtext", "import-tag", {"initialValue": ""}),

				new SDK.PluginProperty("group", "convert-group"),
				new SDK.PluginProperty("combo", "convert-input-format", {"initialValue": "array", "items": ["json-single", "json-multiple", "csv", "dictionary", "array"]}),
				new SDK.PluginProperty("longtext", "convert-input-source", {"initialValue": ""}),
				new SDK.PluginProperty("text", "convert-input-language", {"initialValue": ""}),
				new SDK.PluginProperty("combo", "convert-output-format", {"initialValue": "array", "items": ["json-single", "json-multiple", "csv", "dictionary", "array"]}),
				new SDK.PluginProperty("link", "convert-start", {"linkCallback": ((e) => {e._Convert();}), "callbackType": "for-each-instance"}),
				new SDK.PluginProperty("longtext", "convert-output-source", {"initialValue": ""})
			]);
			SDK.Lang.PopContext();

			SDK.Lang.PopContext();
		}
	};

	SDK.Plugins.RobotKaposzta_TextManager = TextManagerEditorPlugin;
	TextManagerEditorPlugin.Register(PLUGIN_ID, TextManagerEditorPlugin);
};