"""Import only a validated DesignBridge package; run through run-ue.ps1."""
import hashlib
import json
import os
from pathlib import Path
import re
import time
import unreal

package = Path(os.environ["DESIGNBRIDGE_PACKAGE"]).resolve(strict=True)
document = json.loads((package / "runtime.json").read_text(encoding="utf-8"))
assert document["schemaVersion"] == 1
assert not any(d["severity"] == "error" for d in document["diagnostics"])
library = unreal.DesignBridgeEditorLibrary
assets = unreal.AssetToolsHelpers.get_asset_tools()
report = {"ok": False, "runId": os.environ.get("DESIGNBRIDGE_RUN_ID"), "engine": unreal.SystemLibrary.get_engine_version(), "source": document["source"], "assets": [], "nodes": len(document["nodes"])}

def source_file(asset):
    filename = (package / asset["path"]).resolve(strict=True)
    filename.relative_to(package)
    assert hashlib.sha256(filename.read_bytes()).hexdigest() == asset["sha256"], "Source resource hash changed"
    return filename

def import_file(filename, destination, name):
    task = unreal.AssetImportTask()
    task.set_editor_property("filename", str(filename))
    task.set_editor_property("destination_path", destination)
    task.set_editor_property("destination_name", name)
    task.set_editor_property("automated", True)
    task.set_editor_property("replace_existing", False)
    task.set_editor_property("save", False)
    assets.import_asset_tasks([task])
    paths = task.get_editor_property("imported_object_paths")
    assert paths, "UE did not import " + str(filename)
    value = unreal.load_asset(destination + "/" + name)
    assert value, "UE did not create the requested asset name"
    return value

try:
    for asset in document["assets"]:
        filename = source_file(asset)
        object_path = asset["uePath"]
        assert re.fullmatch(r"/Game/DesignBridge/[A-Za-z0-9_/]+\.[A-Za-z0-9_]+", object_path), "Unsafe UE output path"
        asset_path = object_path.split(".")[0]
        destination, name = asset_path.rsplit("/", 1)
        value = unreal.load_asset(asset_path) if unreal.EditorAssetLibrary.does_asset_exist(asset_path) else None
        if asset["kind"] == "image":
            if value is None:
                value = import_file(filename, destination, name)
            assert isinstance(value, unreal.Texture2D), "Expected Texture2D"
            # Set compression first: Normalmap PostEditChange forces SRGB off.
            value.set_editor_property("compression_settings", unreal.TextureCompressionSettings.TC_EDITOR_ICON)
            value.set_editor_property("srgb", True)
            value.set_editor_property("mip_gen_settings", unreal.TextureMipGenSettings.TMGS_NO_MIPMAPS)
            value.set_editor_property("lod_group", unreal.TextureGroup.TEXTUREGROUP_UI)
            value.set_editor_property("never_stream", True)
            assert value.get_editor_property("srgb"), "UI texture was still interpreted as a normal map"
            assert unreal.EditorAssetLibrary.save_loaded_asset(value, only_if_is_dirty=False)
        elif asset["kind"] == "font":
            face_name = "FF_" + asset["sha256"][:24]
            face_path = destination + "/" + face_name
            face = unreal.load_asset(face_path) if unreal.EditorAssetLibrary.does_asset_exist(face_path) else import_file(filename, destination, face_name)
            assert isinstance(face, unreal.FontFace), "Expected FontFace"
            assert unreal.EditorAssetLibrary.save_loaded_asset(face, only_if_is_dirty=False)
            styles = {n["text"].get("fontStyle", "Regular") for n in document["nodes"] if n.get("text", {}).get("fontAssetId") == asset["id"]}
            assert len(styles) <= 1, "One font resource must have one explicit typeface in v1"
            result = library.create_font_asset(face, asset_path, next(iter(styles), "Regular"))
            assert result == object_path, "Font asset creation failed"
        report["assets"].append({"id": asset["id"], "sha256": asset["sha256"], "uePath": object_path})
    # A stable dedicated asset per design. No unrelated UMG assets are overwritten.
    blueprint_path = "/Game/DesignBridge/Widgets/WBP_" + document["id"]
    result = library.build_widget_blueprint(str(package / "runtime.json"), blueprint_path)
    assert result, "Widget Blueprint generation/compilation failed"
    report["blueprint"] = result
    report["blueprintCompiled"] = True
    if os.environ.get("DESIGNBRIDGE_CAPTURE", "1") == "1":
        png = package / "ue-umg.png"
        assert library.capture_blueprint(result, str(png), int(document["canvas"]["width"]), int(document["canvas"]["height"])), "UE offscreen capture failed"
        report["screenshot"] = str(png)
        report["widgetTree"] = json.loads(library.inspect_blueprint(result))
    report["ok"] = True
finally:
    (package / "ue-import-report.json").write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")
    print("DESIGNBRIDGE_IMPORT=" + json.dumps(report, ensure_ascii=False))
    # Allow editor end-of-frame and deferred render cleanup before requesting exit.
    exit_after = time.monotonic() + 3
    def finish_editor(_delta):
        if time.monotonic() >= exit_after:
            unreal.unregister_slate_post_tick_callback(exit_handle)
            unreal.SystemLibrary.quit_editor()
    exit_handle = unreal.register_slate_post_tick_callback(finish_editor)
