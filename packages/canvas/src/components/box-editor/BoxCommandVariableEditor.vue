<template>
  <v-card>
    <v-card-title class="text-body-2">값을 입력하세요</v-card-title>
    <v-card-text>
      <v-form v-if="variable">
        <div v-if="variable.type === 'string'">
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
            v-model.number="returnData"
            type="number"
            autofocus
            counter
            dense
            solo
            @keydown.enter.prevent="save(variable_key, returnData)"
          />
        </div>
        <div v-else-if="variable.type === 'radio'">
          <v-radio-group v-model="returnData">
            <v-radio
              v-for="(button, i) in variable.items"
              :key="`radio-${i}`"
              :label="button.preview"
              :value="button.value"
            />
          </v-radio-group>
        </div>
        <div v-else>
          <v-alert type="error">Unknown variable type.</v-alert>
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
        tile
        @click="save(variable_key, returnData)"
      >
        완료
      </v-btn>
      <v-btn
        elevation="0"
        width="100"
        tile
        @click="close"
      >
        취소
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch } from '@vue/composition-api'

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
      type: [String, Number, Boolean],
      default: null
    }
  },
  setup(props, { emit }) {
    const default_value_ensured = computed(() => props.default_value ?? props.command.variables[props.variable_key].default_value)

    const returnData = ref<SupportedVariableType>(default_value_ensured.value)
    const variable = computed(() => props.command.variables[props.variable_key])

    const save = (key: string, data: SupportedVariableType) => emit('resolve', key, data)
    const close = () => emit('reject')

    watch(() => props.default_value, () => returnData.value = default_value_ensured.value)
    watch(() => props.command, () => returnData.value = default_value_ensured.value)

    return {
      returnData,
      variable,
      save,
      close
    }
  }
})
</script>
