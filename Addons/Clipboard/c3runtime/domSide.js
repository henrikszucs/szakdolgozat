"use strict";
{
    const TEXTTYPES = ["text/plain", "text/html"];
    const IMAGESTYPES = ["image/png"];
    const DOM_COMPONENT_ID = "RobotKaposzta_Clipboard";
    let SELF;
    const HANDLER_CLASS = class ClipboardDOMHandler extends self.DOMHandler {
        constructor(iRuntime) {
            super(iRuntime, DOM_COMPONENT_ID);
            SELF = this;
            this._isDragStart = false;
            this._dragTimeout = 0;
            
            this.AddRuntimeMessageHandlers([
                ["get-init", (e) => this._GetInit(e)],

                ["request-permission", (e) => this._RequestPermission(e)],

                ["set-drop", (e) => this._SetDrop(e)],
                ["read", () => this._Read()],

                ["write", (e) => this._Write(e)],
            ]);

            window.addEventListener("paste", this._OnPaste);

            window.addEventListener("copy", this._OnCopy);
            window.addEventListener("cut", this._OnCut);
        }

        async _GetInit(e) {
            const result = {};
            //drop
            if (e["drop"]) {
                this._SetDrop(true);
            }
            //read
            if (typeof (self.navigator.clipboard.readText) !== "undefined") {
                result["is-read-support"] = true;
            } else {
                result["is-read-support"] = false;
            }
            if (typeof (self.navigator.clipboard.read) !== "undefined") {
                result["is-read-data-support"] = true;
            } else {
                result["is-read-data-support"] = false;
            }
            if (e["read"] && (typeof (self.navigator.clipboard.readText) !== "undefined" || typeof (self.navigator.clipboard.read) !== "undefined")) {
                let res;
                try {
                    res = await navigator.permissions.query({
                        "name": "clipboard-read"
                    });
                } catch (error) {}
                if (res) {
                    if (res.state === "granted") {
                        result["is-read-permission"] = 1;
                    } else {
                        result["is-read-permission"] = 0;
                    }
                } else {
                    result["is-read-permission"] = -1;
                }
            } else {
                result["is-read-permission"] = -1;
            }
            //write
            if (typeof (self.navigator.clipboard.writeText) !== "undefined") {
                result["is-write-support"] = true;
            } else {
                result["is-write-support"] = false;
            }
            if (typeof (self.navigator.clipboard.write) !== "undefined") {
                result["is-write-data-support"] = true;
            } else {
                result["is-write-data-support"] = false;
            }
            if (e["write"] && (typeof (self.navigator.clipboard.writeText) !== "undefined" || typeof (self.navigator.clipboard.write) !== "undefined")) {
                let res;
                try {
                    res = await navigator.permissions.query({
                        "name": "clipboard-write"
                    });
                } catch (error) {}
                if (res) {
                    if (res.state === "granted") {
                        result["is-write-permission"] = 1;
                    } else {
                        result["is-write-permission"] = 0;
                    }
                } else {
                    result["is-write-permission"] = -1;
                }
            } else {
                result["is-write-permission"] = -1;
            }
            return result;
        }

        async _RequestPermission(e) {
            let name = (e["type"] === 0 ? "clipboard-read" : "clipboard-write");
            let permission;
            try {
                permission = await navigator.permissions.query({
                    "name": name
                });
            } catch (error) {}
            if (permission) {
                if (permission.state === "granted") {
                    return {"result": true};
                } else {
                    return {"result": false};
                }
            } else {
                return {"result": true};
            }
        }

        _SetDrop(e) {
            if (e) {
                document.addEventListener("drop", this._OnDrop);
                document.addEventListener("dragover", this._OnDrag);
            } else {
                document.removeEventListener("drop", this._OnDrop);
                document.removeEventListener("dragover", this._OnDrag);
            }
        }
        async _Read() {
            try {
                await navigator.permissions.query({ "name": "clipboard-read" });
            } catch (error) {}
            let isError = false;
            let isOnlyText = false;
            let clipboardContents;
            try {
                clipboardContents = await navigator.clipboard.read();
            } catch (error) {
                isOnlyText = true;
                try {
                    clipboardContents = await navigator.clipboard.readText();
                } catch (error) {
                    isError = true;
                    clipboardContents = "";
                }
            }
            let result = {
                "error": "",
                "data": {}
            };
            if (!isError) {
                if (!isOnlyText) {
                    const types = clipboardContents[0].types;
                    for (const type of TEXTTYPES) {
                        if (types.includes(type)) {
                            const blob = await clipboardContents[0].getType(type);
                            const text = await blob.text();
                            result["data"][type] = text;
                        }           
                    }
                    for (const type of IMAGESTYPES) {
                        if (types.includes(type)) {
                            const blob = await clipboardContents[0].getType(type);
                            const arrayBuffer = await blob.arrayBuffer();
                            const array = new Uint8Array(arrayBuffer);
                            const text = this._Uint8ArrayToBase64(array);
                            result["data"][type] = text;
                        }  
                    }
                } else {
                    if (clipboardContents !== "") {
                        result["data"]["text/plain"] = clipboardContents;
                    }
                }
            } else {
                result["error"] = "CannotRead"
            }
            return result;
        }
        _OnPaste(event) {
            const types = event.clipboardData.types.concat();
            const data = {};
            const removeIndex = types.indexOf('Files');
            if (removeIndex !== -1) {
                types.splice(removeIndex, 1);
            }
            if (types.length === 0) {
                return;
            }
            for (const type of TEXTTYPES) {
                if (types.includes(type)) {
                    data[type] = event.clipboardData.getData(type);
                }
            }
            for (const type of IMAGESTYPES) {
                if (types.includes(type)) {
                    data[type] = event.clipboardData.getData(type);
                }
            }
            SELF.PostToRuntime("on-paste", {
                "data": data
            });
        }
        _OnDrop(event) {
            event.preventDefault();
            const types = event.dataTransfer.types.concat();
            const data = {};
            const removeIndex = types.indexOf('Files');
            if (removeIndex !== -1) {
                types.splice(removeIndex, 1);
            }
            if (types.length === 0) {
                return;
            }
            for (const type of TEXTTYPES) {
                if (types.includes(type)) {
                    data[type] = event.dataTransfer.getData(type);
                }
            }
            for (const type of IMAGESTYPES) {
                if (types.includes(type)) {
                    data[type] = event.dataTransfer.getData(type)
                }
            }
            SELF.PostToRuntime("on-drop", {
                "data": data,
                "position-x": event.pageX,
                "position-y": event.pageY
            });
        }
        _OnDrag(event) {
            event.preventDefault();
            const types = event.dataTransfer.types.concat();
            const data = {};
            const removeIndex = types.indexOf('Files');
            if (removeIndex !== -1) {
                types.splice(removeIndex, 1);
            }
            if (types.length === 0) {
                return;
            }
            for (const type of TEXTTYPES) {
                if (types.includes(type)) {
                    data[type] = "";
                }
            }
            for (const type of IMAGESTYPES) {
                if (types.includes(type)) {
                    data[type] = "";
                }
            }
            if (!SELF._isDragStart) {
                SELF._isDragStart = true;
                SELF._dragTimeout = setTimeout(SELF._OnDragEnd, 200);
                SELF.PostToRuntime("on-drag-start", {
                    "data": data,
                    "position-x": event.pageX,
                    "position-y": event.pageY
                });
            } else {
                clearTimeout(SELF._dragTimeout);
                SELF._dragTimeout = setTimeout(SELF._OnDragEnd, 200);
            }
            SELF.PostToRuntime("on-drag", {
                "data": data,
                "position-x": event.pageX,
                "position-y": event.pageY
            });
        }
        _OnDragEnd() {
            SELF._isDragStart = false;
            SELF.PostToRuntime("on-drag-end");
        }

        async _Write(e) {
            try {
                await navigator.permissions.query({ "name": "clipboard-write" });
            } catch (error) {}
            const res = { "error": "" };
            try {
                let clipData = {};
                for (const type in e["data"]) {
                    if (TEXTTYPES.includes(type)) {
                        clipData[type] = new Blob([e["data"][type]], { "type": type });
                    } else if (IMAGESTYPES.includes(type)) {
                        const arr = this._Base64ToUint8Array(e["data"][type]);
                        clipData[type] = new Blob([arr], { "type": type });
                    }
                }
                await navigator.clipboard.write([new ClipboardItem(clipData)]);
            } catch (error) {
                res["error"] = "SomeFormatsNotSupported";
                try {
                    if (typeof (e["data"]["text/plain"]) !== "undefined") {
                        await navigator.clipboard.writeText(e["data"]["text/plain"]);
                    } else {
                        res["error"] = "FormatsNotSupported";
                    }
                } catch (error) {
                }
            }
            return res;
        }
        _OnCopy(event) {
            SELF.PostToRuntime("on-copy");
        }
        _OnCut(event) {
            SELF.PostToRuntime("on-cut");
        }

        _Uint8ArrayToBase64(arr) {
            let str = '';
            let len = arr.byteLength;
            for (let i = 0; i < len; i++) {
                str += String.fromCharCode(arr[i]);
            }
            return self.btoa(str);
        }
        _Base64ToUint8Array(base64) {
            let str = atob(base64);
            let len = str.length;
            let arr = new Uint8Array(len);
            for (let i = 0; i < len; i++) {
                arr[i] = str.charCodeAt(i);
            }
            return arr;
        }
    };
    self.RuntimeInterface.AddDOMHandlerClass(HANDLER_CLASS);
};