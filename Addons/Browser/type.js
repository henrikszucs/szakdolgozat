"use strict";
{
	const SDK = self.SDK;

	const PLUGIN_CLASS = SDK.Plugins.RobotKaposzta_Browser2;

	PLUGIN_CLASS.Type = class Browser2Type extends SDK.ITypeBase {
		constructor(sdkPlugin, iObjectType) {
			super(sdkPlugin, iObjectType);
		}
	};
};