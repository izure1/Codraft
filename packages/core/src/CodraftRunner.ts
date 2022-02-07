import { Codraft, MacroDataTransfer, RawVariable, SupportedVariableType } from '@typings/codraft'
import Mexp from 'math-expression-evaluator'

export class CodraftRunner {
  private __events: Codraft.MacroCommand[]
  private __conditions: Codraft.MacroCommand[]
  private __actions: Codraft.MacroCommand[]
  private __boxes: Codraft.MacroBox[]
  private __usedCommands: Record<string, string>
  private __commandHashMap: Map<string, Codraft.MacroCommand>
  private __isDebug: boolean

  private static CreateHashMap<T extends { id: string }>(sources: T[]): Map<string, T> {
    const map = new Map<string, T>()
    sources.forEach((source) => map.set(source.id, source))
    return map
  }

  private static GetVariableType(command: Codraft.MacroCommand, key: string): RawVariable<SupportedVariableType>['type']|null {
    if (key in command.variables) {
      return command.variables[key].type
    }
    return null
  }

  private static ParseVariables(command: Codraft.MacroCommand, variables: Record<string, string>, local: Record<string, SupportedVariableType>, global: Record<string, SupportedVariableType>): Record<string, SupportedVariableType> {
    const clone: Record<string, SupportedVariableType> = {}
    for (const key in variables) {
      clone[key] = CodraftRunner.ParseVariable(command, variables, key, local, global)
    }
    return clone
  }

  private static ParseVariable(command: Codraft.MacroCommand, variables: Record<string, string>, key: string, local: Record<string, SupportedVariableType>, global: Record<string, SupportedVariableType>): SupportedVariableType {
    const local_regexp = /{{2}\s*(.*?)\s*}{2}/gmi
    const global_regexp = /{{3}\s*(.*?)\s*}{3}/gmi

    const value = variables[key]
    const equation = value.replace(global_regexp, (matched, key) => {
      let raw: SupportedVariableType = matched
      if (key in global) raw = global[key]
      if (typeof raw !== 'string') {
        raw = JSON.stringify(raw)
      }
      return raw
    }).replace(local_regexp, (_matched, key) => {
      let raw = null
      if (key in local) raw = local[key]
      else if (key in global) raw = global[key]
      if (typeof raw !== 'string') {
        raw = JSON.stringify(raw)
      }
      return raw
    })
    
    let result
    console.log(command, key, CodraftRunner.GetVariableType(command, key))
    switch (CodraftRunner.GetVariableType(command, key)) {
      case 'number': {
        result = Mexp.eval(equation)
        break
      }
      case 'boolean': {
        result = equation.toLowerCase() === 'true'
        break
      }
      // is primitive type?
      case 'string':
      default: {
        result = equation
        break
      }
    }

    return result
  }

  private static RunCommand(command: Codraft.MacroCommand, variables: Record<string, string>, dataTransfer: Parameters<typeof command.fn>[0]): Promise<MacroDataTransfer> {
    return new Promise<MacroDataTransfer>((resolve, reject) => {
      const parsedVars = CodraftRunner.ParseVariables(command, variables, dataTransfer.local, dataTransfer.global)
      command.fn.call(parsedVars, dataTransfer, resolve, reject)
    })
  }
  
  private static RunCommandAsync(command: Codraft.MacroCommand, variables: Record<string, string>, dataTransfer: Parameters<typeof command.fn>[0], resolve: (data: MacroDataTransfer) => void, reject: (reason?: Error) => void): void {
    const parsedVars = CodraftRunner.ParseVariables(command, variables, dataTransfer.local, dataTransfer.global)
    command.fn.call(parsedVars, dataTransfer, resolve, reject)
  }

  private static FindBox(boxes: Codraft.MacroBox[], id: string): Codraft.MacroBox|null {
    return boxes.find((box) => box.id === id) ?? null
  }

  constructor(events: Codraft.MacroCommand[], conditions: Codraft.MacroCommand[], actions: Codraft.MacroCommand[], save: Codraft.SaveFormat, isDebug = false) {
    this.__events = events
    this.__conditions = conditions
    this.__actions = actions
    this.__boxes = save.boxes
    this.__usedCommands = save.used_commands
    this.__isDebug = isDebug

    this.__commandHashMap = CodraftRunner.CreateHashMap([...this.__events, ...this.__conditions, ...this.__actions])
  }

  private async __runCommand(format: Codraft.MacroCommandSaveFormat, data: MacroDataTransfer): Promise<MacroDataTransfer> {
    const { command_id, variables } = format
    const command = this.__commandHashMap.get(command_id) ?? null
    if (command !== null) {
      return await CodraftRunner.RunCommand(command, variables, data)
    }
    else {
      throw new Error(`The '${command_id}' command not exists.`)
    }
  }

  private __runCommandAsync(format: Codraft.MacroCommandSaveFormat, data: MacroDataTransfer, resolve: (data: MacroDataTransfer) => void, reject: (reason?: Error) => void): void {
    const { command_id, variables } = format
    const command = this.__commandHashMap.get(command_id) ?? null
    if (command !== null) {
      CodraftRunner.RunCommandAsync(command, variables, data, resolve, reject)
    }
    else {
      throw new Error(`The '${command_id}' command not exists.`)
    }
  }

  private __runCommands(formats: Codraft.MacroCommandSaveFormat[], data: MacroDataTransfer): Promise<void> {
    // eslint-disable-next-line no-async-promise-executor
    const promise = new Promise<void>(async (resolve, reject) => {
      let isFail = false
      for (const format of formats) {
        if (isFail) return
        else {
          await new Promise((next, stop) => this.__runCommand(format, data).then(next).catch(stop)).catch((reason) => {
            isFail = true
            const debugData = { format, data, reason }
            reject(debugData)
          })
        }
      }
      resolve()
    })

    promise.catch((debugData) => {
      if (this.__isDebug) {
        console.error(debugData)
      }
    })

    return promise
  }

  private __recursiveBox(box: Codraft.MacroBox, data: MacroDataTransfer): void {
    const nextBoxes = box.next_box_ids.filter((id) => CodraftRunner.FindBox(this.__boxes, id)).map((id) => CodraftRunner.FindBox(this.__boxes, id)!)
    this.__runCommands(box.conditions, data).then(() => this.__runCommands(box.actions, data)).then(() => {
      nextBoxes.forEach((nextBox) => this.__recursiveBox(nextBox, data))
    })
  }

  private __attachEvent(): void {
    this.__boxes.forEach((box) => {
      box.events.forEach((event) => {
        const runner = (data: MacroDataTransfer) => this.__recursiveBox(box, data)
        const catcher = (reason?: Error) => console.error(reason)
        this.__runCommandAsync(event, { event: null, local: {}, global: globalThis }, runner, catcher)
      })
    })
  }

  init(): void {
    this.__attachEvent()
  }

  setDebugMode(isDebug: boolean): void {
    this.__isDebug = isDebug
  }
}