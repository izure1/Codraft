<template>
  <div class="root">
    <v-card>
      <v-stepper
        v-model="step"
        elevation="0"
        class="no-transition"
      >
        <v-stepper-header class="justify-space-around elevation-0">
          <v-stepper-step
            v-for="(keys, i) in [['events', 'Event'], ['conditions', 'Conditions'], ['actions', 'Actions']]"
            :key="`stepper-step-${i}`"
            :step="i+1"
            editable
            @click="
              selectCommand(null);
              selectFormat(null);
              setCurrentCommandTab(keys[0]);
            "
          >
            {{ keys[1] }}
          </v-stepper-step>
          <v-spacer />
          <v-btn
            class="ma-3"
            icon
            @click="close"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-stepper-header>
        <v-divider />
        <v-stepper-items>
          <v-stepper-content
            v-for="(tab, i) in ['events', 'conditions', 'actions']"
            :key="`stepper-item-${i}`"
            :step="i+1"
          >
            <div class="d-flex">
              <div class="box-editor-wrapper flex-grow-1 flex-shrink-1">
                <v-list dense>
                  <div
                    v-for="(format, i) in returnData[tab]"
                    :key="`command-${i}`"
                  >
                    <v-list-item
                      v-if="getCommandFromID(format.command_id)"
                      @click="
                        selectCommand(getCommandFromID(format.command_id));
                        selectFormat(format);
                      "
                      @dblclick="openCommandEditor"
                    >
                      <v-list-item-icon class="mr-0">
                        <v-icon
                          v-if="checkSelectedFormat(format.id)"
                          class="red--text"
                          small
                        >
                          mdi-check
                        </v-icon>
                      </v-list-item-icon>
                      <v-list-item-content>
                        <v-list-item-subtitle v-html="parseCommandDescription(getCommandFromID(format.command_id), format)" />
                      </v-list-item-content>
                    </v-list-item>

                    <v-list-item v-else>
                      <v-list-item-subtitle>
                        <strong>{{ format.command_id }}</strong>(은)는 존재하지 않는 커맨드입니다.
                      </v-list-item-subtitle>
                    </v-list-item>
                  </div>
                </v-list>
              </div>

              <div class="box-editor-actions flex-grow-0 flex-shrink-1 ml-5">
                <v-btn
                  v-if="currentCommands.length"
                  elevation="0"
                  width="100"
                  class="my-1"
                  tile
                  @click="
                    selectCommand(null);
                    selectFormat(null);
                    openCommandEditor();
                  "
                >
                  추가
                </v-btn>
                <v-btn
                  :disabled="!selectedFormat"
                  elevation="0"
                  width="100"
                  class="my-1"
                  tile
                  @click="openCommandEditor"
                >
                  수정
                </v-btn>
                <v-btn
                  :disabled="!selectedFormat"
                  elevation="0"
                  width="100"
                  class="my-1"
                  tile
                  @click="
                    removeFormat(selectedFormat);
                    selectCommand(null);
                    selectFormat(null);
                  "
                >
                  삭제
                </v-btn>
              </div>
            </div>
          </v-stepper-content>
        </v-stepper-items>
      </v-stepper>

      <v-card-actions class="d-block">
        <div class="box-editor-comment">
          <v-text-field
            v-model="returnData.comment"
            label="이곳에 주석을 기입할 수 있습니다"
            counter="30"
            class="mx-4"
            type="text"
            outlined
            dense
          />
        </div>
        <v-divider class="mb-3" />
        <div class="d-flex justify-end">
          <v-btn
            elevation="0"
            width="100"
            class="mr-1"
            tile
            @click="save(returnData)"
          >
            저장
          </v-btn>

          <v-btn
            elevation="0"
            width="100"
            tile
            @click="close"
          >
            닫기
          </v-btn>
        </div>
      </v-card-actions>
    </v-card>

    <v-overlay :value="isCommandEditOpen" />
    <v-dialog
      :attach="rootElement"
      :value="isCommandEditOpen"
      max-width="800"
      hide-overlay
      persistent
    >
      <box-command-editor
        v-if="isCommandEditOpen"
        :save_format="selectedFormat"
        :commands="currentCommands"
        :command="selectedCommand"
        @resolve="
          modifyReturnData(returnData, currentCommandTab, ...arguments);
          closeCommandEditor();
        "
        @reject="closeCommandEditor"
      />
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from '@vue/composition-api'

