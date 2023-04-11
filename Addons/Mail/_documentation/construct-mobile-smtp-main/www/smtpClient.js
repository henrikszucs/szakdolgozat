/*global cordova, module*/

let smtpClient = {
    sendMail: function(mailSettings, successCallback, errorCallback) {
        const mailSettingsClone = {};
        const keys = ["smtp", "smtpUserName", "smtpPassword", "emailFrom", "emailTo", "emailCC", "emailBCC", "subject", "textBody", "priority", "attachmentsName", "attachmentsRole", "attachmentsType", "attachmentsBase64"];
        for (let key of keys) {
            const value = mailSettings?.[key];
            if (typeof value === "undefined") {
                throw new Error("\"" + key + "\" parameter is not a found");
            }
            mailSettingsClone[key] = value;
        }
        if (mailSettingsClone["smtp"] === "" || mailSettingsClone["smtpUserName"] === "" || mailSettingsClone["smtpPassword"] === "" || (mailSettingsClone["emailTo"] === "" && mailSettingsClone["emailCC"] === "" && mailSettingsClone["emailBCC"] === "")) {
            errorCallback();
        } else {
            if (mailSettingsClone["emailFrom"] === "") {
                mailSettingsClone["emailFrom"] = mailSettingsClone["smtpUserName"];
            }
            cordova.exec(successCallback, errorCallback, "SMTPClient", "cordovaSendMail", [JSON.stringify(mailSettingsClone)]);
        }
    },
    isLoaded: function() {
        console.info('SMTP Client is loaded !');
        return true;
    }
};

module.exports = smtpClient;
