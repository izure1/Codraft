<template>
  <div class="mx-5 mt-5">
    <div v-if="command && save_format">
      <span
        v-for="(item, i) in nodes"
        :key="`node-${i}`"
      >
        <v-btn
          v-if="item.isVariable"
          v-text="item.node.textContent"
          class="btn-var blue--text font-weight-bold px-2 d-inline"
          text
          @click="openInput(item.key)"
        />
        <span
          v-else
          v-text="item.node.textContent"
        />
      </span>

      <div class="mt-5 mb-2 text-right">
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-icon
              v-on="on"
              class="mr-1"
              small
            >
              mdi-help-circle-outline
            </v-icon>
          </template>
          <div class="text-caption">
            <div>Author: <strong>{{ command.author }}</strong></div>
            <div>Version: <strong>{{ command.version }}</strong></div>
          </div>
        </v-tooltip>
        <a
          :href="command.url"
          class="text-caption"
          target="_blank"
        >
          {{ command.url }}
        </a>
      </div>

      <v-overlay :value="isInputOpen" />
      <v-dialog
        :attach="rootElement"
        :value="isInputOpen"
        max-width="25%"
        hide-overlay
        persistent
      >
        <box-command-variable-editor
          v-if="isInputOpen"
          :default_value="save_format.variables[selectedKey]"
          :variable_key="selectedKey"
          :command="command"
          @resolve="
            save(...arguments);
            closeInput();
          "
          @reject="closeInput"
        />
      </v-dialog>
    </div>
    <div
      v-else
      class="mb-5"
    >
      상단에서 원하는 커맨드를 선택하세요.
    </div>
  </div>
</template>

<script lang="ts">
import { Codraft, SupportedVariableType } from '@typings/codraft'

import { computed, defineComponent, onMounted, ref, watch } from '@vue/composition-api'

import { useCommand, useElement, useComponentUtils } from '@/components/common'
import BoxCommandVariableEditor from './BoxCommandVariableEditor.vue'

interface RawDescriptionNode {
  node: HTMLElement|ChildNode
  isVariable: boolean
  key?: string
}

interface VariableDescriptionNode extends RawDescriptionNode {
  node: HTMLElement
  isVariable: true
  key: string
}

type DescriptionNode = RawDescriptionNode|VariableDescriptionNode

export default defineComponent({
  components: {
    BoxCommandVariableEditor
  },
  emits: ['resolve'],
  props: {
    command: {
      type: Object as () => Codraft.MacroCommand,
      default: null
    },
    save_format: {
      type: Object as () => Codraft.MacroCommandSaveFormat,
      default: null
    }
  },
  setup(props, { emit }) {
    const { getCommandVariableKeys, parseCommandDescription } = useCommand()
    const { isElement } = useElement()

    const nodes = ref<DescriptionNode[]>([])

    const parseDescriptionHTML = (command: Codraft.MacroCommand, format: Codraft.MacroCommandSaveFormat) => {
      const parser = new DOMParser
      const text = parseCommandDescription(command, format, 'variable blue--text font-weight-bold')
      const doc = parser.parseFromString(text, 'text/html')
      return Array.from(doc.body.childNodes)
    }

    const fetchDescriptionHTML = () => {
      const { command, save_format } = props
      if (!command || !save_format) {
        return
      }
      const list: DescriptionNode[] = []
      const keys = getCommandVariableKeys(command)
      const allNodes = parseDescriptionHTML(command, save_format)
      const variableNodes = allNodes.filter(isElement)
      allNodes.forEach((node) => {
        if (isElement(node)) {
          const i = variableNodes.indexOf(node)
          const key = keys[i]
          const item: VariableDescriptionNode = {
            isVariable: true,
            node,
            key
          }
          list.push(item)
        }
        else {
          const item: RawDescriptionNode = {
            isVariable: false,
            node
          }
          list.push(item)
        }
      })
      nodes.value = list
    }

    const selectedKey = ref<string|null>(null)
    const isInputOpen = computed(() => !!selectedKey.value)
    const openInput = (key: string) => selectedKey.value = key
    const closeInput = () => selectedKey.value = null

    const save = (key: string, value: SupportedVariableType) => emit('resolve', key, value)

    onMounted(fetchDescriptionHTML)
    watch(() => props.command, fetchDescriptionHTML)
    watch(() => props.save_format, fetchDescriptionHTML)

    return {
      nodes,
      isInputOpen,
      selectedKey,
      openInput,
      closeInput,
      save,
      ...useComponentUtils()
    }
  }
})
</script>

<style lang="scss" scoped>
.btn-var {
  min-width: initial !important;
}
</style>