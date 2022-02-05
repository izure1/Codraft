import e1 from './event/click.js'
import e2 from './event/contextmenu.js'
import e3 from './event/keydown.js'
import e4 from './event/keyup.js'
import e5 from './event/mousedown.js'
import e6 from './event/mousemove.js'
import e7 from './event/mouseup.js'
import e8 from './event/ready.js'
import e9 from './event/wheel.js'

import c1 from './condition/check-environment.js'
import c2 from './condition/check-mouse-which.js'
import c3 from './condition/check-protocol.js'
import c4 from './condition/variable.js'

import a1 from './action/alert.js'
import a2 from './action/confirm.js'
import a3 from './action/consolelog.js'
import a4 from './action/prompt.js'
import a5 from './action/variable.js'
import a6 from './action/mouse-position.js'
import a7 from './action/DOM-attribute.js'
import a8 from './action/delete-variable.js'

export const events = [e1, e2, e3, e4, e5, e6, e7, e8, e9]
export const conditions = [c1, c2, c3, c4]
export const actions = [a1, a2, a3, a4, a5, a6, a7, a8]