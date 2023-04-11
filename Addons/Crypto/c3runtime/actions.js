"use strict";
{
    const C3 = self.C3;
    C3.Plugins.RobotKaposzta_Crypto.Acts = {
        async EncryptRSA_OAEP(key, data, label, tag) {
            const keyObj = this._keys.get(key)?.["publicKey"];
            if (!keyObj) {
                this._encryptTag = tag;
                this._encryptResult = "";
                this._encryptError = "InvalidKeyName";
                this.Trigger(C3.Plugins.RobotKaposzta_Crypto.Cnds.OnEncryptError);
                return false;
            }
            let dataBin;
            let result;
            try {
                let algorithm =  { "name": "RSA-OAEP" };
                if (label !== "") algorithm["label"] = this._Base64ToUint8Array(label);
                dataBin = this._Base64ToUint8Array(data);
                result = await self.crypto.subtle.encrypt(
                    algorithm,
                    keyObj,
                    dataBin
                );
                result = new Uint8Array(result);
            } catch (error) {
                this._encryptTag = tag;
                this._encryptResult = "";
                this._encryptError = error.name;
                this.Trigger(C3.Plugins.RobotKaposzta_Crypto.Cnds.OnEncryptError);
                return false;
            }
            this._encryptTag = tag;
            this._encryptResult = this._Uint8ArrayToBase64(result);
            this._encryptError = "";
            this.Trigger(C3.Plugins.RobotKaposzta_Crypto.Cnds.OnEncrypt);
            return true;
        },
        async EncryptAES_CTR(key, data, counter, length, tag) {
            const keyObj = this._keys.get(key)?.["secretKey"];
            if (!keyObj) {
                this._encryptTag = tag;
                this._encryptResult = "";
                this._encryptError = "InvalidKeyName";
                this.Trigger(C3.Plugins.RobotKaposzta_Crypto.Cnds.OnEncryptError);
                return false;
            }
            let dataBin;
            let result;
            try {
                let algorithm =  {
                    "name": "AES-CTR",
                    "counter": this._Base64ToUint8Array(counter),
                    "length": length
                };
                dataBin = this._Base64ToUint8Array(data);
                result = await self.crypto.subtle.encrypt(
                    algorithm,
                    keyObj,
                    dataBin
                );
                result = new Uint8Array(result);
            } catch (error) {
                this._encryptTag = tag;
                this._encryptResult = "";
                this._encryptError = error.name;
                this.Trigger(C3.Plugins.RobotKaposzta_Crypto.Cnds.OnEncryptError);
                return false;
            }
            this._encryptTag = tag;
            this._encryptResult = this._Uint8ArrayToBase64(result);
            this._encryptError = "";
            this.Trigger(C3.Plugins.RobotKaposzta_Crypto.Cnds.OnEncrypt);
            return true;
        },
        async EncryptAES_CBC(key, data, iv, tag) {
            const keyObj = this._keys.get(key)?.["secretKey"];
            if (!keyObj) {
                this._encryptTag = tag;
                this._encryptResult = "";
                this._encryptError = "InvalidKeyName";
                this.Trigger(C3.Plugins.RobotKaposzta_Crypto.Cnds.OnEncryptError);
                return false;
            }
            let dataBin;
            let result;
            
            try {
                let algorithm =  {
                    "name": "AES-CBC",
                    "iv": this._Base64ToUint8Array(iv)
                };
                dataBin = this._Base64ToUint8Array(data);
                result = await self.crypto.subtle.encrypt(
                    algorithm,
                    keyObj,
                    dataBin
                );
                result = new Uint8Array(result);
            } catch (error) {
                this._encryptTag = tag;
                this._encryptResult = "";
                this._encryptError = error.name;
                this.Trigger(C3.Plugins.RobotKaposzta_Crypto.Cnds.OnEncryptError);
                return false;
            }
            this._encryptTag = tag;
            this._encryptResult = this._Uint8ArrayToBase64(result);
            this._encryptError = "";
            this.Trigger(C3.Plugins.RobotKaposzta_Crypto.Cnds.OnEncrypt);
            return true;
        },
        async EncryptAES_GCM(key, data, iv, additonalData, tagLength, tag) {
            const keyObj = this._keys.get(key)?.["secretKey"];
            if (!keyObj) {
                this._encryptTag = tag;
                this._encryptResult = "";
                this._encryptError = "InvalidKeyName";
                this.Trigger(C3.Plugins.RobotKaposzta_Crypto.Cnds.OnEncryptError);
                return false;
            }
            if (tagLength === 0) {
                tagLength = 128;
            } else if (tagLength === 1) {
                tagLength = 120;
            } else if (tagLength === 2) {
                tagLength = 112;
            } else if (tagLength === 3) {
                tagLength = 104;
            } else if (tagLength === 4) {
                tagLength = 96;
            } else if (tagLength === 5) {
                tagLength = 64;
            } else {
                tagLength = 32;
            }
            let dataBin;
            let result;
            try {
                let algorithm =  {
                    "name": "AES-GCM",
                    "iv": this._Base64ToUint8Array(iv),
                    "additonalData": this._Base64ToUint8Array(additonalData),
                    "tagLength": tagLength
                };
                dataBin = this._Base64ToUint8Array(data);
                result = await self.crypto.subtle.encrypt(
                    algorithm,
                    keyObj,
                    dataBin
                );
                result = new Uint8Array(result);
            } catch (error) {
                this._encryptTag = tag;
                this._encryptResult = "";
                this._encryptError = error.name;
                this.Trigger(C3.Plugins.RobotKaposzta_Crypto.Cnds.OnEncryptError);
                return false;
            }
            this._encryptTag = tag;
            this._encryptResult = this._Uint8ArrayToBase64(result);
            this._encryptError = "";
            this.Trigger(C3.Plugins.RobotKaposzta_Crypto.Cnds.OnEncrypt);
            return true;
        },
        async DecryptRSA_OAEP(key, data, label, tag) {
            const keyObj = this._keys.get(key)?.["privateKey"];
            if (!keyObj) {
                this._decryptTag = tag;
                this._decryptResult = "";
                this._decryptError = "InvalidKeyName";
                this.Trigger(C3.Plugins.RobotKaposzta_Crypto.Cnds.OnDecryptError);
                return false;
            }
            let dataBin;
            let result;
            try {
                let algorithm =  { "name": "RSA-OAEP" };
                if (label !== "") algorithm["label"] = this._Base64ToUint8Array(label);
                dataBin = this._Base64ToUint8Array(data);
                result = await self.crypto.subtle.decrypt(
                    algorithm,
                    keyObj,
                    dataBin
                );
                result = new Uint8Array(result);
            } catch (error) {
                this._decryptTag = tag;
                this._decryptResult = "";
                this._decryptError = error.name;
                this.Trigger(C3.Plugins.RobotKaposzta_Crypto.Cnds.OnDecryptError);
                return false;
            }
            this._decryptTag = tag;
            this._decryptResult = this._Uint8ArrayToBase64(result);
            this._decryptError = "";
            this.Trigger(C3.Plugins.RobotKaposzta_Crypto.Cnds.OnDecrypt);
            return true;
        },
        async DecryptAES_CTR(key, data, counter, length, tag) {
            const keyObj = this._keys.get(key)?.["secretKey"];
            if (!keyObj) {
                this._decryptTag = tag;
                this._decryptResult = "";
                this._decryptError = "InvalidKeyName";
                this.Trigger(C3.Plugins.RobotKaposzta_Crypto.Cnds.OnDecryptError);
                return false;
            }
            let dataBin;
            let result;
            try {
                let algorithm =  {
                    "name": "AES-CTR",
                    "counter": this._Base64ToUint8Array(counter),
                    "length": length
                };
                dataBin = this._Base64ToUint8Array(data);
                result = await self.crypto.subtle.decrypt(
                    algorithm,
                    keyObj,
                    dataBin
                );
                result = new Uint8Array(result);
            } catch (error) {
                this._decryptTag = tag;
                this._decryptResult = "";
                this._decryptError = error.name;
                this.Trigger(C3.Plugins.RobotKaposzta_Crypto.Cnds.OnDecryptError);
                return false;
            }
            this._decryptTag = tag;
            this._decryptResult = this._Uint8ArrayToBase64(result);
            this._decryptError = "";
            this.Trigger(C3.Plugins.RobotKaposzta_Crypto.Cnds.OnDecrypt);
            return true;
        },
        async DecryptAES_CBC(key, data, iv, tag) {
            const keyObj = this._keys.get(key)?.["secretKey"];
            if (!keyObj) {
                this._decryptTag = tag;
                this._decryptResult = "";
                this._decryptError = "InvalidKeyName";
                this.Trigger(C3.Plugins.RobotKaposzta_Crypto.Cnds.OnDecryptError);
                return false;
            }
            let dataBin;
            let result;
            try {
                let algorithm =  {
                    "name": "AES-CBC",
                    "iv": this._Base64ToUint8Array(iv)
                };
                dataBin = this._Base64ToUint8Array(data);
                result = await self.crypto.subtle.decrypt(
                    algorithm,
                    keyObj,
                    dataBin
                );
                result = new Uint8Array(result);
            } catch (error) {
                this._decryptTag = tag;
                this._decryptResult = "";
                this._decryptError = error.name;
                this.Trigger(C3.Plugins.RobotKaposzta_Crypto.Cnds.OnDecryptError);
                return false;
            }
            this._decryptTag = tag;
            this._decryptResult = this._Uint8ArrayToBase64(result);
            this._decryptError = "";
            this.Trigger(C3.Plugins.RobotKaposzta_Crypto.Cnds.OnDecrypt);
            return true;
        },
        async DecryptAES_GCM(key, data, iv, additonalData, tagLength, tag) {
            const keyObj = this._keys.get(key)?.["secretKey"];
            if (!keyObj) {
                this._decryptTag = tag;
                this._decryptResult = "";
                this._decryptError = "InvalidKeyName";
                this.Trigger(C3.Plugins.RobotKaposzta_Crypto.Cnds.OnDecryptError);
                return false;
            }
            if (tagLength === 0) {
                tagLength = 128;
            } else if (tagLength === 1) {
                tagLength = 120;
            } else if (tagLength === 2) {
                tagLength = 112;
            } else if (tagLength === 3) {
                tagLength = 104;
            } else if (tagLength === 4) {
                tagLength = 96;
            } else if (tagLength === 5) {
                tagLength = 64;
            } else {
                tagLength = 32;
            }
            let dataBin;
            let result;
            try {
                let algorithm =  {
                    "name": "AES-GCM",
                    "iv": this._Base64ToUint8Array(iv),
                    "additonalData": this._Base64ToUint8Array(additonalData),
                    "tagLength": tagLength
                };
                dataBin = this._Base64ToUint8Array(data);
                result = await self.crypto.subtle.decrypt(
                    algorithm,
                    keyObj,
                    dataBin
                );
                result = new Uint8Array(result);
            } catch (error) {
                this._decryptTag = tag;
                this._decryptResult = "";
                this._decryptError = error.name;
                this.Trigger(C3.Plugins.RobotKaposzta_Crypto.Cnds.OnDecryptError);
                return false;
            }
            this._decryptTag = tag;
            this._decryptResult = this._Uint8ArrayToBase64(result);
            this._decryptError = "";
            this.Trigger(C3.Plugins.RobotKaposzta_Crypto.Cnds.OnDecrypt);
            return true;
        },

        async ExportKey(key, secretFormat, publicFormat, privateFormat) {
            const keyObj = this._keys.get(key);
            if (!keyObj) {
                this._exportKeyName = key;
                this._exportSecretKey = "";
                this._exportPublicKey = "";
                this._exportPrivateKey = "";
                this._exportError = "InvalidKeyName";
                this.Trigger(C3.Plugins.RobotKaposzta_Crypto.Cnds.OnExportError);
                return false;
            }
            let secretKey = "";
            let publicKey = "";
            let privateKey = "";
            try {
                if (["HMAC", "AES-CTR", "AES-CBC", "AES-GCM"].includes(keyObj["type"])) {
                    let secFormat;
                    if (secretFormat === 0) {
                        secFormat = "raw";
                    } else {
                        secFormat = "jwk";
                    }
                    const secResult = await self.crypto.subtle.exportKey(
                        secFormat,
                        keyObj["secretKey"]
                    );
                    if (secretFormat === 0) {
                        secretKey = this._Uint8ArrayToBase64(new Uint8Array(secResult));
                     } else if (secretFormat === 1) {
                        secretKey = JSON.stringify(secResult);
                    }
                } else {
                    if (!keyObj["publicKey"]["extractable"] && !keyObj["privateKey"]["extractable"]) {
                        this._exportKeyName = key;
                        this._exportSecretKey = "";
                        this._exportPublicKey = "";
                        this._exportPrivateKey = "";
                        this._exportError = "InvalidAccessError";
                        this.Trigger(C3.Plugins.RobotKaposzta_Crypto.Cnds.OnExportError);
                        return false;
                    }
                    if (keyObj["publicKey"] && keyObj["publicKey"]["extractable"]) {
                        let pubFormat;
                        if (publicFormat === 0) {
                            if (keyObj["type"] === "ECDSA" || keyObj["type"] === "ECDH") {
                                pubFormat = "raw";
                            } else {
                                pubFormat = "spki";
                            }
                        } else if (publicFormat === 1 || publicFormat === 2) {
                            pubFormat = "spki";
                        } else {
                            pubFormat = "jwk";
                        }
                        const pubResult = await self.crypto.subtle.exportKey(
                            pubFormat,
                            keyObj["publicKey"]
                        );
                        if (publicFormat === 0 || publicFormat === 1) {
                            publicKey = this._Uint8ArrayToBase64(new Uint8Array(pubResult));
                        } else if (publicFormat === 2) {
                            publicKey = "-----BEGIN PUBLIC KEY-----\n" + this._Uint8ArrayToBase64(new Uint8Array(pubResult)) + "\n-----END PUBLIC KEY-----";
                        } else {
                            publicKey = JSON.stringify(pubResult);
                        }
                    }
                    if (keyObj["privateKey"] && keyObj["privateKey"]["extractable"]) {
                        let priFormat;
                        if (privateFormat === 0 || privateFormat === 1) {
                            priFormat = "pkcs8"
                        } else {
                            priFormat = "jwk"
                        }
                        const priResult = await self.crypto.subtle.exportKey(
                            priFormat,
                            keyObj["privateKey"]
                        );
                        if (privateFormat === 0) {
                            privateKey = this._Uint8ArrayToBase64(new Uint8Array(priResult));
                        } else if (privateFormat === 1) {
                            privateKey = "-----BEGIN PRIVATE KEY-----\n" + this._Uint8ArrayToBase64(new Uint8Array(priResult)) + "\n-----END PRIVATE KEY-----";
                        } else {
                            privateKey = JSON.stringify(priResult);
                        }
                    }
                }
            } catch (error) {
                this._exportKeyName = key;
                this._exportSecretKey = "";
                this._exportPublicKey = "";
                this._exportPrivateKey = "";
                this._exportError = error.name;
                this.Trigger(C3.Plugins.RobotKaposzta_Crypto.Cnds.OnExportError);
                return false;
            }
            this._exportKeyName = key;
            this._exportSecretKey = secretKey;
            this._exportPublicKey = publicKey;
            this._exportPrivateKey = privateKey;
            this._exportError = "";
            this.Trigger(C3.Plugins.RobotKaposzta_Crypto.Cnds.OnExport);
            return true;
        },
        async ImportRSA(key, type, publicExport, publicFormat, publicData, privateExport, privateFormat, privateData, hash) {
            if (publicData === "" && privateData === "") {
                this._importKeyName = key;
                this._importError = "NoKeyData";
                this.Trigger(C3.Plugins.RobotKaposzta_Crypto.Cnds.OnImportError);
                return false;
            }
            const memoryKeyObj = {};
            const algorithm = {};
            let priKeyUsage;
            let pubKeyUsage;
            if (type === 0) {
                algorithm["name"] = "RSASSA-PKCS1-v1_5";
                pubKeyUsage = ["verify"];
                priKeyUsage = ["sign"];
            } else if (type === 1) {
                algorithm["name"] = "RSA-PSS";
                pubKeyUsage = ["verify"];
                priKeyUsage = ["sign"];
            } else {
                algorithm["name"] = "RSA-OAEP";
                pubKeyUsage = ["encrypt"];
                priKeyUsage = ["decrypt"];
            }
            if (hash === 0) {
                algorithm["hash"] = "SHA-256";
            } else if (hash === 1) {
                algorithm["hash"] = "SHA-384";
            } else {
                algorithm["hash"] = "SHA-512";
            }
            memoryKeyObj["type"] = algorithm["name"];
            try {
                if (publicData !== "") {
                    if (publicFormat === 0) {
                        publicFormat = "spki";
                        publicData = this._Base64ToUint8Array(publicData);
                    } else if (publicFormat === 1) {
                        publicFormat = "spki";
                        publicData = this._PEMToUint8Array(publicData);
                    } else {
                        publicFormat = "jwk";
                        publicData = JSON.parse(publicData);
                    }
                    memoryKeyObj["publicKey"] = await self.crypto.subtle.importKey(
                        publicFormat,
                        publicData,
                        algorithm,
                        publicExport,
                        pubKeyUsage
                    );
                }
                if (privateData !== "") {
                    if (privateFormat === 0) {
                        privateFormat = "spki";
                        privateData = this._Base64ToUint8Array(privateData);
                    } else if (privateFormat === 1) {
                        privateFormat = "spki";
                        privateData = this._PEMToUint8Array(privateData);
                    } else {
                        privateFormat = "jwk";
                        privateData = JSON.parse(privateData);
                    }
                    memoryKeyObj["privateKey"] = await self.crypto.subtle.importKey(
                        privateFormat,
                        privateData,
                        algorithm,
                        privateExport,
                        priKeyUsage
                    );
                }
            } catch (error) {
                this._importKeyName = key;
                this._importError = error.name;
                this.Trigger(C3.Plugins.RobotKaposzta_Crypto.Cnds.OnImportError);
                return false;
            }
            this._keys.set(key, memoryKeyObj);
            this._importKeyName = key;
            this._importError = "";
            this.Trigger(C3.Plugins.RobotKaposzta_Crypto.Cnds.OnImport);
            return true;
        },
        async ImportEC(key, type, publicExport, publicFormat, publicData, privateExport, privateFormat, privateData, curve) {
            const memoryKeyObj = {};
            const algorithm = {};
            let priKeyUsage;
            let pubKeyUsage;
            if (type === 0) {
                algorithm["name"] = "ECDSA";
                pubKeyUsage = ["verify"];
                priKeyUsage = ["sign"];
            } else {
                algorithm["name"] = "ECDH";
                pubKeyUsage = ["deriveKey", "deriveBits"];
                priKeyUsage = ["deriveKey", "deriveBits"];
            }
            if (curve === 0) {
                algorithm["namedCurve"] = "P-256";
            } else if (curve === 1) {
                algorithm["namedCurve"] = "P-384";
            } else {
                algorithm["namedCurve"] = "P-521";
            }
            memoryKeyObj["type"] = algorithm["name"];
            try {
                if (publicFormat === 0) {
                    publicFormat = "raw";
                    publicData = this._Base64ToUint8Array(publicData);
                } else if (publicFormat === 1) {
                    publicFormat = "spki";
                    publicData = this._Base64ToUint8Array(publicData);
                } else if (publicFormat === 2) {
                    publicFormat = "spki";
                    publicData = this._PEMToUint8Array(publicData);
                } else {
                    publicFormat = "jwk";
                    publicData = JSON.parse(publicData);
                }
                memoryKeyObj["publicKey"] = await self.crypto.subtle.importKey(
                    publicFormat,
                    publicData,
                    algorithm,
                    publicExport,
                    pubKeyUsage
                );
                if (privateFormat === 0) {
                    privateFormat = "pkcs8";
                    privateData = this._Base64ToUint8Array(privateData);
                } else if (privateFormat === 1) {
                    privateFormat = "pkcs8";
                    privateData = this._PEMToUint8Array(privateData);
                } else {
                    privateFormat = "jwk";
                    privateData = JSON.parse(privateData);
                }
                memoryKeyObj["privateKey"] = await self.crypto.subtle.importKey(
                    privateFormat,
                    privateData,
                    algorithm,
                    privateExport,
                    priKeyUsage
                );
            } catch (error) {
                this._importKeyName = key;
                this._importError = error.name;
                this.Trigger(C3.Plugins.RobotKaposzta_Crypto.Cnds.OnImportError);
                return false;
            }
            this._keys.set(key, memoryKeyObj);
            this._importKeyName = key;
            this._importError = "";
            this.Trigger(C3.Plugins.RobotKaposzta_Crypto.Cnds.OnImport);
            return true;
        },
        async ImportHMAC(key, allowExport, secretFormat, secretData, hash, length) {
            const memoryKeyObj = {};
            const algorithm = {};
            let keyUsage;
            algorithm["name"] = "HMAC";
            if (hash === 0) {
                algorithm["hash"] = "SHA-1";
            } else if (hash === 1) {
                algorithm["hash"] = "SHA-256";
            } else if (hash === 2) {
                algorithm["hash"] = "SHA-384";
            } else {
                algorithm["hash"] = "SHA-521";
            }
            if (length > 0) {
                algorithm["length"] = length;
            }
            keyUsage = ["sign", "verify"];
            memoryKeyObj["type"] = algorithm["name"];
            try {
                if (secretFormat === 0) {
                    secretFormat = "raw";
                    secretData = this._Base64ToUint8Array(secretData);
                } else {
                    secretFormat = "jwk";
                    secretData = JSON.parse(secretData);
                }
                memoryKeyObj["secretKey"] = await self.crypto.subtle.importKey(
                    secretFormat,
                    secretData,
                    algorithm,
                    allowExport,
                    keyUsage
                );
            } catch (error) {
                this._importKeyName = key;
                this._importError = error.name;
                this.Trigger(C3.Plugins.RobotKaposzta_Crypto.Cnds.OnImportError);
                return false;
            }
            this._keys.set(key, memoryKeyObj);
            this._importKeyName = key;
            this._importError = "";
            this.Trigger(C3.Plugins.RobotKaposzta_Crypto.Cnds.OnImport);
            return true;
        },
        async ImportAES(key, allowExport, type, secretFormat, secretData) {
            const memoryKeyObj = {};
            const algorithm = {};
            let keyUsage;
            if (type === 0) {
                algorithm["name"] = "AES-CTR";
            } else if (type === 1) {
                algorithm["name"] = "AES-CBC";
            } else {
                algorithm["name"] = "AES-GCM";
            }
            keyUsage = ["encrypt", "decrypt"];
            memoryKeyObj["type"] = algorithm["name"];
            try {
                if (secretFormat === 0) {
                    secretFormat = "raw";
                    secretData = this._Base64ToUint8Array(secretData);
                } else {
                    secretFormat = "jwk";
                    secretData = JSON.parse(secretData);
                }
                memoryKeyObj["secretKey"] = await self.crypto.subtle.importKey(
                    secretFormat,
                    secretData,
                    algorithm,
                    allowExport,
                    keyUsage
                );
            } catch (error) {
                this._importKeyName = key;
                this._importError = error.name;
                this.Trigger(C3.Plugins.RobotKaposzta_Crypto.Cnds.OnImportError);
                return false;
            }
            this._keys.set(key, memoryKeyObj);
            this._importKeyName = key;
            this._importError = "";
            this.Trigger(C3.Plugins.RobotKaposzta_Crypto.Cnds.OnImport);
            return true;
        },
        async ImportHKDF(key, secretData) {
            const memoryKeyObj = {};
            const algorithm = "HKDF";
            let keyUsage = ["deriveKey", "deriveBits"];
            memoryKeyObj["type"] = algorithm;
            try {
                secretData = this._Base64ToUint8Array(secretData);
                memoryKeyObj["secretKey"] = await self.crypto.subtle.importKey(
                    "raw",
                    secretData,
                    algorithm,
                    false,
                    keyUsage
                );
            } catch (error) {
                this._importKeyName = key;
                this._importError = error.name;
                this.Trigger(C3.Plugins.RobotKaposzta_Crypto.Cnds.OnImportError);
                return false;
            }
            this._keys.set(key, memoryKeyObj);
            this._importKeyName = key;
            this._importError = "";
            this.Trigger(C3.Plugins.RobotKaposzta_Crypto.Cnds.OnImport);
            return true;
        },
        async ImportPBKDF2(key, secretData) {
            const memoryKeyObj = {};
            const algorithm = "PBKDF2";
            let keyUsage = ["deriveKey", "deriveBits"];
            memoryKeyObj["type"] = algorithm;
            try {
                secretData = this._Base64ToUint8Array(secretData);
                memoryKeyObj["secretKey"] = await self.crypto.subtle.importKey(
                    "raw",
                    secretData,
                    algorithm,
                    false,
                    keyUsage
                );
            } catch (error) {
                this._importKeyName = key;
                this._importError = error.name;
                this.Trigger(C3.Plugins.RobotKaposzta_Crypto.Cnds.OnImportError);
                return false;
            }
            this._keys.set(key, memoryKeyObj);
            this._importKeyName = key;
            this._importError = "";
            this.Trigger(C3.Plugins.RobotKaposzta_Crypto.Cnds.OnImport);
            return true;
        },

        async GenerateRSA(key, allowExport, type, hash, modulus, exponent) {
            const memoryKeyObj = {};
            const algorithm = {};
            let keyUsage;
            if (type === 0) {
                algorithm["name"] = "RSASSA-PKCS1-v1_5";
                keyUsage = ["sign", "verify"];
            } else if (type === 1) {
                algorithm["name"] = "RSA-PSS";
                keyUsage = ["sign", "verify"];
            } else {
                algorithm["name"] = "RSA-OAEP";
                keyUsage = ["encrypt", "decrypt"];
            }
            if (hash === 0) {
                algorithm["hash"] = "SHA-256";
            } else if (hash === 1) {
                algorithm["hash"] = "SHA-384";
            } else {
                algorithm["hash"] = "SHA-512";
            }
            algorithm["modulusLength"] = modulus;
            try {
                if (exponent !== "") {
                    algorithm["publicExponent"] = this._Base64ToUint8Array(exponent);
                } else {
                    algorithm["publicExponent"] = new Uint8Array([0x01, 0x00, 0x01]);
                }
                memoryKeyObj["type"] = algorithm["name"];
                const result = await self.crypto.subtle.generateKey(
                    algorithm,
                    allowExport,
                    keyUsage
                );
                memoryKeyObj["publicKey"] = result["publicKey"];
                memoryKeyObj["privateKey"] = result["privateKey"];
            } catch (error) {
                this._generateKeyName = key;
                this._generateKeyError = error.name;
                this.Trigger(C3.Plugins.RobotKaposzta_Crypto.Cnds.OnKeyGenerateError);
                return false;
            }
            this._keys.set(key, memoryKeyObj);
            this._generateKeyName = key;
            this._generateKeyError = "";
            this.Trigger(C3.Plugins.RobotKaposzta_Crypto.Cnds.OnKeyGenerate);
            return true;
        },
        async GenerateEC(key, allowExport, type, curve) {
            const memoryKeyObj = {};
            const algorithm = {};
            let keyUsage;
            if (type === 0) {
                algorithm["name"] = "ECDSA";
                keyUsage = ["sign", "verify"];
            } else {
                algorithm["name"] = "ECDH";
                keyUsage = ["deriveKey", "deriveBits"];
            }
            if (curve === 0) {
                algorithm["namedCurve"] = "P-256";
            } else if (curve === 1) {
                algorithm["namedCurve"] = "P-384";
            } else {
                algorithm["namedCurve"] = "P-521";
            }
            memoryKeyObj["type"] = algorithm["name"];
            try {
                const result = await self.crypto.subtle.generateKey(
                    algorithm,
                    allowExport,
                    keyUsage
                );
                memoryKeyObj["publicKey"] = result["publicKey"];
                memoryKeyObj["privateKey"] = result["privateKey"];
            } catch (error) {
                this._generateKeyName = key;
                this._generateKeyError = error.name;
                this.Trigger(C3.Plugins.RobotKaposzta_Crypto.Cnds.OnKeyGenerateError);
                return false;
            }
            this._keys.set(key, memoryKeyObj);
            this._generateKeyName = key;
            this._generateKeyError = "";
            this.Trigger(C3.Plugins.RobotKaposzta_Crypto.Cnds.OnKeyGenerate);
            return true;
        },
        async GenerateHMAC(key, allowExport, hash, length) {
            const memoryKeyObj = {};
            const algorithm = {};
            let keyUsage;
            algorithm["name"] = "HMAC";
            if (hash === 0) {
                algorithm["hash"] = "SHA-1";
            } else if (hash === 1) {
                algorithm["hash"] = "SHA-256";
            } else if (hash === 2) {
                algorithm["hash"] = "SHA-384";
            } else {
                algorithm["hash"] = "SHA-521";
            }
            if (length > 0) {
                algorithm["length"] = length;
            }
            keyUsage = ["sign", "verify"];
            memoryKeyObj["type"] = algorithm["name"];
            try {
                memoryKeyObj["secretKey"] = await self.crypto.subtle.generateKey(
                    algorithm,
                    allowExport,
                    keyUsage
                );
            } catch (error) {
                this._generateKeyName = key;
                this._generateKeyError = error.name;
                this.Trigger(C3.Plugins.RobotKaposzta_Crypto.Cnds.OnKeyGenerateError);
                return false;
            }
            this._keys.set(key, memoryKeyObj);
            this._generateKeyName = key;
            this._generateKeyError = "";
            this.Trigger(C3.Plugins.RobotKaposzta_Crypto.Cnds.OnKeyGenerate);
            return true;
        },
        async GenerateAES(key, allowExport, type, length) {
            const memoryKeyObj = {};
            const algorithm = {};
            let keyUsage;
            if (type === 0) {
                algorithm["name"] = "AES-CTR";
            } else if (type === 1) {
                algorithm["name"] = "AES-CBC";
            } else {
                algorithm["name"] = "AES-GCM";
            }
            if (length === 0) {
                algorithm["length"] = 128;
            } else if (length === 1) {
                algorithm["length"] = 192;
            } else {
                algorithm["length"] = 256;
            }
            keyUsage = ["encrypt", "decrypt"];
            memoryKeyObj["type"] = algorithm["name"];
            try {
                memoryKeyObj["secretKey"] = await self.crypto.subtle.generateKey(
                    algorithm,
                    allowExport,
                    keyUsage
                );
            } catch (error) {
                this._generateKeyName = key;
                this._generateKeyError = error.name;
                this.Trigger(C3.Plugins.RobotKaposzta_Crypto.Cnds.OnKeyGenerateError);
                return false;
            }
            this._keys.set(key, memoryKeyObj);
            this._generateKeyName = key;
            this._generateKeyError = "";
            this.Trigger(C3.Plugins.RobotKaposzta_Crypto.Cnds.OnKeyGenerate);
            return true;
        },
        async DeriveKeyHMAC_ECDH(key, allowExport, hash, length, publicKey, privateKey) {
            const memoryKeyObj = {};
            const algorithm = {};
            const derivedKeyAlgorithm = {};
            const keyUsage = ["sign", "verify"];
            algorithm["name"] = "ECDH";
            derivedKeyAlgorithm["name"] = "HMAC";
            if (hash === 0) {
                derivedKeyAlgorithm["hash"] = "SHA-1";
            } else if (hash === 1) {
                derivedKeyAlgorithm["hash"] = "SHA-256";
            } else if (hash === 2) {
                derivedKeyAlgorithm["hash"] = "SHA-384";
            } else {
                derivedKeyAlgorithm["hash"] = "SHA-521";
            }
            if (0 < length && length <= 256) {
                derivedKeyAlgorithm["length"] = length;
            } else {
                derivedKeyAlgorithm["length"] = 256;
            }
            const publicKeyObj = this._keys.get(publicKey);
            if (!publicKeyObj || publicKeyObj["type"] !== "ECDH" || !publicKeyObj["publicKey"]) {
                this._generateKeyName = key;
                this._generateKeyError = "InvalidKeyName";
                this.Trigger(C3.Plugins.RobotKaposzta_Crypto.Cnds.OnKeyGenerateError);
                return false;
            }
            const privateKeyObj = this._keys.get(privateKey);
            if (!privateKeyObj || privateKeyObj["type"] !== "ECDH" || !privateKeyObj["privateKey"]) {
                this._generateKeyName = key;
                this._generateKeyError = "InvalidKeyName";
                this.Trigger(C3.Plugins.RobotKaposzta_Crypto.Cnds.OnKeyGenerateError);
                return false;
            }
            algorithm["public"] = publicKeyObj["publicKey"];
            memoryKeyObj["type"] = derivedKeyAlgorithm["name"];
            try {
                memoryKeyObj["secretKey"] = await self.crypto.subtle.deriveKey(
                    algorithm,
                    privateKeyObj["privateKey"],
                    derivedKeyAlgorithm,
                    allowExport,
                    keyUsage
                );
            } catch (error) {
                this._generateKeyName = key;
                this._generateKeyError = error.name;
                this.Trigger(C3.Plugins.RobotKaposzta_Crypto.Cnds.OnKeyGenerateError);
                return false;
            }
			this._keys.set(key, memoryKeyObj);
            this._generateKeyName = key;
            this._generateKeyError = "";
            this.Trigger(C3.Plugins.RobotKaposzta_Crypto.Cnds.OnKeyGenerate);
            return true;
        },
        async DeriveKeyHMAC_HKDF(key, allowExport, hash, length, secretKey, HKDFHash, HKDFSalt, HKDFInfo) {
            const memoryKeyObj = {};
            const algorithm = {};
            const derivedKeyAlgorithm = {};
            const keyUsage = ["sign", "verify"];
            algorithm["name"] = "HKDF";
            if (HKDFHash === 0) {
                algorithm["hash"] = "SHA-1";
            } else if (HKDFHash === 1) {
                algorithm["hash"] = "SHA-256";
            } else if (HKDFHash === 2) {
                algorithm["hash"] = "SHA-384";
            } else {
                algorithm["hash"] = "SHA-521";
            }
            try {
                algorithm["salt"] = this._Base64ToUint8Array(HKDFSalt);
                algorithm["info"] = this._Base64ToUint8Array(HKDFInfo);
            } catch (error) {
                this._generateKeyName = key;
                this._generateKeyError = error.name;
                this.Trigger(C3.Plugins.RobotKaposzta_Crypto.Cnds.OnKeyGenerateError);
                return false;
            }
            derivedKeyAlgorithm["name"] = "HMAC";
            if (hash === 0) {
                derivedKeyAlgorithm["hash"] = "SHA-1";
            } else if (hash === 1) {
                derivedKeyAlgorithm["hash"] = "SHA-256";
            } else if (hash === 2) {
                derivedKeyAlgorithm["hash"] = "SHA-384";
            } else {
                derivedKeyAlgorithm["hash"] = "SHA-521";
            }
            if (length > 0) {
                derivedKeyAlgorithm["length"] = length;
            }
            const secretKeyObj = this._keys.get(secretKey);
            if (!secretKeyObj || secretKeyObj["type"] !== "HKDF" || !secretKeyObj["secretKey"]) {
                this._generateKeyName = key;
                this._generateKeyError = "InvalidKeyName";
                this.Trigger(C3.Plugins.RobotKaposzta_Crypto.Cnds.OnKeyGenerateError);
                return false;
            }
            memoryKeyObj["type"] = derivedKeyAlgorithm["name"];
            try {
                memoryKeyObj["secretKey"] = await self.crypto.subtle.deriveKey(
                    algorithm,
                    secretKeyObj["secretKey"],
                    derivedKeyAlgorithm,
                    allowExport,
                    keyUsage
                );
            } catch (error) {
                this._generateKeyName = key;
                this._generateKeyError = error.name;
                this.Trigger(C3.Plugins.RobotKaposzta_Crypto.Cnds.OnKeyGenerateError);
                return false;
            }
			this._keys.set(key, memoryKeyObj);
            this._generateKeyName = key;
            this._generateKeyError = "";
            this.Trigger(C3.Plugins.RobotKaposzta_Crypto.Cnds.OnKeyGenerate);
            return true;
        },
        async DeriveKeyHMAC_PBKDF2(key, allowExport, hash, length, secretKey, PBKDF2Hash, PBKDF2Salt, PBKDF2Iterations) {
            const memoryKeyObj = {};
            const algorithm = {};
            const derivedKeyAlgorithm = {};
            const keyUsage = ["sign", "verify"];
            algorithm["name"] = "PBKDF2";
            if (PBKDF2Hash === 0) {
                algorithm["hash"] = "SHA-1";
            } else if (PBKDF2Hash === 1) {
                algorithm["hash"] = "SHA-256";
            } else if (PBKDF2Hash === 2) {
                algorithm["hash"] = "SHA-384";
            } else {
                algorithm["hash"] = "SHA-512";
            }
            try {
                algorithm["salt"] = this._Base64ToUint8Array(PBKDF2Salt);
            } catch (error) {
                this._generateKeyName = key;
                this._generateKeyError = error.name;
                this.Trigger(C3.Plugins.RobotKaposzta_Crypto.Cnds.OnKeyGenerateError);
                return false;
            }
            algorithm["iterations"] = PBKDF2Iterations;
            derivedKeyAlgorithm["name"] = "HMAC";
            if (hash === 0) {
                derivedKeyAlgorithm["hash"] = "SHA-1";
            } else if (hash === 1) {
                derivedKeyAlgorithm["hash"] = "SHA-256";
            } else if (hash === 2) {
                derivedKeyAlgorithm["hash"] = "SHA-384";
            } else {
                derivedKeyAlgorithm["hash"] = "SHA-521";
            }
            if (length > 0) {
                derivedKeyAlgorithm["length"] = length;
            }
            const secretKeyObj = this._keys.get(secretKey);
            if (!secretKeyObj || secretKeyObj["type"] !== "PBKDF2" || !secretKeyObj["secretKey"]) {
                this._generateKeyName = key;
                this._generateKeyError = "InvalidKeyName";
                this.Trigger(C3.Plugins.RobotKaposzta_Crypto.Cnds.OnKeyGenerateError);
                return false;
            }
            memoryKeyObj["type"] = derivedKeyAlgorithm["name"];
            try {
                memoryKeyObj["secretKey"] = await self.crypto.subtle.deriveKey(
                    algorithm,
                    secretKeyObj["secretKey"],
                    derivedKeyAlgorithm,
                    allowExport,
                    keyUsage
                );
            } catch (error) {
                this._generateKeyName = key;
                this._generateKeyError = error.name;
                this.Trigger(C3.Plugins.RobotKaposzta_Crypto.Cnds.OnKeyGenerateError);
                return false;
            }
			this._keys.set(key, memoryKeyObj);
            this._generateKeyName = key;
            this._generateKeyError = "";
            this.Trigger(C3.Plugins.RobotKaposzta_Crypto.Cnds.OnKeyGenerate);
            return true;
        },
        async DeriveKeyAES_ECDH(key, allowExport, type, length, publicKey, privateKey) {
            const memoryKeyObj = {};
            const algorithm = {};
            const derivedKeyAlgorithm = {};
            const keyUsage = ["encrypt", "decrypt"];
            algorithm["name"] = "ECDH";
            if (type === 0) {
                derivedKeyAlgorithm["name"] = "AES-CTR";
            } else if (type === 1) {
                derivedKeyAlgorithm["name"] = "AES-CBC";
            } else {
                derivedKeyAlgorithm["name"] = "AES-GCM";
            }
            if (length === 0) {
                derivedKeyAlgorithm["length"] = 128;
            } else if (length === 1) {
                derivedKeyAlgorithm["length"] = 192;
            } else {
                derivedKeyAlgorithm["length"] = 256;
            }
            const publicKeyObj = this._keys.get(publicKey);
            if (!publicKeyObj || publicKeyObj["type"] !== "ECDH" || !publicKeyObj["publicKey"]) {
                this._generateKeyName = key;
                this._generateKeyError = "InvalidKeyName";
                this.Trigger(C3.Plugins.RobotKaposzta_Crypto.Cnds.OnKeyGenerateError);
                return false;
            }
            const privateKeyObj = this._keys.get(privateKey);
            if (!privateKeyObj || privateKeyObj["type"] !== "ECDH" || !privateKeyObj["privateKey"]) {
                this._generateKeyName = key;
                this._generateKeyError = "InvalidKeyName";
                this.Trigger(C3.Plugins.RobotKaposzta_Crypto.Cnds.OnKeyGenerateError);
                return false;
            }
            algorithm["public"] = publicKeyObj["publicKey"];
            memoryKeyObj["type"] = derivedKeyAlgorithm["name"];
            try {
                memoryKeyObj["secretKey"] = await self.crypto.subtle.deriveKey(
                    algorithm,
                    privateKeyObj["privateKey"],
                    derivedKeyAlgorithm,
                    allowExport,
                    keyUsage
                );
                
            } catch (error) {
                this._generateKeyName = key;
                this._generateKeyError = error.name;
                this.Trigger(C3.Plugins.RobotKaposzta_Crypto.Cnds.OnKeyGenerateError);
                return false;
            }
			this._keys.set(key, memoryKeyObj);
            this._generateKeyName = key;
            this._generateKeyError = "";
            this.Trigger(C3.Plugins.RobotKaposzta_Crypto.Cnds.OnKeyGenerate);
            return true;
        },
        async DeriveKeyAES_HKDF(key, allowExport, type, length, secretKey, HKDFHash, HKDFSalt, HKDFInfo) {
            const memoryKeyObj = {};
            const algorithm = {};
            const derivedKeyAlgorithm = {};
            const keyUsage = ["encrypt", "decrypt"];
            algorithm["name"] = "HKDF";
            if (HKDFHash === 0) {
                algorithm["hash"] = "SHA-1";
            } else if (HKDFHash === 1) {
                algorithm["hash"] = "SHA-256";
            } else if (HKDFHash === 2) {
                algorithm["hash"] = "SHA-384";
            } else {
                algorithm["hash"] = "SHA-512";
            }
            try {
                algorithm["salt"] = this._Base64ToUint8Array(HKDFSalt);
                algorithm["info"] = this._Base64ToUint8Array(HKDFInfo);
            } catch (error) {
                this._generateKeyName = key;
                this._generateKeyError = error.name;
                this.Trigger(C3.Plugins.RobotKaposzta_Crypto.Cnds.OnKeyGenerateError);
                return false;
            }
            if (type === 0) {
                derivedKeyAlgorithm["name"] = "AES-CTR";
            } else if (type === 1) {
                derivedKeyAlgorithm["name"] = "AES-CBC";
            } else {
                derivedKeyAlgorithm["name"] = "AES-GCM";
            }
            if (length === 0) {
                derivedKeyAlgorithm["length"] = 128;
            } else if (length === 1) {
                derivedKeyAlgorithm["length"] = 192;
            } else {
                derivedKeyAlgorithm["length"] = 256;
            }
            const secretKeyObj = this._keys.get(secretKey);
            if (!secretKeyObj || secretKeyObj["type"] !== "HKDF" || !secretKeyObj["secretKey"]) {
                this._generateKeyName = key;
                this._generateKeyError = "InvalidKeyName";
                this.Trigger(C3.Plugins.RobotKaposzta_Crypto.Cnds.OnKeyGenerateError);
                return false;
            }
            memoryKeyObj["type"] = derivedKeyAlgorithm["name"];
            try {
                memoryKeyObj["secretKey"] = await self.crypto.subtle.deriveKey(
                    algorithm,
                    secretKeyObj["secretKey"],
                    derivedKeyAlgorithm,
                    allowExport,
                    keyUsage
                );
            } catch (error) {
                this._generateKeyName = key;
                this._generateKeyError = error.name;
                this.Trigger(C3.Plugins.RobotKaposzta_Crypto.Cnds.OnKeyGenerateError);
                return false;
            }
			this._keys.set(key, memoryKeyObj);
            this._generateKeyName = key;
            this._generateKeyError = "";
            this.Trigger(C3.Plugins.RobotKaposzta_Crypto.Cnds.OnKeyGenerate);
            return true;
        },
        async DeriveKeyAES_PBKDF2(key, allowExport, type, length, secretKey, PBKDF2Hash, PBKDF2Salt, PBKDF2Iterations) {
            const memoryKeyObj = {};
            const algorithm = {};
            const derivedKeyAlgorithm = {};
            const keyUsage = ["encrypt", "decrypt"];
            algorithm["name"] = "PBKDF2";
            if (PBKDF2Hash === 0) {
                algorithm["hash"] = "SHA-1";
            } else if (PBKDF2Hash === 1) {
                algorithm["hash"] = "SHA-256";
            } else if (PBKDF2Hash === 2) {
                algorithm["hash"] = "SHA-384";
            } else {
                algorithm["hash"] = "SHA-521";
            }
            try {
                algorithm["salt"] = this._Base64ToUint8Array(PBKDF2Salt);
            } catch (error) {
                this._generateKeyName = key;
                this._generateKeyError = error.name;
                this.Trigger(C3.Plugins.RobotKaposzta_Crypto.Cnds.OnKeyGenerateError);
                return false;
            }
            algorithm["iterations"] = PBKDF2Iterations;
            if (type === 0) {
                derivedKeyAlgorithm["name"] = "AES-CTR";
            } else if (type === 1) {
                derivedKeyAlgorithm["name"] = "AES-CBC";
            } else {
                derivedKeyAlgorithm["name"] = "AES-GCM";
            }
            if (length === 0) {
                derivedKeyAlgorithm["length"] = 128;
            } else if (length === 1) {
                derivedKeyAlgorithm["length"] = 192;
            } else {
                derivedKeyAlgorithm["length"] = 256;
            }
            const secretKeyObj = this._keys.get(secretKey);
            if (!secretKeyObj || secretKeyObj["type"] !== "PBKDF2" || !secretKeyObj["secretKey"]) {
                this._generateKeyName = key;
                this._generateKeyError = "InvalidKeyName";
                this.Trigger(C3.Plugins.RobotKaposzta_Crypto.Cnds.OnKeyGenerateError);
                return false;
            }
            memoryKeyObj["type"] = derivedKeyAlgorithm["name"];
            try {
                memoryKeyObj["secretKey"] = await self.crypto.subtle.deriveKey(
                    algorithm,
                    secretKeyObj["secretKey"],
                    derivedKeyAlgorithm,
                    allowExport,
                    keyUsage
                );
            } catch (error) {
                this._generateKeyName = key;
                this._generateKeyError = error.name;
                this.Trigger(C3.Plugins.RobotKaposzta_Crypto.Cnds.OnKeyGenerateError);
                return false;
            }
			this._keys.set(key, memoryKeyObj);
            this._generateKeyName = key;
            this._generateKeyError = "";
            this.Trigger(C3.Plugins.RobotKaposzta_Crypto.Cnds.OnKeyGenerate);
            return true;
        },
        async DeriveBitsECDH(tag, length, publicKey, privateKey) {
            let result;
            const algorithm = {};
            algorithm["name"] = "ECDH";
            const publicKeyObj = this._keys.get(publicKey);
            if (!publicKeyObj || publicKeyObj["type"] !== "ECDH" || !publicKeyObj["publicKey"]) {
                this._generateDataTag = tag;
                this._generateData = "";
                this._generateDataError = "InvalidKeyName";
                this.Trigger(C3.Plugins.RobotKaposzta_Crypto.Cnds.OnDataGenerateError);
                return false;
            }
            const privateKeyObj = this._keys.get(privateKey);
            if (!privateKeyObj || privateKeyObj["type"] !== "ECDH" || !privateKeyObj["privateKey"]) {
                this._generateDataTag = tag;
                this._generateData = "";
                this._generateDataError = "InvalidKeyName";
                this.Trigger(C3.Plugins.RobotKaposzta_Crypto.Cnds.OnDataGenerateError);
                return false;
            }
            algorithm["public"] = publicKeyObj["publicKey"];
            try {
                result = await self.crypto.subtle.deriveBits(
                    algorithm,
                    privateKeyObj["privateKey"],
                    length
                );
            } catch (error) {
                this._generateDataTag = tag;
                this._generateData = "";
                this._generateDataError = error.name;
                this.Trigger(C3.Plugins.RobotKaposzta_Crypto.Cnds.OnDataGenerateError);
                return false;
            }
            this._generateDataTag = tag;
            this._generateData = result;
            this._generateDataError = "";
            this.Trigger(C3.Plugins.RobotKaposzta_Crypto.Cnds.OnDataGenerate);
            return true;
        },
        async DeriveBitsHKDF(tag, length, secretKey, HKDFHash, HKDFSalt, HKDFInfo) {
            let result;
            const algorithm = {};
            algorithm["name"] = "HKDF";
            if (HKDFHash === 0) {
                algorithm["hash"] = "SHA-1";
            } else if (HKDFHash === 1) {
                algorithm["hash"] = "SHA-256";
            } else if (HKDFHash === 2) {
                algorithm["hash"] = "SHA-384";
            } else {
                algorithm["hash"] = "SHA-521";
            }
            try {
                algorithm["salt"] = this._Base64ToUint8Array(HKDFSalt);
                algorithm["info"] = this._Base64ToUint8Array(HKDFInfo);
            } catch (error) {
                this._generateDataTag = tag;
                this._generateData = "";
                this._generateDataError = error.name;
                this.Trigger(C3.Plugins.RobotKaposzta_Crypto.Cnds.OnDataGenerateError);
                return false;
            }
            const secretKeyObj = this._keys.get(secretKey);
            if (!secretKeyObj || secretKeyObj["type"] !== "HKDF" || !secretKeyObj["secretKey"]) {
                this._generateDataTag = tag;
                this._generateData = "";
                this._generateDataError = "InvalidKeyName";
                this.Trigger(C3.Plugins.RobotKaposzta_Crypto.Cnds.OnDataGenerateError);
                return false;
            }
            try {
                result = await self.crypto.subtle.deriveBits(
                    algorithm,
                    secretKeyObj["secretKey"],
                    length
                );
            } catch (error) {
                this._generateDataTag = tag;
                this._generateData = "";
                this._generateDataError = error.name;
                this.Trigger(C3.Plugins.RobotKaposzta_Crypto.Cnds.OnDataGenerateError);
                return false;
            }
            this._generateDataTag = tag;
            this._generateData = result;
            this._generateDataError = "";
            this.Trigger(C3.Plugins.RobotKaposzta_Crypto.Cnds.OnDataGenerate);
            return true;
        },
        async DeriveBitsPBKDF2(tag, length, secretKey, PBKDF2Hash, PBKDF2Salt, PBKDF2Iterations) {
            let result;
            const algorithm = {};
            algorithm["name"] = "PBKDF2";
            if (PBKDF2Hash === 0) {
                algorithm["hash"] = "SHA-1";
            } else if (PBKDF2Hash === 1) {
                algorithm["hash"] = "SHA-256";
            } else if (PBKDF2Hash === 2) {
                algorithm["hash"] = "SHA-384";
            } else {
                algorithm["hash"] = "SHA-512";
            }
            try {
                algorithm["salt"] = this._Base64ToUint8Array(PBKDF2Salt);
            } catch (error) {
                this._generateDataTag = tag;
                this._generateData = "";
                this._generateDataError = error.name;
                this.Trigger(C3.Plugins.RobotKaposzta_Crypto.Cnds.OnDataGenerateError);
                return false;
            }
            algorithm["iterations"] = PBKDF2Iterations;
            const secretKeyObj = this._keys.get(secretKey);
            if (!secretKeyObj || secretKeyObj["type"] !== "PBKDF2" || !secretKeyObj["secretKey"]) {
                this._generateDataTag = tag;
                this._generateData = "";
                this._generateDataError = "InvalidKeyName";
                this.Trigger(C3.Plugins.RobotKaposzta_Crypto.Cnds.OnDataGenerateError);
                return false;
            }
            try {
                result = await self.crypto.subtle.deriveBits(
                    algorithm,
                    secretKeyObj["secretKey"],
                    length
                );
            } catch (error) {
                this._generateDataTag = tag;
                this._generateData = "";
                this._generateDataError = error.name;
                this.Trigger(C3.Plugins.RobotKaposzta_Crypto.Cnds.OnDataGenerateError);
                return false;
            }
            this._generateDataTag = tag;
            this._generateData = result;
            this._generateDataError = "";
            this.Trigger(C3.Plugins.RobotKaposzta_Crypto.Cnds.OnDataGenerate);
            return true;
        },

        async HashText(text, hash, tag) {
            let result;
            let data;
            let algorithm;
            if (hash === 0) {
                algorithm = "MD5";
            } else if (hash === 1) {
                algorithm = "SHA-1";
            } else if (hash === 2) {
                algorithm = "SHA-256";
            } else if (hash === 3) {
                algorithm = "SHA-384";
            } else {
                algorithm = "SHA-512";
            }
            if (algorithm === "MD5") {
                result = this._MD5Hash(text);
                this._hashAsHex = result;
                this._hashAsBase64 = this._Uint8ArrayToBase64(this._HexToUint8Array(result));
            } else {
                data = this._StringToUint8Array(text);
                result = await self.crypto.subtle.digest(algorithm, data);
                result = new Uint8Array(result);
                this._hashAsHex = this._Uint8ArrayToHex(result);
                this._hashAsBase64 = this._Uint8ArrayToBase64(result);
            }
            this._hashTag = tag;
            this._hashError = "";
            this.Trigger(C3.Plugins.RobotKaposzta_Crypto.Cnds.OnHash);
        },
        async HashBinary(binary, hash, tag) {
            let result;
            if (!binary) {
                this._hashTag = tag;
                this._hashAsHex = "";
                this._hashAsBase64 = "";
                this._hashError = "NoBinary";
                this.Trigger(C3.Plugins.RobotKaposzta_Crypto.Cnds.OnHashError);
                return false;
            };
			const inst = binary.GetFirstPicked(this._inst);
			if (!inst) {
                this._hashTag = tag;
                this._hashAsHex = "";
                this._hashAsBase64 = "";
                this._hashError = "NoBinary";
                this.Trigger(C3.Plugins.RobotKaposzta_Crypto.Cnds.OnHashError);
                return false;
            }
			binary = inst.GetSdkInstance();
            let data = new Uint8Array(binary.GetArrayBufferReadOnly());
            let algorithm;
            if (hash === 0) {
                algorithm = "MD5";
            } else if (hash === 1) {
                algorithm = "SHA-1";
            } else if (hash === 2) {
                algorithm = "SHA-256";
            } else if (hash === 3) {
                algorithm = "SHA-384";
            } else {
                algorithm = "SHA-512";
            }
            if (algorithm === "MD5") {
                data = this._Uint8ArrayToString(data);
                result = this._MD5Hash(data);
                this._hashAsHex = result;
                this._hashAsBase64 = this._Uint8ArrayToBase64(this._HexToUint8Array(result));
            } else {
                result = await self.crypto.subtle.digest(algorithm, data);
                result = new Uint8Array(result);
                this._hashAsHex = this._Uint8ArrayToHex(result);
                this._hashAsBase64 = this._Uint8ArrayToBase64(result);
            }
            this._hashTag = tag;
            this._hashError = "";
            this.Trigger(C3.Plugins.RobotKaposzta_Crypto.Cnds.OnHash);
        },
        async HashFile(url, hash, tag) {
            const assetManager = this._runtime.GetAssetManager();
            let blob;
            try {
                blob = await assetManager.FetchBlob(url);
            } catch (error) {
                this._hashTag = tag;
                this._hashAsHex = "";
                this._hashAsBase64 = "";
                this._hashError = error.name;
                this.Trigger(C3.Plugins.RobotKaposzta_Crypto.Cnds.OnHashError);
                return false;
            }
            let result;
            const blobArrayBuffer = await blob.arrayBuffer();
            let data = new Uint8Array(blobArrayBuffer);
            let algorithm;
            if (hash === 0) {
                algorithm = "MD5";
            } else if (hash === 1) {
                algorithm = "SHA-1";
            } else if (hash === 2) {
                algorithm = "SHA-256";
            } else if (hash === 3) {
                algorithm = "SHA-384";
            } else {
                algorithm = "SHA-512";
            }
            if (algorithm === "MD5") {
                data = this._Uint8ArrayToString(data);
                result = this._MD5Hash(data);
                this._hashAsHex = result;
                this._hashAsBase64 = this._Uint8ArrayToBase64(this._HexToUint8Array(result));
            } else {
                result = await self.crypto.subtle.digest(algorithm, data);
                result = new Uint8Array(result);
                this._hashAsHex = this._Uint8ArrayToHex(result);
                this._hashAsBase64 = this._Uint8ArrayToBase64(result);
            }
            this._hashTag = tag;
            this.Trigger(C3.Plugins.RobotKaposzta_Crypto.Cnds.OnHash);
            return true;
        },

        RenameKey(oldName, newName) {
            const key = this._keys.get(oldName);
            if (typeof (key) === "undefined") {
                return false;
            }
            this._keys.set(newName, key);
            this._keys.delete(oldName);
            return true;
        },
        DeleteKey(key) {
            this._keys.delete(key);
        },
        ClearKeys() {
            this._keys.clear();
        },

        async SignRSASSA_PKCS1_V1_5(key, data, tag) {
            const algorithm = { "name": "RSASSA-PKCS1-v1_5" };
            const privateKey = this._keys.get(key);
            let result = "";
            if (!privateKey || privateKey["type"] !== "RSASSA-PKCS1-v1_5" || !privateKey["privateKey"]) {
                this._signTag = tag;
                this._signature = "";
                this._signError = "InvalidKeyName";
                this.Trigger(C3.Plugins.RobotKaposzta_Crypto.Cnds.OnSignError);
                return false;
            }
            try {
                data = this._Base64ToUint8Array(data);
                result = await self.crypto.subtle.sign(algorithm, privateKey["privateKey"], data);
                result = new Uint8Array(result);
                result = this._Uint8ArrayToBase64(result);   
            } catch (error) {
                this._signTag = tag;
                this._signature = "";
                this._signError = error.name;
                this.Trigger(C3.Plugins.RobotKaposzta_Crypto.Cnds.OnSignError);
                return false;
            }
            this._signTag = tag;
            this._signature = result;
            this._signError = "";
            this.Trigger(C3.Plugins.RobotKaposzta_Crypto.Cnds.OnSign);
            return true;
        },
        async SignRSA_PSS(key, data, salt, tag) {
            const algorithm = { "name": "RSA-PSS" };
            algorithm["saltLength"] = salt;
            const privateKey = this._keys.get(key);
            let result = "";
            if (!privateKey || privateKey["type"] !== "RSA-PSS" || !privateKey["privateKey"]) {
                this._signTag = tag;
                this._signature = "";
                this._signError = "InvalidKeyName";
                this.Trigger(C3.Plugins.RobotKaposzta_Crypto.Cnds.OnSignError);
                return false;
            }
            try {
                data = this._Base64ToUint8Array(data);
                result = await self.crypto.subtle.sign(algorithm, privateKey["privateKey"], data);
                result = new Uint8Array(result);
                result = this._Uint8ArrayToBase64(result);
            } catch (error) {
                this._signTag = tag;
                this._signature = "";
                this._signError = error.name;
                this.Trigger(C3.Plugins.RobotKaposzta_Crypto.Cnds.OnSignError);
                return false;
            }
            this._signTag = tag;
            this._signature = result;
            this._signError = "";
            this.Trigger(C3.Plugins.RobotKaposzta_Crypto.Cnds.OnSign);
            return true;
        },
        async SignECDSA(key, data, hash, tag) {
            const algorithm = { "name": "ECDSA" };
            if (hash === 0) {
                algorithm["hash"] = "SHA-256";
            } else if (hash === 1) {
                algorithm["hash"] = "SHA-384";
            } else {
                algorithm["hash"] = "SHA-512";
            }
            const privateKey = this._keys.get(key);
            let result = "";
            if (!privateKey || privateKey["type"] !== "ECDSA" || !privateKey["privateKey"]) {
                this._signTag = tag;
                this._signature = "";
                this._signError = "InvalidKeyName";
                this.Trigger(C3.Plugins.RobotKaposzta_Crypto.Cnds.OnSignError);
                return false;
            }
            try {
                data = this._Base64ToUint8Array(data);
                result = await self.crypto.subtle.sign(algorithm, privateKey["privateKey"], data);
                result = new Uint8Array(result);
                result = this._Uint8ArrayToBase64(result);
            } catch (error) {
                this._signTag = tag;
                this._signature = "";
                this._signError = error.name;
                this.Trigger(C3.Plugins.RobotKaposzta_Crypto.Cnds.OnSignError);
                return false;
            }
            this._signTag = tag;
            this._signature = result;
            this._signError = "";
            this.Trigger(C3.Plugins.RobotKaposzta_Crypto.Cnds.OnSign);
            return true;
        },
        async SignHMAC(key, data, tag) {
            const algorithm = { "name": "HMAC" };
            const secretKey = this._keys.get(key);
            let result = "";
            if (!secretKey || secretKey["type"] !== "HMAC" || !secretKey["secretKey"]) {
                this._signTag = tag;
                this._signature = "";
                this._signError = "InvalidKeyName";
                this.Trigger(C3.Plugins.RobotKaposzta_Crypto.Cnds.OnSignError);
                return false;
            }
            try {
                data = this._Base64ToUint8Array(data);
                result = await self.crypto.subtle.sign(algorithm, secretKey["secretKey"], data);
                result = new Uint8Array(result);
                result = this._Uint8ArrayToBase64(result);
            } catch (error) {
                this._signTag = tag;
                this._signature = "";
                this._signError = error.name;
                this.Trigger(C3.Plugins.RobotKaposzta_Crypto.Cnds.OnSignError);
                return false;
            }
            this._signTag = tag;
            this._signature = result;
            this._signError = "";
            this.Trigger(C3.Plugins.RobotKaposzta_Crypto.Cnds.OnSign);
            return true;
        },
        async VerifyRSASSA_PKCS1_V1_5(key, signature, data, tag) {
            const algorithm = { "name": "RSASSA-PKCS1-v1_5" };
            const publicKey = this._keys.get(key);
            let result = "";
            if (!publicKey || publicKey["type"] !== "RSASSA-PKCS1-v1_5" || !publicKey["publicKey"]) {
                this._verifyTag = tag;
                this._isValid = false;
                this._verifyError = "InvalidKeyName";
                this.Trigger(C3.Plugins.RobotKaposzta_Crypto.Cnds.OnVerifyError);
                return false;
            }
            try {
                signature = this._Base64ToUint8Array(signature);
                data = this._Base64ToUint8Array(data);
                result = await self.crypto.subtle.verify(algorithm, publicKey["publicKey"], signature, data);
            } catch (error) {
                this._verifyTag = tag;
                this._isValid = false;
                this._verifyError = error.name;
                this.Trigger(C3.Plugins.RobotKaposzta_Crypto.Cnds.OnVerifyError);
                return false;
            }
            this._verifyTag = tag;
            this._isValid = result;
            this._verifyError = "";
            this.Trigger(C3.Plugins.RobotKaposzta_Crypto.Cnds.OnVerify);
            return true;
        },
        async VerifyRSA_PSS(key, signature, data, salt, tag) {
            const algorithm = { "name": "RSA-PSS" };
            algorithm["saltLength"] = salt;
            const publicKey = this._keys.get(key);
            let result = "";
            if (!publicKey || publicKey["type"] !== "RSA-PSS" || !publicKey["publicKey"]) {
                this._verifyTag = tag;
                this._isValid = false;
                this._verifyError = "InvalidKeyName";
                this.Trigger(C3.Plugins.RobotKaposzta_Crypto.Cnds.OnVerifyError);
                return false;
            }
            try {
                signature = this._Base64ToUint8Array(signature);
                data = this._Base64ToUint8Array(data);
                result = await self.crypto.subtle.verify(algorithm, publicKey["publicKey"], signature, data);
            } catch (error) {
                this._verifyTag = tag;
                this._isValid = false;
                this._verifyError = error.name;
                this.Trigger(C3.Plugins.RobotKaposzta_Crypto.Cnds.OnVerifyError);
                return false;
            }
            this._verifyTag = tag;
            this._isValid = result;
            this._verifyError = "";
            this.Trigger(C3.Plugins.RobotKaposzta_Crypto.Cnds.OnVerify);
            return true;
        },
        async VerifyECDSA(key, signature, data, hash, tag) {
            const algorithm = { "name": "ECDSA" };
            if (hash === 0) {
                algorithm["hash"] = "SHA-256";
            } else if (hash === 1) {
                algorithm["hash"] = "SHA-384";
            } else {
                algorithm["hash"] = "SHA-512";
            }
            const publicKey = this._keys.get(key);
            let result = "";
            if (!publicKey || publicKey["type"] !== "ECDSA" || !publicKey["publicKey"]) {
                this._verifyTag = tag;
                this._isValid = false;
                this._verifyError = "InvalidKeyName";
                this.Trigger(C3.Plugins.RobotKaposzta_Crypto.Cnds.OnVerifyError);
                return false;
            }
            try {
                signature = this._Base64ToUint8Array(signature);
                data = this._Base64ToUint8Array(data);
                result = await self.crypto.subtle.verify(algorithm, publicKey["publicKey"], signature, data);
            } catch (error) {
                this._verifyTag = tag;
                this._isValid = false;
                this._verifyError = error.name;
                this.Trigger(C3.Plugins.RobotKaposzta_Crypto.Cnds.OnVerifyError);
                return false;
            }
            this._verifyTag = tag;
            this._isValid = result;
            this._verifyError = "";
            this.Trigger(C3.Plugins.RobotKaposzta_Crypto.Cnds.OnVerify);
            return true;
        },
        async VerifyHMAC(key, signature, data, tag) {
            const algorithm = { "name": "HMAC" };
            const secretKey = this._keys.get(key);
            let result = "";
            if (!secretKey || secretKey["type"] !== "HMAC" || !secretKey["secretKey"]) {
                this._verifyTag = tag;
                this._isValid = false;
                this._verifyError = "InvalidKeyName";
                this.Trigger(C3.Plugins.RobotKaposzta_Crypto.Cnds.OnVerifyError);
                return false;
            }
            try {
                signature = this._Base64ToUint8Array(signature);
                data = this._Base64ToUint8Array(data);
                result = await self.crypto.subtle.verify(algorithm, secretKey["secretKey"], signature, data);
            } catch (error) {
                this._verifyTag = tag;
                this._isValid = false;
                this._verifyError = error.name;
                this.Trigger(C3.Plugins.RobotKaposzta_Crypto.Cnds.OnVerifyError);
                return false;
            }
            this._verifyTag = tag;
            this._isValid = result;
            this._verifyError = "";
            this.Trigger(C3.Plugins.RobotKaposzta_Crypto.Cnds.OnVerify);
            return true;
        }
    };
};