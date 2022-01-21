<template>
  <div class="box-canvas-wrapper">
    <draggable-field>
      <div
        v-dragscroll:nochilddrag
        ref="canvas"
        class="box-canvas"
        @contextmenu.prevent="
          if (isConnectionMode) {
            connectionStartBox = [];
            return;
          }
          addBox(...arguments);
        "
        @mousemove="
          connectionOffset.x = $event.x / $store.state.draggable.zoom;
          connectionOffset.y = $event.y / $store.state.draggable.zoom;
        "
      >
        <draggable
          v-for="box in boxes"
          :key="`box-${box.id}`"
          :init_left="box.x"
          :init_top="box.y"
          :grid="20"
          @dragging="updateConnectionDrawing"
          @drag-end="updateBoxPosition($event, box)"
        >
          <template v-slot:activator="{ on }">
            <div
              v-on="on"
              @dblclick="selectedBox = box"
              @click="
                if (isConnectionMode && !has(connectionStartBox, box)) {
                  connectionStartBox.forEach((source) => connectTo(source, box));
                  connectionStartBox = [];
                  connectionEndBox = [];
                }
              "
              @mouseenter="connectionEndBox = [box]"
              @mouseleave="connectionEndBox = []"
            >
              <box
                :id="getPlumbBoxID(plumbID, box.id)"
                :box="box"
                :class="{
                  'box-connectionable': (isConnectionMode && !has(connectionStartBox, box) && has(connectionEndBox, box)),
                  'box-connectionunable': (isConnectionMode && has(connectionStartBox, box) && has(connectionEndBox, box))
                }"
                @connection-start="connectionStartBox = [...arguments]"
                @copy-box="addCopyBox"
                @delete-box="deleteBox"
              />
            </div>
          </template>
        </draggable>

        <div
          ref="cursor"
          :id="connectionCursorID"
          :style="{
            left: `${connectionOffset.x}px`,
            top: `${connectionOffset.y}px`
          }"
          class="box-connection-preview"
        />
      </div>
    </draggable-field>

    <v-overlay :value="isBoxEditorOpen" />
    <v-dialog
      :attach="rootElement"
      :value="isBoxEditorOpen"
      max-width="900"
      hide-overlay
      persistent
      data-app
    >
      <box-editor
        v-if="selectedBox"
        :box="selectedBox"
        @resolve="
          updateBox(...arguments);
          selectedBox = null;
        "
        @reject="selectedBox = null"
      />
    </v-dialog>
  </div>
</template>

<script lang="ts">
import * as JsPlumb from '@jsplumb/browser-ui'
import { ConnectionDetachedParams } from '@jsplumb/core'
import { FlowchartConnector } from '@jsplumb/connector-flowchart'
import { nanoid } from 'nanoid'
import { computed, defineComponent, onMounted, reactive, ref, watch } from '@vue/composition-api'

import { useAdvancedArray, useAdvancedObject, useBox, useElement, useComponentUtils, useStore } from '@/components/common'
import DraggableField from '@/components/draggable/DraggableField.vue'
import Draggable from '@/components/draggable/Draggable.vue'
import BoxEditor from '@/components/box-editor/BoxEditor.vue'
import Box from './Box.vue'

function useBoxManager() {
  const { dispatch, state } = useStore()
  const { createNewBox, copyBox } = useBox()

  const addBox = (e: MouseEvent) => {
    const { offsetX, offsetY } = e
    const { zoom } = state.draggable
    const x = offsetX / zoom
    const y = offsetY / zoom
    dispatch('addBox', createNewBox(x, y))
  }

  const addCopyBox = (box: Codraft.MacroBox) => {
    const clone = copyBox(box)
    dispatch('addBox', clone)
  }

  const deleteBox = (box: Codraft.MacroBox) => dispatch('deleteBox', box.id)

  const updateBox = (box: Codraft.MacroBox) => {
    dispatch('updateBox', box)
  }

  const updateBoxPosition = ({ x, y }: Point2, box: Codraft.MacroBox) => {
    const { id } = box
    dispatch('updateBox', { id, x, y })
  }

  return {
    addBox,
    addCopyBox,
    deleteBox,
    updateBox,
    updateBoxPosition
  }
}

