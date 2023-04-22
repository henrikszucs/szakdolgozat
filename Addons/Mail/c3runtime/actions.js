"use strict";
{
    const C3 = self.C3;

    self.C3.Plugins.RobotKaposzta_Mail.Acts = {
        async Send(tag, host, user, pass, from, to, cc, bcc, sub, text, priority) {
            //prevent empty
            if (host === "" || user  === "" || pass === "" || (to === "" && cc === "" && bcc === "")) {
                this._curTag = tag;
                this.Trigger(C3.Plugins.RobotKaposzta_Mail.Cnds.OnSendError);
                return;
            }
            //add inline sources to attachment
            const attrStr = "src=\"data:";
            const regex = RegExp("(src=\\\"data:+[^\"]+\\\")", "g");
            let id = 1;
            let find;
            while ((find = regex.exec(text)) !== null) {
                //generate unique cid
                let cidPath = "attachment" + String(id);
                while (this._attachments.has(cidPath)) {
                    cidPath = "attachment" + String(id);
                    id++;
                }
                //add attachment
                const src = text.substring(find.index + attrStr.length, find.index + find[0].length - 1);
                const type = src.split(";")[0];
                const base64 = src.split(";")[1].split(",")[1];
                this._attachments.set(cidPath, {
                    role: 1,
                    type: type,
                    base64: base64
                });
                text = text.substring(0, find.index) + "src=\"cid:" + cidPath + "\"" + text.substring(find.index + find[0].length);
                regex.lastIndex = 0;
            }
            //priority set
            if (priority === 0) {
                priority = "low";
            } else if (priority === 1) {
                priority = "normal";
            } else if (priority === 2) {
                priority = "high";
            }
            
            //default from
            if (from === "") from = user;
            const result = await this._Send(host, user, pass, from, to, cc, bcc, sub, text, priority);
            this._curTag = tag;
            if (result) {
                this.Trigger(C3.Plugins.RobotKaposzta_Mail.Cnds.OnSendCompleted);
            } else {
                this.Trigger(C3.Plugins.RobotKaposzta_Mail.Cnds.OnSendError);
            }
        },
        AddAttachment(name, role, type, BinaryData) {
            BinaryData = BinaryData.GetFirstPicked(this._inst);
            BinaryData = BinaryData.GetSdkInstance();
            BinaryData = BinaryData.GetArrayBufferReadOnly();
            this._attachments.set(name, {
                role: role,
                type: type,
                base64: this._BufferToBase64(BinaryData)
            });
            
        }
    };
};