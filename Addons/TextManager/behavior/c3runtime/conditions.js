"use strict";
{
    const C3 = self.C3;
    C3.Behaviors.RobotKaposzta_TextManagerBehavior.Cnds = {
        IsKeyValue(value) {
            return this._key === value;
        },

        IsLangValue(value) {
            return this._lang === value;
        },

        IsEnabled() {
            return this._isEnable === 1;
        }
    };
};
