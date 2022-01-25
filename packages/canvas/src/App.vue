<template>
  <codraft-root />
</template>

<script lang="ts">
import { Codraft } from '@typings/codraft'

import Vue from 'vue'
import { onMounted, watch } from '@vue/composition-api'
import { DelayCall } from 'delay-call'

import store from '@/plugins/store'
import vuetify from '@/plugins/vuetify'
import '@/plugins/composition'
import '@/plugins/dragscroll'

import { useAdvancedArray, useAdvancedObject, useComponentUtils, useStore } from '@/components/common'
import CodraftRoot from '@/views/CodraftRoot.vue'

function usePublicMethod() {
  const { dispatch, state } = useStore()
  const { add } = useAdvancedArray()
  const { deepCopy } = useAdvancedObject()

  const addEventCommand = (command: Codraft.MacroCommand) => dispatch('addEventCommand', command)
  const addConditionCommand = (command: Codraft.MacroCommand) => dispatch('addConditionCommand', command)
  const addActionCommand = (command: Codraft.MacroCommand) => dispatch('addActionCommand', command)
  const setEventCommands = (commands: Codraft.MacroCommand[]) => commands.forEach(addEventCommand)
  const setConditionCommands = (commands: Codraft.MacroCommand[]) => commands.forEach(addConditionCommand)
  const setActionCommands = (commands: Codraft.MacroCommand[]) => commands.forEach(addActionCommand)

  const save = (): Codraft.SaveFormat => {
    const { events, conditions, actions } = state.command
    const { boxes } = state.box

    const used_commands: Record<string, string> = {}

    const commands = [...events, ...conditions, ...actions]
    commands.forEach((command) => {
      const { id, version } = command
      used_commands[id] = version
    })

    const format: Codraft.SaveFormat = { used_commands, boxes }
    return deepCopy(format)
  }

  const load = (save: Codraft.SaveFormat) => {
    const { events, conditions, actions } = state.command
    const { used_commands, boxes } = save

    const allCommands = [...events, ...conditions, ...actions]
    let missing: string[] = []
    let warning: string[] = []

    for (const id in used_commands) {
      const version = used_commands[id]
      const command = allCommands.find((command) => command.id === id) ?? null
      if (command === null) {
        missing = add(missing, id)
      }
      else if (command.version !== version) {
        warning = add(warning, id)
      }
    }

    dispatch('setBoxes', boxes)

    return {
      missing,
      warning
    }
  }

  return {
    addEventCommand,
    addConditionCommand,
    addActionCommand,
    setEventCommands,
    setConditionCommands,
    setActionCommands,
    save,
    load
  }
}

export default Vue.extend({
  store,
  vuetify,
  name: 'App',
  components: {
    CodraftRoot
  },
  setup() {
    const { state } = useStore()
    const { currentElement } = useComponentUtils()
    const { deepCopy } = useAdvancedObject()
    const { save, load, addEventCommand, addConditionCommand, addActionCommand, setEventCommands, setConditionCommands, setActionCommands } = usePublicMethod()

    const getRootElement = () => {
      const element = currentElement.value
      const root = element.getRootNode()
      return root instanceof ShadowRoot ? root.host : element
    }

    const waitMount = (callback: () => any) => {
      onMounted(() => {
        setTimeout(callback)
      })
    }

    const methods = { save, load, addEventCommand, addConditionCommand, addActionCommand, setEventCommands, setConditionCommands, setActionCommands }

    waitMount(() => {
      const target = getRootElement()
      const event = new CustomEvent('codraft-ready', {
        detail: { ...methods }
      })
      target.dispatchEvent(event)
    })

    waitMount(() => {
      const caller = new DelayCall
      watch(() => state.box.boxes, () => {
        caller.request('codraft-change', () => {
          const target = getRootElement()
          const boxes = deepCopy(state.box.boxes)
          const event = new CustomEvent('codraft-change', {
            detail: { boxes, ...methods }
          })
          target.dispatchEvent(event)
        })
      })
    })

    return {}
  }
})
</script>

<style lang="scss">
@import '~vuetify/dist/vuetify.min.css';
@import url(https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700,900);
@import url(https://cdn.jsdelivr.net/npm/@mdi/font@latest/css/materialdesignicons.min.css);

#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-family: Roboto, Avenir, Helvetica, Arial, sans-serif;
  color: #2c3e50;

  .movable {
    cursor: move;
    user-select: none;
  }

  .v-dialog {
    box-sizing: border-box;
  }
}
</style>

<style scoped>
.a {
  color: red;
}
</style>