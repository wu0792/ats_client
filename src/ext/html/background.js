import * as CONSTS from './consts'
import { getNow } from '../common';

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

let seq = 0

const wrapMessageWithSeq = (message) => {
    return Object.assign(message, { id: seq++, time: getNow() })
}

chrome.runtime.onConnect.addListener(function (port) {
    switch (port.name) {
        case CONSTS.CONNECT_ID_INIT_PANEL:
            port.onMessage.addListener(function (msg) {
                const { action, tabId } = msg

                if (action === 'init' && tabId) {
                    activeTabId = tabId
                    chrome.tabs.executeScript(tabId, { code: 'location.reload()' }, function (result) {
                        port.postMessage({ action: 'start' })
                    })
                } else if (action === 'save') {
                    port.postMessage({ action: 'dump', data: ensureExist(activeTabId) })
                } else if (activeTabId) {
                    const theActionEnum = CONSTS.ACTION_TYPES.get(action)
                    if (theActionEnum) {
                        let existed = ensureExist(activeTabId)

                        existed[theActionEnum.value.key].push(wrapMessageWithSeq(theActionEnum.value.wrapMessage(msg)))
                        tabs.set(activeTabId, existed)

                        console.log(`receive ${theActionEnum.key}`)
                        console.log(existed)
                    }
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

                    existed[theActionEnum.value.key].push(wrapMessageWithSeq(theActionEnum.value.wrapMessage(msg)))
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

