export declare type VariableItem<T> = {
    preview: string;
    value: T;
};
export declare type SupportedVariableType = string | number | boolean;
export declare interface RawVariable<T> {
    type: 'string' | 'number' | 'boolean' | 'dynamic';
    default_value: T;
    items?: VariableItem<T>[];
}
export declare interface StringVariable extends RawVariable<string> {
    type: 'string';
    default_value: string;
}
export declare interface NumberVariable extends RawVariable<number> {
    type: 'number';
    default_value: number;
}
export declare interface BooleanVariable extends RawVariable<boolean> {
    type: 'boolean';
    default_value: boolean;
}
export declare interface DynamicVariable extends RawVariable<SupportedVariableType> {
    type: 'dynamic';
    default_value: SupportedVariableType;
}
export declare type MacroVariable = StringVariable | NumberVariable | BooleanVariable | DynamicVariable;
export declare type MacroDataTransfer = {
    event: any;
    local: Record<string, any>;
    global: any;
};
export declare type Resolve = (data: MacroDataTransfer) => void;
export declare type Reject = (reason?: Error) => void;
export declare type Fn = (this: Record<string, any>, data: MacroDataTransfer, next: Resolve, stop: Reject) => void;
export declare interface Point2 {
    x: number;
    y: number;
}
export declare interface Range {
    a: Point2;
    b: Point2;
}
export declare namespace Codraft {
    type MacroCommand = {
        id: string;
        version: string;
        url: string;
        author: string;
        group: string;
        title: string;
        description: string;
        variables: {
            [key: string]: MacroVariable;
        };
        fn: Fn;
    };
    type MacroCommandSaveFormat = {
        id: string;
        command_id: string;
        variables: Record<string, string>;
    };
    type MacroBox = {
        id: string;
        next_box_ids: string[];
        comment: string;
        events: MacroCommandSaveFormat[];
        conditions: MacroCommandSaveFormat[];
        actions: MacroCommandSaveFormat[];
        x: number;
        y: number;
    };
    type SaveFormat = {
        used_commands: Record<string, string>;
        boxes: MacroBox[];
    };
}