import { useAdvancedArray, useAdvancedObject, useBox, useCommand, useHashMap, useComponentUtils, useStore } from '@/components/common'
import BoxCommandEditor from './BoxCommandEditor.vue'

type MacroTabs = 'events'|'conditions'|'actions'

function useStepper() {
  const step = ref(1)
  const setStep = (index: number) => step.value = index

  return {
    step,
    setStep
  }
}

const { createNewBox } = useBox()

export default defineComponent({
  components: {
    BoxCommandEditor
  },
  emits: ['resolve', 'reject'],
  props: {
    box: {
      type: Object as () => Codraft.MacroBox,
      default: () => createNewBox(0, 0)
    }
  },
  setup(props, { emit }) {
    const { state } = useStore()
    const { add, hasItemFromID, removeFromID } = useAdvancedArray()
    const { deepCopy } = useAdvancedObject()
    const { createHashMap } = useHashMap()

    const returnData = ref<Codraft.MacroBox>(deepCopy(props.box))

    const modifyReturnData = (box: Codraft.MacroBox, commandTab: MacroTabs, command: Codraft.MacroCommandSaveFormat) => {
      const clone = deepCopy(box)
      if (!(commandTab in box)) {
        throw new Error(`Somethings wrong. '${commandTab}' field was incorrect tab name.`)
      }
      // insert
      if (!hasItemFromID(box[commandTab], command.id)) {
        clone[commandTab] = add(box[commandTab], command)
        returnData.value = clone
      }
      // update
      else {
        const index = box[commandTab].findIndex((before) => before.id === command.id)
        if (index !== -1) {
          clone[commandTab].splice(index, 1, command)
          returnData.value = clone
        }
        else {
          throw new Error(`Somethings wrong. The command not exists what id is '${command.id}'`)
        }
      }
    }

    const save = (data: Codraft.MacroBox) => emit('resolve', deepCopy(data))
    const close = () => emit('reject')

    const commandHashMap = computed(() => createHashMap([
      ...state.command.events,
      ...state.command.conditions,
      ...state.command.actions,
    ]))

    const isCommandEditOpen = ref(false)
    const selectedCommand = ref<Codraft.MacroCommand|null>(null)
    const selectedFormat = ref<Codraft.MacroCommandSaveFormat|null>(null)
    const checkSelectedFormat = (id: string) => {
      if (selectedFormat.value === null) {
        return false
      }
      return selectedFormat.value.id === id
    }

    const currentCommandTab = ref<MacroTabs>('events')
    const currentCommands = computed(() => state.command[currentCommandTab.value])

    const setCurrentCommandTab = (type: MacroTabs) => currentCommandTab.value = type
    const selectCommand = (command: Codraft.MacroCommand|null) => selectedCommand.value = command
    const selectFormat = (format: Codraft.MacroCommandSaveFormat|null) => selectedFormat.value = format
    const getCommandFromID = (id: string) => commandHashMap.value.get(id) ?? null

    const removeFormat = (format: Codraft.MacroCommandSaveFormat) => {
      const clone = deepCopy(returnData.value)
      clone.events = removeFromID(clone.events, format.id)
      clone.conditions = removeFromID(clone.conditions, format.id)
      clone.actions = removeFromID(clone.actions, format.id)
      returnData.value = clone
    }

    const openCommandEditor = () => isCommandEditOpen.value = true
    const closeCommandEditor = () => isCommandEditOpen.value = false
    
    return {
      returnData,
      modifyReturnData,
      save,
      close,

      isCommandEditOpen,
      currentCommandTab,
      currentCommands,
      selectedCommand,
      selectedFormat,
      setCurrentCommandTab,
      selectCommand,
      selectFormat,
      getCommandFromID,
      removeFormat,
      checkSelectedFormat,
      openCommandEditor,
      closeCommandEditor,

      ...useStepper(),
      ...useHashMap(),
      ...useCommand(),
      ...useComponentUtils()
    }
  },
})
</script>

<style lang="scss" scoped>
.root {
  user-select: none;
}

.box-editor-wrapper {
  border: 1px solid lightgrey;
  box-sizing: border-box;
  padding: 10px;
  overflow: auto;
  overflow-y: scroll;
  min-height: 300px;
  max-height: 800px;
}

.box-editor-comment {
  width: calc(100% - 120px);
}

.box-editor-actions {
  width: 100px;
}
</style>

<style lang="scss">
.no-transition .v-stepper__content {
  transition: none !important;
}
</style>