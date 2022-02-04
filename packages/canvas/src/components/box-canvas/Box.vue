<template>
  <v-card
    :min-width="300"
    :max-width="500"
    class="box movable"
    dark
  >
    <div class="grey darken-3 pt-2 pb-1">
      <v-card-title class="py-0">
        <div class="box-head d-flex">
          <span
            v-if="box.comment"
            v-text="box.comment"
            class="box-comment flex-grow-0 flex-shrink-1 text-subtitle-1"
          />
          <span
            v-else
            class="text-overline grey--text"
          >
            주석 없음
          </span>
          <v-spacer />
          <div class="flex-shrink-0">
            <v-tooltip
              v-for="(control, i) in controls"
              :key="`box-control-${i}`"
              :attach="rootElement"
              right
            >
              <template v-slot:activator="{ on }">
                <v-btn
                  v-on="on"
                  class="box-button"
                  small
                  icon
                  @click="control.click($event, box)"
                >
                  <v-icon small>{{ control.icon }}</v-icon>
                </v-btn>
              </template>
              <span class="text-caption">{{ control.description }}</span>
            </v-tooltip>
          </div>
        </div>
      </v-card-title>
    </div>

    <div>
      <v-subheader class="grey--text text-overline">Event</v-subheader>
      <box-list
        :save_formats="box.events"
        :commands="$store.state.command.events"
      />

      <v-subheader class="grey--text text-overline mt-2">Conditions</v-subheader>
      <box-list
        :save_formats="box.conditions"
        :commands="$store.state.command.conditions"
      />

      <v-subheader class="grey--text text-overline mt-2">Actions</v-subheader>
      <box-list
        :save_formats="box.actions"
        :commands="$store.state.command.actions"
      />
    </div>

    <v-card-actions></v-card-actions>
  </v-card>
</template>

<script lang="ts">
import { Codraft } from '@typings/codraft'

import { defineComponent, ref } from '@vue/composition-api'

import { useComponentUtils } from '@/components/common'

import BoxList from './BoxList.vue'

interface BoxControl {
  icon: string
  description: string
  // eslint-disable-next-line no-unused-vars
  click: (e: MouseEvent, box: Codraft.MacroBox) => void
}

export default defineComponent({
  components: {
    BoxList
  },
  emits: ['connection-start', 'copy-box', 'delete-box'],
  props: {
    box: {
      type: Object as () => Codraft.MacroBox,
      required: true
    }
  },
  setup(_props, { emit }) {
    const controls = ref<BoxControl[]>([
      {
        icon: 'mdi-link-variant-plus',
        description: '박스를 연결합니다.',
        click(_e, box) {
          emit('connection-start', box)
        }
      },
      {
        icon: 'mdi-content-copy',
        description: '박스를 복사합니다.',
        click(_e, box) {
          emit('copy-box', box)
        }
      },
      {
        icon: 'mdi-delete-forever',
        description: '박스를 삭제합니다.',
        click(_e, box) {
          emit('delete-box', box)
        }
      }
    ])

    return {
      controls,
      ...useComponentUtils()
    }
  }
})
</script>

<style lang="scss" scoped>
.box {
  user-select: none;
  cursor: pointer;

  .box-head {
    width: 100%;
    min-width: 0;
  }

  .box-button {
    vertical-align: top;
  }

  .box-comment {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>