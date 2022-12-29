"use strict";
{
    const C3 = self.C3;
    /** @namespace */
    C3.Plugins.RobotKaposzta_TextEditor.Acts = {
        /**
         * @desc Set the text in the field.
		 * @param {number} type - type of the fiel text to compare. 0 plain text, 1 HTML text
		 * @param {string} text - text to set
         */
        SetText(type, text) {
            if (type === 0) {
                this._SetText(text);
            } else {
                this._SetTextHTML(text);
            }
        },
        /**
         * @desc Set the placeholder for the field.
		 * @param {string} placeholder - placeholder to set
         */
        SetPlaceholder(placeholder) {
            this._SetPlaceholder(placeholder);
        },
        /**
         * @desc Set the tooltip for the field.
		 * @param {string} tooltip - placeholder to set
         */
        SetTooltip(tooltip) {
            this._SetTooltip(tooltip);
        },
        /**
         * @desc Set the read-only mode for the field.
		 * @param {number} readOnlyMode - 0 enable read-only mode, 1 disable read-only mode
         */
        SetReadOnly(readOnlyMode) {
            this._SetReadOnly(readOnlyMode === 0);
        },
        /**
         * @desc Set the read-only mode for the field.
		 * @param {number} visibleMode - 0 visible, 1 hide, 2 toggle
         */
        SetVisible(visibleMode) {
            if (visibleMode === 2) {
                this._SetVisible(!this._GetVisible());
            } else  {
                this._SetVisible(visibleMode === 0);
            }
        }
	};
};
