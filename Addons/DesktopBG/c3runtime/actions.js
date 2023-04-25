"use strict";
{
    const C3 = self.C3;

    self.C3.Plugins.RobotKaposzta_DesktopBG.Acts = {
        SetText(text) {
            this._SetText(text);
        },
        SetEnabled(status) {
            this._SetEnabled(!status);
        }
    };
};