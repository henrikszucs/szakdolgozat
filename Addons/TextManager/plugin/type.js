"use strict";
{
	const SDK = self.SDK;
	const PLUGIN_CLASS = SDK.Plugins.RobotKaposzta_TextManager;
	
	/**
	 * @external ITypeBase
	 * @desc Plugin type definition in editor. It is constant class, follow API example.
	 * @see https://www.construct.net/en/make-games/manuals/addon-sdk
	 */
	/**
	 * @classdesc TextManagerType plugin configurator.
	 * @extends external:ITypeBase
	 */
	class TextManagerEditorType extends SDK.ITypeBase {
		/**
		 * @desc create class.
		 * @param {object} sdkPlugin - The SDK plugin object calls from editor.
		 * @param {object} iObjectType - The plugin type from editor.
		 */
		constructor(sdkPlugin, iObjectType) {
			super(sdkPlugin, iObjectType);
		}
	};
	
	PLUGIN_CLASS.Type = TextManagerEditorType;
};