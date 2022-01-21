/* eslint-disable no-unused-vars */
type VariableItem<T> = {
  preview: string
  value: T
}
type SupportedVariableType = string|number|boolean
interface RawVariable {
  type: 'string'|'number'|'radio',
  default_value: SupportedVariableType
}
interface StringVariable extends RawVariable {
  type: 'string'
  default_value: string
}
interface NumberVariable extends RawVariable {
  type: 'number'
  default_value: number
}
interface AdvancedVariable<T extends SupportedVariableType> extends RawVariable {
  type: 'radio'
  default_value: T
  items: VariableItem<T>[]
}
interface RadioVariable extends AdvancedVariable<SupportedVariableType> {
  type: 'radio'
  default_value: string
  items: VariableItem<string>[]
}

type MacroVariable = StringVariable|NumberVariable|RadioVariable
type MacroDataTransfer = { event: any, local: Record<string, any>, global: any }
type Resolve = (data: MacroDataTransfer) => void
type Reject = (reason?: Error) => void
type Fn = (this: Record<string, any>, data: MacroDataTransfer, next: Resolve, stop: Reject) => Resolve|Reject
declare interface Point2 {
  x: number
  y: number
}

declare interface Range {
  a: Point2
  b: Point2
}

declare namespace Codraft {
  type MacroCommand = {
    id: string
    version: string
    url: string
    author: string
    group: string
    title: string
    description: string
    variables: {
      [key: string]: MacroVariable
    },
    fn: Fn
  }

  type MacroCommandSaveFormat = {
    id: string
    command_id: string
    variables: Record<string, SupportedVariableType>
  }

  type MacroBox = {
    id: string
    next_box_ids: string[]
    comment: string
    events: MacroCommandSaveFormat[]
    conditions: MacroCommandSaveFormat[]
    actions: MacroCommandSaveFormat[]
    x: number
    y: number
  }

  type SaveFormat = {
    used_commands: Record<string, string>
    boxes: MacroBox[]
  }
}