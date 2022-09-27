"use strict";
{
	const SDK = self.SDK;

	const PLUGIN_CLASS = SDK.Plugins.RobotKaposzta_TextManager;
	
	PLUGIN_CLASS.Type = class TextManagerType extends SDK.ITypeBase
	{
		constructor(sdkPlugin, iObjectType)
		{
			super(sdkPlugin, iObjectType);
		}
	};
};