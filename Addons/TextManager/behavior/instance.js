"use strict";
{
	const SDK = self.SDK;

	const BEHAVIOR_CLASS = SDK.Behaviors.RobotKaposzta_TextManagerBehavior;
	
	BEHAVIOR_CLASS.Instance = class TextManagerBehaviorInstance extends SDK.IBehaviorInstanceBase
	{
		constructor(sdkBehType, behInst)
		{
			super(sdkBehType, behInst);
		}
		
		Release() {
			super.Release();
		}
		
		OnCreate() {
			
		}
		
		OnPropertyChanged(id, value) {
            
		}
		
		LoadC2Property(name, valueString) {
			return false;		// not handled
		}
	};
}