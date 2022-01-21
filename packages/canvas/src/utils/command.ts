import { nanoid } from 'nanoid'
import { deepCopy } from './advancedObject'

export function isAdvancedType<T extends SupportedVariableType>(v: unknown): v is AdvancedVariable<T> {
  if (typeof v === 'string' || typeof v === 'number') {
    return false
  }
  return true
}

export function getMatchedCommand(commands: Codraft.MacroCommand[], commandID: string): Codraft.MacroCommand|null {
  return commands.find((command) => command.id === commandID) ?? null
}

export function getCommandVariableKeys(command: Codraft.MacroCommand): string[] {
  const regexp = /{{2}\s*(.*?)\s*}{2}/gmi
  const matched = command.description.match(regexp)
  if (matched === null) {
    return []
  }
  else {
    return matched.map((matched) => matched.replace(regexp, '$1'))
  }
}

export function getSortedCommandsByGroup(commands: Codraft.MacroCommand[]): Codraft.MacroCommand[] {
  const clones = [...commands]
  return clones.sort((a, b) => a.group.localeCompare(b.group))
}

export function parseCommandDescription(origin: Codraft.MacroCommand, format: Codraft.MacroCommandSaveFormat, className = ''): string {
  if (origin.id !== format.command_id) {
    throw new Error(`The origin not matched command with saved format.`)
  }

  const { description } = origin
  const regexp = /{{2}\s*(.*?)\s*}{2}/gmi
  
  return description.replace(regexp, (_matched, key) => {
    let value: SupportedVariableType
    let preview = ''
    let color = className

    // 기본 value 값 가져오기
    if (key in format.variables) {
      value = format.variables[key]
    }
    else {
      // 저장된 값이 없다면 커맨드에 있는지 확인합니다.
      if (key in origin.variables) {
        // 있다면 지정된 기본값을 가져옵니다.
        value = origin.variables[key].default_value
      }
      // 없다면 커맨드의 오류입니다.
      else {
        value = 'UNKNOWN'
        color = 'red--text'
      }
    }

    // 고급 지정 타입인지 확인하기
    // variables[key].items 속성이 있다면, item.preview 속성을 이용하여 미리보기값을 가져와야 합니다.
    if (key in origin.variables) {
      if ('items' in origin.variables[key]) {
        const variable = origin.variables[key] as AdvancedVariable<any>
        const matched = variable.items.find((item) => value === item.value) ?? null
        if (matched === null) {
          preview = 'UNKNOWN'
          color = 'red--text'
        }
        else {
          preview = matched.preview
        }
      }
      else {
        preview = value.toString()
      }
    }
    // 없다면 커맨드의 오류입니다.
    else {
      value = 'UNKNOWN'
      color = 'red--text'
    }

    if (color) {
      preview = `<span class="${color}">${preview}</span>`
    }

    return preview
  })
}

export function createDefaultCommandFormat(command: Codraft.MacroCommand): Codraft.MacroCommandSaveFormat {
  const id = nanoid()
  const command_id = command.id
  const variables: Record<string, SupportedVariableType> = {}

  for (const key in command.variables) {
    const { default_value } = command.variables[key]
    variables[key] = default_value
  }

  return {
    id,
    command_id,
    variables
  }
}

export function createEnsureCommandFormat(command: Codraft.MacroCommand, format: Codraft.MacroCommandSaveFormat|null = null): Codraft.MacroCommandSaveFormat {
  if (format === null) {
    return createDefaultCommandFormat(command)
  }
  
  const clone = deepCopy(format)
  for (const key in command.variables) {
    if (!(key in clone.variables)) {
      const { default_value } = command.variables[key]
      clone.variables[key] = default_value
    }
  }

  return clone
}