"use strict";
{
    const C3 = self.C3;
	/** @namespace */
	C3.Plugins.RobotKaposzta_TextEditor.Cnds = {
		/**
         * @desc Called when user changed the text on the field.
         * @returns {boolean} always true
         */
		OnTextChanged() {
			return true;
		},
		/**
         * @desc Retrun true if field text equal with input text.
		 * @param {number} type - type of the fiel text to compare. 0 plain text, 1 HTML text
		 * @param {string} text - text to compare with field
		 * @param {number} mode - mode to compare. 0 case insensitive, 1 case sensitive
         * @returns {boolean} plain text of the field
         */
		CompareText(type, text, mode) {
			let selectedText;
			if (type === 0) {
				selectedText = this._GetText();
			} else {
				selectedText = this._GetTextHTML();
			}

			if (mode === 0) {
				selectedText = selectedText.toLowerCase();
				text = text.toLowerCase();
			}

			if (text === selectedText) {
				return true;
			}
			return false;
		},
		/**
         * @desc Return true if field is in read-only mode else false.
         * @returns {boolean}
         */
		IsReadOnly() {
			return this._GetReadOnly();
		},
		/**
         * @desc Return true if field is visible else false.
         * @returns {boolean}
         */
		IsVisible() {
			return this._GetVisible();
		}
	};
};