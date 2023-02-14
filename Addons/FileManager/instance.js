"use strict";
{
    const SDK = self.SDK;

    /**
     * @external IInstanceBase
     * @desc The IInstanceBase interface is used as the base class for instances in the SDK. For "world" type plugins, instances instead derive from IWorldInstanceBase, which itself derives from IInstanceBase.
     * @see https://www.construct.net/en/make-games/manuals/addon-sdk/reference/base-classes/iinstancebase
     */
    /**
     * @classdesc TextManager editor instance class.
     * @extends external:IInstanceBase
     */
    class FileManagerEditorInstance extends SDK.IInstanceBase {
        constructor(sdkType, inst) {
            super(sdkType, inst);
        }
    };
    SDK.Plugins.RobotKaposzta_FileManager.Instance = FileManagerEditorInstance;
};