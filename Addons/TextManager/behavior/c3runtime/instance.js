"use strict";
{
	// 5 UNDOCUMENTED feature
	const C3 = self.C3;

	let AddListener;
	let RemoveListener;
	let GetText;
	try {
		AddListener = C3.Plugins.RobotKaposzta_TextManager.Behavior.AddListener;
		RemoveListener = C3.Plugins.RobotKaposzta_TextManager.Behavior.RemoveListener;
		GetText = C3.Plugins.RobotKaposzta_TextManager.Behavior.GetText;
	} catch (error) {
		console.warn("Text Manager parent plugin not found.");
		AddListener = function () {};
		RemoveListener = function () {};
		GetText = function () {
			return "";
		};
	}

	C3.Behaviors.RobotKaposzta_TextManagerBehavior.Instance = class RobotKaposzta_TextManagerBehaviorInstance extends C3.SDKBehaviorInstanceBase {
		constructor(behInst, properties) {
			super(behInst);
			AddListener(this);

			this._key = "";
			this._lang = "";
			this._isEnable = true;
			if (properties) {
				if (typeof (properties[0]) === "string") {
					this._key = properties[0];
				}
				if (typeof (properties[1]) === "string") {
					this._lang = properties[1];
				}
				if (typeof (properties[2]) === "boolean") {
					this._isEnable = properties[2];
				}
			}

			this._type = 0; // 0 - not supported, 1 - text, 2 - spritefont, 3 - sprite, 4 - button, 5 - textinput
			this._lastText;
			const type = this.GetObjectInstance().GetPlugin().constructor;
			if (type === C3.Plugins.Text) {
				this._type = 1;
			} else if (type === C3.Plugins.Spritefont2) {
				this._type = 2;
			} else if (type === C3.Plugins.Sprite) {
				this._type = 3;
			} else if (type === C3.Plugins.Button) {
				this._type = 4;
			} else if (type === C3.Plugins.TextBox) {
				this._type = 5;
			}
			
		}
		PostCreate() {
			this._UpdateText();
		}

		Release() {
			RemoveListener(this);
			super.Release();
		}
		SaveToJson() {
			return {
				"key": this._key,
				"is-enable": this._isEnable
			};
		}
		LoadFromJson(o) {
			this._key = o["key"];
			this._isEnable = o["is-enable"];
		}
		GetDebuggerProperties() {
			const prefix = "behaviors.robotkaposzta_textmanagerbehavior.debugger";
			return [
				{
					"title": prefix + ".name",
					"properties": [
						{
							"name": prefix + ".key",
							"value": this._key,
							"onedit": v => this._SetKey(v)
						},
						{
							"name": prefix + ".lang",
							"value": this._lang,
							"onedit": v => this._SetLang(v)
						},
						{
							"name": prefix + ".is-enable",
							"value": this._isEnable,
							"onedit": v => this._SetEnabled(v)
						}
					]
				}
			];
		}

		_SetKey(key) {
			this._key = key;
			this._UpdateText();
		}
		_SetLang(lang) {
			this._lang = lang;
			this._UpdateText();
		}
		_SetEnabled(isEnable) {
			this._isEnable = isEnable;
			this._UpdateText();
		}
		_UpdateText() {
			if (this._isEnable) {
				this._SetText(GetText(this._key, this._lang));
			}
		}
		_SetText(text) {
			if (this._isEnable && this._lastText !== text) {
				this._lastText = text;
				if (this._type === 1) {
					this._inst.GetSdkInstance()._SetText(text);
				} else if (this._type === 2) {
					this._inst.GetSdkInstance()._SetText(text);
				} else if (this._type === 3) {
					this._inst.GetSdkInstance()._SetAnim(text, 0);
				} else if (this._type === 4) {
					this._inst.GetSdkInstance()._SetText(text);
				} else if (this._type === 5) {
					this._inst.GetSdkInstance()._SetPlaceholder(text);
				}
			}
		}
	};
};