let editor = new Quill("#editor", {
	"modules": {
		"toolbar": [
			[{ "header": [1, 2, 3, 4, 5, 6, false] }],		//set size
			[{ "color": [] }, { "background": [] }],     	//set color
			[{ "align": [] }],								//set align
			["bold", "italic", "underline", "strike"],  	//toggled formats
			["blockquote", "image", "code-block"],			//embed content
			[{ "list": "ordered"}, { "list": "bullet" }],	//set list
			[{ "script": "sub"}, { "script": "super" }],	// superscript/subscript
			[{ "indent": "-1"}, { "indent": "+1" }],		// outdent/indent
			[{ "direction": "rtl" }]                 		// text direction
		]
	},
	"theme": "snow"
});
document.getElementById("getText").addEventListener("click", () => {
	let plainText = document.getElementById("plainText");
	plainText.value = editor.getText();
	
	let htmlText = document.getElementById("htmlText");
	htmlText.value = editor.root.innerHTML;
});


const elem = document.createElement("div");
            elem.style.position = "absolute";
			let editor2 = new Quill(elem, {
				"modules": {
					"toolbar": [
						[{ "header": [1, 2, 3, 4, 5, 6, false] }],		//set size
						[{ "color": [] }, { "background": [] }],     	//set color
						[{ "align": [] }],								//set align
						["bold", "italic", "underline", "strike"],  	//toggled formats
						["blockquote", "image", "code-block"],			//embed content
						[{ "list": "ordered"}, { "list": "bullet" }],	//set list
						[{ "script": "sub"}, { "script": "super" }],	// superscript/subscript
						[{ "indent": "-1"}, { "indent": "+1" }],		// outdent/indent
						[{ "direction": "rtl" }]                 		// text direction
					]
				},
				"theme": "snow"
			});
			console.log(elem);