"use strict";
{
    const C3 = self.C3;
    /** @namespace */
	C3.Plugins.RobotKaposzta_TextEditor.Exps = {
        /**
         * @desc Return the plain text of the field.
         * @returns {string} plain text of the field
         */
        Text() {
            return this._GetText();
        },
        /**
         * @desc Return the HTML text of the field.
         * @returns {string} HTML text of the field
         */
        TextHTML() {
            return this._GetTextHTML();
        },
        /**
         * @desc Return the placeholder of the field.
         * @returns {string} placeholder of the field
         */
        Placeholder() {
            return this._GetPlaceholder();
        },
        /**
         * @desc Return the tooltip of the field.
         * @returns {string} tooltip of the field
         */
        Tooltip() {
            return this._GetTooltip();
        },
        /**
         * @desc Return CSS dependecy with style tags.
         * @returns {string} CSS dependecy in string
         */
        CSSDependency() {
            return this._GetCSSDependency();
        }
	};
};

