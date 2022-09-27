"use strict";
{
    const C3 = self.C3;
    const DOM_COMPONENT_ID = "RobotKaposzta_Desktop";
    C3.Plugins.RobotKaposzta_Desktop.Instance = class DesktopInstance extends C3.SDKInstanceBase {
        constructor(inst, properties) {
            super(inst, DOM_COMPONENT_ID);

            this.execTags = [];

            /*
                {
                    "id": string,
                    "type": normal|separator|check|radio,
                    "submenu": [], menuItem object
                    "reference": [], pathArray

                    "text": string,
                    "subtext": string,
                    "icon": string,
                    "enabled": boolean,
                    "checked": boolean,
                    "visible": boolean,
                    "hotkey": string
                }
            */
            this.menuItems = {
                "id": "",
                "type": "normal",
                "submenu": [],
                "reference": [],
                "text": "",
                "subtext": "",
                "icon": "",
                "enabled": true,
                "checked": false,
                "visible": true,
                "hotkey": ""
            };

            this.AddDOMMessageHandlers([
                ["on-maximize", () => this._OnMaximize()]
            ]);
        }
        //Construct integration
        Release() {
            super.Release();
        }
        SaveToJson() {
            return {};
        }
        LoadFromJson(o) {
            
        }
        GetDebuggerProperties() {
            const prefix = "plugins.robotkaposzta_desktop.debugger";
            return [{
                "title": prefix + ".name",
                "properties": [

                ]
            }];
        }

        //Standard binary methods
        _Base64ToUint8Array(base64) {
            let str = self.atob(base64);
            let len = str.length;
            let arr = new Uint8Array(len);
            for (let i = 0; i < len; i++) {
                arr[i] = str.charCodeAt(i);
            }
            return arr;
        }
        _Uint8ArrayToBase64(arr) {
            let str = '';
            let len = arr.byteLength;
            for (let i = 0; i < len; i++) {
                str += String.fromCharCode(arr[i]);
            }
            return self.btoa(str);
        }

        //Path methods (async calleble)
        _PathToArray(path) {
            //get path tree in array and handle escaped dots (.)
            const pathArray = [];
            let lastIndex = 0;
            let reg = new RegExp(/(?:\\\\|\\\.)|(\.)/g);
            let match;
            while (match = reg.exec(path)) {
                if (match[1] !== undefined) {
                    const str = path.substring(lastIndex, match.index);
                    if (str !== "") {
                        pathArray.push(str);
                    }
                    lastIndex = match.index + 1;
                }
            }
            const str = path.substring(lastIndex, path.length);
            if (str !== "") {
                pathArray.push(str);
            }
            return pathArray;
        }
        _IsPathSelf(srcPathArray, destPathArray) {
            if (srcPathArray.length <= destPathArray.length) {
                return srcPathArray.every((el, i) => {
                    return el === destPathArray[i];
                });
            } else {
                return destPathArray.every((el, i) => {
                    return el === srcPathArray[i];
                });
            }
        }
        _MenuItemGet(pathArray, isCreate) {
            //get item and his parent at path and show index where get error or create path anyway.
            let selectObj = this.menuItems;
            let parentObj = null;
            let i = 0, length = pathArray.length;
            if (isCreate) {
                while (i < length && selectObj !== null) {
                    parentObj = selectObj;
                    selectObj = selectObj["submenu"].find((subItem) => {
                        if (subItem["id"] === pathArray[i]) {
                            return true;
                        }
                        return false;
                    });
                    if (typeof(selectObj) === "object") {
                        i++;
                    } else {
                        selectObj = null;
                    }
                }
                if (selectObj === null) {
                    if (parentObj["reference"].length !== 0) {
                        parentObj["reference"] = [];
                    }
                    while (i < length - 1) {
                        selectObj = {
                            "id": pathArray[i],
                            "submenu": [],
                            "reference": [],
                            "type": "normal",
                            "text": "",
                            "subtext": "",
                            "icon": "",
                            "enabled": true,
                            "checked": false,
                            "visible": true,
                            "hotkey": "",
                            "nwMenu": null,
                            "nwMenuItem": null
                        };
                        parentObj["submenu"].push(selectObj);
                        parentObj = selectObj;
                        i++;
                    }
                    selectObj = {
                        "id": pathArray[i],
                        "submenu": [],
                        "reference": [],
                        "type": "normal",
                        "text": "",
                        "subtext": "",
                        "icon": "",
                        "enabled": true,
                        "checked": false,
                        "visible": true,
                        "hotkey": "",
                        "nwMenu": null,
                        "nwMenuItem": null
                    };
                    parentObj["submenu"].push(selectObj);
                    i++;
                } else {
                    if (selectObj["reference"].length !== 0) {
                        selectObj["reference"] = [];
                    }
                }
            } else {
                while (i < length && selectObj !== null) {
                    parentObj = selectObj;
                    selectObj = selectObj["submenu"].find((subItem) => {
                        if (subItem["id"] === pathArray[i]) {
                            return true;
                        }
                        return false;
                    });
                    if (typeof(selectObj) === "object") {
                        i++;
                    } else {
                        selectObj = null;
                    }
                }
            }
            return {
                "index": i,
                "selectObj": selectObj,
                "parentObj": parentObj
            };
        }

        _SetMenuItem(data) {
            //path, index, type, text, subtext, icon, enabled, checked, visible, hotkey
            const pathArray = this._PathToArray(data["path"]);
            if (pathArray.length === 0) {
                return false;
            }
            const pathData = this._MenuItemGet(pathArray, true);
            const selectItem = pathData["selectObj"];
            const parentItem = pathData["parentObj"];
            if (typeof data["index"] === "number") {
                parentItem["submenu"].splice(parentItem["submenu"].indexOf(selectItem), 1);
                parentItem["submenu"].splice(data["index"], 0, selectItem);
            }
            if (data["type"] === "normal" || data["type"] === "separator" || data["type"] === "checkbox" || data["type"] === "radio") {
                selectItem["type"] = data["type"];
            }
            if (typeof data["text"] === "string") {
                selectItem["text"] = data["text"];
            }
            if (typeof data["subtext"] === "string") {
                selectItem["subtext"] = data["subtext"];
            }
            if (typeof data["icon"] === "string") {
                /*
                try {
                    const assetManager = this.GetRuntime().GetAssetManager();
                    const iconBlob = await assetManager.FetchBlob(data["icon"]);
                    const iconBuffer = await iconBlob["arrayBuffer"]()
                    let iconBase64 = "data:" + iconBlob["type"] + ";base64," + this._Uint8ArrayToBase64(iconBuffer);
                    selectItem["icon"] = iconBase64;
                } catch (error) {
                    selectItem["icon"] = "";
                }*/
                selectItem["icon"] = data["icon"];
            }
            if (typeof data["enabled"] === "boolean") {
                selectItem["enabled"] = data["enabled"];
            }
            if (typeof data["checked"] === "boolean") {
                selectItem["checked"] = data["checked"];
            }
            if (typeof data["visible"] === "boolean") {
                selectItem["visible"] = data["visible"];
            }
            if (typeof data["hotkey"] === "string") {
                selectItem["hotkey"] = data["hotkey"];
            }
            //radio behavior
            if (selectItem["type"] === "radio" && selectItem["checked"] === true) {
                const index = parentItem["submenu"].indexOf(selectItem);
                let i = index + 1,
                    length = parentItem["submenu"].length;
                while (i < length && parentItem["submenu"][i]["type"] !== "separator") {
                    if (parentItem["submenu"][i]["type"] === "radio") {
                        parentItem["submenu"][i]["checked"] = false;
                        parentItem["submenu"][i]["nwMenuItem"]["checked"] = false; //for menuItem
                    }
                    i++;
                }
                let j = index - 1;
                while (j >= 0 && parentItem["submenu"][j]["type"] !== "separator") {
                    if (parentItem["submenu"][j]["type"] === "radio") {
                        parentItem["submenu"][j]["checked"] = false;
                        parentItem["submenu"][j]["nwMenuItem"]["checked"] = false; //for menuItem
                    }
                    j--;
                }
            }
            //send below
            this.PostToDOM("set-menu-item", {
                "data": data
            });
            return true;
        }
        _CopyMenuItem(srcPath, destPath, isReference, index) {
            //empty/non-exist path check
            const srcPathArray = this._PathToArray(srcPath);
            if (srcPathArray.length === 0) {
                return false;
            }
            const srcPathData = this._MenuItemGet(srcPathArray, false);
            if (srcPathData["index"] !== srcPathArray.length) {
                return false;
            }
            const destPathArray = this._PathToArray(destPath);
            if (destPathArray.length === 0) {
                return false;
            }

            //self copy check
            if (this._IsPathSelf(srcPathArray, destPathArray)) {
                return false
            }

            //submenu loop check
            const isRecursive = (item) => {
                if (item["submenu"].length !== 0) {
                    return item["submenu"].find((element) => {
                        return isRecursive(element);
                    });
                } else if (item["reference"].length !== 0) {
                    return this._IsPathSelf(item["reference"], destPathArray);
                } else {
                    return false;
                }
            };
            if (isRecursive(srcPathData["selectObj"])) {
                return false;
            };

            //copy content
            const destPathData = this._MenuItemGet(destPathArray, true);
            if (isReference) {
                destPathData["selectObj"]["submenu"] = [];
                destPathData["selectObj"]["reference"] = srcPathArray;
                if (typeof index !== "undefined") {
                    const i = destPathData["parentObj"]["submenu"].indexOf(destPathData["selectObj"]);
                    destPathData["parentObj"]["submenu"].splice(i, 1);
                    destPathData["parentObj"]["submenu"].splice(index, 0, destPathData["selectObj"]);
                }
            } else {
                const clone = JSON.parse(JSON.stringify(srcPathData["selectObj"]));
                const refClone = (item) => {
                    if (item["submenu"].length !== 0) {
                        item["submenu"].forEach((submenu) => {
                            refClone(submenu);
                        });
                    } else if (item["reference"].length !== 0) {
                        const ref = this._MenuItemGet(item["reference"], false, false);
                        item = JSON.parse(JSON.stringify(ref["selectObj"]));
                        refClone(item);
                    }
                };
                refClone(clone);
                clone["id"] = destPathData["selectObj"]["id"];
                const i = destPathData["parentObj"]["submenu"].indexOf(destPathData["selectObj"]);
                destPathData["parentObj"]["submenu"].splice(i, 1);
                if (typeof index === "undefined") {
                    index = i;
                }
                destPathData["parentObj"]["submenu"].splice(index, 0, clone);
            }
            //send below
            this.PostToDOM("copy-menu-item", {
                "source-path-array": srcPathArray,
                "dest-path-array": destPathArray,
                "is-reference": isReference,
                "index": index
            });
            return true;
        }
        _RemoveMenuItem(path) {
            const pathArray = this._PathToArray(path);
            const pathData = this._MenuItemGet(pathArray, false);
            if (pathData["index"] === pathArray.length) {
                if (pathData["parentObj"] === null) {
                    pathData["selectObj"]["submenu"] = [];
                } else {
                    const index = pathData["parentObj"]["submenu"].indexOf(pathData["selectObj"]);
                    pathData["parentObj"]["submenu"].splice(index, 1);
                }
            }
            //send below
            this.PostToDOM("remove-menu-item", {
                "path": path
            });
            return true;
        }

        _OnMaximize() {
            this.Trigger(C3.Plugins.RobotKaposzta_Desktop.Cnds.OnMaximize);
        }

    };
};