function usePlumb() {
  const { dispatch } = useStore()
  const { remove } = useAdvancedArray()
  const { deepCopy } = useAdvancedObject()
  const { currentQuerySelector } = useComponentUtils()

  const getPlumbBoxID = (plumbID: string, boxID: string) => `plumb__${plumbID}__box__${boxID}`
  const getBoxIDFromPlumbID = (plumbID: string) => plumbID.split('__').pop()

  const connect = (plumbID: string, instance: JsPlumb.BrowserJsPlumbInstance, box: Codraft.MacroBox) => {
    instance.batch(() => {
      const { id, next_box_ids } = box
      const source = currentQuerySelector(`#${getPlumbBoxID(plumbID, id)}`)
      if (source === null) {
        return
      }
      next_box_ids.forEach((nextID) => {
        const target = currentQuerySelector(`#${getPlumbBoxID(plumbID, nextID)}`)
        if (target === null) {
          return
        }
        instance.connect({
          source,
          target,
          deleteEndpointsOnDetach: true,
          connector: {
            type: FlowchartConnector.type,
            options: {
              cornerRadius: 3
            }
          },
          endpoint: {
            type: 'Dot',
            options: {
              radius: 6
            }
          },
          anchor: ['Top', 'Left', 'Right', 'Bottom'],
          overlays: [
            {
              type: 'Arrow',
              options: {
                id: 'arrow',
                location: 1
              }
            }
          ]
        })
      })
    })
  }

  const initConnection = (boxes: Codraft.MacroBox[], plumbID: string, instance: JsPlumb.BrowserJsPlumbInstance, canvas: HTMLElement) => {
    instance.setContainer(canvas)
    instance.unbind('connection:detach')
    instance.bind('connection:detach', (info: ConnectionDetachedParams) => {
      if (info.source && info.target) {
        const sourceBoxID = getBoxIDFromPlumbID(info.source.id)
        const targetBoxID = getBoxIDFromPlumbID(info.target.id)
        const sourceBox = boxes.find((box) => box.id === sourceBoxID)
        const targetBox = boxes.find((box) => box.id === targetBoxID)
        if (sourceBox && targetBox) {
          const clone = deepCopy(sourceBox)
          clone.next_box_ids = remove(clone.next_box_ids, targetBox.id)
          dispatch('updateBox', clone)
        }
      }
    })
    instance.deleteEveryConnection({ fireEvent: false })
    boxes.forEach((box) => connect(plumbID, instance, box))
  }

  const redraw = (instance: JsPlumb.BrowserJsPlumbInstance) => instance.repaintEverything()

  return {
    getPlumbBoxID,
    getBoxIDFromPlumbID,
    connect,
    initConnection,
    redraw
  }
}

function useConnectionPreview() {
  const { dispatch } = useStore()
  const { add } = useAdvancedArray()
  const { deepCopy } = useAdvancedObject()
  const { getPlumbBoxID } = usePlumb()
  const { currentQuerySelector } = useComponentUtils()

  const hidePreviewConnection = (instance: JsPlumb.BrowserJsPlumbInstance, cursorElement: HTMLElement) => {
    const connections = instance.connections.filter((connection) => connection.target.id === cursorElement.id)
    connections.forEach((connection) => {
      instance.deleteConnection(connection)
    })
  }

  const showPreviewConnection = (instance: JsPlumb.BrowserJsPlumbInstance, plumbID: string, box: Codraft.MacroBox, cursorElement: HTMLElement) => {
    hidePreviewConnection(instance, cursorElement)
    instance.batch(() => {
      const source = currentQuerySelector(`#${getPlumbBoxID(plumbID, box.id)}`)
      const target = currentQuerySelector(`#${cursorElement.id}`)
      if (source === null || target === null) {
        console.log(source, target)
        return
      }
      instance.connect({
        source,
        target,
        connector: {
          type: FlowchartConnector.type,
          options: {
            cornerRadius: 3
          }
        },
        endpoint: {
          type: 'Blank',
          options: {
            cssClass: 'pointer-events-none'
          }
        },
        overlays: [
          {
            type: 'Arrow',
            options: {
              id: 'arrow',
              location: 1
            }
          }
        ]
      })
    })
  }

  const connectTo = (sourceBox: Codraft.MacroBox, targetBox: Codraft.MacroBox) => {
    if (sourceBox.id !== targetBox.id) {
      const clone = deepCopy(sourceBox)
      clone.next_box_ids = add(clone.next_box_ids, targetBox.id)
      dispatch('updateBox', clone)
    }
  }

  return {
    showPreviewConnection,
    hidePreviewConnection,
    connectTo
  }
}

