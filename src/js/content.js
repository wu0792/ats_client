import * as CONSTS from './consts'
import { UserActivityListener } from './userActivityListener';

let connContentAndPanel = null,
    userActivityListener = null,
    rootTargetSelectors = []

const connContentAndBackground = chrome.runtime.connect({ name: CONSTS.CONNECT_ID_INIT_CONTENT })

let handlers = {}

//watch user input, hover
function listen(phase) {
    userActivityListener = new UserActivityListener(
        [connContentAndBackground, connContentAndPanel],
        CONSTS.ACTION_TYPES.enums.filter(theEnum => theEnum.value.listenInContentPhase === phase))

    const newHandlers = userActivityListener.listen(document, rootTargetSelectors)
    Object.assign(handlers, newHandlers)
}

//watch user input, hover
function stopListen() {
    userActivityListener && handlers.length && userActivityListener.stopListen(document, handlers)
    handlers = {}
}

chrome.runtime.onConnect.addListener(function (port) {
    switch (port.name) {
        case CONSTS.CONNECT_ID_INIT_PANEL:
            connContentAndPanel = port
            port.onMessage.addListener(function (msg) {
                const { action, tabId, url, rootTargetSelectors: theRootTargetSelectors } = msg
                if (action === 'init' && tabId && url) {
                    rootTargetSelectors = theRootTargetSelectors

                    stopListen()
                    listen(CONSTS.LISTEN_IN_CONTENT_PHASE.INIT)
                } else if (action === 'record') {
                    listen(CONSTS.LISTEN_IN_CONTENT_PHASE.RECORD)
                } else if (action === 'stop') {
                    stopListen()
                }
            })
            break
        default:
            break
    }
})
