"use strict";
{
    const SDK = self.SDK;

    /**
     * @external ITypeBase
     * @desc Plugin type definition in editor. It is constant class, follow API example.
     * @see https://www.construct.net/en/make-games/manuals/addon-sdk
     */
    /**
     * @classdesc TextEditor plugin type configurator in editor.
     * @extends external:ITypeBase
     */
    class TextEditorEditorType extends SDK.ITypeBase {
        /**
         * @desc Create class type.
         * @param {object} sdkPlugin - The SDK plugin from editor call.
         * @param {object} iObjectType - The plugin type from editor call.
         */
        constructor(sdkPlugin, iObjectType) {
            super(sdkPlugin, iObjectType);
        }
    };

    SDK.Plugins.RobotKaposzta_TextEditor.Type = TextEditorEditorType;
};