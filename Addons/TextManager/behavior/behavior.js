"use strict";
{
	const SDK = self.SDK;

    const BEHAVIOR_ID = "RobotKaposzta_TextManagerBehavior";
	const BEHAVIOR_VERSION = "0.0.1.0";
	const BEHAVIOR_CATEGORY = "attributes"; 
    const BEHAVIOR_CLASS = SDK.Behaviors.RobotKaposzta_TextManagerBehavior = class TextManagerBehavior extends SDK.IBehaviorBase {
        constructor() {
            super(BEHAVIOR_ID);

            SDK.Lang.PushContext("behaviors." + BEHAVIOR_ID.toLowerCase()); 

            this._info.SetName(self.lang(".name"));
			this._info.SetDescription(self.lang(".description"));
			this._info.SetVersion(BEHAVIOR_VERSION);
			this._info.SetCategory(BEHAVIOR_CATEGORY);
			this._info.SetAuthor("Szűcs Henrik");
			this._info.SetHelpUrl(self.lang(".help-url"));
			this._info.SetIsOnlyOneAllowed(true); 

            SDK.Lang.PushContext(".properties");
            this._info.SetProperties([
                new SDK.PluginProperty("text", "key", {"initialValue": ""}),
                new SDK.PluginProperty("text", "lang", {"initialValue": ""}),
                new SDK.PluginProperty("check", "enabled", {"initialValue": "true"})
            ]);
            SDK.Lang.PopContext();

			SDK.Lang.PopContext();
        }
    };
    BEHAVIOR_CLASS.Register(BEHAVIOR_ID, BEHAVIOR_CLASS);
};