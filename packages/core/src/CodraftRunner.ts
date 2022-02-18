import { Codraft, MacroDataTransfer, SupportedVariableType } from '@typings/codraft'
import { CodraftSolver } from './CodraftSolver'

export class CodraftRunner {
  private __events: Codraft.MacroCommand[]
  private __conditions: Codraft.MacroCommand[]
  private __actions: Codraft.MacroCommand[]
  private __boxes: Codraft.MacroBox[]
  private __usedCommands: Record<string, string>
  private __commandHashMap: Map<string, Codraft.MacroCommand>
  private __isDebug: boolean

  protected static CreateHashMap<T extends { id: string }>(sources: T[]): Map<string, T> {
    const map = new Map<string, T>()
    sources.forEach((source) => map.set(source.id, source))
    return map
  }

  protected static ParseVariables(command: Codraft.MacroCommand, variables: Record<string, string>, local: Record<string, any>, global: Record<string, any>): Record<string, any> {
    const clone: Record<string, any> = {}
    for (const key in variables) {
      clone[key] = CodraftRunner.ParseVariable(command, variables, key, local, global)
    }
    return clone
  }

  protected static ParseVariable(command: Codraft.MacroCommand, variables: Record<string, string>, key: string, local: Record<string, any>, global: Record<string, any>): any {
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
    
    const type = CodraftSolver.GetVariableType(command, key)
    const solver = CodraftSolver.GetVariableSolver(type)
    if (!solver) {
      throw new Error(`The unknown '${type}' type.`)
    }

    return solver(equation)
  }

  protected static RunCommand(command: Codraft.MacroCommand, variables: Record<string, string>, dataTransfer: MacroDataTransfer): Promise<MacroDataTransfer> {
    return new Promise<MacroDataTransfer>((resolve, reject) => {
      const parsedVars = CodraftRunner.ParseVariables(command, variables, dataTransfer.local, dataTransfer.global)
      command.fn.call(parsedVars, dataTransfer, resolve, reject)
    })
  }
  
  protected static RunCommandAsync(command: Codraft.MacroCommand, variables: Record<string, string>, dataTransfer: MacroDataTransfer, resolve: (data: MacroDataTransfer) => void, reject: (reason?: Error) => void): void {
    const parsedVars = CodraftRunner.ParseVariables(command, variables, dataTransfer.local, dataTransfer.global)
    command.fn.call(parsedVars, dataTransfer, resolve, reject)
  }

  protected static FindBox(boxes: Codraft.MacroBox[], id: string): Codraft.MacroBox|null {
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

  protected async __runCommand(format: Codraft.MacroCommandSaveFormat, data: MacroDataTransfer): Promise<MacroDataTransfer> {
    const { command_id, variables } = format
    const command = this.__commandHashMap.get(command_id) ?? null
    if (command !== null) {
      return await CodraftRunner.RunCommand(command, variables, data)
    }
    else {
      throw new Error(`The '${command_id}' command not exists.`)
    }
  }

  protected __runCommandAsync(format: Codraft.MacroCommandSaveFormat, data: MacroDataTransfer, resolve: (data: MacroDataTransfer) => void, reject: (reason?: Error) => void): void {
    const { command_id, variables } = format
    const command = this.__commandHashMap.get(command_id) ?? null
    if (command !== null) {
      CodraftRunner.RunCommandAsync(command, variables, data, resolve, reject)
    }
    else {
      throw new Error(`The '${command_id}' command not exists.`)
    }
  }

  protected __runCommands(formats: Codraft.MacroCommandSaveFormat[], data: MacroDataTransfer): Promise<void> {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve, reject) => {
      for (const format of formats) {
        try {
          await this.__runCommand(format, data)
        } catch (reason) {
          const debugging = { format, data, reason }
          reject(debugging)
          return
        }
      }
      resolve()
    })
  }

  protected async __recursiveBox(box: Codraft.MacroBox, data: MacroDataTransfer): Promise<void> {
    const nextBoxes = box.next_box_ids
      .filter((id) => CodraftRunner.FindBox(this.__boxes, id))
      .map((id) => CodraftRunner.FindBox(this.__boxes, id)!)

    try {
      await this.__runCommands(box.conditions, data)
      await this.__runCommands(box.actions, data)
      nextBoxes.forEach((nextBox) => this.__recursiveBox(nextBox, data))
    } catch (debugging) {
      if (this.__isDebug) {
        console.error(debugging)
      }
    }
  }

  protected __attachEvent(): void {
    this.__boxes.forEach((box) => {
      box.events.forEach((event) => {
        const runner = (data: MacroDataTransfer) => this.__recursiveBox(box, data)
        const catcher = (reason?: Error) => console.error(reason)
        const stream = { event: null, local: {}, global: globalThis }
        this.__runCommandAsync(event, stream, runner, catcher)
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