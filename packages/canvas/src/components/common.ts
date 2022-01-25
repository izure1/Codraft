import { Codraft } from '@typings/codraft'

import { getCurrentInstance, onMounted, ref } from '@vue/composition-api'
import { nanoid } from 'nanoid'

import { createDefaultCommandFormat, createEnsureCommandFormat, getCommandVariableKeys, getSortedCommandsByGroup, getMatchedCommand, parseCommandDescription } from '@/utils/command'
import { add, has, remove, addFromID, removeFromID, getItemFromID, hasItemFromID } from '@/utils/advancedArray'
import { isElement, isTextNode } from '@/utils/element'
import { deepCopy } from '@/utils/advancedObject'
import { createHashMap } from '@/utils/hashMap'

import store from '@/plugins/store'

export function defineCommandLine(command: Codraft.MacroCommand): Codraft.MacroCommand {
  return command
}

export function useCommand() {
  return {
    createDefaultCommandFormat,
    createEnsureCommandFormat,
    getCommandVariableKeys,
    getSortedCommandsByGroup,
    getMatchedCommand,
    parseCommandDescription
  }
}

export function useComponentUtils() {
  const currentInstance = getCurrentInstance()!
  const rootInstance = ref(currentInstance.proxy.$root)
  const currentElement = ref<Element>(currentInstance.proxy.$el)
  const rootElement = ref<Element>(currentInstance.proxy.$root.$el)

  onMounted(() => {
    rootElement.value = currentInstance.proxy.$root.$el
    currentElement.value = currentInstance.proxy.$el
  })

  const currentQuerySelector = (query: string) => currentElement.value.querySelector(query)
  const rootQuerySelector = (query: string) => rootElement.value.querySelector(query)

  return {
    currentElement,
    rootInstance,
    rootElement,
    currentQuerySelector,
    rootQuerySelector
  }
}

export function useHashMap() {
  return {
    createHashMap
  }
}

export function useStore(): typeof store {
  const { proxy } = getCurrentInstance()!
  return proxy.$store
}

export function useBox() {
  const createNewBox = (x: number, y: number): Codraft.MacroBox => {
    const id = nanoid()
    return {
      id,
      x,
      y,
      comment: '',
      next_box_ids: [],
      events: [],
      conditions: [],
      actions: [],
    }
  }

  const copyBox = (box: Codraft.MacroBox, x = box.x + 30, y = box.y + 30) => {
    const updateFormat = (format: Codraft.MacroCommandSaveFormat) => {
      format.id = nanoid()
      return format
    }

    const clone = deepCopy(box)
    clone.id = nanoid()
    clone.x = x
    clone.y = y
    clone.events = clone.events.map(updateFormat)
    clone.conditions = clone.conditions.map(updateFormat)
    clone.actions = clone.actions.map(updateFormat)
    
    return clone
  }

  return {
    createNewBox,
    copyBox
  }
}

export function useAdvancedArray() {
  return {
    add,
    has,
    remove,
    addFromID,
    removeFromID,
    getItemFromID,
    hasItemFromID
  }
}

export function useAdvancedObject() {
  return {
    deepCopy
  }
}

export function useElement() {
  return {
    isElement,
    isTextNode
  }
}

export function useTick() {
  const { proxy } = getCurrentInstance()!

  const _ticker = (callback: () => any, interval = 1) => {
    if (interval === 0) callback()
    else {
      proxy.$nextTick(() => _ticker(callback, interval - 1))
    }
  }

  const nextTick = (callback: () => any, interval = 1) => {
    _ticker(callback, interval)
  }

  return {
    nextTick
  }
}