"use strict";
{
	const C3 = self.C3;
	/**
	 * @external SDKTypeBase
	 * @see https://www.construct.net/en/make-games/manuals/addon-sdk/runtime-reference/base-classes/sdktypebase
	 */
    /**
	 * @classdesc TextManager editor class.
	 * @extends external:SDKTypeBase
	 */
	class TextManagerRuntimeType extends C3.SDKTypeBase {
		constructor(objectClass) {
			super(objectClass);
		}
	};
	C3.Plugins.RobotKaposzta_TextManager.Type = TextManagerRuntimeType;
};