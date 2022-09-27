"use strict";
{
    // 1 UNDOCUMENTED FEATURE new C3.CompositeDisposable();
    const C3 = self.C3;
    const DOM_COMPONENT_ID = "RobotKaposzta_Clipboard";
    C3.Plugins.RobotKaposzta_Clipboard.Instance = class ClipboardInstance extends C3.SDKInstanceBase {
        constructor(inst, properties) {
            super(inst, DOM_COMPONENT_ID);

            this.startReadPermission = false;
            this.startWritePermission = false;

            this._permissionReqType = 0; // 0-read, 1-write

            this._isReadTextSupport = false;
            this._isReadDataSupport = false;
            this._enabledDrop = false;
            this._readTag = "";
            this._readError = "";
            this._readData = {};
            this._dragPosX = 0;
            this._dragPosY = 0;

            this._isWriteTextSupport = false;
            this._isWriteDataSupport = false;
            this._writeTag = "";
            this._writeError = "";

            this.AddDOMMessageHandlers([
                ["on-paste", (e) => this._OnPaste(e)],
                ["on-drop", (e) => this._OnDrop(e)],
                ["on-drag-start", (e) => this._OnDragStart(e)],
                ["on-drag", (e) => this._OnDrag(e)],
                ["on-drag-end", (e) => this._OnDragEnd()],

                ["on-cut", () => this._OnCut()],
                ["on-copy", () => this._OnCopy()]
            ]);
            
            if (properties) {
                if (typeof(properties[0]) === "boolean") {
                    this._enabledDrop = properties[0];
                }
                if (typeof(properties[1]) === "boolean") {
                    this.startReadPermission = properties[1];
                }
                if (typeof(properties[2]) === "boolean") {
                    this.startWritePermission = properties[2];
                }
            }

            //!!!!Undocumented (for startup after load)
            const rt = this._runtime.Dispatcher();
            this._disposables = new C3.CompositeDisposable(
                C3.Disposable.From(
                    rt,
                    "afterfirstlayoutstart",
                    () => this._OnAfterFirstLayoutStart()
                )
            );
        }
        _OnAfterFirstLayoutStart() {
            this.PostToDOMAsync("get-init", {
                "drop": this._enabledDrop,
                "read": this.startReadPermission,
                "write": this.startWritePermission
            }).then((data) => {
                this._isReadTextSupport = data["is-read-support"];
                this._isReadDataSupport = data["is-read-data-support"];
                if (data["is-read-permission"] === 1) {
                    this._permissionReqType = 0;
                    this.Trigger(C3.Plugins.RobotKaposzta_Clipboard.Cnds.OnPermissonGranted);
                } else if (data["is-read-permission"] === 0) {
                    this._permissionReqType = 0;
                    this.Trigger(C3.Plugins.RobotKaposzta_Clipboard.Cnds.OnPermissionDenied);
                }
                
                this._isWriteTextSupport = data["is-write-support"];
                this._isWriteDataSupport = data["is-write-data-support"];
                if (data["is-write-permission"] === 1) {
                    this._permissionReqType = 1;
                    this.Trigger(C3.Plugins.RobotKaposzta_Clipboard.Cnds.OnPermissonGranted);
                } else if (data["is-write-permission"] === 0) {
                    this._permissionReqType = 1;
                    this.Trigger(C3.Plugins.RobotKaposzta_Clipboard.Cnds.OnPermissionDenied);
                }
            });
        }
        
        Release() {
            super.Release();
        }
        SaveToJson() {
            return {
                "set-drop": this._enabledDrop
            };
        }
        LoadFromJson(o) {
            this._SetDrop(o["set-drop"]);
        }
        GetDebuggerProperties() {
            const prefix = "plugins.robotkaposzta_clipboard.debugger";
            return [
                {
                    "title": prefix + ".read.name",
                    "properties": [
                        {
                            "name": prefix + ".read.enabled-drop",
                            "value": this._enabledDrop,
                            "onedit": v => this._SetDrop(v)
                        },
                        {
                            "name": prefix + ".read.text-support",
                            "value": this._isReadTextSupport
                        },
                        {
                            "name": prefix + ".read.data-support",
                            "value": this._isReadDataSupport
                        },
                        {
                            "name": prefix + ".read.last-tag",
                            "value": this._readTag
                        },
                        {
                            "name": prefix + ".read.last-error",
                            "value": this._readError
                        },
                        {
                            "name": prefix + ".read.last-drag-x",
                            "value": this._dragPosX
                        },
                        {
                            "name": prefix + ".read.last-drag-y",
                            "value": this._dragPosY
                        },
                        {
                            "name": prefix + ".read.last-text-plain",
                            "value": (this._readData["text/plain"] ? this._readData["text/plain"] : "")
                        },
                        {
                            "name": prefix + ".read.last-text-html",
                            "value": (this._readData["text/html"] ? this._readData["text/html"] : "")
                        },
                        {
                            "name": prefix + ".read.last-image-png",
                            "value": (this._readData["image/png"] ? this._readData["image/png"].substring(0, 100) + "..." : "")
                        },
                    ]
                },
                {
                    "title": prefix + ".write.name",
                    "properties": [
                        {
                            "name": prefix + ".write.text-support",
                            "value": this._isWriteTextSupport
                        },
                        {
                            "name": prefix + ".write.data-support",
                            "value": this._isWriteDataSupport
                        },
                        {
                            "name": prefix + ".write.last-tag",
                            "value": this._writeTag
                        },
                        {
                            "name": prefix + ".write.last-error",
                            "value": this._writeError
                        }
                    ]
                }
            ];
        }

        _SetDrop(isEnalbled) {
            this._enabledDrop = isEnalbled;
            this.PostToDOM("set-drop", this._enabledDrop);
        }
        _OnPaste(e) {
            this._writeTag = "";
            this._readError = "";
            this._readData = e["data"];
            this._dragPosX = 0;
            this._dragPosY = 0;
            this.Trigger(C3.Plugins.RobotKaposzta_Clipboard.Cnds.OnUserPaste);
        }
        _OnDrop(e) {
            this._writeTag = "";
            this._readError = "";
            this._readData = e["data"];
            this._dragPosX = e["position-x"];
            this._dragPosY = e["position-y"];
            this.Trigger(C3.Plugins.RobotKaposzta_Clipboard.Cnds.OnUserDrop);
        }
        _OnDragStart(e) {
            this._writeTag = "";
            this._readError = "";
            this._readData = e["data"];
            this._dragPosX = e["position-x"];
            this._dragPosY = e["position-y"];
            this.Trigger(C3.Plugins.RobotKaposzta_Clipboard.Cnds.OnUserDragStart);
        }
        _OnDrag(e) {
            this._writeTag = "";
            this._readError = "";
            this._readData = e["data"];
            this._dragPosX = e["position-x"];
            this._dragPosY = e["position-y"];
            this.Trigger(C3.Plugins.RobotKaposzta_Clipboard.Cnds.OnUserDrag);
        }
        _OnDragEnd() {
            this.Trigger(C3.Plugins.RobotKaposzta_Clipboard.Cnds.OnUserDragEnd);
        }

        _OnCopy() {
            this.Trigger(C3.Plugins.RobotKaposzta_Clipboard.Cnds.OnUserCopy);
        }
        _OnCut() {
            this.Trigger(C3.Plugins.RobotKaposzta_Clipboard.Cnds.OnUserCut);
        }
    };
};
