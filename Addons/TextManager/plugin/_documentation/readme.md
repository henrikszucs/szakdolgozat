## TextManager plugin developer documentation

This plugin provides internationalization functions for Construct 3 projects.
Main functions:
 - Detect/Manages languages 
 - Load translation
 - Insert dynamic parameters

## Main sections
### Editor
Following files will run in the editor:
 - .\plugin.json
 - .\type.json
 - .\instance.json

The following constnant files will not explain in the documentation:
 - .\addon.json - Static plugin metadata. [read more](https://www.construct.net/en/make-games/manuals/addon-sdk/guide/addon-metadata)
 - .\aces.json - Defining the Actions, Conditions and Expressions (ACEs). [read more](https://www.construct.net/en/make-games/manuals/addon-sdk/guide/defining-aces)
 - .\lang\en-US.json - Language file for plugin's editor elements. [read more](https://www.construct.net/en/make-games/manuals/addon-sdk/guide/language-file)
 - .\icon.svg - plugin's icon

### Runtime
Following files will run in the exported program:
 - .\actions.js
 - .\conditions.json
 - .\expressions.json
 - .\plugin.json
 - .\type.json
 - .\instance.json
 - .\domSide.json