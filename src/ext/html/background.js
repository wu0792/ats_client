import * as CONSTS from './consts'

let tabs = new Map(),
    activeTabId = 0

function ensureExist(tabId) {
    let existed = tabs.get(tabId)

    return existed || {
        network: [],
        mutation: [],
        activity: []
    }
}

chrome.runtime.onConnect.addListener(function (port) {
    switch (port.name) {
        case CONSTS.CONNECT_ID_INIT_PANEL:
            port.onMessage.addListener(function (msg) {
                const { action, url, method, body, postData, date, tabId = 0 } = msg

                if (action === 'init' && tabId) {
                    activeTabId = tabId
                } else if (action === 'listen' && activeTabId) {
                    let existed = ensureExist(activeTabId)

                    existed.network.push({ url, method, body, postData, date })
                    tabs.set(activeTabId, existed)

                    chrome.storage.local.set({ [`ats_${activeTabId}`]: { data: existed, update_at: new Date() } })

                    console.log('receive network message, now the set is:')
                    console.log(existed)
                } else if (action === 'stop') {
                    console.log('background.js receive stop action from panel.')
                }
            })
            break
        // track network activity
        case CONSTS.CONNECT_ID_INIT_CONTENT:
            port.onMessage.addListener(function (msg) {
                let action = msg.action
                if (action === CONSTS.ACTION_TYPES.USER_ACTIVITY.key) {
                    const { target, keyCode, ctrlKey, shiftKey, altKey } = msg

                    let existed = ensureExist(activeTabId)

                    existed.activity.push({ target, keyCode, ctrlKey, shiftKey, altKey })
                    tabs.set(activeTabId, existed)

                    console.log('receive user activity message, now the set is:')
                    console.log(existed)
                } else if (action === CONSTS.ACTION_TYPES.DOM_MUTATION.key) {
                    const { type, target } = msg

                    let existed = ensureExist(activeTabId)

                    existed.mutation.push({ activeTabId, type, target })
                    tabs.set(activeTabId, existed)

                    console.log('receive mutation message, now the set is:')
                    console.log(existed)
                }
            })
            break
        default:
            break
    }
})

