<template>
  <div
    :style="{ zoom: zoom }"
    class="draggable-field"
    @mouseleave="mouseleave"
    @mousemove="mousemove"
    @mouseup="mouseup"
    @mousewheel="wheel"
  >
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, getCurrentInstance } from '@vue/composition-api'
import { useStore } from '@/components/common'

function useWheelControl() {
  const { dispatch, state } = useStore()

  const zoom = computed(() => state.draggable.zoom)
  const wheel = (e: WheelEvent) => {
    let zoom = state.draggable.zoom
    const isWheelDown = e.deltaY > 0
    const scalar = 0.1
    const min = 0.1
    const max = 1.0
    if (isWheelDown) {
      zoom -= scalar
      if (zoom < min) {
        zoom = min
      }
    }
    else {
      zoom += scalar
      if (zoom > max) {
        zoom = max
      }
    }
    dispatch('setDraggableZoom', zoom)
  }

  return {
    zoom,
    wheel
  }
}

export default defineComponent({
  setup() {
    const { dispatch, state } = useStore()
    const { proxy: { $nextTick } } = getCurrentInstance()!

    const mousemove = (e: MouseEvent) => {
      if (state.draggable.id) {
        const zoom = state.draggable.zoom
        const x = e.movementX / zoom
        const y = e.movementY / zoom
        dispatch('setDraggableOffset', { x, y })
        dispatch('updateDraggableState', 'dragging')
      }
    }

    const dispatchResetDraggableID = async () => {
      await $nextTick()
      dispatch('setDraggableID', null)
    }

    const mouseup = (_e: MouseEvent) => {
      if (state.draggable.id) {
        if (state.draggable.state.event === 'dragging') {
          dispatch('updateDraggableState', 'drag-end')
        }
        dispatchResetDraggableID()
      }
    }

    const mouseleave = (_e: MouseEvent) => {
      if (state.draggable.id) {
        if (state.draggable.state.event === 'dragging') {
          dispatch('updateDraggableState', 'drag-end')
        }
        dispatchResetDraggableID()
      }
    }

    return {
      mouseleave,
      mousemove,
      mouseup,
      ...useWheelControl()
    }
  }
})
</script>

<style lang="scss" scoped>
.draggable-field {
  width: 100%;
  height: 100%;
}
</style>