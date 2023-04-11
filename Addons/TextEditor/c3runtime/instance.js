"use strict";
{
    const C3 = self.C3;
    const DOM_COMPONENT_ID = "robotkaposzta-texteditor";
    const CSS_DEPEMDENCY = ".ql-clipboard p,blockquote,h1,h2,h3,h4,h5,h6,ol,p,pre,ul{margin:0;padding:0}blockquote,h1,h2,h3,h4,h5,h6,ol,ol li,p,pre,ul{counter-reset:list-1 list-2 list-3 list-4 list-5 list-6 list-7 list-8 list-9}.ql-container{box-sizing:border-box;font-family:Helvetica,Arial,sans-serif;font-size:13px;height:100%;margin:0;position:relative}.ql-container.ql-disabled .ql-tooltip{visibility:hidden}.ql-container.ql-disabled ul[data-checked]>li::before,ul[data-checked=false],ul[data-checked=true]{pointer-events:none}.ql-clipboard{left:-100000px;height:1px;overflow-y:hidden;position:absolute;top:50%}ol,ol li:not(.ql-direction-rtl),ul,ul li:not(.ql-direction-rtl){padding-left:1.5em}ol>li,ul>li{list-style-type:none}ul>li::before{content:'\\2022'}ul[data-checked=false]>li *,ul[data-checked=true]>li *{pointer-events:all}ul[data-checked=false]>li::before,ul[data-checked=true]>li::before{color:#777;cursor:pointer;pointer-events:all}ul[data-checked=true]>li::before{content:'\\2611'}ul[data-checked=false]>li::before{content:'\\2610'}li::before{display:inline-block;white-space:nowrap;width:1.2em}li:not(.ql-direction-rtl)::before{margin-left:-1.5em;margin-right:.3em;text-align:right}li.ql-direction-rtl::before{margin-left:.3em;margin-right:-1.5em}ol li.ql-direction-rtl,ul li.ql-direction-rtl{padding-right:1.5em}ol li{counter-increment:list-0}ol li:before{content:counter(list-0,decimal) '. '}ol li.ql-indent-1{counter-increment:list-1;counter-reset:list-2 list-3 list-4 list-5 list-6 list-7 list-8 list-9}ol li.ql-indent-1:before{content:counter(list-1,lower-alpha) '. '}ol li.ql-indent-2{counter-increment:list-2;counter-reset:list-3 list-4 list-5 list-6 list-7 list-8 list-9}ol li.ql-indent-2:before{content:counter(list-2,lower-roman) '. '}ol li.ql-indent-3{counter-increment:list-3;counter-reset:list-4 list-5 list-6 list-7 list-8 list-9}ol li.ql-indent-3:before{content:counter(list-3,decimal) '. '}ol li.ql-indent-4{counter-increment:list-4;counter-reset:list-5 list-6 list-7 list-8 list-9}ol li.ql-indent-4:before{content:counter(list-4,lower-alpha) '. '}ol li.ql-indent-5{counter-increment:list-5;counter-reset:list-6 list-7 list-8 list-9}ol li.ql-indent-5:before{content:counter(list-5,lower-roman) '. '}ol li.ql-indent-6{counter-increment:list-6;counter-reset:list-7 list-8 list-9}ol li.ql-indent-6:before{content:counter(list-6,decimal) '. '}ol li.ql-indent-7{counter-increment:list-7;counter-reset:list-8 list-9}ol li.ql-indent-7:before{content:counter(list-7,lower-alpha) '. '}ol li.ql-indent-8{counter-increment:list-8;counter-reset:list-9}ol li.ql-indent-8:before{content:counter(list-8,lower-roman) '. '}ol li.ql-indent-9{counter-increment:list-9}ol li.ql-indent-9:before{content:counter(list-9,decimal) '. '}.ql-indent-1:not(.ql-direction-rtl){padding-left:3em}li.ql-indent-1:not(.ql-direction-rtl){padding-left:4.5em}.ql-indent-1.ql-direction-rtl.ql-align-right{padding-right:3em}li.ql-indent-1.ql-direction-rtl.ql-align-right{padding-right:4.5em}.ql-indent-2:not(.ql-direction-rtl){padding-left:6em}li.ql-indent-2:not(.ql-direction-rtl){padding-left:7.5em}.ql-indent-2.ql-direction-rtl.ql-align-right{padding-right:6em}li.ql-indent-2.ql-direction-rtl.ql-align-right{padding-right:7.5em}.ql-indent-3:not(.ql-direction-rtl){padding-left:9em}li.ql-indent-3:not(.ql-direction-rtl){padding-left:10.5em}.ql-indent-3.ql-direction-rtl.ql-align-right{padding-right:9em}li.ql-indent-3.ql-direction-rtl.ql-align-right{padding-right:10.5em}.ql-indent-4:not(.ql-direction-rtl){padding-left:12em}li.ql-indent-4:not(.ql-direction-rtl){padding-left:13.5em}.ql-indent-4.ql-direction-rtl.ql-align-right{padding-right:12em}li.ql-indent-4.ql-direction-rtl.ql-align-right{padding-right:13.5em}.ql-indent-5:not(.ql-direction-rtl){padding-left:15em}li.ql-indent-5:not(.ql-direction-rtl){padding-left:16.5em}.ql-indent-5.ql-direction-rtl.ql-align-right{padding-right:15em}li.ql-indent-5.ql-direction-rtl.ql-align-right{padding-right:16.5em}.ql-indent-6:not(.ql-direction-rtl){padding-left:18em}li.ql-indent-6:not(.ql-direction-rtl){padding-left:19.5em}.ql-indent-6.ql-direction-rtl.ql-align-right{padding-right:18em}li.ql-indent-6.ql-direction-rtl.ql-align-right{padding-right:19.5em}.ql-indent-7:not(.ql-direction-rtl){padding-left:21em}li.ql-indent-7:not(.ql-direction-rtl){padding-left:22.5em}.ql-indent-7.ql-direction-rtl.ql-align-right{padding-right:21em}li.ql-indent-7.ql-direction-rtl.ql-align-right{padding-right:22.5em}.ql-indent-8:not(.ql-direction-rtl){padding-left:24em}li.ql-indent-8:not(.ql-direction-rtl){padding-left:25.5em}.ql-indent-8.ql-direction-rtl.ql-align-right{padding-right:24em}li.ql-indent-8.ql-direction-rtl.ql-align-right{padding-right:25.5em}.ql-indent-9:not(.ql-direction-rtl){padding-left:27em}li.ql-indent-9:not(.ql-direction-rtl){padding-left:28.5em}.ql-indent-9.ql-direction-rtl.ql-align-right{padding-right:27em}li.ql-indent-9.ql-direction-rtl.ql-align-right{padding-right:28.5em}.ql-video{display:block;max-width:100%}.ql-video.ql-align-center{margin:0 auto}.ql-video.ql-align-right{margin:0 0 0 auto}.ql-bg-black{background-color:#000}.ql-bg-red{background-color:#e60000}.ql-bg-orange{background-color:#f90}.ql-bg-yellow{background-color:#ff0}.ql-bg-green{background-color:#008a00}.ql-bg-blue{background-color:#06c}.ql-bg-purple{background-color:#93f}.ql-color-white{color:#fff}.ql-color-red{color:#e60000}.ql-color-orange{color:#f90}.ql-color-yellow{color:#ff0}.ql-color-green{color:#008a00}.ql-color-blue{color:#06c}.ql-color-purple{color:#93f}.ql-font-serif{font-family:Georgia,Times New Roman,serif}.ql-font-monospace{font-family:Monaco,Courier New,monospace}.ql-size-small{font-size:.75em}.ql-size-large{font-size:1.5em}.ql-size-huge{font-size:2.5em}.ql-direction-rtl{direction:rtl;text-align:inherit}.ql-align-center{text-align:center}.ql-align-justify{text-align:justify}.ql-align-right{text-align:right}.ql-blank::before{color:rgba(0,0,0,.6);content:attr(data-placeholder);font-style:italic;left:15px;pointer-events:none;position:absolute;right:15px}"

    /**
     * @external SDKDOMInstanceBase
     * @desc The SDKDOMInstanceBase interface is used as the base class for runtime instances that create a DOM element. It derives from SDKWorldInstanceBase.
     * @see https://www.construct.net/en/make-games/manuals/addon-sdk/runtime-reference/base-classes/sdkdominstancebase
     */
    /**
     * @classdesc TextManager editor class.
     * @extends external:SDKDOMInstanceBase
     */
    class TextEditorRuntimeInstance extends C3.SDKDOMInstanceBase {
        /**
         * @desc Create class.
         * @param {object} inst - The instance object that gives to the parent's constructor.
         * @param {Array.<string|number|boolean>} properties - the initial parameters in array
         */
        constructor(inst, properties) {
            super(inst, DOM_COMPONENT_ID);

            /**
             * @public
             * @desc Plain text
             * @type {string}
             */
            this._text = "";
            /**
             * @public
             * @desc HTML text
             * @type {string}
             */
            this._textHTML = "";
            /**
             * @public
             * @desc Placeholder text
             * @type {string}
             */
            this._placeholder = "";
            /**
             * @public
             * @desc Tooltip text
             * @type {string}
             */
            this._tooltip = "";
            /**
             * @public
             * @desc Read-only mode boolean
             * @type {boolean}
             */
            this._isReadOnly = false;
            /**
             * @public
             * @desc Visibility mode boolean
             * @type {boolean}
             */
            this._isVisible = true;

            if (properties) {
                if (properties[0] !== "") {
                    this._text = properties[0];
                    this._textHTML = properties[0];
                } else {
                    this._text = this._RemoveHTML(properties[1]);
                    this._textHTML = properties[1];
                }
                this._placeholder = properties[2];
                this._tooltip = properties[3];
                this._isReadOnly = properties[4];
                this._isVisible = properties[5];
            }

            this.CreateElement();
        }
        /**
         * @override
         * @desc Handle release.
         * @returns {object} save state in object
         */
        Release() {
            super.Release();
        }
        /**
         * @desc Draw WebGL data. Not used.
         * @param {object} renderer - the instance object that gives to the parent's constructor
         */
        Draw(renderer) {
            return;
        }


        /**
         * @desc Returns the instance save state in object.
         * @returns {object} save state object
         */
        SaveToJson() {
            return {
                "t": this._text,
                "te": this._textHTML,
                "p": this._placeholder,
                "to": this._tooltip,
                "r": this._isReadOnly,
                "v": this._isVisible
            };
        }
        /**
         * @desc Load the instance state from save object.
         * @param {object} entries - save state to load
         */
        LoadFromJson(o) {
            // load state for savegames
            this._text = o["t"];
            this._textHTML = o["te"];
            this._placeholder = o["p"];
            this._tooltip = o["to"];
            this._isReadOnly = o["r"];
            this._isVisible = o["v"];

            this.UpdateElementState();
        }
        /**
         * @desc Returns the instance state in object for debugging.
         * @returns {object} debugger object
         */
        GetDebuggerProperties() {
            const prefix = "plugins.robotkaposzta_texteditor.debugger";
            return [{
                title: prefix + ".title",
                properties: [{
                        "name": prefix + ".text",
                        "value": this._text,
                        "onedit": (v) => {
                            this._SetText(v)
                        }
                    },
                    {
                        "name": prefix + ".text-html",
                        "value": this._textHTML,
                        "onedit": (v) => {
                            this._SetTextHTML(v)
                        }
                    },
                    {
                        "name": prefix + ".placeholder",
                        "value": this._placeholder,
                        "onedit": (v) => {
                            this._SetPlaceholder(v)
                        }
                    },
                    {
                        "name": prefix + ".tooltip",
                        "value": this._tooltip,
                        "onedit": (v) => {
                            this._SetTooltip(v)
                        }
                    },
                    {
                        "name": prefix + ".read-only",
                        "value": this._isReadOnly,
                        "onedit": (v) => {
                            this._SetReadOnly(v)
                        }
                    },
                    {
                        "name": prefix + ".visible",
                        "value": this._isVisible,
                        "onedit": (v) => {
                            this._SetVisible(v)
                        }
                    }
                ]
            }];
        }
        /**
         * @desc Returns the instance state for DOM element.
         * @returns {object} state object
         */
        GetElementState() {
            this._worldInfo.SetVisible(this._isVisible);
            return {
                "t": this._text,
                "te": this._textHTML,
                "p": this._placeholder,
                "to": this._tooltip,
                "r": this._isReadOnly
            };
        }


        /**
         * @desc Remove HTML tags from text.
         * @param {string} text - text to remove HTML tags
         * @returns {string} text without HTML tags
         */
        _RemoveHTML(str) {
            return str.replace(/<[^>]*>/ig, "");
        }


        /**
         * @desc Called when user change text data.
         * @param {string} text - plain text from field
         * @param {string} textHTML - HTML text from field
         */
        _OnTextChange(text, textHTML) {
            this._text = text;
            this._textHTML = textHTML;
            this.Trigger(C3.Plugins.RobotKaposzta_TextEditor.Cnds.OnTextChanged);
        }


        /**
         * @desc Set field's plain text.
         * @param {string} text - plain text to set
         */
        _SetText(text) {
            if (this._text === text) {
                return;
            }

            this._text = text;
            this._textHTML = text;
            this.UpdateElementState();
        }
        /**
         * @desc Return field's HTML text.
         * @returns {string} field's plain text
         */
        _GetText() {
            return this._text;
        }
        /**
         * @desc Set field's HTML text.
         * @param {string} textHTML - HTML text to set
         */
        _SetTextHTML(textHTML) {
            if (this._textHTML === textHTML) {
                return;
            }

            this._text = this._RemoveHTML(textHTML);
            this._textHTML = textHTML;
            this.UpdateElementState();
        }
        /**
         * @desc Return field's HTML text.
         * @returns {string} field's HTML text
         */
        _GetTextHTML() {
            return this._textHTML;
        }
        /**
         * @desc Set field's placeholder.
         * @param {string} placeholder - placeholder to set
         */
        _SetPlaceholder(placeholder) {
            if (this._placeholder === placeholder) {
                return;
            }

            this._placeholder = placeholder;
            this.UpdateElementState();
        }
        /**
         * @desc Return field's placeholder.
         * @returns {string} field's placeholder
         */
        _GetPlaceholder() {
            return this._placeholder;
        }
        /**
         * @desc Set field's tooltip.
         * @param {string} tooltip - tooltip to set
         */
        _SetTooltip(tooltip) {
            if (this._tooltip === tooltip) {
                return;
            }

            this._tooltip = tooltip;
            this.UpdateElementState();
        }
        /**
         * @desc Return field's tooltip.
         * @returns {string} field's tooltip
         */
        _GetTooltip() {
            return this._tooltip;
        }
        /**
         * @desc Set field's read-only mode.
         * @param {boolean} isReadOnly - read-only mode to set. True is on.
         */
        _SetReadOnly(isReadOnly) {
            if (this._isReadOnly === isReadOnly) {
                return;
            }

            this._isReadOnly = isReadOnly;
            this.UpdateElementState();
        }
        /**
         * @desc Return field's read-only mode.
         * @returns {boolean} read-only mode
         */
        _GetReadOnly() {
            return this._isReadOnly;
        }
        /**
         * @desc Set field's visibility.
         * @param {boolean} isVisible - visibility to set. True is on.
         */
        _SetVisible(isVisible) {
            if (this._isVisible === isVisible) {
                return;
            }

            this._isVisible = isVisible;
            this.UpdateElementState();
        }
        /**
         * @desc Return field's visibility.
         * @returns {boolean} visible mode
         */
        _GetVisible() {
            return this._isVisible;
        }
        /**
         * @desc Return CSS dependency in string between HTML style tags.
         * @returns {string} CSS dependency
         */
        _GetCSSDependency() {
            return CSS_DEPEMDENCY;
        }
    };
    C3.Plugins.RobotKaposzta_TextEditor.Instance = TextEditorRuntimeInstance;
};