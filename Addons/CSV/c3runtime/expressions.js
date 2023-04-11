"use strict";
{
    const C3 = self.C3;
    /** @namespace */
    C3.Plugins.RobotKaposzta_CSV.Exps = {
        /**
         * Returns loaded data in CSV text format.
         * @param {string} separator - optional CSV separator that use in export. If empty export use last used separator tat used in load.
         * @returns {string} text
         */
		AsText(sep="") {
            if (sep === "" || sep === "\"" || sep === "\n") {
                sep = this._sep;
            }
            return this._ArrayToCSV(this._data, sep);
        },
        /**
         * Returns loaded data in JSON text data.
         * @returns {string} JSON text
         */
        AsJSON() {
            return JSON.stringify(this._data);
        },


        /**
         * Returns last used separator in CSV text format.
         * @returns {string} text
         */
        Separator() {
            return this._sep;
        },
        /**
         * Returns loaded data's width.
         * @returns {number} non negative integer width
         */
        Width() {
            return this._data[0].length;
        },
        /**
         * Returns loaded data's height.
         * @returns {number} non negative integer height
         */
        Height() {
            return this._data.length;
        },
         /**
         * Returns loaded data in position.
         * @param {number} x - non negative integer X position to get data.
         * @param {number} y - non negative integer Y position to get data.
         * @returns {string} text
         */
        At(x, y) {
            const at = this._data?.[y]?.[x];
            if (typeof at === "undefined") {
                return "";
            }
            return at;
        }
	};
};