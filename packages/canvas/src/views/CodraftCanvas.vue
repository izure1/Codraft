<template>
  <box-canvas :boxes="boxes" />
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'

import { useStore } from '../components/common'
import BoxCanvas from '@/components/box-canvas/BoxCanvas.vue'

export default defineComponent({
  components: {
    BoxCanvas
  },
  setup() {
    const { state } = useStore()
    const boxes = computed(() => state.box.boxes)

    return {
      boxes
    }
  },
})
</script>
