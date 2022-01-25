<template>
  <v-list
    class="py-0"
    dense
  >
    <div
      v-if="!save_formats.length"
      class="text-caption text-center grey--text"
    >
      (비어있음)
    </div>
    <v-list-item
      v-for="(format, i) in save_formats"
      :key="`box-item-${i}`"
      class="box-item"
    >
      <v-list-item-content>
        <v-list-item-subtitle
          v-if="commandHashMap.has(format.command_id)"
          v-html="parseCommandDescription(commandHashMap.get(format.command_id), format, 'orange--text')"
          class="text-caption"
        >
        </v-list-item-subtitle>
        <v-list-item-subtitle
          v-else
          class="red--text text-caption"
        >
          삭제된 커맨드입니다.
        </v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>
  </v-list>
</template>

<script lang="ts">
import { Codraft } from '@typings/codraft'

import { computed, defineComponent, getCurrentInstance } from '@vue/composition-api'

import { useCommand, useHashMap } from '@/components/common'

export default defineComponent({
  props: {
    commands: {
      type: Array as () => Codraft.MacroCommand[],
      required: true
    },
    save_formats: {
      type: Array as () => Codraft.MacroCommandSaveFormat[],
      required: true
    }
  },
  setup() {
    const { props } = getCurrentInstance()!
    const { createHashMap } = useHashMap()
    const commandHashMap = computed(() => createHashMap(props.commands as Codraft.MacroCommand[]))

    return {
      commandHashMap,
      ...useCommand()
    }
  }
})
</script>

<style lang="scss" scoped>
.box-item {
  min-height: 30px !important;
}
</style>