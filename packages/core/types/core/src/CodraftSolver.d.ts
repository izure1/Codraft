import { Codraft, RawVariable, SupportedVariableType } from "../../@typings/codraft";
export declare class CodraftSolver {
    static SolveString(v: string): string;
    static SolveNumber(v: string): number;
    static SolveBoolean(v: string): boolean;
    static SolveDynamic(v: string): any;
    static readonly VariableSolver: {
        string: (v: string) => string;
        number: (v: string) => number;
        boolean: (v: string) => boolean;
        dynamic: (v: string) => any;
    };
    static GetVariableType(command: Codraft.MacroCommand, key: string): RawVariable<SupportedVariableType>['type'] | null;
    static GetVariableSolver(type: ReturnType<typeof CodraftSolver.GetVariableType>): ((v: string) => any) | null;
}
