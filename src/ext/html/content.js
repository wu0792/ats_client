import * as CONSTS from './consts'
import { UserActivityListener } from './userActivityListener';

let tabId = 0,
    domHasLoaded = false,
    connContentAndPanel = null,
    userActivityListener = null

const //COMMON_THRESHOLD = 500,
    connContentAndBackground = chrome.runtime.connect({ name: CONSTS.CONNECT_ID_INIT_CONTENT })

let handlers = []

//watch user input, hover
function listen() {
    userActivityListener = new UserActivityListener(
        [connContentAndBackground, connContentAndPanel],
        [CONSTS.ACTION_TYPES.DOM_MUTATION,
        CONSTS.ACTION_TYPES.USER_ACTIVITY_KEYDOWN,
        CONSTS.ACTION_TYPES.USER_ACTIVITY_CLICK,
        CONSTS.ACTION_TYPES.USER_ACTIVITY_SCROLL,
        CONSTS.ACTION_TYPES.USER_ACTIVITY_RESIZE])

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
                const { action, tabId: activeTabId } = msg

                if (action === 'init' && activeTabId) {
                    tabId = activeTabId
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
