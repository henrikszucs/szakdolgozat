"use strict";
{
    const DOM_COMPONENT_ID = "robotkaposzta-texteditor";

    const StopPropagation = function(e) {
        e.stopPropagation();
    };

    /**
     * @external Quill
     * @desc HTML based text editor library.
     * @see https://quilljs.com/docs/api/
     */
    /**
     * @external DOMElementHandler
     * @desc The DOMElementHandler interface is used as a base class for DOM handlers in the DOM-side script (typically domSide.js). See DOM calls in the C3 runtime for more information.
     * @see https://www.construct.net/en/make-games/manuals/addon-sdk/runtime-reference/base-classes/domelementhandler
     */
    /**
     * @classdesc TextManager editor class.
     * @extends external:DOMElementHandler
     */
    class TextEditorRuntimeDOMElementHandler extends self.DOMElementHandler {
        /**
         * @desc Create class.
         * @param {object} iRuntime - The instance object that gives to the parent's constructor.
         */
        constructor(iRuntime) {
            super(iRuntime, DOM_COMPONENT_ID);

            /**
             * @public
             * @desc Quill editor object.
             * @type {Object.<external:Quill>}
             */
            this._editor = null;
        }
        
        
        /**
         * @desc Called when runtime want create DOM element.
         * @param {number} elementId - The element id that identify the instance.
         * @param {object} e - Optional create data.
         * @returns {Object.<Element>} DOM element to create.
         */
        CreateElement(elementId, e) {
            const elem = document.createElement("div");
            const elem2 = document.createElement("div");
            elem.appendChild(elem2);
            const elem3 = document.createElement("div");
            elem2.appendChild(elem3);

            elem.style.position = "absolute";

            elem2.style.height = "inherit";
            elem2.style.width = "inherit";
            elem2.style.display = "table";
            elem2.style.borderCollapse = "collapse";
            elem2.style.color = "black";

            this._editor = new self["Quill"](elem3, {
                "modules": {
                    "toolbar": [
                        [{
                            "header": [1, 2, 3, 4, 5, 6, false]
                        }], //set size
                        [{
                            "color": []
                        }, {
                            "background": []
                        }], //set color
                        [{
                            "align": []
                        }], //set align
                        ["bold", "italic", "underline", "strike"], //toggled formats
                        ["blockquote", "image", "code-block"], //embed content
                        [{
                            "list": "ordered"
                        }, {
                            "list": "bullet"
                        }], //set list
                        [{
                            "script": "sub"
                        }, {
                            "script": "super"
                        }], // superscript/subscript
                        [{
                            "indent": "-1"
                        }, {
                            "indent": "+1"
                        }], // outdent/indent
                        [{
                            "direction": "rtl"
                        }] // text direction
                    ]
                },
                "theme": "snow"
            });
            elem2["children"]["item"](0).style.display = "table-row";
            elem2["children"]["item"](1).style.display = "table-row";

            this._editor.on("text-change", () => {
                this._OnTextChanged(elementId);
            });

            // Prevent touches reaching the canvas
            elem.addEventListener("touchstart", StopPropagation);
            elem.addEventListener("touchmove", StopPropagation);
            elem.addEventListener("touchend", StopPropagation);

            // Prevent clicks being blocked
            elem.addEventListener("mousedown", StopPropagation);
            elem.addEventListener("mouseup", StopPropagation);

            // Prevent key presses being blocked by the Keyboard object
            elem.addEventListener("keydown", StopPropagation);
            elem.addEventListener("keyup", StopPropagation);

            this.UpdateState(elem, e);

            return elem;
        }

        /**
         * @desc Called when runtime want update DOM element state.
         * @param {number} elem - The instance element.
         * @param {object} e - Update data.
         */
        UpdateState(elem, e) {
            this._editor["setText"](e["t"]);
            this._editor["root"]["innerHTML"] = e["te"];
            this._editor["root"]["dataset"]["placeholder"] = e["p"];
            elem["children"]["item"](0)["children"]["item"](1)["title"] = e["to"];
            this._editor["enable"](!e["r"]);
        }

        /**
         * @desc Called when user changeddd the text.
         * @param {number} elementId - The element id that identify the instance.
         */
        _OnTextChanged(elementId) {
            this.PostToRuntimeElement("text-changed", elementId, {
                "t": this._editor["getText"](),
                "te": this._editor["root"]["innerHTML"]
            });
        }
    };
    self.RuntimeInterface.AddDOMHandlerClass(TextEditorRuntimeDOMElementHandler);
}