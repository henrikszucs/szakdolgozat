"use strict";
{
    const C3 = self.C3;
    C3.Plugins.RobotKaposzta_Clipboard.Acts = {
        async RequestPermission(type) {
            let result = await this.PostToDOMAsync("request-permission", {
                "type": type
            });
            this._permissionReqType = type;
            if (result["result"]) {
                this.Trigger(C3.Plugins.RobotKaposzta_Clipboard.Cnds.OnPermissonGranted);
            } else {
                this.Trigger(C3.Plugins.RobotKaposzta_Clipboard.Cnds.OnPermissionDenied);
            }
        },

        SetDrop(mode) {
            mode = mode === 0;
            this._SetDrop(mode);
        },
        async Read(tag) {
            const result = await this.PostToDOMAsync("read");
            this._readTag = tag;
            this._readError = result["error"];
            this._readData = result["data"];
            this._dragPosX = 0;
            this._dragPosY = 0;
            if (result["error"]) {
                this.Trigger(C3.Plugins.RobotKaposzta_Clipboard.Cnds.OnAnyReadError);
                this.Trigger(C3.Plugins.RobotKaposzta_Clipboard.Cnds.OnReadError);
                return false;
            } else {
                this.Trigger(C3.Plugins.RobotKaposzta_Clipboard.Cnds.OnAnyRead);
                this.Trigger(C3.Plugins.RobotKaposzta_Clipboard.Cnds.OnRead);
                return true;
            }
        },

        async Write(textPlain, textHTML, imagePNG, tag) {
            const data = {};
            if (textPlain !== "") {
                data["text/plain"] = textPlain;
            }
            if (textHTML !== "") {
                data["text/html"] = textHTML;
            }
            if (imagePNG !== "") {
                data["image/png"] = imagePNG;
            }
            if (Object.keys(data).length === 0) {
                data["text/plain"] = "";
            }
            const res = await this.PostToDOMAsync("write", {
               "data": data
            });
            if (res["error"]) {
                this._writeTag = tag;
                this._writeError = res["error"];
                this.Trigger(C3.Plugins.RobotKaposzta_Clipboard.Cnds.OnAnyWriteError);
                this.Trigger(C3.Plugins.RobotKaposzta_Clipboard.Cnds.OnWriteError);
                return false;
            }
            this._writeTag = tag;
            this._writeError = "";
            this.Trigger(C3.Plugins.RobotKaposzta_Clipboard.Cnds.OnAnyWrite);
            this.Trigger(C3.Plugins.RobotKaposzta_Clipboard.Cnds.OnWrite);
            return true;
        }
    };
};