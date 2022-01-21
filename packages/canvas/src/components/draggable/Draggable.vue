<template>
  <div
    ref="el"
    class="draggable"
    :style="{ position: 'absolute', left: `${roundedLeft}px`, top: `${roundedTop}px` }"
  >
    <slot
      name="activator"
      :on="{
        mousedown: mousedown
      }"
    ></slot>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref, watch } from '@vue/composition-api'
import { nanoid } from 'nanoid'

import { useStore } from '@/components/common'

function isElement<T extends HTMLElement>(v: unknown): v is T {
  return v instanceof HTMLElement
}

export default defineComponent({
  emits: ['drag-start', 'dragging', 'drag-end'],
  props: {
    init_left: {
      type: Number,
      default: 0
    },
    init_top: {
      type: Number,
      default: 0
    },
    grid: {
      type: Number,
      default: 1
    }
  },
  setup(props, { emit }) {
    const id = nanoid()
    const { state, dispatch } = useStore()

    const el = ref(null)
    const left = ref(props.init_left)
    const top = ref(props.init_top)

    const roundedLeft = computed(() => Math.round(left.value / props.grid) * props.grid)
    const roundedTop = computed(() => Math.round(top.value / props.grid) * props.grid)

    const mousedown = (_e: MouseEvent) => {
      if (!state.draggable.id) {
        dispatch('setDraggableID', id)
        dispatch('updateDraggableState', 'drag-start')
      }
    }

    onMounted(() => {
      if (isElement(el)) {
        const { offsetLeft, offsetTop } = el
        left.value = offsetLeft
        top.value = offsetTop
      }
    })

    watch(computed(() => `${state.draggable.offset.x},${state.draggable.offset.y}`), () => {
      if (state.draggable.id === id) {
        const { x, y } = state.draggable.offset
        left.value += x
        top.value += y
      }
    })

    watch(computed(() => state.draggable.state), () => {
      if (state.draggable.id === id) {
        const { event } = state.draggable.state
        if (event !== null) {
          const x = left.value
          const y = top.value
          emit(event, { x, y })
        }
      }
    })

    return {
      el,
      left,
      top,
      roundedLeft,
      roundedTop,
      mousedown
    }
  }
})
</script>
