declare module "cpp" {
    import * as UE from "ue"
    import * as cpp from "cpp"
    import {$Ref, $Nullable, cstring} from "puerts"

    abstract class EasyEditorPlugin {
        static SetOnJsEnvPreReload(p0: () => void) :void;
        static SetEval(p0: (p0:string) => void) :void;
        static AddConsoleCommand(p0: string, p1: string, p2: ()=>void) :number;
        static RemoveConsoleCommand(p0: number) :void;
    }

    abstract class FFloat16Color {
    }

    abstract class FPuertsEditorModule {
        static SetCmdCallback(p0: (p0:string, p1:string) => void) :void;
        static GetTypeScriptConfigPaths() :string;
        static GetTypeScriptCompilerPath() :string;
    }

    class FSlateIcon {
        constructor();
        constructor(p0: string, p1: string);
        constructor(p0: string, p1: string, p2: string);
    }

}
