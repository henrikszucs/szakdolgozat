"use strict";
{
	const SDK = self.SDK;

	const PLUGIN_CLASS = SDK.Plugins.RobotKaposzta_Clipboard;

	PLUGIN_CLASS.Instance = class ClipboardInstance extends SDK.IInstanceBase {
		constructor(sdkType, inst) {
			super(sdkType, inst);
		}

		Release() {

		}

		OnCreate() {

		}

		OnPropertyChanged(id, value) {
			
		}

		LoadC2Property(name, valueString) {
			return false; // not handled
		}
	};
};