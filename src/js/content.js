import * as CONSTS from './consts'
import { UserActivityListener } from './userActivityListener';

let connContentAndPanel = null,
    userActivityListener = null

const connContentAndBackground = chrome.runtime.connect({ name: CONSTS.CONNECT_ID_INIT_CONTENT })

let handlers = []

//watch user input, hover
function listen() {
    userActivityListener = new UserActivityListener(
        [connContentAndBackground, connContentAndPanel],
        [CONSTS.ACTION_TYPES.DOM_MUTATION,
        CONSTS.ACTION_TYPES.KEYDOWN,
        CONSTS.ACTION_TYPES.MOUSE_OVER,
        CONSTS.ACTION_TYPES.CLICK,
        CONSTS.ACTION_TYPES.SCROLL,
        CONSTS.ACTION_TYPES.RESIZE])

    handlers = userActivityListener.listen(document)
}

//watch user input, hover
function stopListen() {
    userActivityListener && handlers.length && userActivityListener.stopListen(document, handlers)
}

chrome.runtime.onConnect.addListener(function (port) {
    switch (port.name) {
        case CONSTS.CONNECT_ID_INIT_PANEL:
            connContentAndPanel = port
            port.onMessage.addListener(function (msg) {
                const { action, tabId, url } = msg
                if (action === 'init' && tabId && url) {
                    stopListen()
                    listen()
                } else if (action === 'stop') {
                    stopListen()
                }
            })
            break
        default:
            break
    }
})
