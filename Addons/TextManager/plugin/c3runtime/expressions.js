"use strict";
{
    const C3 = self.C3;
    /** @namespace */
    C3.Plugins.RobotKaposzta_TextManager.Exps = {
        /**
         * Returns the added language count.
         * @returns {number} integer
         */
        LanguageCount() {
            return this._availableLanguages.length;
        },
        /**
         * Returns the added language at an index.
         * @param {number} at - the language integer index.
         * @returns {string} language string
         */
        Language(at) {
            if (typeof at === "undefined") return this._currentLanguage;
            at = Number(at);
            if (at < 0 || isNaN(at)) at = 0;
            else if (at >= this._availableLanguages.length) at = this._availableLanguages.length - 1;
            return this._availableLanguages[at];
        },
        /**
         * Returns the device language count.
         * @returns {number} integer
         */
        DeviceLanguageCount() {
            return this._deviceLanguages.length;
        },
        /**
         * Returns device language at an index.
         * @param {number} at - the language integer index.
         * @returns {string} language string
         */
        DeviceLanguageAt(at) {
            if (at < 0) at = 0;
            else if (at >= this._deviceLanguages.length) at = this._deviceLanguages.length - 1;
            return this._deviceLanguages[at];
        },
        /**
         * Returns the suggested language.
         * @returns {string} language string
         */
        SuggestedLanguage() {
            let allLang = Array.from(arguments).join(",");
            const [check, suggested] = this._LanguageSupportCheck(allLang);
            return suggested;
        },
        /**
         * Returns the language code from language string
         * @param {string} str - the language string.
         * @returns {string} language section string
         */
        GetLanguageSection(str) {
            return this._GetLangCode(str);
        },
        /**
         * Returns the region code from language string
         * @param {string} str - the language string.
         * @returns {string} region code string
         */
        GetRegionSection(str) {
            return this._GetRegionCode(str);
        },

        /**
         * Returns the last loaded data's tag name
         * @returns {string} last loaded data's tag name
         */
        LoadTag() {
            return this._lastDataTag;
        },
        /**
         * Returns the last loaded data's error. This not implemented
         * @returns {string} empty string
         */
        LoadError() {
            return this._lastDataError;
        },
        /**
         * Returns the tags count
         * @returns {number} tags count in non zero integer
         */
        TagCount() {
            return this._languagesDataByTags.size;
        },
        /**
         * Returns the tag's name at index
         * @returns {string} tag's name in string
         */
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
        /**
         * Returns the language key count at tag.  If not set the tag's name the function count all keys (note empty string is a valid name for tags)
         * @param {string=} tag - optional tag's name
         * @returns {number} key count in non zero integer
         */
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
        /**
         * Returns the language key count at tag's name. If not set the tag's name the function search through all tags (note empty string is a valid name for tags)
         * @param {at} at - searched key's index
         * @param {string=} tag - optional tag's name
         * @returns {string} key's name in string
         */
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
        /**
         * Returns the key's translation value. If not set the language return in currently selected language.
         * @param {string} key - tag's name
         * @param {string=} lang - language code in string.
         * @returns {string} key's translation value in string
         */
        Translate(key, lang = "") {
            if (lang === "") lang = this._currentLanguage;
            let langObj = this._languagesDataByKeys.get(key);
            if (!langObj) return "";
            if (!langObj["langs"][lang]) return "";
            return langObj["langs"][lang];
        },

        /**
         * Returns the text's parameter's count
         * @param {string} text - text to analize
         * @returns {number} the paramer count in non-zero integer.
         */
        ParamKeyCount(text) {
            return Object.keys(this._ParamAnalyze(text)).length;
        },
        /**
         * Returns the parameter's key name at index
         * @param {string} text - text to analize
         * @param {number} at - index of the parameter
         * @returns {string} the paramer key name in string
         */
        ParamKeyAt(text, at) {
            const result = Object.keys(this._ParamAnalyze(text))?.[at];
            if (typeof (result) === "undefined") return "";
            return result;
        },
        /**
         * Returns the parameter key's count from text
         * @param {string} text - text to analize
         * @param {string} key - ket to count
         * @returns {number} the count of the parameter
         */
        ParamKeyCountAt(text, key) {
            const result = this._ParamAnalyze(text)?.[key]?.length;
            if (typeof (result) === "undefined") return 0;
            return result; 
        },
        /**
         * Find the parameter's start index (include)
         * @param {string} text - text to analize
         * @param {string} key - key to count
         * @param {number} at - key's index to search
         * @returns {number} start index of the parameter. If not exist return -1
         */
        ParamKeyStart(text, key, at) {
            const result =  this._ParamAnalyze(text)?.[key]?.[at]?.["startIndex"];
            if (typeof (result) === "undefined") return -1;
            return result; 
        },
        /**
         * Find the parameter's end index (include).
         * @param {string} text - text to analize
         * @param {string} key - key to count
         * @param {number} at - key's index to search
         * @returns {number} end index of the parameter. If not exist return -1
         */
        ParamKeyEnd(text, key, at) {
            const result =  this._ParamAnalyze(text)?.[key]?.[at]?.["endIndex"];
            if (typeof (result) === "undefined") return -1;
            return result; 
        },
        /**
         * Replace numbered parameters in text.
         * @param {string} text - text to replace
         * @param {number} isFillEmpty - set 1 to clear not used parameters, 0 to leave them
         * @param {number} isStringParams - set 0 to inserts parameters add separatly. If set 1 inserts parameters can be added in single string comma separated string.
         * @param {...string} inserts - if isStringParams is 0 numbered parameters separatly eg. zero, one, two . If isStringParams 1 add one parameter with comma separated string eg. "zero,one,two"
         * @returns {string} parameter replaced string
         */
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
        /**
         * Replace numbered parameters in text.
         * @param {string} text - text to replace
         * @param {number} isFillEmpty - set 1 to clear not used parameters, 0 to leave them
         * @param {number} isStringParams - set 0 to inserts parameters add separatly. If set 1 inserts parameters can be added in single string comma separated string.
         * @param {...string} inserts - if isStringParams is 0 key value parameters separatly eg. keyzero, valuezero, keyone, valueone . If isStringParams 1 add one parameter with comma separated string eg. "keyzero,valuezero,keyone,valueone"
         * @returns {number} parameter replaced string
         */
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
        /**
         * Replace escaped charactes to descaped characters or reverse it.
         * @param {string} text - text to escape
         * @param {number} isDescape - set 1 to key characters replace with value characters, set 1 to value characters replace with key characters
         * @param {number} isStringParams - set 0 to inserts parameters add separatly. If set 1 inserts parameters can be added in single string comma separated string.
         * @param {...string} inserts - if isStringParams is 0 key value parameters separatly eg. keyzero, valuezero, keyone, valueone . If isStringParams 1 add one parameter with comma separated string eg. "keyzero,valuezero,keyone,valueone"
         * @returns {number} parameter replaced string
         */
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