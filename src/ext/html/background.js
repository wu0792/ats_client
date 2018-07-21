import * as CONSTS from './consts'

let tabs = new Map(),
    activeTabId = 0,
    allActionKeys = CONSTS.ACTION_TYPES.enums.map(theEnum => theEnum.value.key)

function ensureExist(tabId) {
    let existed = tabs.get(tabId)

    if (existed) {
        return existed
    } else {
        existed = {}
        allActionKeys.forEach(actionKey => {
            Object.assign(existed, { [actionKey]: [] })
        })
    }

    return existed
}

chrome.runtime.onConnect.addListener(function (port) {
    switch (port.name) {
        case CONSTS.CONNECT_ID_INIT_PANEL:
            port.onMessage.addListener(function (msg) {
                const { action, tabId } = msg

                if (action === 'init' && tabId) {
                    activeTabId = tabId
                } else if (action === 'listen' && activeTabId) {
                    const existed = ensureExist(activeTabId),
                        theActionEnum = CONSTS.ACTION_TYPES.NETWORK

                    existed[theActionEnum.value.key].push(theActionEnum.value.wrapMessage(msg))

                    tabs.set(activeTabId, existed)

                    chrome.storage.local.set({ [`ats_${activeTabId}`]: { data: existed, update_at: new Date() } })

                    console.log('receive network:')
                    console.log(existed)
                } else if (action === 'stop') {
                    console.log('background.js receive stop action from panel.')
                } else if (action === 'save') {
                    const existed = ensureExist(activeTabId)
                    port.postMessage({ action: 'dump', data: existed })
                }
            })
            break
        // track network
        case CONSTS.CONNECT_ID_INIT_CONTENT:
            port.onMessage.addListener(function (msg) {
                let action = msg.action
                const theActionEnum = CONSTS.ACTION_TYPES.get(action)
                if (theActionEnum) {
                    let existed = ensureExist(activeTabId)

                    existed[theActionEnum.value.key].push(theActionEnum.value.wrapMessage(msg))
                    tabs.set(activeTabId, existed)

                    console.log(`receive ${theActionEnum.key}`)
                    console.log(existed)
                }
            })
            break
        default:
            break
    }
})

