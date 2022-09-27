"use strict";
{
    const C3 = self.C3;
    C3.Plugins.RobotKaposzta_Crypto.Exps = {
        EncryptTag() {
            return this._encryptTag;
        },
        EncryptResult() {
            return this._encryptResult;
        },
        EncryptError() {
            return this._encryptError;
        },  
        DecryptTag() {
            return this._decryptTag;
        },
        DecryptResult() {
            return this._decryptResult;
        },
        DecryptError() {
            return this._decryptError;
        },

        ExportKeyName() {
            return this._exportKeyName;
        },
        ExportSecretKey() {
            return this._exportSecretKey;
        },
        ExportPublicKey() {
            return this._exportPublicKey;
        },
        ExportPrivateKey() {
            return this._exportPrivateKey;
        },
        ExportError() {
            return this._exportError;
        },
        ImportKeyName() {
            return this._importKeyName;
        },
        ImportError() {
            return this._importError;
        },

        RandomBase64(byteCount) {
            const arr = new Uint8Array(byteCount);
            self.crypto.getRandomValues(arr);
            return this._Uint8ArrayToBase64(arr);
        },
        RandomUUID() {
            return self.crypto.randomUUID();
        },
        GenerateKeyName() {
            return this._generateKeyName;
        },
        GenerateKeyError() {
            return this._generateKeyError;
        },
        GenerateDataTag() {
            return this._generateDataTag;
        },
        GenerateData() {
            return this._generateData;
        },
        GenerateDataError() {
            return this._generateDataError;
        },

        HashTag() {
            return this._hashTag;
        },
        HashAsHex() {
            return this._hashAsHex;
        },
        HashAsBase64() {
            return this._hashAsBase64;
        },
        HashError() {
            return this._hashError;
        },

        TextToBase64(text) {
            const arr = this._StringToUint8Array(text);
            return this._Uint8ArrayToBase64(arr);
        },
        Base64ToText(base64) {
            const arr = this._Base64ToUint8Array(base64);
            return this._Uint8ArrayToString(arr);
        },
        KeyCount() {
            return this._keys.size;
        },
        KeyNameAt(at) {
            const nameArr = [];
            const iterator = this._keys[Symbol.iterator]();
            for (const item of iterator) {
                nameArr.push(item[0]);
            }
            if (nameArr[at]) return nameArr[at];
            return "";
        },
        KeyType(keyName) {
            const keyType = this._keys.get(keyName);
            if (keyType["type"]) return keyType["type"];
            return "";
        },

        SignTag() {
            return this._signTag;
        },
        Signature() {
            return this._signature;
        },
        SignError() {
            return this._signError;
        },
        VerifyTag() {
            return this._verifyTag;
        },
        VerifyError() {
            return this._verifyError;
        }
    };
};