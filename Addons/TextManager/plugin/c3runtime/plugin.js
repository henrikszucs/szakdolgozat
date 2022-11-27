"use strict";
{
	const C3 = self.C3;
	/**
	 * @external SDKPluginBase
	 * @see https://www.construct.net/en/make-games/manuals/addon-sdk/runtime-reference/base-classes/sdkpluginbase
	 */
    /**
	 * @classdesc TextManager editor class.
	 * @extends external:SDKPluginBase
	 */
	class TextManagerRuntimePlugin extends C3.SDKPluginBase {
		constructor(opts) {
			super(opts);
		}
	};
	C3.Plugins.RobotKaposzta_TextManager = TextManagerRuntimePlugin;
};