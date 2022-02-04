import e1 from './event/click.js'
import e2 from './event/contextmenu.js'
import e3 from './event/keydown.js'
import e4 from './event/keyup.js'
import e5 from './event/mousedown.js'
import e6 from './event/mousemove.js'
import e7 from './event/mouseup.js'
import e8 from './event/ready.js'
import e9 from './event/wheel.js'

import c1 from './condition/checkEnvironment.js'
import c2 from './condition/checkMouseWhich.js'
import c3 from './condition/checkProtocol.js'

import a1 from './action/alert.js'
import a2 from './action/confirm.js'
import a4 from './action/consolelog.js'
import a3 from './action/prompt.js'

export const events = [e1, e2, e3, e4, e5, e6, e7, e8, e9]
export const conditions = [c1, c2, c3]
export const actions = [a1, a2, a3, a4]