"use strict";
{
    const C3 = self.C3;
    /** @namespace */
    C3.Plugins.RobotKaposzta_TextManager.Exps = {
        LanguageCount() {
            return this._availableLanguages.length;
        },
        Language(at) {
            if (typeof at === "undefined") return this._currentLanguage;
            at = Number(at);
            if (at < 0 || isNaN(at)) at = 0;
            else if (at >= this._availableLanguages.length) at = this._availableLanguages.length - 1;
            return this._availableLanguages[at];
        },
        DeviceLanguageCount() {
            return this._deviceLanguages.length;
        },
        DeviceLanguageAt(at) {
            if (at < 0) at = 0;
            else if (at >= this._deviceLanguages.length) at = this._deviceLanguages.length - 1;
            return this._deviceLanguages[at];
        },
        SuggestedLanguage() {
            let allLang = Array.from(arguments).join(",");
            const [check, suggested] = this._LanguageSupportCheck(allLang);
            return suggested;
        },
        GetLanguageSection(str) {
            return this._GetLangCode(str);
        },
        GetRegionSection(str) {
            return this._GetRegionCode(str);
        },

        LoadTag() {
            return this._lastDataTag;
        },
        LoadError() {
            return this._lastDataError;
        },
        TagCount() {
            return this._languagesDataByTags.size;
        },
        TagAt(at) {
            const iterator = this._languagesDataByTags.entries();
            let val;
            let i = 0;
            do {
                val = iterator.next().value;
                i++;
            } while (i <= at && val);
            if (val) return val[0];
            return "";
        },
        KeyCount(tag) {
            if (typeof (tag) === "undefined") {
                return this._languagesDataByKeys.size;
            }
            let existTag = this._languagesDataByTags.get(tag);
            if (!existTag) {
                return 0;
            }
            tag = existTag;
            const iterator = this._languagesDataByKeys.entries();
            let val;
            let i = 0;
            do {
                val = iterator.next().value;
                if (typeof (val) !== "undefined" && val[1]["tags"].includes(tag)) {
                    i++;
                }
            } while (val);
            return i;
        },
        KeyAt(at, tag) {
            if (typeof (tag) !== "undefined") {
                let existTag = this._languagesDataByTags.get(tag);
                if (!existTag) {
                    return "";
                }
                tag = existTag;
            }

            const iterator = this._languagesDataByKeys.entries();
            let val;
            let i = 0;
            do {
                val = iterator.next().value;
                if (typeof (tag) === "undefined") {
                    i++;
                } else if (typeof (val) !== "undefined" && val[1]["tags"].includes(tag)) {
                    i++;
                }
            } while (i <= at && val);
            if (val) return val[0];
            return "";
        },
        Translate(key, lang = "") {
            if (lang === "") lang = this._currentLanguage;
            let langObj = this._languagesDataByKeys.get(key);
            if (!langObj) return "";
            if (!langObj["langs"][lang]) return "";
            return langObj["langs"][lang];
        },

        ParamKeyCount(text) {
            return Object.keys(this._ParamAnalyze(text)).length;
        },
        ParamKeyAt(text, at) {
            const result = Object.keys(this._ParamAnalyze(text))?.[at];
            if (typeof (result) === "undefined") return "";
            return result;
        },
        ParamKeyCountAt(text, key) {
            const result = this._ParamAnalyze(text)?.[key]?.length;
            if (typeof (result) === "undefined") return 0;
            return result; 
        },
        ParamKeyStart(text, key, at) {
            const result =  this._ParamAnalyze(text)?.[key]?.[at]?.["startIndex"];
            if (typeof (result) === "undefined") return -1;
            return result; 
        },
        ParamKeyEnd(text, key, at) {
            const result =  this._ParamAnalyze(text)?.[key]?.[at]?.["endIndex"];
            if (typeof (result) === "undefined") return -1;
            return result; 
        },
        ParamTextNum(text, isFillEmpty = 1, isStringParams) {
            const scheme = "default";
            if (typeof (this._paramSchemes[scheme]) === "undefined") return text;
            const startCharEscape = this._paramSchemes[scheme].startEscape;
            const startCharEscapeLength = startCharEscape.length;
            const startChar = this._paramSchemes[scheme].start;
            const startCharLength = startChar.length;
            const endCharEscape = this._paramSchemes[scheme].endEscape;
            const endCharEscapeLength = endCharEscape.length;
            const endChar = this._paramSchemes[scheme].end;
            const endCharLength = endChar.length;
            isFillEmpty = !!isFillEmpty;

            const paramValues = [];
            const argLength = arguments.length;
            let i = 3;
            if (isStringParams) {
                let str = [];
                while (i < argLength) {
                    str.push(String(arguments[i]));
                    i++;
                }
                str = str.join(",");
                const pattern = new RegExp("(?:\\\\,)|(,)", "gd");
                let matches;
                let startIndex = 0;
                while (matches = pattern.exec(str)) {
                    if (matches[1] !== undefined) {
                        paramValues.push(str.substring(startIndex, matches.indices[1][0]));
                        startIndex = matches.indices[1][1];
                    }
                }
                paramValues.push(str.substring(startIndex));
            } else {
                while (i < argLength) {
                    paramValues.push(String(arguments[i]));
                    i++;
                }
            }

            const textLength = text.length;
            let newText = "";
            let startIndex = -1;
            let endIndex = 0;
            let param = "";
            let j = 0;
            while (j < textLength) {
                if (startIndex === -1) {
                    if (text.substring(j, j + startCharEscapeLength) === startCharEscape) {
                        j += startCharEscapeLength;
                    } else if (text.substring(j, j + startCharLength) === startChar) {
                        startIndex = j;
                        j += startCharLength;
                    } else {
                        j++;
                    }
                } else {
                    if (text.substring(j, j + endCharEscapeLength) === endCharEscape) {
                        j += endCharEscapeLength;
                    } else if (text.substring(j, j + endCharLength) === endChar) {
                        param = text.substring(startIndex + startCharLength, j);
                        j += endCharLength;
                        if (typeof (paramValues[param]) === "string") {
                            newText += text.substring(endIndex, startIndex) + paramValues[param];
                        } else if (isFillEmpty) {
                            newText += text.substring(endIndex, startIndex);
                        } else {
                            newText += text.substring(endIndex, j);
                        }
                        startIndex = -1;
                        endIndex = j;
                    } else {
                        j++;
                    }
                }
            }
            newText += text.substring(endIndex);
            return newText;
        },
        ParamTextKey(text, isFillEmpty = 1, isStringParams) {
            const scheme = "default";
            if (typeof (this._paramSchemes[scheme]) === "undefined") return text;
            const startChar = this._paramSchemes[scheme].start;
            const startCharLength = startChar.length;
            const startCharEscape = this._paramSchemes[scheme].startEscape;
            const startCharEscapeLength = startCharEscape.length;
            const endChar = this._paramSchemes[scheme].end;
            const endCharLength = endChar.length;
            const endCharEscape = this._paramSchemes[scheme].endEscape;
            const endCharEscapeLength = endCharEscape.length;
            isFillEmpty = !!isFillEmpty;

            const paramValues = {};
            const argLength = arguments.length;
            let i = 3;
            if (isStringParams) {
                let str = [];
                while (i < argLength) {
                    str.push(String(arguments[i]));
                    i++;
                }
                str = str.join(",");
                const pattern = new RegExp("(?:\\\\,)|(,)", "gd");
                let matches;
                let startIndex = 0;
                let key = "";
                while (matches = pattern.exec(str)) {
                    if (matches[1] !== undefined) {
                        key = str.substring(startIndex, matches.indices[1][0]).replaceAll('\\,', ',');
                        startIndex = matches.indices[1][1];
                        matches = pattern.exec(str);
                        if (matches !== null && matches[1] !== undefined) {
                            const value = str.substring(startIndex, matches.indices[1][0]).replaceAll('\\,', ',');;
                            startIndex = matches.indices[1][1];
                            paramValues[key] = value;
                            key = "";
                        } else {
                            break;
                        }
                    }
                }
                if (key !== "") {
                    paramValues[key] = str.substring(startIndex).replaceAll('\\,', ',');
                }
            } else {
                while (i < argLength) {
                    const key = arguments[i++];
                    const value = arguments[i++];
                    if (value !== undefined) {
                        paramValues[String(key)] = String(value);
                    } else {
                        paramValues[String(key)] = "";
                    }
                }
            }
            const textLength = text.length;
            let newText = "";
            let startIndex = -1;
            let endIndex = 0;
            let param = "";
            let j = 0;
            while (j < textLength) {
                if (startIndex === -1) {
                    if (text.substring(j, j + startCharEscapeLength) === startCharEscape) {
                        j += startCharEscapeLength;
                    } else if (text.substring(j, j + startCharLength) === startChar) {
                        startIndex = j;
                        j += startCharLength;
                    } else {
                        j++;
                    }
                } else {
                    if (text.substring(j, j + endCharEscapeLength) === endCharEscape) {
                        j += endCharEscapeLength;
                    } else if (text.substring(j, j + endCharLength) === endChar) {
                        param = text.substring(startIndex + startCharLength, j);
                        j += endCharLength;
                        if (typeof (paramValues[param]) === "string") {
                            newText += text.substring(endIndex, startIndex) + paramValues[param];
                        } else if (isFillEmpty) {
                            newText += text.substring(endIndex, startIndex);
                        } else {
                            newText += text.substring(endIndex, j);
                        }
                        startIndex = -1;
                        endIndex = j;
                    } else {
                        j++;
                    }
                }
            }
            newText += text.substring(endIndex);
            return newText;
        },
        Escaping(text, isDescape, isStringParams) {
            let paramValues = {};
            const argLength = arguments.length;
            let i = 3;
            if (isStringParams) {
                let str = [];
                while (i < argLength) {
                    str.push(String(arguments[i]));
                    i++;
                }
                str = str.join(",");
                const pattern = new RegExp("(?:\\\\,)|(,)", "gd");
                let matches;
                let startIndex = 0;
                let key = "";
                while (matches = pattern.exec(str)) {
                    if (matches[1] !== undefined) {
                        key = str.substring(startIndex, matches.indices[1][0]).replaceAll('\\,', ',');
                        startIndex = matches.indices[1][1];
                        matches = pattern.exec(str);
                        if (matches !== null && matches[1] !== undefined) {
                            const value = str.substring(startIndex, matches.indices[1][0]).replaceAll('\\,', ',');;
                            startIndex = matches.indices[1][1];
                            paramValues[key] = value;
                            key = "";
                        } else {
                            break;
                        }
                    }
                }
                if (key !== "") {
                    paramValues[key] = str.substring(startIndex).replaceAll('\\,', ',');
                }
            } else {
                while (i < argLength) {
                    const key = arguments[i++];
                    const value = arguments[i++];
                    if (value !== undefined) {
                        paramValues[String(key)] = String(value);
                    } else {
                        paramValues[String(key)] = "";
                    }
                }
            }

            if (isDescape) {
                paramValues = Object.keys(paramValues).reduce((res, key) => {
                    res[paramValues[key]] = key;
                    return res;
                }, {});
            }
            
            const keys = Object.keys(paramValues).map((el) => {
                return this._RegExpEscape(el);
            });
            const values = Object.values(paramValues).map((el) => {
                return this._RegExpEscape(el);
            });
            const replaceRegExp = new RegExp("(?:" + keys.join("|") + ")|(" + values.join("|") + ")", "g");
            return text.replaceAll(replaceRegExp, (char) => {
                const newChar = paramValues[char];
                return (newChar ? newChar : char);
            });
        }
    };
};