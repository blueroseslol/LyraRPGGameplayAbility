// Minimal editor entry; gameplay is started separately by LyraGameInstance.
const editor = require("cpp").EasyEditorPlugin;
let reactPreview;
editor.SetOnJsEnvPreReload(() => { if (reactPreview) reactPreview.dispose(); console.log("[EasyEditorMinimal] editor cleanup"); });
console.log("[EasyEditorMinimal] editor startup");
// Explicit verification runs only; no effect on normal editor/game startup.
if (require('process').env.DESIGNBRIDGE_VERIFY) require('Plugins/ReactUMG/TypeScript/ReactUMGTest/editor-verify').run();
if (require('process').env.DESIGNBRIDGE_REACT_PREVIEW) reactPreview = require('Plugins/ReactUMG/TypeScript/ReactUMGTest/react-preview').run();
