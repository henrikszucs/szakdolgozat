"use strict";
{
	const SDK = self.SDK;
	const PLUGIN_CLASS = SDK.Plugins.RobotKaposzta_TextManager;
	
	/**
	 * @external ITypeBase
	 * @desc Plugin type definition in editor.
	 */
	/**
	 * @classdesc TextManagerType plugin configurator.
	 * @extends external:ITypeBase
	 */
	class TextManagerEditorType extends SDK.ITypeBase {
		/**
		 * @desc create class.
		 * @param {object} sdkPlugin - The title of the book.
		 * @param {object} iObjectType - The author of the book.
		 */
		constructor(sdkPlugin, iObjectType) {
			super(sdkPlugin, iObjectType);
		}
	};
	
	PLUGIN_CLASS.Type = TextManagerType;
};