"use strict";
{
    const C3 = self.C3;
    const DOM_COMPONENT_ID = "RobotKaposzta_Mail";

    /**
     * @external SDKInstanceBase
     * @desc The SDKInstanceBase interface is used as the base class for runtime instances in the SDK. For "world" type plugins, instances instead derive from SDKWorldInstanceBase which itself derives from SDKInstanceBase.
     * @see https://www.construct.net/en/make-games/manuals/addon-sdk/runtime-reference/base-classes/sdkinstancebase
     */
    /**
     * @classdesc TextManager editor class. 1 UNDOCUMENTED FEATURE new C3.CompositeDisposable();
     * @extends external:SDKInstanceBase
     */
    class MailRuntimeInstance extends C3.SDKInstanceBase {
        constructor(inst, properties) {
            super(inst, DOM_COMPONENT_ID);

            this._support = {
                isNode: false,
                isCordova: false
            };
            this._node;

            this._attachments = new Map();
            this._curTag = "";

            this._runtime.AddLoadPromise((async () => {
                try {
                    this._node = require("nodemailer");
                    this._support.isNode = true;
                } catch (error) {
                    this._support.isCordova = await this.PostToDOMAsync("is-cordova");
                }
                if (this._support.isNode) {
                    this._Send = this._SendNode;
                } else if (this._support.isCordova) {
                    this._Send = this._SendCordova;
                }
            })());
        }
        _BufferToBase64(buffer) {
            let binary = "";
            const bytes = new Uint8Array(buffer);
            const len = bytes.byteLength;
            for (let i = 0; i < len; i++) {
                binary += String.fromCharCode(bytes[i]);
            }
            return self.btoa(binary);
        }

        async _Send(host, user, pass, from, to, cc, bcc, sub, text, priority) {
            return false;
        }
        async _SendNode(host, user, pass, from, to, cc, bcc, sub, text, priority) {
            try {
                //connection
                const data = host.split(":");
                host = data[0];
                let port = 587;
                if (!isNaN(parseInt(data?.[1]))) port = parseInt(data[1]);
                let transporter = this._node["createTransport"]({
                    "host": host,
                    "port": port,
                    "secure": port === 465, // true for 465, false for other ports
                    "tls": {
                        "rejectUnauthorized": true //allow invalid cert
                    },
                    "requireTLS": true,
                    "auth": {
                        "user": user,
                        "pass": pass
                    }
                });
                //attachments
                let attachments = [];
                const it = this._attachments.entries();
                for (const [name, content] of it) {
                    if (content.role === 0 || content.role === 2) {
                        attachments.push({
                            "filename": name,
                            "contentType": content.type,
                            "encoding": "base64",
                            "content": content.base64
                        });
                    }
                    if (content.role === 1 || content.role === 2) {
                        attachments.push({
                            "cid": name,
                            "filename": name,
                            "contentType": content.type,
                            "encoding": "base64",
                            "content": content.base64
                        });
                    }
                }
                this._attachments.clear();
                
                //mail
                const headers = {};
                if (priority === "low") {
                    headers["Priority"] = "Non-Urgent";
                } else if (priority === "normal") {
                    headers["Priority"] = "Normal";
                } else if (priority === "high") {
                    headers["Priority"] = "Urgent";
                } 
                const mail = {
                    "from": from,
                    "to": to,
                    "cc": cc,
                    "bcc": bcc,
                    "subject": sub,
                    "html": text,
                    "attachments": attachments,
                    "priority": priority,
                    "headers": headers
                };
                await transporter["sendMail"](mail);
            } catch (error) {
                console.error(error);
                return false;
            }
            return true;
        }
        async _SendCordova(host, user, pass, from, to, cc, bcc, sub, text, priority) {
            host = host.split(":")[0];
            let attachmentsName = [];
            let attachmentsRole = [];
            let attachmentsType = [];
            let attachmentsBase64 = [];
            const it = this._attachments.entries();
            for (const [name, content] of it) {
                attachmentsName.push(name);
                attachmentsRole.push(String(content.role));
                attachmentsType.push(content.type);
                attachmentsBase64.push(content.base64);
            }
            this._attachments.clear();
            const result = await this.PostToDOMAsync("cordova-send", [host, user, pass, from, to, cc, bcc, sub, text, priority, attachmentsName, attachmentsRole, attachmentsType, attachmentsBase64]);
            return result;
        }
    };
    C3.Plugins.RobotKaposzta_Mail.Instance = MailRuntimeInstance;
};