export default defineComponent({
  components: {
    DraggableField,
    Draggable,
    BoxEditor,
    Box
  },
  props: {
    boxes: {
      type: Array as () => Codraft.MacroBox[],
      required: true
    }
  },
  setup(props) {
    const { showPreviewConnection, hidePreviewConnection, connectTo } = useConnectionPreview()
    const { addBox, addCopyBox, updateBox, updateBoxPosition, deleteBox } = useBoxManager()
    const { getPlumbBoxID, initConnection, redraw } = usePlumb()
    const { rootElement } = useComponentUtils()
    const { isElement } = useElement()

    const canvas = ref<HTMLDivElement|null>(null)
    const cursor = ref<HTMLDivElement|null>(null)
    const plumbInstance = JsPlumb.newInstance({ container: rootElement.value })
    const plumbID = nanoid()

    const selectedBox = ref<Codraft.MacroBox|null>(null)
    const connectionStartBox = ref<Codraft.MacroBox[]>([])
    const connectionEndBox = ref<Codraft.MacroBox[]>([])
    const connectionOffset = reactive<Point2>({ x: 0, y: 0 })
    const connectionCursorID = computed(() => `box-preview-cursor-${plumbID}`)
    const isBoxEditorOpen = computed(() => !!selectedBox.value)
    const isConnectionMode = computed(() => !!connectionStartBox.value.length)

    const updateConnectionDrawing = () => redraw(plumbInstance)

    onMounted(() => {
      const canvasEl = canvas.value
      const cursorEl = cursor.value
      if (isElement(canvasEl) && isElement(cursorEl)) {
        initConnection(props.boxes, plumbID, plumbInstance, canvasEl)
        watch(() => props.boxes, (boxes) => initConnection(boxes, plumbID, plumbInstance, canvasEl))
        watch(connectionOffset, updateConnectionDrawing)
        watch(connectionStartBox, (boxes) => {
          if (!boxes.length) {
            return hidePreviewConnection(plumbInstance, cursorEl)
          }
          boxes.forEach((box) => showPreviewConnection(plumbInstance, plumbID, box, cursorEl))
        })
      }
      else {
        throw new Error(`Some element is not loaded. canvas = ${canvasEl}, cursor = ${cursorEl}`)
      }
    })

    return {
      selectedBox,
      connectionStartBox,
      connectionEndBox,
      connectionOffset,
      isBoxEditorOpen,
      isConnectionMode,
      canvas,
      cursor,
      plumbID,
      connectionCursorID,
      updateConnectionDrawing,
      getPlumbBoxID,
      addBox,
      addCopyBox,
      updateBox,
      updateBoxPosition,
      deleteBox,
      connectTo,
      ...useAdvancedArray(),
      ...useComponentUtils()
    }
  }
})
</script>

<style lang="scss">
.pointer-events-none {
  pointer-events: none;
}
</style>

<style lang="scss" scoped>
.box-canvas-wrapper {
  width: 100%;
  height: 100%;
}

.box-canvas {
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
}

.box-connection-preview {
  width: 1px;
  height: 1px;
  position: absolute;
  pointer-events: none;
}

.box-connectionable {
  outline: 3px solid orange;
}

.box-connectionunable {
  outline: 3px solid red;
}
</style>