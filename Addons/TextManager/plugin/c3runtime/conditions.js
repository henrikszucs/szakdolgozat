"use strict";
{
    const C3 = self.C3;
    /** @namespace */
    C3.Plugins.RobotKaposzta_TextManager.Cnds = {
        OnLanguageChange() {
            return true;
        },
        OnDeviceLanguageChange() {
            return true;
        },
        IsLanguageSupport(type, lang) {
            const [check] = this._LanguageSupportCheck(lang);
            if (check === 2 && type === 0) {
                return true;
            } else if (check === 1 && type === 1) {
                return true;
            } else if (check === 0 && type === 2) {
                return true;
            }
            return false;
        },

        OnDataLoad() {
            return true;
        },
        OnDataLoadError() {
            return true;
        },

        IsParamValid(text, scheme="default") {
            if (typeof(this._paramSchemes[scheme]) === "undefined") return true;
            const startCharEscape = this._paramSchemes[scheme].startEscape;
            const startCharEscapeLength = startCharEscape.length;
            const startChar = this._paramSchemes[scheme].start;
            const startCharLength = startChar.length;
            const endCharEscape = this._paramSchemes[scheme].endEscape;
            const endCharEscapeLength = endCharEscape.length;
            const endChar = this._paramSchemes[scheme].end;
            const endCharLength = endChar.length;

            const textLength = text.length;
            let startIndex = -1;
            let j = 0;
            while (j < textLength) {
                if (startIndex === -1) {
                    if (text.substring(j, j + startCharEscapeLength) === startCharEscape) {
                        j += startCharEscapeLength;
                    } else if (text.substring(j, j + startCharLength) === startChar) {
                        startIndex = j;
                        j += startCharLength;
                    } else if (text.substring(j, j + endCharEscapeLength) === endCharEscape) {
                        j += endCharEscapeLength;
                    } else if (text.substring(j, j + endCharLength) === endChar) {
                        return false;
                    } else{
                    	j++;
                    }
                } else {
                    if (text.substring(j, j + endCharEscapeLength) === endCharEscape) {
                        j += endCharEscapeLength;
                    } else if (text.substring(j, j + endCharLength) === endChar) {
                        j += endCharLength;
                        startIndex = -1;
                    } else if (text.substring(j, j + startCharEscapeLength) === startCharEscape) {
                        j += startCharEscapeLength;
                    } else if (text.substring(j, j + startCharLength) === startChar) {
                        return false;
                    } else {
                    	j++;
                    }
                }
            }
            if (startIndex !== -1) return false;
            return true;
        }
    };
};