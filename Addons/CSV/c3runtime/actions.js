"use strict";
{
    const C3 = self.C3;
    /**
     * @namespace
    */
    C3.Plugins.RobotKaposzta_CSV.Acts = {
        /**
         * Load CSV data.
         * @param {string} text - CSV text data to load.
         * @param {string} sep - CSV separator character.
         */
        LoadText(text, sep) {
            if (sep === "" || sep === "\"" || sep === "\n") {
                sep = this._sep;
            } else {
                this._sep = sep;
            }
            this._data = this._ArrayToBlock(this._CSVToArray(text, sep));
            this._transposed = false;
        },
        /**
         * Load 2D array in JSON string data.
         * @param {string} JSON - CSV text data to load.
         */
        LoadJSON(json) {
            let data;
            try {
                data = this._ArrayToBlock(JSON.parse(json));
            } catch (error) {
                console.error(error);
            }
            if (typeof data !== "undefined") {
                this._data = data;
            }
        },
        /**
         * Load Construct array.
         * @param {array} array - Construct 3 array intace to load.
         * @param {number} axis - array axis to load 0-X, 1-Y, 3-Z
         * @param {number} index - non negative integer axis index to load.
         */
        LoadArray(array, axis, index) {
            array = array.GetFirstPicked(this._inst);
            array = array.GetSdkInstance();

            const w = array.GetWidth();
            const h = array.GetHeight();
            const d = array.GetDepth();
            
            //[x, y, z] store position index (i) and length (l), access always same
            let xi = 0;
            let xl = 0;
            let yi = 1;
            let yl = 0;
            let zi = 2;
            //out of array
            if ((axis === 0 && index >= w) || (axis === 1 && index >= h) || (axis === 2 && index >= d)) {
                this._data = [[]];
                this._transposed = false;
                return;
            }
            //setup area indexes
            if (axis === 0) {
                xi = 1;
                xl = h;
                yi = 2;
                yl = d;
                zi = 0;
            } else if (axis === 1) {
                xi = 0;
                xl = w;
                yi = 2;
                yl = d;
                zi = 1;
            } else {
                xi = 0;
                xl = w;
                yi = 1;
                yl = h;
                zi = 2;
            }
            //copy data
            const data = [];
            const pos = [0, 0, 0];
            pos[zi] = index;
            for (let i = 0, length = yl; i < length; i++) {
                data.push([]);
                for (let j = 0, length = xl; j < length; j++) {
                    pos[xi] = j;
                    pos[yi] = i;
                    data[i].push(array.At(...pos));
                }
            }
            this._data = data;
            this._transposed = false;
        },


        /**
         * Set Construct array.
         * @param {array} array - Construct 3 array intace to load.
         * @param {number} axis - array axis to load 0-X, 1-Y, 3-Z
         * @param {number} index - non negative integer axis index to load.
         * @param {boolean} isResize - boolean that indicate to resize array to fit data or not.
         */
        SetArray(array, axis, index, isResize) {
            array = array.GetFirstPicked(this._inst);
            array = array.GetSdkInstance();

            const w = array.GetWidth();
            const h = array.GetHeight();
            const d = array.GetDepth();
            //out of array
            if ((axis === 0 && index >= w) || (axis === 1 && index >= h) || (axis === 2 && index >= d)) {
                return;
            }

            //[x, y, z] store position index (i) and length (l), access always same
            let xi = 0;
            let xl = 0;
            let yi = 1;
            let yl = 0;
            let zi = 2;
            let zl = 0;
            //setup area indexes
            if (axis === 0) {
                xi = 1;
                xl = h;
                yi = 2;
                yl = d;
                zi = 0;
                zl = w;
            } else if (axis === 1) {
                xi = 0;
                xl = w;
                yi = 2;
                yl = d;
                zi = 1;
                zl = h;
            } else {
                xi = 0;
                xl = w;
                yi = 1;
                yl = h;
                zi = 2;
                zl = d;
            }

            //out of size
            const width = this._data[0].length;
            const height = this._data.length;
            if (isResize) {
                xl = width;
                yl = height;
                const size = [0, 0, 0];
                size[xi] = xl;
                size[yi] = yl;
                size[zi] = zl;
                array.SetSize(...size);
            } else {
                xl = Math.min(xl, width);
                yl = Math.min(yl, height);
            }
            
            const pos = [0, 0, 0];
            pos[zi] = index;
            for (let i = 0, length = yl; i < length; i++) {
                for (let j = 0, length = xl; j < length; j++) {
                    pos[xi] = j;
                    pos[yi] = i;
                    array.Set(...pos, this._data[i][j]);
                }
            }
        },

        /**
         * Transpose loaded data.
         * @param {inteder} type - 0-restore the original data, 1-transpose the original data, 2-toggle transpose
         */
        Transpose(type) {
            if (type === 0 && this._transposed === true) {
                this._data = this._Transpose(this._data);
                this._transposed = false;

            } else if (type === 1 && this._transposed === false) {
                this._data = this._Transpose(this._data);
                this._transposed = true;

            } else if (type === 2) {
                this._data = this._Transpose(this._data);
                this._transposed = !this._transposed;
            }
        },
        /**
         * Clear currently loaded data.
         */
        Clear() {
            this._data = [[]];
            this._transposed = false;
        }
    };
};