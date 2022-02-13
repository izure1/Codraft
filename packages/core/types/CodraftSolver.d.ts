import { Codraft, RawVariable, SupportedVariableType } from '@typings/codraft'

export abstract class CodraftSolver {
  static SolveString(v: string): string

  static SolveNumber(v: string): number

  static SolveBoolean(v: string): boolean

  static SolveDynamic(v: string): SupportedVariableType

  static readonly VariableSolver = {
    'string': (v: string) => CodraftSolver.SolveString(v),
    'number': (v: string) => CodraftSolver.SolveNumber(v),
    'boolean': (v: string) => CodraftSolver.SolveBoolean(v),
    'dynamic': (v: string) => CodraftSolver.SolveDynamic(v)
  }

  static GetVariableType(command: Codraft.MacroCommand, key: string): RawVariable<SupportedVariableType>['type']|null

  static GetVariableSolver(type: ReturnType<typeof CodraftSolver.GetVariableType>): ((v: string) => SupportedVariableType)|null
}