"use strict";
{
    const C3 = self.C3;
    const PLUGIN_ID = "RobotKaposzta_CSV";

    /**
     * @external SDKInstanceBase
     * @desc The SDKInstanceBase interface is used as the base class for runtime instances in the SDK. For "world" type plugins, instances instead derive from SDKWorldInstanceBase which itself derives from SDKInstanceBase.
     * @see https://www.construct.net/en/make-games/manuals/addon-sdk/runtime-reference/base-classes/sdkinstancebase
     */
    /**
     * @classdesc CSV editor class.
     * @extends external:SDKInstanceBase
     */
    class CSVRuntimeInstance extends C3.SDKInstanceBase {
        /**
         * @desc create class.
         * @param {object} inst - The instance object that gives to the parent's constructor.
         * @param {Array.<string|number|boolean>} properties - The initial parameters in array.
         */
        constructor(inst, properties) {
            super(inst);

            /**
             * @desc CSV data separator character
             * @type {string} 
             * @public
             */
            this._sep = ",";
            /**
             * @desc Loaded data in 2D array. First dimension means rows, second means columns.
             * @type {Array.<Array.<string>>} 
             * @public
             */
            this._data = [[]];
            /**
             * @desc Boolean that show that array is transponated or not.
             * @type {boolean} 
             * @public
             */
            this._transposed = false;
        }
        /**
		 * @override
		 * @desc Return plugins state to save.
         * @return {Array} return separator charater, transposed state and data array.
		 */
        SaveToJson() {
            return [
                this._sep,
                this._data,
                this._transposed
            ];
        }
        /**
		 * @override
		 * @desc Load plugins state from save object.
         * @param {object} o - Save state object.
		 */
        LoadFromJson(o) {
            this._sep = o[0];
            this._data = o[1];
            this._transposed = o[3];
        }
        /**
		 * @override
		 * @desc Get plugins debug state.
         * @return {Array} return debugger array for Construct editor testing.
		 */
        GetDebuggerProperties() {
            const properties = [];
            for (let i = 0, length = this._data.length; i < length; i++) {
                const columns = [];
                for (let j = 0, length = this._data[i].length; j < length; j++) {
                    if (this._data[i][j].indexOf("\"") !== -1) {
                        columns.push("\"" + this._data[i][j].replaceAll("\"", "\"\"") +"\"");
                    } else {
                        columns.push(this._data[i][j]);
                    }
                }
                properties.push({
                    "name": ("$" + String(i)),
                    "value": columns.join(this._sep)
                });
            }
            const prefix = "plugins." + PLUGIN_ID.toLowerCase() + ".debugger.data";
            return [
                {
                    "title": prefix + ".name",
                    "properties": properties
                }
            ];
        }

        /**
         * Escape string for regular expression usage
         * @param {string} str - string to escape
         */
        _RegExpEscape(str) {
            return str.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
        }


        /**
         * Convert CSV string to 2D array.
         * @param {string} lines - CSV string to convert
         * @param {string} sep - CSV separator
         * @returns {Array.<Array.<string>>} result in 2D array
         */
        _CSVToArray(lines, sep) {
            const regSep = this._RegExpEscape(sep);
            const regex = new RegExp("((" + regSep + ")|\\r?\\n|\\r|^)(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|([^(" + regSep + ")\\r\\n]*))", "gi");
            lines = lines.split("\n");
            for (let i = 0, length = lines.length; i < length; i++) {
                const line = lines[i];
                const data = [];
                //first el
                if (line.startsWith(sep)) {
                    data.push("");
                }
                //other el
                if (line !== "") {
                    let matches;
                    while ((matches = regex.exec(line)) !== null) {
                        const result = matches[3] || matches[4];
                        data.push(result.replaceAll("\"\"", "\""));
                    }
                }
                lines[i] = data;
            }
            return lines;
        }
        /**
         * Convert 2D array to CSV string.
         * @param {array} lines - array to convert
         * @param {string} sep - CSV separator to connect data in exporting
         * @returns {string} result CSV string
         */
        _ArrayToCSV(array, sep) {
            let lines = "";
            for (let i = 0, length = array.length; i < length; i++) {
                let line = "";
                for (let j = 0, length = array[i].length; j < length; j++) {
                    if (String(array[i][j]).indexOf("\"") === -1) {
                        line += String(array[i][j]) + sep;
                    } else {
                        line += "\"" + String(array[i][j]).replaceAll("\"", "\"\"") +"\"" + sep;
                    }
                }
                lines += line.substring(0, line.length - 1) + "\n";
            }
            return lines.substring(0, lines.length - 1);
        }
        

        /**
         * Convert 2D array to 2D block array (every columns and rows are same size).
         * @param {array} array - 2D array to convert to block
         * @returns {Array.<Array.<string>>} result in 2D array
         */
        _ArrayToBlock(array) {
            let maxWidth = 0;
            for (let i = 0, length = array.length; i < length; i++) {
                const width = array[i].length;
                if (maxWidth < width) {
                    maxWidth = width;
                }
            }
            for (let i = 0, length = array.length; i < length; i++) {
                const width = array[i].length;
                for (let j = width, length = maxWidth; j < length; j++) {
                    array[i].push("");
                }
            }
            return array;
        }
        /**
         * Swap 2D array rows and columns and return a copy.
         * @param {array} array - 2D array to transpose
         * @returns {Array.<Array.<string>>} transposed new 2D array
         */
        _Transpose(array) {
            return array[0].map((col, c) => array.map(row => row[c]));
        }
    };
    C3.Plugins.RobotKaposzta_CSV.Instance = CSVRuntimeInstance;
};