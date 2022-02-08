import Mexp from 'math-expression-evaluator'

import { Codraft, RawVariable, SupportedVariableType } from '@typings/codraft'

export class CodraftSolver {
  static SolveString(v: string): string {
    return v
  }

  static SolveNumber(v: string): number {
    const equation = Mexp.eval(v)
    return Number(equation)
  }

  static SolveBoolean(v: string): boolean {
    const equation = Boolean(v)
    return equation === true
  }

  static SolveDynamic(v: string): SupportedVariableType {
    let result
    try {
      // check number type
      result = CodraftSolver.SolveNumber(v)
    } catch (reason) {
      try {
        // check parsable type (boolean)
        result = JSON.parse(v)
      } catch (reason) {
        result = v
      }
    }
    return result
  }

  static readonly VariableSolver = {
    'string': (v: string) => CodraftSolver.SolveString(v),
    'number': (v: string) => CodraftSolver.SolveNumber(v),
    'boolean': (v: string) => CodraftSolver.SolveBoolean(v),
    'dynamic': (v: string) => CodraftSolver.SolveDynamic(v)
  }

  static GetVariableType(command: Codraft.MacroCommand, key: string): RawVariable<SupportedVariableType>['type']|null {
    if (key in command.variables) {
      return command.variables[key].type
    }
    return null
  }

  static GetVariableSolver(type: ReturnType<typeof CodraftSolver.GetVariableType>): ((v: string) => SupportedVariableType)|null {
    if (type === null) {
      return null
    }
    return CodraftSolver.VariableSolver[type] ?? null
  }
}