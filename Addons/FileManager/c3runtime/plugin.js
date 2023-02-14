"use strict";
{
	const C3 = self.C3;
	/**
	 * @external SDKPluginBase
	 * @desc The SDKPluginBase interface is used as the base class for your plugin in the runtime.
	 * @see https://www.construct.net/en/make-games/manuals/addon-sdk/runtime-reference/base-classes/sdkpluginbase
	 */
    /**
	 * @classdesc FileManager editor class.
	 * @extends external:SDKPluginBase
	 */
	class FileManagerRuntimePlugin extends C3.SDKPluginBase {
		/**
		 * @desc Initialize plugin in runtime.
		 * @param {object} opts - Options that gives to the parent's constructor.
		 */
		constructor(opts) {
			super(opts);
		}
	};
	C3.Plugins.RobotKaposzta_FileManager = FileManagerRuntimePlugin;
};