"use strict";
{
    const C3 = self.C3;

    self.C3.Plugins.RobotKaposzta_Mail.Cnds = {
        IsSendSupported() {
            return this._support.isNode || this._support.isCordova;
        },
        OnSendCompleted() {
            return true;
        },
        OnSendError() {
            return true;
        }
    };
};