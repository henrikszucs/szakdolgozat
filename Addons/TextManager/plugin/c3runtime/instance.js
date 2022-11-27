"use strict";
{
    // 1 UNDOCUMENTED FEATURE new C3.CompositeDisposable();
    /*
    Language data scheme:
    Keys: {
        "key": {
            "tags": [[],[]],
            "langs": {
                "en-US": "hello",
                "hu-HU": "helló"
            }
        }
    }
    Tags: {
        "name": [],
        "name2": []
    }
    */
    const C3 = self.C3;
    const DOM_COMPONENT_ID = "RobotKaposzta_TextManager";
    let PLUGIN = null;

    /**
	 * @external SDKInstanceBase
	 * @see https://www.construct.net/en/make-games/manuals/addon-sdk/runtime-reference/base-classes/sdkinstancebase
	 */
    /**
	 * @classdesc TextManager editor class.
	 * @extends external:SDKInstanceBase
	 */
    class TextManagerRuntimeInstance extends C3.SDKInstanceBase {
        /**
		 * @desc create class.
		 * @param {object} inst - The title of the book.
		 * @param {array} properties - The author of the book.
		 */
        constructor(inst, properties) {
            super(inst, DOM_COMPONENT_ID);
            PLUGIN = this;

            this._availableLanguages = ["en-US"];
            this._deviceLanguages = [];
            this._currentLanguage = "en-US";
            this._isSaveLang = false;
            this._isSaveData = false;
            this._languagesDataByTags = new Map();
            this._languagesDataByKeys = new Map();
            
            this._startDataLoadList = [];
            this._lastDataTag = "";
            this._lastDataError = "";

            this._behaviorList = new Set();

            this._paramSchemes = {
                "default": {
                    start: "{",
                    startEscape: "\\{",
                    end: "}",
                    endEscape: "\\}"
                }
            };

            if (properties) {
                if (typeof (properties[0]) === "string") {
                    const data = properties[0].split(new RegExp("(?:\n|,|;| )+", "g"));
                    if (data[0] === "") data.shift();
                    if (data[data.length - 1] === "") data.pop();
                    if (data.length === 0) data.push("en-US");
                    this._availableLanguages = data;
                }
                if (typeof (properties[1]) === "string") {
                    const find = this._availableLanguages.find((el) => el === properties[1]);
                    if (!find) {
                        const codes = properties[1].split("-");
                        let langCode = "";
                        if (codes.length === 1 || codes.length === 2) {
                            langCode = codes[0];
                        } else {
                            langCode = codes[0] + "-" + codes[1];
                        }
                        const regex2 = new RegExp("^(" + langCode + ")", "gi");
                        const find2 = this._availableLanguages.find((el) => regex2.test(el));
                        if (!find2) {
                            const regex3 = new RegExp("^(en)", "gi");
                            const find3 = this._availableLanguages.find((el) => regex3.test(el));
                            if (!find3) {
                                this._currentLanguage = this._availableLanguages[0];
                            } else {
                                this._currentLanguage = find3;
                            }
                        } else {
                            this._currentLanguage = find2;
                        }
                    } else {
                        this._currentLanguage = properties[1];
                    }
                }
                if (typeof (properties[2]) === "boolean") {
                    this._isSaveLang = properties[2];
                }
                if (typeof (properties[3]) === "boolean") {
                    this._isSaveData = properties[3];
                }
                if (typeof (properties[6]) === "string" && properties[6] !== "") {
                    let format = properties[4]; // JSON single, JSON multiple, CSV, Dictionary, Array
                    let mode = properties[5]; // file, data
                    let source = properties[6];
                    let language = properties[7];
                    let tag = properties[8];
                    // Mode
                    if (mode === 0) {
                        source = source.split("\n").map((x, i) => {
                            return x.replace(/\r?\n|\r/gim, "");
                        });
                        language = language.split("\n").map((el) => {
                            return this._FormatLang(el.replace(/\r?\n|\r/gim, ""));
                        });
                        tag = tag.split("\n").map((el) => {
                            return el.replace(/\r?\n|\r/gim, "");
                        });
                    } else {
                        source = [source];
                        language = [this._FormatLang(language)];
                        tag = [tag];
                    }
                    // Language (Only for JSON single, Dictionary)
                    if (format === 0 || format === 3) {
                        if (!language[0]) {
                            language[0] = "en-US";
                        }
                        source.forEach((el, index) => {
                            if (!language[index]) {
                                language[index] = language[0];
                            }
                        });
                    }
                    // Tag
                    source.forEach((el, index) => {
                        if (typeof (tag[index]) === "undefined") {
                            tag[index] = tag[0];
                        }
                    });

                    // Load
                    if (mode === 0) {
                        source.forEach((el, index) => {
                            this._runtime.AddLoadPromise(
                                this._LoadFile(el, format, language[index], tag[index]).then(
                                (success) => {
                                    const res = {
                                        "tag": tag[index]
                                    };
                                    this._startDataLoadList.push(res);
                                },
                                (rejected) => {
                                    const res = {
                                        "tag": tag[index],
                                        "error": rejected
                                    };
                                    this._startDataLoadList.push(res);
                                })
                            );
                        });
                    } else {
                        source.forEach((el, index) => {
                            this._Load(el, format, language[index], tag[index]);
                        });
                    }

                    //!!!!Undocumented (for startup after load)
                    const rt = this._runtime.Dispatcher();
                    this._disposables = new C3.CompositeDisposable(
                        C3.Disposable.From(
                            rt,
                            "afterfirstlayoutstart",
                            () => this._OnAfterFirstLayoutStart()
                        )
                    );
                }
            }

            this._deviceLanguages = [...navigator.languages];
            this._deviceLanguages.splice(this._deviceLanguages.indexOf(navigator.language), 1);
            this._deviceLanguages.unshift(navigator.language);
            const [check, lang] = this._LanguageSupportCheck();
            this._currentLanguage = lang;

            this._runtime.AddLoadPromise(
                this.PostToDOMAsync("get-init", {
                    "is-save-lang": this._isSaveLang,
                    "current-language": this._currentLanguage
                }).then((data) => {
                    if (this._isSaveLang) {
                        const backLang = data["current-language"];
                        const find = this._availableLanguages.find((el) => el === backLang);
                        if (find) {
                            this._currentLanguage = backLang;
                        }
                    }
                    this.PostToDOM("change-lang", {
                        "lang": this._currentLanguage
                    });
                })
            );

            this.AddDOMMessageHandlers([
                ["on-device-language-change", () => this._OnDeviceLanguageChange()]
            ]);
        }
        
        SaveToJson() {
            if (this._isSaveData) {
                const tags = Object.fromEntries(this._languagesDataByTags);
                const keys = Object.fromEntries(this._languagesDataByKeys);
                for (const key in keys) {
                    for (const tag in tags) {
                        const index = keys[key]["tags"].indexOf(tags[tag]);
                        if (index !== -1) {
                            keys[key]["tags"][index] = tag;
                        }
                    }
                }
                return keys;
            }
            return {};
        }
        LoadFromJson(entries) {
            if (this._isSaveData) {
                const newTags = new Map();
                const newKeys = new Map();
                for (const entry in entries) {
                    const tags = entries[entry]["tags"];
                    for (let i = 0, length = tags.length; i < length; i++) {
                        let stored = newTags.get(tags[i]);
                        if (!stored) {
                            let newTagPtr = [];
                            newTags.set(tags[i], newTagPtr);
                            stored = newTagPtr;
                        }
                        tags[i] = stored;
                    }
                    newKeys.set(entry, entries[entry]);
                }
                this._languagesDataByTags = newTags;
                this._languagesDataByKeys = newKeys;
            }
        }
        GetDebuggerProperties() {
            const prefix = "plugins.robotkaposzta_textmanager.debugger";
            const tagGroup = [];
            const iterator = this._languagesDataByTags[Symbol.iterator]();
            for (const [key, value] of iterator) {
                const newGroup = {
                    "title": "$" + key,
                    "properties": []
                };
                const iterator2 = this._languagesDataByKeys[Symbol.iterator]();
                for (const [key2, value2] of iterator2) {
                    if (value2["tags"].includes(value)) {
                        newGroup["properties"].push({
                            "name": "$" + key2,
                            "value": JSON.stringify(value2["langs"])
                        });
                    }
                }
                tagGroup.push(newGroup);
            }
            return [
                {
                    "title": prefix + ".language.name",
                    "properties": [
                        {
                            "name": prefix + ".language.language-list",
                            "value": this._availableLanguages.join(",")
                        },
                        {
                            "name": prefix + ".language.device-language-list",
                            "value": this._deviceLanguages.join(",")
                        },
                        {
                            "name": prefix + ".language.current-language",
                            "value": this._currentLanguage
                        },
                        {
                            "name": prefix + ".load.tag",
                            "value": this._lastDataTag
                        },
                        {
                            "name": prefix + ".load.error",
                            "value": this._lastDataError
                        }
                    ]
                },
                ...tagGroup
            ];
        }

        /**
		 * @desc Event change method.
		 * @param {string} id - The title of the book.
		 * @param {string} value - The author of the book.
		 */
        _OnAfterFirstLayoutStart() {
            this._startDataLoadList.forEach((element) => {
                if (typeof element["error"] === "undefined") {
                    this._lastDataTag = element["tag"];
                    this._lastDataError = "";
                    this.Trigger(C3.Plugins.RobotKaposzta_TextManager.Cnds.OnDataLoad);
                } else {
                    this._lastDataTag = element["tag"];
                    this._lastDataError = element["error"];
                    this.Trigger(C3.Plugins.RobotKaposzta_TextManager.OnDataLoadError);
                }
            });
        }

        _OnDeviceLanguageChange() {
            this._deviceLanguages = [...navigator.languages];
            this._deviceLanguages.splice(this._deviceLanguages.indexOf(navigator.language), 1);
            this._deviceLanguages.unshift(navigator.language);
            this._BehaviorUpdate();
            this.Trigger(C3.Plugins.RobotKaposzta_TextManager.Cnds.OnDeviceLanguageChange);
        }

        _LanguageSupportCheck(lang = "") {
            let availableLanguages;
            if (lang !== "") {
                availableLanguages = [...lang.split(",")];
            } else {
                availableLanguages = [...this._availableLanguages];
            }

            //Most preferable
            let mostLang = this._deviceLanguages[0];
            const mostCodes = mostLang.split("-");
            let mostLangCode = "";
            if (mostCodes.length === 1 || mostCodes.length === 2) {
                mostLangCode = mostCodes[0];
            } else {
                mostLangCode = mostCodes[0] + "-" + mostCodes[1];
            }
            const mostRegex = new RegExp("^(" + mostLangCode + ")", "gi");
            const mostFind = availableLanguages.find((el) => {
                return mostRegex.test(el);
            });
            if (mostFind) {
                return [2, mostFind];
            }
            //preferable
            let find = false;
            let findIndex = 0;
            let findLength = this._deviceLanguages.length;
            while (!find && findIndex < findLength) {
                const find2 = availableLanguages.find((el) => el === this._deviceLanguages[findIndex]);
                if (find2) {
                    return [2, find2];
                }
                findIndex++;
            }
            //preferable but not in region
            if (!find) {
                findIndex = 0;
                findLength = this._deviceLanguages.length;
                while (!find && findIndex < findLength) {
                    const find2 = availableLanguages.find((el) => {
                        const codes = el.split("-");
                        let langCode = "";
                        if (codes.length === 1 || codes.length === 2) {
                            langCode = codes[0];
                        } else {
                            langCode = codes[0] + "-" + codes[1];
                        }
                        const regex = new RegExp("^(" + langCode + ")", "gi");
                        return regex.test(this._deviceLanguages[findIndex]);
                    });
                    if (find2) {
                        return [1, find2];
                    }
                    findIndex++;
                }
            }
            return [0, ""];
        }

        _FormatLang(str) {
            const regex = new RegExp("^(zh-hans|zh-hant)", "gi");
            const arr = str.toUpperCase().split("-");
            if (regex.test(str)) {
                arr[0] = arr[0].toLowerCase();
                arr[1] = arr[1].toLowerCase();
            } else {
                arr[0] = arr[0].toLowerCase();
            }
            return arr.join("-");
        }
        _GetLangCode(str) {
            const el = str.split("-");
            const regex = new RegExp("^(zh-hans|zh-hant)", "gi");
            if (regex.test(str)) {
                return el[0] + "-" + el[1];
            }
            return el[0];
        }
        _GetRegionCode(str) {
            const el = str.split("-");
            const regex = new RegExp("^(zh-hans|zh-hant)", "gi");
            if (regex.test(str)) {
                return (el[2] ? el[2] : "");
            }
            return (el[1] ? el[1] : "");
        }

        async _LoadFile(filename, format, lang, tag) {
            return new Promise(async (resolve, reject) => {
                const assetManager = this._runtime.GetAssetManager();
                let blob;
                try {
                    blob = await assetManager.FetchBlob(filename);
                } catch (error) {
                    console.warn("Failed to load file: " + filename);
                }
                if (!blob) {
                    reject();
                    return;
                }
                const data = await blob.text();
                this._Load(data, format, lang, tag, filename);
                resolve();
                return;
            });
        }
        _Load(data, format, lang, tag, filename = "") {
            if (format === 0) {
                let dataObj;
                try {
                    dataObj = JSON.parse(data);
                } catch (error) {
                    console.warn("Failed to parse JSON: " + (filename ? filename : data));
                    return false;
                }
                if (dataObj) {
                    this._LoadJSONSimple(dataObj, lang, tag);
                }
            } else if (format === 1) {
                let dataObj;
                try {
                    dataObj = JSON.parse(data);
                } catch (error) {
                    console.warn("Failed to parse JSON: " + (filename ? filename : data));
                    return false;
                }
                if (dataObj) {
                    this._LoadJSONMultiple(dataObj, tag);
                }
            } else if (format === 2) {
                this._LoadCSV(data, tag);
            } else if (format === 3) {
                let dataObj;
                try {
                    dataObj = JSON.parse(data);
                } catch (error) {
                    console.warn("Failed to parse JSON: " + (filename ? filename : data));
                    return false;
                }
                if (dataObj) {
                    this._LoadDictionary(dataObj, lang, tag);
                }
            } else if (format === 4) {
                let dataObj;
                try {
                    dataObj = JSON.parse(data);
                } catch (error) {
                    console.warn("Failed to parse JSON: " + (filename ? filename : data));
                    return false;
                }
                if (dataObj) {
                    this._LoadArray(dataObj, tag);
                }
            }
            this._BehaviorUpdate();
            return true;
        }
        _LoadJSONSimple(obj, lang, tag) {
            if (!lang) {
                return false;
            }

            const tags = tag.split(",").map((tag) => {
                let existTag = this._languagesDataByTags.get(tag);
                if (!existTag) {
                    existTag = [];
                    this._languagesDataByTags.set(tag, existTag);
                }
                return existTag;
            });

            const JSONSimpleParser = (obj, lang, path = "") => {
                if (typeof obj === "string" || typeof obj === "number" || typeof obj === "boolean") {
                    const value = {
                        [lang]: String(obj)
                    };
                    this._AddLanguageData(path, value, tags);
                    return;
                }
                const keys = Object.keys(obj);
                if (keys.length === 0) {
                    return;
                }
                keys.forEach((key) => {
                    let newPath;
                    if (path) {
                        newPath = [path, key].join(".");
                    } else {
                        newPath = key;
                    }
                    JSONSimpleParser(obj[key], lang, newPath);
                });
            };
            JSONSimpleParser(obj, lang);
            return true;
        }
        _LoadJSONMultiple(obj, tag) {
            const tags = tag.split(",").map((tag) => {
                let existTag = this._languagesDataByTags.get(tag);
                if (!existTag) {
                    existTag = [];
                    this._languagesDataByTags.set(tag, existTag);
                }
                return existTag;
            });

            const JSONMultipleParser = (obj, path = "") => {
                const keys = Object.keys(obj);
                if (keys.length === 0) {
                    return;
                }
                const isEveryString = keys.every((key) => {
                    if (typeof obj[key] === "string" || typeof obj[key] === "number" || typeof obj[key] === "boolean") {
                        return true;
                    } else {
                        return false;
                    }
                });
                if (isEveryString) {
                    let values = {};
                    keys.forEach(key => {
                        values[key] = String(obj[key]);
                    });
                    this._AddLanguageData(path, values, tags);
                    return;
                }
                const isEveryObject = keys.every((key) => {
                    if (typeof obj[key] === "object") {
                        return true;
                    } else {
                        return false;
                    }
                });
                if (!isEveryObject) {
                    console.warn("TextManager: Invalid JSON (multiple) format in " + path);
                    return;
                }
                keys.forEach((key) => {
                    let newPath;
                    if (path) {
                        newPath = [path, key].join(".");
                    } else {
                        newPath = key;
                    }
                    JSONMultipleParser(obj[key], newPath);
                });
            };
            JSONMultipleParser(obj);
            return true;
        }
        _LoadCSV(str, tag) {
            const result = new Map();
            const pattern = /(\,|\r?\n|\r|^)(?:"([^"]*(?:""[^"]*)*)"|([^\,\r\n]*))/gi;
            const replaceEscape = /""/g;

            let headers = [];
            let headerIndex = 1;
            let lastKey = "";
            let lastResult = {};
            let matches;
            let data;

            if (str === "") {
                return false;
            }

            const tags = tag.split(",").map((tag) => {
                let existTag = this._languagesDataByTags.get(tag);
                if (!existTag) {
                    existTag = [];
                    this._languagesDataByTags.set(tag, existTag);
                }
                return existTag;
            });

            //header first el (key)
            if (matches = pattern.exec(str)) {
                if (matches[2]) {
                    data = matches[2].replace(replaceEscape);
                } else {
                    data = matches[3];
                }
                headers.push(data);
            }

            //header other el (languages)
            while (matches = pattern.exec(str)) {
                if (matches[1].length !== 0 && matches[1] !== ",") {
                    if (matches[2]) {
                        data = matches[2].replace(replaceEscape);
                    } else {
                        data = matches[3];
                    }
                    lastKey = data;
                    break;
                } else {
                    if (matches[2]) {
                        data = matches[2].replace(replaceEscape);
                    } else {
                        data = matches[3];
                    }
                    headers.push(data);
                }
            }
            const headersLength = headers.length;

            //parsing data
            while (matches = pattern.exec(str)) {
                if (matches[1].length !== 0 && matches[1] !== ",") {
                    this._AddLanguageData(lastKey, lastResult, tags);
                    if (matches[2]) {
                        data = matches[2].replace(replaceEscape);
                    } else {
                        data = matches[3];
                    }
                    headerIndex = 0;
                    lastKey = data;
                    lastResult = {};
                } else {
                    if (matches[2]) {
                        data = matches[2].replace(replaceEscape);
                    } else {
                        data = matches[3];
                    }
                    if (headerIndex < headersLength && data !== "") {
                        lastResult[headers[headerIndex]] = data;
                    }
                }
                headerIndex++;
            }
            if (lastKey !== "") {
                this._AddLanguageData(lastKey, lastResult, tags);
            }
            return result;
        }
        _LoadDictionary(obj, lang, tag) {
            if (!obj["data"] || !lang) {
                return false;
            }

            const tags = tag.split(",").map((tag) => {
                let existTag = this._languagesDataByTags.get(tag);
                if (!existTag) {
                    existTag = [];
                    this._languagesDataByTags.set(tag, existTag);
                }
                return existTag;
            });

            const iterator = Object.entries(obj["data"]);
            for (const [key, langValue] of iterator) {
                const value = {
                    [lang]: String(langValue)
                };
                this._AddLanguageData(key, value, tags);
            }
            return true;
        }
        _LoadArray(obj, tag) {
            const result = new Map();
            if (!obj["data"] || typeof (obj["data"]) !== "object" || typeof (obj["data"][0]) !== "object" || typeof (obj["data"][0][0]) !== "object") {
                return result;
            }

            const tags = tag.split(",").map((tag) => {
                let existTag = this._languagesDataByTags.get(tag);
                if (!existTag) {
                    existTag = [];
                    this._languagesDataByTags.set(tag, existTag);
                }
                return existTag;
            });

            const data = obj["data"];
            const width = data.length;
            const height = data[0].length;
            const depth = data[0][0].length;
            let widthIndex = 0;
            let heightIndex = 0;
            let depthIndex = 0;
            //Sheet
            while (depthIndex < depth) {
                heightIndex = 0;

                //First row
                widthIndex = 0;
                let headers = [];
                while (widthIndex < width) {
                    headers.push(data[widthIndex][heightIndex][depthIndex]);
                    widthIndex++;
                }
                heightIndex++;

                //Parse rows
                while (heightIndex < height) {
                    let langKey;
                    let langData = {};
                    langKey = data[0][heightIndex][depthIndex];
                    widthIndex = 1;
                    while (widthIndex < width) {
                        const currData = data[widthIndex][heightIndex][depthIndex];
                        if (currData !== "") {
                            langData[headers[widthIndex]] = String(currData);
                        }
                        widthIndex++;
                    }
                    this._AddLanguageData(langKey, langData, tags);
                    heightIndex++;
                }
                depthIndex++;
            }
            return result;
        }
        _AddLanguageData(key, values, tags) {
            if (key === "") return;
            const exist = this._languagesDataByKeys.get(key);
            if (exist) {
                tags.forEach((tag) => {
                    if (!exist["tags"].includes(tag)) {
                        exist["tags"].push(tag);
                    }
                });
                exist["langs"] = {
                    ...exist["langs"],
                    ...values
                };
            } else {
                const value = {
                    "tags": [...tags],
                    "langs": {
                        ...values
                    }
                };
                this._languagesDataByKeys.set(key, value);
            }
        }

        _UnloadByTag(mode, tag, lang) {
            //tags
            //tagMode 0 - Hard delete; 1 - Soft delete
            let tags = [];
            tag = String(tag);
            tag.split(",").reduce((tags, tag) => {
                let existTag = this._languagesDataByTags.get(tag);
                this._languagesDataByTags.delete(tag);
                if (existTag) {
                    tags.push(existTag);
                }
                    return tags;
            }, tags);
            if (tags.length === 0) {
                return;
            }
            //lang
            let isLang = false;
            if (lang !== "") {
                isLang = true;
            }
            const iterator = this._languagesDataByKeys[Symbol.iterator]();
            for (const [key, value] of iterator) {
                if (value["tags"].some((tag) => { return tags.includes(tag); })) {
                    if (!isLang || typeof (value["langs"][lang]) !== "undefined") {
                        if (mode === 0) {
                            if (isLang) {
                                tags.forEach((tag) => {
                                    const i = value["tags"].indexOf(tag);
                                    if (i !== -1) {
                                        value["tags"].splice(i, 1);
                                    }
                                });
                                delete value["langs"][lang];
                                if (value["tags"].length === 0 || Object.entries(value["langs"]).length === 0) {
                                    this._languagesDataByKeys.delete(key);  
                                }
                            } else {
                                this._languagesDataByKeys.delete(key);
                            }
                        } else {
                            tags.forEach((tag) => {
                                const i = value["tags"].indexOf(tag);
                                if (i !== -1) {
                                    value["tags"].splice(i, 1);
                                }
                            });
                            if (value["tags"].length === 0) {
                                this._languagesDataByKeys.delete(key);  
                            }
                        }
                    }
                }
            }
            this._BehaviorUpdate();
        }
        _UnloadByKey(keyVal, lang) {
            //lang
            let isLang = false;
            if (lang !== "") {
                isLang = true;
            }

            const iterator = this._languagesDataByKeys[Symbol.iterator]();
            for (const [key, value] of iterator) {
                if (key === keyVal) {
                    if (!isLang || typeof (value["langs"][lang]) !== "undefined") {
                        if (isLang) {
                            delete value["langs"][lang];
                            if (Object.entries(value["langs"]).length === 0) {
                                this._languagesDataByKeys.delete(key);  
                            }
                        } else {
                            this._languagesDataByKeys.delete(key);
                        }
                    }
                }
            }
            this._BehaviorUpdate();
        }

        _ExportJSONSimple(lang, tag) {
            const result = {};

            let isTag = false;
            let tags = [];
            if (typeof (tag) !== "undefined") {
                isTag = true;
                tag = String(tag);
                tag.split(",").reduce((tags, tag) => {
                    let existTag = this._languagesDataByTags.get(tag);
                    if (existTag) {
                        tags.push(existTag);
                    }
                    return tags;
                }, tags);
                if (tags.length === 0) {
                    return JSON.stringify(result);
                }
            }

            const iterator = this._languagesDataByKeys[Symbol.iterator]();
            for (const [key, value] of iterator) {
                if (!isTag || (isTag && value["tags"].some((tag) => { return tags.includes(tag); }))) {
                    const data = value["langs"][lang];
                    if (data) {
                        const path = key.split('.');
                        const pathLength = path.length;
                        path.reduce(function (previous, current, currentIndex) {
                            if (currentIndex >= pathLength - 1) {
                                if (data) {
                                    return previous[current] = data;
                                } else {
                                    return previous[current] = "";
                                }
                            } else if (typeof (previous[current]) !== "object") {
                                return previous[current] = {};
                            } else {
                                return previous[current];
                            }
                        }, result);
                    }
                }
            }
            return JSON.stringify(result);
        }
        _ExportJSONMultiple(tag) {
            const result = {};

            let isTag = false;
            let tags = [];
            if (typeof (tag) !== "undefined") {
                isTag = true;
                tag = String(tag);
                tag.split(",").reduce((tags, tag) => {
                    let existTag = this._languagesDataByTags.get(tag);
                    if (existTag) {
                        tags.push(existTag);
                    }
                    return tags;
                }, tags);
                if (tags.length === 0) {
                    return JSON.stringify(result);
                }
            }

            const iterator = this._languagesDataByKeys[Symbol.iterator]();
            for (const [key, value] of iterator) {
                if (!isTag || (isTag && value["tags"].some((tag) => { return tags.includes(tag); }))) {
                    const path = key.split('.');
                    const pathLength = path.length;
                    path.reduce(function (previous, current, currentIndex) {
                        if (currentIndex >= pathLength - 1) {
                            return previous[current] = value["langs"];
                        } else if (typeof (previous[current]) !== "object") {
                            return previous[current] = {};
                        } else {
                            return previous[current];
                        }
                    }, result);
                }
            }
            return JSON.stringify(result);
        }
        _ExportCSV(tag) {
            let result = "";
            const map = this._languagesDataByKeys;

            let isTag = false;
            let tags = [];
            if (typeof (tag) !== "undefined") {
                isTag = true;
                tag = String(tag);
                tag.split(",").reduce((tags, tag) => {
                    let existTag = this._languagesDataByTags.get(tag);
                    if (existTag) {
                        tags.push(existTag);
                    }
                    return tags;
                }, tags);
                if (tags.length === 0) {
                    return JSON.stringify(result);
                }
            }

            //collect all languages
            const allLang = [];
            const iterator = map[Symbol.iterator]();
            for (const [key, value] of iterator) {
                const difference = Object.keys(value["langs"]).filter(x => !allLang.includes(x));
                allLang.push(...difference);
            }

            //write header
            result += "\"" + ["key", ...allLang].map((head) => {
                return head.replaceAll("\"", "\"\"");
            }).join("\",\"") + "\"";
            result += "\n";

            //write data
            const iterator2 = map[Symbol.iterator]();
            for (const [key, value] of iterator2) {
                if (!isTag || (isTag && value["tags"].some((tag) => { return tags.includes(tag); }))) {
                    const data = [];
                    data.push(key);
                    for (const lang of allLang) {
                        const langVal = value["langs"][lang];
                        if (langVal) {
                            data.push(langVal);
                        } else {
                            data.push("");
                        }
                    }
                    result += "\"" + data.map((data) => {
                        return data.replaceAll("\"", "\"\"");
                    }).join("\",\"") + "\"";
                    result += "\n";
                }
            }
            return result;
        }
        _ExportDictionary(lang, tag) {
            const result = {
                "c2dictionary": true,
                "data": {
                    "": ""
                }
            };

            let isTag = false;
            let tags = [];
            if (typeof (tag) !== "undefined") {
                isTag = true;
                tag = String(tag);
                tag.split(",").reduce((tags, tag) => {
                    let existTag = this._languagesDataByTags.get(tag);
                    if (existTag) {
                        tags.push(existTag);
                    }
                    return tags;
                }, tags);
                if (tags.length === 0) {
                    return JSON.stringify(result);
                }
            }

            const resultData = {};
            const iterator = this._languagesDataByKeys[Symbol.iterator]();
            for (const [key, value] of iterator) {
                if (!isTag || (isTag && value["tags"].some((tag) => { return tags.includes(tag); }))) {
                    const data = value["langs"][lang];
                    if (data) {
                        resultData[key] = data;
                    } else {
                        resultData[key] = "";
                    }
                }
            }
            result["data"] = resultData;

            return JSON.stringify(result);
        }
        _ExportArray(tag) {
            const result = {
                "c2array": true,
                "size": [1, 1, 1],
                "data": [
                    [
                        [
                            ""
                        ]
                    ]
                ]
            };

            const resultData = [];
            let width = 0;
            let height = 0;
            let depth = 1;

            const map = this._languagesDataByKeys;
            let isTag = false;
            let tags = [];
            if (typeof (tag) !== "undefined") {
                isTag = true;
                tag = String(tag);
                tag.split(",").reduce((tags, tag) => {
                    let existTag = this._languagesDataByTags.get(tag);
                    if (existTag) {
                        tags.push(existTag);
                    }
                    return tags;
                }, tags);
                if (tags.length === 0) {
                    return JSON.stringify(result);
                }
            }

            //collect all languages
            const allLang = [];
            const iterator = map[Symbol.iterator]();
            for (const [key, value] of iterator) {
                const difference = Object.keys(value["langs"]).filter(x => !allLang.includes(x));
                allLang.push(...difference);
            }

            //write header
            ["key", ...allLang].forEach((el) => {
                resultData.push([
                    [el]
                ]);
                width++;
            });
            height++;

            //write data
            const iterator2 = map[Symbol.iterator]();
            for (const [key, value] of iterator2) {
                if (!isTag || (isTag && value["tags"].some((tag) => { return tags.includes(tag); }))) {
                    let widthIndex = 0;
                    resultData[widthIndex].push([key]);
                    widthIndex++;
                    for (const lang of allLang) {
                        const langVal = value["langs"][lang];
                        if (langVal) {
                            resultData[widthIndex].push([langVal]);
                        } else {
                            resultData[widthIndex].push([""]);
                        }
                        widthIndex++;
                    }
                    height++;
                }
            }
            result["size"] = [width, height, depth];
            result["data"] = resultData;

            return JSON.stringify(result);
        }

        _ParamAnalyze(text) {
            const scheme = "default";
            if (typeof (this._paramSchemes[scheme]) === "undefined") return {};
            const startCharEscape = this._paramSchemes[scheme].startEscape;
            const startCharEscapeLength = startCharEscape.length;
            const startChar = this._paramSchemes[scheme].start;
            const startCharLength = startChar.length;
            const endCharEscape = this._paramSchemes[scheme].endEscape;
            const endCharEscapeLength = endCharEscape.length;
            const endChar = this._paramSchemes[scheme].end;
            const endCharLength = endChar.length;

            const paramsObj = {};

            const textLength = text.length;
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
                        if (typeof (paramsObj[param]) === "undefined") {
                            paramsObj[param] = [];
                        }
                        paramsObj[param].push({
                            "startIndex": startIndex,
                            "endIndex": j
                        });
                        j += endCharLength;
                        startIndex = -1;
                        endIndex = j;
                    } else {
                        j++;
                    }
                }
            }
            return paramsObj;
        }
        _RegExpEscape(text) {
            return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
        }

        _BehaviorUpdate() {
            this._behaviorList.forEach((value) => {
                let text;
                let lang = value._lang;
                if (!lang) lang = this._currentLanguage;
                let langObj = this._languagesDataByKeys.get(value._key);
                if (!langObj || !langObj["langs"][lang]) {
                    text = "";
                } else {
                    text = langObj["langs"][lang];
                }
                value._SetText(text);
            });
        }
    };
    C3.Plugins.RobotKaposzta_TextManager.Instance = TextManagerRuntimeInstance;

    //Behavior interface
    C3.Plugins.RobotKaposzta_TextManager.Behavior = {
        GetText(key, lang) {
            if (!lang) lang = PLUGIN._currentLanguage;
            let langObj = PLUGIN._languagesDataByKeys.get(key);
            if (!langObj || !langObj["langs"][lang]) {
                return "";
            }
            return langObj["langs"][lang];
        },
        AddListener(obj) {
            PLUGIN._behaviorList.add(obj);
        },
        RemoveListener(obj) {
            PLUGIN._behaviorList.delete(obj);
        }
    }
};