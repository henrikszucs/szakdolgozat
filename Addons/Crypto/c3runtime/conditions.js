"use strict";
{
    const C3 = self.C3;
    C3.Plugins.RobotKaposzta_Crypto.Cnds = {
        OnEncrypt() {
            return true;
        },
        OnEncryptError() {
            return true;
        },
        OnDecrypt() {
            return true;
        },
        OnDecryptError() {
            return true;
        },

        OnExport() {
            return true;
        },
        OnExportError() {
            return true;
        },
        OnImport() {
            return true;
        },
        OnImportError() {
            return true;
        },

        OnKeyGenerate() {
            return true;
        },
        OnKeyGenerateError() {
            return true;
        },
        OnDataGenerate() {
            return true;
        },
        OnDataGenerateError() {
            return true;
        },

        OnHash() {
            return true;
        },
        OnHashError() {
            return true;
        },

        HasKey(key, type, data) {
            key = this._keys.get(key);
            if (typeof (key) === "undefined") {
                return false;
            }
            if (type !== 0) {
                if (type === 1) {
                    type = "RSASSA-PKCS1-v1_5";
                } else if (type === 2) {
                    type = "RSA-PSS";
                } else if (type === 3) {
                    type = "RSA-OAEP";
                } else if (type === 4) {
                    type = "ECDSA";
                } else if (type === 5) {
                    type = "ECDH";
                } else if (type === 6) {
                    type = "HMAC";
                } else if (type === 7) {
                    type = "AES-CTR";
                } else if (type === 8) {
                    type = "AES-CBC";
                } else if (type === 9) {
                    type = "AES-GCM";
                }
                if (key["type"] !== type) {
                    return false
                }
            }
            if (data !== 0) {
                if (data === 1) {
                    if (typeof (key["secretKey"]) === "undefined") {  
                        return false;
                    }
                } else if (data === 2) {
                    if (typeof (key["publicKey"]) === "undefined") {
                        return false;
                    }
                } else if (data === 3) {
                    if (typeof (key["privateKey"]) === "undefined") {
                        return false;
                    }
                }
            }
            return true;
        },

        OnSign() {
            return true;
        },
        OnSignError() {
            return true;
        },
        OnVerify() {
            return true;
        },
        OnVerifyError() {
            return true;
        },
        IsValid() {
            return this._isValid;
        }
    };
};