"use strict";
{
    const C3 = self.C3;
    /**
     * @namespace
    */
    C3.Plugins.RobotKaposzta_TextManager.Acts = {
        /**
         * Set the main language if exist.
         * @param {string} lang - language identifier string
         */
        SetLanguage(lang) {
            const find = this._availableLanguages.find((el) => el === lang);
            if (find) {
                this._currentLanguage = lang;
                this.PostToDOM("change-lang", {
                    "lang": lang
                });
                this._BehaviorUpdate();
                this.Trigger(C3.Plugins.RobotKaposzta_TextManager.Cnds.OnLanguageChange);
            }
        },
        /**
         * Add a language to list.
         * @param {string} lang - language identifier string
         * @param {number} index - index of the new language
         */
        AddLanguage(lang, index) {
            if (lang === "") return;
            const find = this._availableLanguages.find((el) => el === lang);
            if (!find) this._availableLanguages.splice(index, 0, lang);
        },
        /**
         * Remove a language from list.
         * @param {string} lang - language identifier string
         */
        RemoveLanguage(lang) {
            if (lang === "") return;
            if (this._currentLanguage === lang) return;
            const index = this._availableLanguages.indexOf(lang);
            if (index !== -1) {
                this._availableLanguages.splice(index, 1);
            }
        },

        /**
         * Load language data from string data.
         * @param {number} format - input format in integer: 0 - json simple, 1 - json multiple, 2 - csv, 3 - dictionary , 4 - arra 
         * @param {string} lang - language identifier string
         * @param {string} data - input data in string
         * @param {string} tag - the loaded data identifier string
         */
        LoadLanguageData(format, lang, data, tag) {
            const success = this._Load(data, format, lang, tag);
            if (success) {
                this._lastDataTag = tag;
                this._lastDataError = "";
                this.Trigger(C3.Plugins.RobotKaposzta_TextManager.Cnds.OnDataLoad);
            } else {
                this._lastDataTag = tag;
                this._lastDataError = "InvalidData";
                this.Trigger(C3.Plugins.RobotKaposzta_TextManager.OnDataLoadError);
            }
        },
        /**
         * Load language data from file.
         * @param {number} format - input format in integer: 0 - json simple, 1 - json multiple, 2 - csv, 3 - dictionary , 4 - arra 
         * @param {string} lang - language identifier string
         * @param {string} url - the path of the data file
         * @param {string} tag - the loaded data identifier string
         */
        async LoadLanguageFile(format, lang, url, tag) {
            let success = true;
            try {
                await this._LoadFile(url, format, lang, tag);
            } catch (error) {
                success = false;
            }
            if (success) {
                this._lastDataTag = tag;
                this._lastDataError = "";
                this.Trigger(C3.Plugins.RobotKaposzta_TextManager.Cnds.OnDataLoad);
            } else {
                this._lastDataTag = tag;
                this._lastDataError = "InvalidData";
                this.Trigger(C3.Plugins.RobotKaposzta_TextManager.Cnds.OnDataLoadError);
            }
        },
        /**
         * Unload language data from memory by load tag name.
         * @param {number} mode - unload mode, 0 - delete other language data, 1 - only delete selected language
         * @param {string} tag - the load tag name to delete
         * @param {string} lang - language identifier string, empty for select all language
         */
        UnloadLanguageByTag(mode, tag, lang) {
            this._UnloadByTag(mode, tag, lang);
        },
        /**
         * Unload language data from memory by key name.
         * @param {string} key - the key name of the translation.
         * @param {string} lang - language identifier string, empty for select all language
         */
        UnloadLanguageByKey(key, lang) {
            this._UnloadByKey(key, lang);
        }
    };
};