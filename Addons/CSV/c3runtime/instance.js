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
        constructor(inst, properties) {
            super(inst);

            this._sep = ",";
            this._data = [[]];
            this._transposed = false;
        }
        SaveToJson() {
            return [
                this._sep,
                this._data,
                this._reversed
            ];
        }
        LoadFromJson(o) {
            this._sep = o[0];
            this._data = o[1];
            this._reversed = o[3];
        }
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

        _RegExpEscape(str) {
            return str.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
        }

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
        _Transpose(array) {
            return array[0].map((col, c) => array.map(row => row[c]));
        }
    };
    C3.Plugins.RobotKaposzta_CSV.Instance = CSVRuntimeInstance;
};