"use strict";
{
	const SDK = self.SDK;

	/**
	 * @external IInstanceBase
	 * @desc The IInstanceBase interface is used as the base class for instances in the SDK. For "world" type plugins, instances instead derive from IWorldInstanceBase, which itself derives from IInstanceBase.
	 * @see https://www.construct.net/en/make-games/manuals/addon-sdk/reference/base-classes/iinstancebase
	 */
	/**
	 * @classdesc TextManager editor instance class.
	 * @extends external:IInstanceBase
	 */
	class TextManagerEditorInstance extends SDK.IInstanceBase {
		/**
		 * @desc Create class.
		 * @param {object} sdkType - Reference to the associated SDK type class.
		 * @param {object} inst - Reference to the IObjectInstance interface, or IWorldInstance interface for "world" type plugins, representing this instance in the editor. This allows access to Construct's built-in features for instances.
		 */
		constructor(sdkType, inst) {
			super(sdkType, inst);

			/**
			 * @property {Array.<string>} _availableLanguages - Available languages' code (ISO 639-1 and ISO 3166-1 alpha-2 code with hyphen separated eg. hu-HU) in string array.
			 */
			this._availableLanguages = ["en-US"];
			/**
			 * @property {string} _currentLanguage - The project's main language's (ISO 639-1 and ISO 3166-1 alpha-2 code with hyphen separated eg. hu-HU) code.
			 */
			this._currentLanguage = "en-US";
		}

		/**
		 * @override
		 * @desc Plugin's property change handler.
		 * @param {string} id - The id of the propery field.
		 * @param {string} value - The current value of the propery field.
		 */
		OnPropertyChanged(id, value) {
			if (id === "all-language") {
				const data = value.split(new RegExp("(?:\n|,|;| )+", "g"));
				if (data[0] === "") data.shift();
				if (data[data.length - 1] === "") data.pop();
				if (data.length === 0) data.push("en-US");
				this._availableLanguages = data;
				this.GetInstance().SetPropertyValue("all-language", this._availableLanguages.join("\n"));

				const find = this._availableLanguages.find((el) => el === this._currentLanguage);
				if (!find) {
					const regex = new RegExp("^(en)", "gi");
					const find2 = this._availableLanguages.find((el) => regex.test(el));
					if (!find2) {
						this._currentLanguage = this._availableLanguages[0];
					} else {
						this._currentLanguage = find2;
					}
					this.GetInstance().SetPropertyValue("default-language", this._currentLanguage);
				}
				return;
			}
			if (id === "default-language") {
				const find = this._availableLanguages.find((el) => el === value);
				if (!find) {
					const regex = new RegExp("^(" + value + ")", "gi");
					const find2 = this._availableLanguages.find((el) => regex.test(el));
					if (!find2) {
						this.GetInstance().SetPropertyValue("default-language", this._currentLanguage);
					} else {
						this._currentLanguage = find2;
						this.GetInstance().SetPropertyValue("default-language", this._currentLanguage);
					}
				} else {
					this._currentLanguage = value;
				}
				return;
			}
		}

		/**
		 * @desc Start conversion.
		 * @return {undefined}
		 */
		_Convert() {
			let data;
			const inputFormat = this.GetInstance().GetPropertyValue("convert-input-format");
			const inputSource = this.GetInstance().GetPropertyValue("convert-input-source");
			const inputLanguage = this.GetInstance().GetPropertyValue("convert-input-language");
			const outputFormat = this.GetInstance().GetPropertyValue("convert-output-format");

			if (inputFormat === "json-single") {
				try {
					data = JSON.parse(inputSource);
				} catch (error) {
					console.warn("Error convert: " + error);
				}
				data = this._LoadJSONSimple(data, inputLanguage);
			} else if (inputFormat === "json-multiple") {
				try {
					data = JSON.parse(inputSource);
				} catch (error) {
					console.warn("Error convert: " + error);
				}
				data = this._LoadJSONMultiple(data);
			} else if (inputFormat === "csv") {
				data = this._LoadCSV(inputSource);
			} else if (inputFormat === "dictionary") {
				try {
					data = JSON.parse(inputSource);
				} catch (error) {
					console.warn("Error convert: " + error);
				}
				data = this._LoadDictionary(data, inputLanguage);
			} else if (inputFormat === "array") {
				try {
					data = JSON.parse(inputSource);
				} catch (error) {
					console.warn("Error convert: " + error);
				}
				data = this._LoadArray(data);
			}

			let outStr;
			if (outputFormat === "json-single") {
				outStr = this._ExportJSONSimple(data, inputLanguage);
			} else if (outputFormat === "json-multiple") {
				outStr = this._ExportJSONMultiple(data);
			} else if (outputFormat === "csv") {
				outStr = this._ExportCSV(data);
			} else if (outputFormat === "dictionary") {
				outStr = this._ExportDictionary(data, inputLanguage);
			} else if (outputFormat === "array") {
				outStr = this._ExportArray(data);
			}
			this.GetInstance().SetPropertyValue("convert-output-source", outStr);
		}

		/**
		 * @desc Convert Simple JSON to language Map.
		 * @param {object} obj - Single JSON object to convert.
		 * @param {string} lang - The object's language.
		 * @return {object} Language map
		 */
		_LoadJSONSimple(obj, lang) {
            const JSONSimpleParser = (obj, lang, result, path="") => {
                if (typeof obj === "string" || typeof obj === "number" || typeof obj === "boolean") {
                    const value = {};
                    value[lang] = String(obj);
                    result.set(path, value);
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
                    JSONSimpleParser(obj[key], lang, result, newPath);
                });
            };
            const result = new Map();
            if (!lang) {
                return result;
            }
            JSONSimpleParser(obj, lang, result);
            return result;
        }
		/**
		 * @desc Convert Multiple JSON to language Map.
		 * @param {object} obj - Multiple JSON object to convert.
		 * @return {object} Language map
		 */
        _LoadJSONMultiple(obj) {
            const result = new Map();
            const JSONMultipleParser = (obj, result, path="") => {
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
                    const exists = result.get(path);
                    if (exists) {
                        values = {...exists, ...values };
                    }
                    result.set(path, values);
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
                    JSONMultipleParser(obj[key], result, newPath);
                });
            };
            JSONMultipleParser(obj, result);
            return result;
        }
		/**
		 * @desc Convert CSV data to language Map.
		 * @param {string} str - The CSV data in string.
		 * @return {object} Language map
		 */
        _LoadCSV(str) {
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
                return result;
            }

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
                    const exists = result.get(lastKey);
                    if (exists) {
                        lastResult = {...exists, ...lastResult };
                    }
                    result.set(lastKey, lastResult);
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
                const exists = result.get(lastKey);
                if (exists) {
                    lastResult = {...exists, ...lastResult };
                }
                result.set(lastKey, lastResult);
            }
            return result;
        }
		/**
		 * @desc Convert Construct 3 dictionary JSON to language Map.
		 * @param {object} obj - The Construct 3 dictionary JSON object to convert.
		 * @param {string} lang - The object's language.
		 * @return {object} Language map
		 */
        _LoadDictionary(obj, lang) {
            const result = new Map();
            if (!obj["data"] || !lang) {
                return result;
            }
            const iterator = Object.entries(obj["data"]);
            for (const [key, value] of iterator) {
                const data = {};
                data[lang] = value;
                result.set(key, data);
            }
            return result;
        }
		/**
		 * @desc Convert Construct 3 array JSON to language Map.
		 * @param {object} obj - The Construct 3 array JSON object to convert.
		 * @return {object} Language map
		 */
        _LoadArray(obj) {
            const result = new Map();
            if (!obj["data"] || typeof (obj["data"]) !== "object" || typeof (obj["data"][0]) !== "object" || typeof (obj["data"][0][0]) !== "object") {
                return result;
            }
            const data = obj["data"];
            const width = data.length;
            const height = data[0].length;
            const depth = data[0][0].length;
            let widthIndex = 0;
            let heightIndex = 0;
            let depthIndex = 0;
            //Sheet
            while(depthIndex < depth) {
                heightIndex = 0;

                //First row
                widthIndex = 0;
                let headers = [];
                while(widthIndex < width) {
                    headers.push(data[widthIndex][heightIndex][depthIndex]);
                    widthIndex++;
                }
                heightIndex++;

                //Parse rows
                while(heightIndex < height) {
                    let langKey;
                    let langData = {};
                    langKey = data[0][heightIndex][depthIndex];
                    widthIndex = 1;
                    while(widthIndex < width) {
                        const currData = data[widthIndex][heightIndex][depthIndex];
                        if (currData !==  "") {
                            langData[headers[widthIndex]] = currData;
                        }
                        widthIndex++;
                    }
                    const exists = result.get(langKey);
                    if (exists) {
                        langData = {...exists, ...langData };
                    }
                    result.set(langKey, langData);
                    heightIndex++;
                }
                depthIndex++;
            }
            return result;
        }

		/**
		 * @desc Export language map to Simple JSON format.
		 * @param {object} map - Language map to convert.
		 * @param {string} lang - The language that select during conversion.
		 * @return {string} language data in Simple JSON string format
		 */
		_ExportJSONSimple(map, lang) {
			const result = {};
			const iterator = map[Symbol.iterator]();
			for (const [key, value] of iterator) {
				const data = value[lang];
				if (data) {
					const path = key.split('.');
					const pathLength = path.length;
					path.reduce(function(previous, current, currentIndex) {
						if (currentIndex >= pathLength - 1) {
							if (data) {
								return previous[current] = data;
							} else {
								return previous[current] = "";
							}
						} else if (typeof(previous[current]) !== "object") {
							return previous[current] = {};
						} else {
							return previous[current];
						}
					}, result);
				}
			}
			return JSON.stringify(result);
		}
		/**
		 * @desc Export language map to Multiple JSON format.
		 * @param {object} map - Language map to convert.
		 * @return {string} language data in Multiple JSON string format
		 */
		_ExportJSONMultiple(map) {
			const result = {};
			const iterator = map[Symbol.iterator]();
			for (const [key, value] of iterator) {
				const path = key.split('.');
				const pathLength = path.length;
				path.reduce(function(previous, current, currentIndex) {
					if (currentIndex >= pathLength - 1) {
						return previous[current] = value;
					} else if (typeof(previous[current]) !== "object") {
						return previous[current] = {};
					} else {
						return previous[current];
					}
				}, result);
			}
			return JSON.stringify(result);
		}
		/**
		 * @desc Export data from language map to CSV format.
		 * @param {object} map - Language map to convert.
		 * @return {string} language data in CSV string format
		 */
		_ExportCSV(map) {
			let result = "";

			//collect all languages
			const allLang = [];
			const iterator = map[Symbol.iterator]();
			for (const [key, value] of iterator) {
				const difference = Object.keys(value).filter(x => !allLang.includes(x));
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
				const data = [];
				data.push(key);
				for (const lang of allLang) {
					const langVal = value[lang];
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
			return result;
		}
		/**
		 * @desc Export data from language map to Construct 3 dictionary format.
		 * @param {object} map - Language map to convert.
		 * @param {string} lang - The language that select during conversion.
		 * @return {string} language data in Construct 3 dictionary JSON string format
		 */
		_ExportDictionary(map, lang) {
			const resultData = {};
			const iterator = map[Symbol.iterator]();
			for (const [key, value] of iterator) {
				const data = value[lang];
				if (data) {
					resultData[key] = data;
				} else {
					resultData[key] = "";
				}
			}
			const result = {
				"c2dictionary": true,
				"data": resultData
			};
			return JSON.stringify(result);
		}
		/**
		 * @desc Export data from language map to Construct 3 array format.
		 * @param {object} map - Language map to convert.
		 * @return {string} language data in Construct 3 array JSON string format
		 */
		_ExportArray(map) {
			const resultData = [];
			let width = 0;
			let height = 0;
			let depth = 1;

			//collect all languages
			const allLang = [];
			const iterator = map[Symbol.iterator]();
			for (const [key, value] of iterator) {
				const difference = Object.keys(value).filter(x => !allLang.includes(x));
				allLang.push(...difference);
			}

			//write header
			["key", ...allLang].forEach((el) => {
				resultData.push([[el]]);
				width++;
			});
			height++;

			//write data
			const iterator2 = map[Symbol.iterator]();
			for (const [key, value] of iterator2) {
				let widthIndex = 0;
				resultData[widthIndex].push([key]);
				widthIndex++;
				for (const lang of allLang) {
					const langVal = value[lang];
					if (langVal) {
						resultData[widthIndex].push([langVal]);
					} else {
						resultData[widthIndex].push([""]);
					}
					widthIndex++;
				}
				height++;
			}

			const result = {
				"c2array": true,
				"size": [width, height, depth],
				"data": resultData
			};
			return JSON.stringify(result);
		}
	};

	SDK.Plugins.RobotKaposzta_TextManager.Instance = TextManagerEditorInstance;
};