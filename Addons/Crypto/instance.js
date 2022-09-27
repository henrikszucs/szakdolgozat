"use strict";
{
    const SDK = self.SDK;

    const PLUGIN_CLASS = SDK.Plugins.RobotKaposzta_Crypto;

    PLUGIN_CLASS.Instance = class CryptoInstance extends SDK.IInstanceBase {
        constructor(sdkType, inst) {
            super(sdkType, inst);
        }

        Release() {

        }

        OnCreate() {

        }

        LoadC2Property(name, valueString) {
            return false; // not handled
        }
    }
};