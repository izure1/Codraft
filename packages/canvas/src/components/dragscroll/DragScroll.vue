<template>
  <div
    class="dragscroll-wrapper"
    ref="dragscroll"
    @mousedown="mousedownHandler"
    @mousemove="mousemoveHandler"
    @mouseup="mouseupHandler"
  >
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from '@vue/composition-api'

export default defineComponent({
  setup() {
    const position = reactive({ x: 0, y: 0, left: 0, top: 0 })
    let isDown = false

    const dragscroll = ref<HTMLDivElement|null>(null)

    const isNoDragscroll = (el: HTMLElement): boolean => {
      if (!(el instanceof HTMLElement)) {
        return false
      }
      if (el === dragscroll.value) {
        return false
      }
      if (!el.hasAttribute('data-nodragscroll')) {
        if (el.parentElement === null) {
          return false
        }
        return isNoDragscroll(el.parentElement)
      }
      return true
    }

    const mousedownHandler = (e: MouseEvent) => {
      const el = dragscroll.value
      if (el instanceof HTMLDivElement) {
        const { clientX, clientY, target } = e
        const { scrollLeft, scrollTop } = el
        
        if (target instanceof HTMLElement) {
          if (isNoDragscroll(target)) {
            return
          }
        }

        isDown = true
        position.x = clientX
        position.y = clientY
        position.left = scrollLeft
        position.top = scrollTop
      }
    }

    const mousemoveHandler = (e: MouseEvent) => {
      if (!isDown) {
        return
      }
      const el = dragscroll.value
      if (el instanceof HTMLDivElement) {
        const { clientX, clientY } = e
        const { x, y } = position
  
        const dx = clientX - x
        const dy = clientY - y
  
        el.scrollTop = position.top - dy
        el.scrollLeft = position.left - dx
      }
    }

    const mouseupHandler = (_e: MouseEvent) => {
      isDown = false
    }

    return {
      dragscroll,
      mousedownHandler,
      mousemoveHandler,
      mouseupHandler
    }
  }
})
</script>

<style lang="scss" scoped>
.dragscroll-wrapper {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: auto;
}
</style>