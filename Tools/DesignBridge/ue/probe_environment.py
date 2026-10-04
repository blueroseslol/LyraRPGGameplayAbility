"""Read-only UE Python capability probe for DesignBridge (no content mutation)."""
import json
import unreal

report = {"engine": unreal.SystemLibrary.get_engine_version(), "classes": {}}
for name in ["WidgetBlueprintFactory", "WidgetBlueprint", "WidgetTree", "CanvasPanel", "Image", "TextBlock", "BlueprintEditorLibrary", "EditorAssetLibrary", "EditorLoadingAndSavingUtils", "AssetImportTask", "TextureFactory", "FontFactory", "AutomationLibrary"]:
    cls = getattr(unreal, name, None)
    report["classes"][name] = cls is not None
report["python_ready"] = True
try:
    blueprint = unreal.new_object(unreal.WidgetBlueprint)
    tree = unreal.new_object(unreal.WidgetTree, outer=blueprint)
    blueprint.set_editor_property("widget_tree", tree)
    root = unreal.new_object(unreal.CanvasPanel, outer=tree)
    tree.set_editor_property("root_widget", root)
    child = unreal.new_object(unreal.Image, outer=tree)
    slot = root.add_child_to_canvas(child)
    slot.set_position(unreal.Vector2D(10, 20))
    slot.set_size(unreal.Vector2D(100, 60))
    report["transient_widget_tree"] = root.get_children_count() == 1
except Exception as error:
    report["transient_widget_tree"] = str(error)
print("DESIGNBRIDGE_PROBE=" + json.dumps(report, sort_keys=True))
