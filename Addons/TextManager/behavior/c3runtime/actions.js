"use strict";
{
    const C3 = self.C3;
    C3.Behaviors.RobotKaposzta_TextManagerBehavior.Acts = {
        SetKeyValue(value) {
            this._SetKey(value);
        },

        SetLangValue(value) {
            this._SetLang(value);
        },

        SetEnabled(state) {
            this._SetEnabled(state === 0);
        }
    };
};