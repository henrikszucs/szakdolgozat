"use strict";
{
    const SDK = self.SDK;

    /**
     * @external ITypeBase
     * @desc Plugin type definition in editor. It is constant class, follow API example.
     * @see https://www.construct.net/en/make-games/manuals/addon-sdk
     */
    /**
     * @classdesc TextManagerType plugin configurator.
     * @extends external:ITypeBase
     */
    class MailEditorType extends SDK.ITypeBase {
        /**
         * @desc create class.
         * @param {object} sdkPlugin - The SDK plugin from editor call.
         * @param {object} iObjectType - The plugin type from editor call.
         */
        constructor(sdkPlugin, iObjectType) {
            super(sdkPlugin, iObjectType);
        }
    };

    SDK.Plugins.RobotKaposzta_Mail.Type = MailEditorType;
};