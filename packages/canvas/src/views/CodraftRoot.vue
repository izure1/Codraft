<template>
  <v-app :style="{ background: background }">
    <codraft-canvas v-if="isMounted" />
  </v-app>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from '@vue/composition-api'
import CodraftCanvas from '@/views/CodraftCanvas.vue'

export default defineComponent({
  components: {
    CodraftCanvas
  },
  props: {
    background: {
      type: String,
      required: true
    }
  },
  setup() {
    const isMounted = ref(false)
    onMounted(() => {
      isMounted.value = true
    })

    return {
      isMounted
    }
  }
})
</script>
