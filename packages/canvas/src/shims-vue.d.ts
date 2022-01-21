/* eslint-disable no-unused-vars */
declare module '*.vue' {
  import Vue, { PluginFunction } from 'vue'
  export default Vue
}

declare module 'vuetify/lib/framework' {
  const _: PluginFunction
  export default _
}