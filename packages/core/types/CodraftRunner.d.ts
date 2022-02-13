import { Codraft, MacroDataTransfer, SupportedVariableType } from '@typings/codraft'

export abstract class CodraftRunner {
  protected static CreateHashMap<T extends { id: string }>(sources: T[]): Map<string, T>

  protected static ParseVariables(command: Codraft.MacroCommand, variables: Record<string, string>, local: Record<string, SupportedVariableType>, global: Record<string, SupportedVariableType>): Record<string, SupportedVariableType>

  protected static ParseVariable(command: Codraft.MacroCommand, variables: Record<string, string>, key: string, local: Record<string, SupportedVariableType>, global: Record<string, SupportedVariableType>): SupportedVariableType

  protected static RunCommand(command: Codraft.MacroCommand, variables: Record<string, string>, dataTransfer: MacroDataTransfer): Promise<MacroDataTransfer>
  
  protected static RunCommandAsync(command: Codraft.MacroCommand, variables: Record<string, string>, dataTransfer: MacroDataTransfer, resolve: (data: MacroDataTransfer) => void, reject: (reason?: Error) => void): void

  protected static FindBox(boxes: Codraft.MacroBox[], id: string): Codraft.MacroBox|null

  constructor(events: Codraft.MacroCommand[], conditions: Codraft.MacroCommand[], actions: Codraft.MacroCommand[], save: Codraft.SaveFormat, isDebug = false) 

  protected async __runCommand(format: Codraft.MacroCommandSaveFormat, data: MacroDataTransfer): Promise<MacroDataTransfer>

  protected __runCommandAsync(format: Codraft.MacroCommandSaveFormat, data: MacroDataTransfer, resolve: (data: MacroDataTransfer) => void, reject: (reason?: Error) => void): void

  protected __runCommands(formats: Codraft.MacroCommandSaveFormat[], data: MacroDataTransfer): Promise<void>

  protected __recursiveBox(box: Codraft.MacroBox, data: MacroDataTransfer): void

  protected __attachEvent(): void

  init(): void

  setDebugMode(isDebug: boolean): void
}