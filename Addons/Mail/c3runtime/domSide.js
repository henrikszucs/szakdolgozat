"use strict";
{
    const DOM_COMPONENT_ID = "RobotKaposzta_Mail";
    /**
     * @external DOMHandler
     * @desc This class run in the runtime side. <br><br> The DOMHandler interface is a base class for DOM-side scripts (typically in domSide.js). This means it does not have access to the runtime, since in Web Worker mode the runtime is hosted in a separate JavaScript context within the worker. However the DOM-side script does have access to the full DOM APIs, e.g. document, and using the messaging methods can communicate with the runtime. See DOM calls in the C3 runtime for more information.
     * @see https://www.construct.net/en/make-games/manuals/addon-sdk/runtime-reference/base-classes/domhandler
     */
    /**
     * @classdesc TextManager editor class.
     * @extends external:DOMHandler
     */
    class MailRuntimeDOMHandler extends self.DOMHandler {
        constructor(iRuntime) {
            super(iRuntime, DOM_COMPONENT_ID);

            this.AddRuntimeMessageHandlers([
                ["is-cordova", () => this.IsCordova()],
                ["cordova-send", (e) => this.CordovaSend(...e)],
            ]);
        }

        IsCordova() {
            return (typeof window["smtpClient"] !== "undefined");
        }
        async CordovaSend(host, user, pass, from, to, cc, bcc, sub, text, priority, attachmentsName, attachmentsRole, attachmentsType, attachmentsBase64) {
            const mailSettings = {
                "smtp": host,
                "smtpUserName": user,
                "smtpPassword": pass,
                "emailFrom": from,
                "emailTo": to,
                "emailCC": cc,
                "emailBCC": bcc,
                "subject": sub,
                "textBody": text,
                "priority": priority,
                "attachmentsName": attachmentsName,
                "attachmentsRole": attachmentsRole,
                "attachmentsType": attachmentsType,
                "attachmentsBase64": attachmentsBase64
            };
            return new Promise((resolve) => {
                window["smtpClient"]["sendMail"](mailSettings, function() {
                    resolve(true);
                }, function() {
                    resolve(false);
                });
            });
        }
    };
    self.RuntimeInterface.AddDOMHandlerClass(MailRuntimeDOMHandler);
};