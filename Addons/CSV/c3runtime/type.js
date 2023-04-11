"use strict";
{
	const C3 = self.C3;
	/**
	 * @external SDKTypeBase
	 * @desc The SDKTypeBase interface is used as the base class for runtime object types in the SDK. An object type corresponds to an object listed in the Project Bar. Object types may have multiple instances.
	 * @see https://www.construct.net/en/make-games/manuals/addon-sdk/runtime-reference/base-classes/sdktypebase
	 */
    /**
	 * @classdesc TextManager editor class.
	 * @extends external:SDKTypeBase
	 */
	class CSVRuntimeType extends C3.SDKTypeBase {
		/**
		 * @desc Initialize plugin in runtime.
		 * @param {object} objectClass - Plugin's class that give to the parent's constructor.
		 */
		constructor(objectClass) {
			super(objectClass);
		}
	};
	C3.Plugins.RobotKaposzta_CSV.Type = CSVRuntimeType;
};