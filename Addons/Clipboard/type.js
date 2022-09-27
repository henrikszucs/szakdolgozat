"use strict";
{
	const SDK = self.SDK;

	const PLUGIN_CLASS = SDK.Plugins.RobotKaposzta_Clipboard;

	PLUGIN_CLASS.Type = class ClipboardType extends SDK.ITypeBase {
		constructor(sdkPlugin, iObjectType) {
			super(sdkPlugin, iObjectType);
		}
	};
};