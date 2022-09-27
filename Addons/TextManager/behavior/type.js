"use strict";
{
	const SDK = self.SDK;

	const BEHAVIOR_CLASS = SDK.Behaviors.RobotKaposzta_TextManagerBehavior;

	BEHAVIOR_CLASS.Type = class TextManagerBehaviorType extends SDK.IBehaviorTypeBase
	{
		constructor(sdkPlugin, iBehaviorType)
		{
			super(sdkPlugin, iBehaviorType);
		}
	};
}