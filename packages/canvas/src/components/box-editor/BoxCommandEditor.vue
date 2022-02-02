<template>
  <v-card min-height="500">
    <v-card-title class="grey darken-3 white--text">명령어 선택</v-card-title>
    <v-card-text>
      <v-autocomplete
        v-model="selectedCommandID"
        :no-data-text="'찾는 명령어가 없습니다'"
        :menu-props="{ 'nudge-right': 24, 'nudge-top': -74 }"
        :attach="currentElement"
        :items="commandItems"
        class="mt-5"
        hide-overlay
        solo
      />
      <div class="description-wrapper">
        <box-command-description
          :save_format="returnData"
          :command="selectedCommand"
          @resolve="modifyReturnData"
        />
      </div>
    </v-card-text>
    <v-card-actions class="justify-end">
      <v-btn
        :disabled="!selectedCommand"
        elevation="0"
        width="100"
        @click="save(returnData)"
      >
        저장
      </v-btn>
      <v-btn
        elevation="0"
        width="100"
        @click="close"
      >
        취소
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import { Codraft } from '@typings/codraft'

import { computed, defineComponent, getCurrentInstance, ref, watch } from '@vue/composition-api'

import { useAdvancedArray, useAdvancedObject, useCommand, useElement, useComponentUtils } from '@/components/common'
import BoxCommandDescription from './BoxCommandDescription.vue'
import BoxCommandVariableEditor from './BoxCommandVariableEditor.vue'
import { createDefaultCommandFormat } from '@/utils/command'

type CommandItem = {
  text?: string
  value?: string
  header?: string
}

export default defineComponent({
  components: {
    BoxCommandDescription,
    BoxCommandVariableEditor,
  },
  emits: ['resolve', 'reject'],
  props: {
    commands: {
      type: Array as () => Codraft.MacroCommand[],
      required: true
    },
    command: {
      type: Object as () => Codraft.MacroCommand,
      default: null
    },
    save_format: {
      type: Object as () => Codraft.MacroCommandSaveFormat,
      default: null
    }
  },
  setup(props) {
    const { emit } = getCurrentInstance()!
    const { getSortedCommandsByGroup } = useCommand()
    const { getItemFromID } = useAdvancedArray()
    const { deepCopy } = useAdvancedObject()

    const isInputOpen = ref(false)
    const openInput = () => isInputOpen.value = true
    const closeInput = () => isInputOpen.value = false

    const commandItems = computed(() => {
      let lastHeader: string|null = null
      const items: CommandItem[] = []
      getSortedCommandsByGroup(props.commands).forEach((command) => {
        if (lastHeader !== command.group) {
          lastHeader = command.group
          items.push({ header: command.group })
        }
        items.push({ text: command.title, value: command.id })
      })
      return items
    })

    const selectedCommandID = ref(props.command ? props.command.id : null)
    const selectedCommand = computed(() => {
      const commandID = selectedCommandID.value
      if (commandID === null) {
        return null
      }
      return getItemFromID(props.commands, commandID)
    })

    const returnData = ref<Codraft.MacroCommandSaveFormat|null>(null)
    if (props.save_format) {
      returnData.value = deepCopy(props.save_format)
    }

    const modifyReturnData = (key: string, value: string) => {
      const v = returnData.value
      if (v !== null) {
        const clone = deepCopy(v)
        clone.variables[key] = value
        returnData.value = clone
      }
    }

    const save = (format: Codraft.MacroCommandSaveFormat) => emit('resolve', deepCopy(format))
    const close = () => emit('reject')

    watch(selectedCommand, () => {
      if (selectedCommand.value !== null) {
        returnData.value = createDefaultCommandFormat(selectedCommand.value)
      }
    })
    
    return {
      isInputOpen,
      commandItems,
      returnData,
      selectedCommandID,
      selectedCommand,
      modifyReturnData,
      save,
      close,
      openInput,
      closeInput,
      ...useComponentUtils(),
      ...useCommand(),
      ...useElement(),
    }
  }
})
</script>

<style lang="scss">
.v-menu--is-active {
  display: block;
}
</style>

<style lang="scss" scoped>
.description-wrapper {
  border: 1px solid lightgrey;
  border-radius: 5px;
}
</style>