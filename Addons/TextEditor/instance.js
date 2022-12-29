"use strict";
{
    const SDK = self.SDK;

    /**
     * @external IWorldInstanceBase
     * @desc The IWorldInstanceBase interface is used as the base class for instances in the SDK for "world" type plugins. It derives from IInstanceBase.
     * @see https://www.construct.net/en/make-games/manuals/addon-sdk/reference/base-classes/iworldinstancebase
     */
    /**
     * @external IWebGLRenderer
     * @desc The IWebGLRenderer interface provides methods for rendering to the Layout View, which is rendered using a WebGL canvas. The interface's methods provide high-level drawing commands implemented by Construct, so you don't need to handle low-level concerns like vertex buffers.
     * @see https://www.construct.net/en/make-games/manuals/addon-sdk/reference/graphics-interfaces/iwebglrenderer
     */
    /**
     * @external IDrawParams
     * @desc The IDrawParams interface provides additional parameters to a Draw() call in the SDK.
     * @see https://www.construct.net/en/make-games/manuals/addon-sdk/reference/graphics-interfaces/idrawparams
     */
    /**
     * @external ILayoutView 
     * @desc The ILayoutView interface provides access to a Layout View from the SDK. Note that this interface represents the editor view; the ILayout interface provides the interface to the actual layout in the project model.
     * @see https://www.construct.net/en/make-games/manuals/addon-sdk/reference/ui-interfaces/ilayoutview
     */
    /**
     * @external IWebGLText
     * @desc The IWebGLText interface manages text wrapping, drawing text to a canvas, and then uploading the result to a WebGL texture. This makes it easy to display text in a WebGL renderer. It is created via the IWebGLRenderer CreateWebGLText() method.
     * @see https://www.construct.net/en/make-games/manuals/addon-sdk/reference/graphics-interfaces/iwebgltext
     */
    /**
     * @classdesc TextEditor instance class in editor.
     * @extends external:IInstanceBase
     */
    class TextEditorEditorInstance extends SDK.IWorldInstanceBase {
        
        

        /**
         * @desc Create editor instance.
         * @param {object} sdkType - Reference to the associated SDK type class.
         * @param {object} inst - Reference to the IObjectInstance interface, or IWorldInstance interface for "world" type plugins, representing this instance in the editor. This allows access to Construct's built-in features for instances.
         */
        constructor(sdkType, inst) {
            super(sdkType, inst);

            /**
             * @public
             * @property {Object.<external:IWebGLText>} _webglText - Text display object.
             */
            this._webglText = null;
        }

        /**
         * @override
         * @desc Called when release the plugin and method free the memory before destruction.
         */
        Release() {
            // Release the WebGL text if it was created
            if (this._webglText) {
                this._webglText.Release();
                this._webglText = null;
            }
            super.Release();
        }
        /**
         * @override
         * @desc Called when create plugin in editor.
         */
        OnCreate() {
            // Default to top-left origin
            this._inst.SetOrigin(0, 0);
        }
        /**
         * @override
         * @desc Called when create plugin placed on layout editor.
         */
        OnPlacedInLayout() {
            // Set default size
            this._inst.SetSize(300, 200);
        }


        /**
         * @desc Called when Construct wants the instance to draw itself in the Layout View.
         * @param {Object.<external:IWebGLRenderer>} iRenderer - The renderer interface used for issuing draw commands.
         * @param {Object.<external:IDrawParams>} iDrawParams - Providing additional information to the draw call.
         */
        Draw(iRenderer, iDrawParams) {
            const iLayoutView = iDrawParams.GetLayoutView();
            this._UpdateWebGLText(iRenderer, iLayoutView);

            iRenderer.SetColorFillMode();

            // Draw grey fill and black outline for button background
            const quad = this._inst.GetQuad();
            iRenderer.SetColorRgba(0.9, 0.9, 0.9, 1);
            iRenderer.Quad(quad);

            iRenderer.SetColorRgba(0, 0, 0, 1);
            iRenderer.LineQuad(quad);

            // Draw button text on top
            const texture = this._webglText.GetTexture();
            if (!texture) {
                return; // not yet loaded WebGLText - just ignore and skip rendering text, it'll appear momentarily
            }

            iRenderer.SetTextureFillMode();
            iRenderer.SetTexture(texture);
            iRenderer.ResetColor();
            iRenderer.Quad3(quad, this._webglText.GetTexRect());
        }


        /**
         * @desc Update the visible text.
         * @param {Object.<external:IWebGLRenderer>} iRenderer - The renderer interface used for issuing draw commands.
         * @param {Object.<external:ILayoutView>} ILayoutView  - Providing additional information about layout
         */
        _UpdateWebGLText(iRenderer, iLayoutView) {
            // lazy-create
            if (!this._webglText) {
                this._webglText = iRenderer.CreateWebGLText();
                this._webglText.SetColorRgb(0, 0, 0);
                this._webglText.SetFontSize(11);
                this._webglText.SetWordWrapMode("word");
                this._webglText.SetHorizontalAlignment("left");
                this._webglText.SetVerticalAlignment("top");
                this._webglText.SetTextureUpdateCallback(() => iLayoutView.Refresh());
            }

            const textZoom = iLayoutView.GetZoomFactor();
            this._webglText.SetSize(this._inst.GetWidth(), this._inst.GetHeight(), textZoom);

            this._webglText.SetText(this._inst.GetPropertyValue("text"));
        }
    };

    SDK.Plugins.RobotKaposzta_TextEditor.Instance = TextEditorEditorInstance;
};