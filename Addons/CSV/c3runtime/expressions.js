"use strict";
{
    const C3 = self.C3;

    C3.Plugins.RobotKaposzta_CSV.Exps = {
		AsText(sep="") {
            if (sep === "" || sep === "\"" || sep === "\n") {
                sep = this._sep;
            }
            return this._ArrayToCSV(this._data, sep);
        },
        AsJSON() {
            return JSON.stringify(this._data);
        },

        Separator() {
            return this._sep;
        },
        Width() {
            return this._data[0].length;
        },
        Height() {
            return this._data.length;
        },
        At(x, y) {
            const at = this._data?.[y]?.[x];
            if (typeof at === "undefined") {
                return "";
            }
            return at;
        }
	};
};