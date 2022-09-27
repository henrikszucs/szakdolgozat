"use strict";
{
    const C3 = self.C3;
    C3.Plugins.RobotKaposzta_TextManager.Acts = {
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
        AddLanguage(lang, index) {
            if (lang === "") return;
            const find = this._availableLanguages.find((el) => el === lang);
            if (!find) this._availableLanguages.splice(index, 0, lang);
        },
        RemoveLanguage(lang) {
            if (lang === "") return;
            if (this._currentLanguage === lang) return;
            const index = this._availableLanguages.indexOf(lang);
            if (index !== -1) {
                this._availableLanguages.splice(index, 1);
            }
        },

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
        UnloadLanguageByTag(mode, tag, lang) {
            this._UnloadByTag(mode, tag, lang);
        },
        UnloadLanguageByKey(key, lang) {
            this._UnloadByKey(key, lang);
        }
    };
};