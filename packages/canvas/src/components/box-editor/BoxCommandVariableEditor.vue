<template>
  <v-card>
    <v-card-title class="grey darken-3 text-body-2 white--text">값을 입력하세요</v-card-title>
    <v-card-text class="mt-5">
      <v-form v-if="variable">
        <div v-if="variable.items">
          <v-radio-group v-model="returnData">
            <v-radio
              v-for="(button, i) in variable.items"
              :key="`radio-${i}`"
              :label="button.preview"
              :value="stringify(button.value)"
            />
          </v-radio-group>
        </div>
        <div v-else>
          <div v-if="variable.type === 'string' || variable.type === 'object'">
            <v-textarea
              v-model="returnData"
              no-resize
              autofocus
              counter
              dense
              solo
            />
          </div>
          <div v-else-if="variable.type === 'number'">
            <v-text-field
              v-model="returnData"
              type="text"
              autofocus
              counter
              dense
              solo
              @keydown.enter.prevent="save(variable_key, returnData)"
            />
          </div>
          <div v-else-if="variable.type === 'boolean'">
            <v-radio-group v-model="returnData">
              <v-radio
                v-for="(tuple, i) in [['참', true], ['거짓', false]]"
                :key="`radio-${i}`"
                :label="tuple[0]"
                :value="stringify(tuple[1])"
              />
            </v-radio-group>
          </div>
          <div v-else>
            <v-alert type="error">Unknown variable type.</v-alert>
          </div>
        </div>
      </v-form>
      <v-alert
        v-else
        v-text="`Deleted Variable.`"
        type="error"
      />
    </v-card-text>
    <v-divider />
    <v-card-actions class="justify-center">
      <v-btn
        elevation="0"
        width="100"
        @click="save(variable_key, returnData)"
      >
        완료
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
import { Codraft, SupportedVariableType } from '@typings/codraft'

import { computed, defineComponent, ref, watch } from '@vue/composition-api'

import { useCommand } from '@/components/common'

export default defineComponent({
  emits: ['resolve', 'reject'],
  props: {
    command: {
      type: Object as () => Codraft.MacroCommand,
      required: true
    },
    variable_key: {
      type: String,
      required: true
    },
    default_value: {
      type: String,
      default: null
    }
  },
  setup(props, { emit }) {
    const { createDefaultCommandFormat } = useCommand()

    const default_value_ensured = computed(() => props.default_value ?? createDefaultCommandFormat(props.command).variables[props.variable_key])

    const returnData = ref<SupportedVariableType>(default_value_ensured.value)
    const variable = computed(() => props.command.variables[props.variable_key])

    const save = (key: string, data: SupportedVariableType) => emit('resolve', key, stringify(data))
    const close = () => emit('reject')
    
    const stringify = (v: unknown) => typeof v === 'string' ? v : JSON.stringify(v)

    watch(() => props.default_value, () => returnData.value = default_value_ensured.value)
    watch(() => props.command, () => returnData.value = default_value_ensured.value)

    return {
      returnData,
      variable,
      save,
      close,
      stringify
    }
  }
})
</script>
