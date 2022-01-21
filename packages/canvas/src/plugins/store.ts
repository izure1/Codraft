import Vue from 'vue'
import Vuex from 'vuex'
import { addFromID, getItemFromID, removeFromID } from '@/utils/advancedArray'

Vue.use(Vuex)

type DragEvents = 'drag-start'|'dragging'|'drag-end'
type DraggableState = { event: DragEvents|null, updatedAt: number }

export default new Vuex.Store({
  state: {
    draggable: {
      id: null as string|null,
      offset: { x: 0, y: 0 } as Point2,
      state: { event: null, updatedAt: 0 } as DraggableState,
      zoom: 1,
    },
    command: {
      events: [] as Codraft.MacroCommand[],
      conditions: [] as Codraft.MacroCommand[],
      actions: [] as Codraft.MacroCommand[]
    },
    box: {
      boxes: [] as Codraft.MacroBox[]
    }
  },
  mutations: {
    setDraggableOffset(state, { x, y }: Point2) {
      state.draggable.offset.x = x
      state.draggable.offset.y = y
    },
    setDraggableID(state, id: string|null) {
      state.draggable.id = id
    },
    setDraggableState(state, status: DraggableState) {
      state.draggable.state = status
    },
    setDraggableZoom(state, zoom: number) {
      state.draggable.zoom = zoom
    },
    setEventCommands(state, commands: Codraft.MacroCommand[]) {
      state.command.events = commands
    },
    setConditionCommands(state, commands: Codraft.MacroCommand[]) {
      state.command.conditions = commands
    },
    setActionCommands(state, commands: Codraft.MacroCommand[]) {
      state.command.actions = commands
    },
    setBoxes(state, boxes: Codraft.MacroBox[]) {
      state.box.boxes = boxes
    }
  },
  actions: {
    setDraggableOffset({ commit }, offset: Point2) {
      commit('setDraggableOffset', offset)
    },
    setDraggableID({ commit }, id: string|null) {
      commit('setDraggableID', id)
    },
    updateDraggableState({ commit }, event: DragEvents|null) {
      const updatedAt = Date.now()
      commit('setDraggableState', { event, updatedAt })
    },
    setDraggableZoom({ commit }, zoom: number) {
      commit('setDraggableZoom', zoom)
    },
    addEventCommand({ commit, state }, command: Codraft.MacroCommand) {
      commit('setEventCommands', addFromID(state.command.events, command))
    },
    deleteEventCommand({ commit, state }, commandID: string) {
      commit('setEventCommands', removeFromID(state.command.events, commandID))
    },
    addConditionCommand({ commit, state }, command: Codraft.MacroCommand) {
      commit('setConditionCommands', addFromID(state.command.conditions, command))
    },
    deleteConditionCommand({ commit, state }, commandID: string) {
      commit('setConditionCommands', removeFromID(state.command.conditions, commandID))
    },
    addActionCommand({ commit, state }, command: Codraft.MacroCommand) {
      commit('setActionCommands', addFromID(state.command.actions, command))
    },
    deleteActionCommand({ commit, state }, commandID: string) {
      commit('setActionCommands', removeFromID(state.command.actions, commandID))
    },
    setEventCommands({ commit }, commands: Codraft.MacroCommand[]) {
      commit('setEventCommands', commands)
    },
    setConditionCommands({ commit }, commands: Codraft.MacroCommand[]) {
      commit('setConditionCommands', commands)
    },
    setActionCommands({ commit }, commands: Codraft.MacroCommand[]) {
      commit('setActionCommands', commands)
    },
    addBox({ commit, state }, box: Codraft.MacroBox) {
      commit('setBoxes', addFromID(state.box.boxes, box))
    },
    updateBox({ commit, state }, box: Codraft.MacroBox) {
      const origin = getItemFromID(state.box.boxes, box.id)
      if (origin === null) {
        commit('setBoxes', addFromID(state.box.boxes, box))
      }
      else {
        const mixedBox = { ...origin, ...box }
        const clones = [...state.box.boxes]
        const i = clones.findIndex((box) => box.id === mixedBox.id)
        if (i !== -1) {
          clones.splice(i, 1, mixedBox)
          commit('setBoxes', clones)
        }
      }
    },
    deleteBox({ commit, state }, boxID: string) {
      commit('setBoxes', removeFromID(state.box.boxes, boxID))
    },
    setBoxes({ commit }, boxes: Codraft.MacroBox[]) {
      commit('setBoxes', boxes)
    }
  }
})