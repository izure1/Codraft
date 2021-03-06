import { Codraft, MacroDataTransfer } from "../../@typings/codraft";
export declare class CodraftRunner {
    private __events;
    private __conditions;
    private __actions;
    private __boxes;
    private __usedCommands;
    private __commandHashMap;
    private __isDebug;
    protected static CreateHashMap<T extends {
        id: string;
    }>(sources: T[]): Map<string, T>;
    protected static ParseVariables(command: Codraft.MacroCommand, variables: Record<string, string>, local: Record<string, any>, global: Record<string, any>): Record<string, any>;
    protected static ParseVariable(command: Codraft.MacroCommand, variables: Record<string, string>, key: string, local: Record<string, any>, global: Record<string, any>): any;
    protected static RunCommand(command: Codraft.MacroCommand, variables: Record<string, string>, dataTransfer: MacroDataTransfer): Promise<MacroDataTransfer>;
    protected static RunCommandAsync(command: Codraft.MacroCommand, variables: Record<string, string>, dataTransfer: MacroDataTransfer, resolve: (data: MacroDataTransfer) => void, reject: (reason?: Error) => void): void;
    protected static FindBox(boxes: Codraft.MacroBox[], id: string): Codraft.MacroBox | null;
    constructor(events: Codraft.MacroCommand[], conditions: Codraft.MacroCommand[], actions: Codraft.MacroCommand[], save: Codraft.SaveFormat, isDebug?: boolean);
    protected __runCommand(format: Codraft.MacroCommandSaveFormat, data: MacroDataTransfer): Promise<MacroDataTransfer>;
    protected __runCommandAsync(format: Codraft.MacroCommandSaveFormat, data: MacroDataTransfer, resolve: (data: MacroDataTransfer) => void, reject: (reason?: Error) => void): void;
    protected __runCommands(formats: Codraft.MacroCommandSaveFormat[], data: MacroDataTransfer): Promise<void>;
    protected __recursiveBox(box: Codraft.MacroBox, data: MacroDataTransfer): Promise<void>;
    protected __attachEvent(): void;
    init(): void;
    setDebugMode(isDebug: boolean): void;
}
