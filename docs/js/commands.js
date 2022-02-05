import event_click from './command/event/click.js'
import event_contextmenu from './command/event/contextmenu.js'
import event_keydown from './command/event/keydown.js'
import event_keyup from './command/event/keyup.js'
import event_mousedown from './command/event/mousedown.js'
import event_mousemove from './command/event/mousemove.js'
import event_mouseup from './command/event/mouseup.js'
import event_ready from './command/event/ready.js'
import event_wheel from './command/event/wheel.js'

export const events = [
  event_click,
  event_contextmenu,
  event_keydown,
  event_keyup,
  event_mousedown,
  event_mousemove,
  event_mouseup,
  event_ready,
  event_wheel
]

import condition_checkEnvironment from './command/condition/check-environment.js'
import condition_checkMouseWhich from './command/condition/check-mouse-which.js'
import condition_checkProtocol from './command/condition/check-protocol.js'
import condition_variable from './command/condition/variable.js'

export const conditions = [
  condition_checkEnvironment,
  condition_checkMouseWhich,
  condition_checkProtocol,
  condition_variable
]

import action_alert from './command/action/alert.js'
import action_confirm from './command/action/confirm.js'
import action_consolelog from './command/action/consolelog.js'
import action_deleteVariable from './command/action/delete-variable.js'
import action_DOMAttribute from './command/action/DOM-attribute.js'
import action_locationReplace from './command/action/location-replace.js'
import action_mousePosition from './command/action/mouse-position.js'
import action_prompt from './command/action/prompt.js'
import action_settimeout from './command/action/settimeout.js'
import action_variable from './command/action/variable.js'
import action_windowOpen from './command/action/window-open.js'

export const actions = [
  action_alert,
  action_confirm,
  action_consolelog,
  action_deleteVariable,
  action_DOMAttribute,
  action_locationReplace,
  action_mousePosition,
  action_prompt,
  action_settimeout,
  action_variable,
  action_windowOpen
]