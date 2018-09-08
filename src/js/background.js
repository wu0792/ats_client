import * as CONSTS from './common/consts'
import { getNow } from './common/getNow'

const NETWORK_REDUNDANT = 'network_redundant'

let tabs = new Map(),
    activeTabId = 0,
    allActionKeys = [...CONSTS.ACTION_TYPES.enums.map(theEnum => theEnum.key.toLowerCase()), NETWORK_REDUNDANT]

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
                    seq = 0
                    tabs = new Map()
                    chrome.tabs.executeScript(tabId, { code: 'location.reload()' }, function (result) {
                        port.postMessage({ action: 'start' })
                    })
                } else if (action === 'save') {
                    let existed = ensureExist(activeTabId),
                        networks = existed[CONSTS.ACTION_TYPES.NETWORK.key.toLowerCase()],
                        networksRedundant = existed[NETWORK_REDUNDANT]

                    networks.forEach(network => {
                        let { id, url, body, status } = network
                        if ((body === null || body === undefined) && Math.floor(status / 100) !== 3) {
                            let networksOfSameUrl = networks.filter(item => item.url === url),
                                sequence = networksOfSameUrl.findIndex(item => item.id === id)

                            if (sequence >= 0) {
                                let networksRedundantOfSameUrl = networksRedundant.filter(item => item.url === url),
                                    matchedNetworksRedundant = networksRedundantOfSameUrl.sort((prev, next) => prev.seq - next.seq)[sequence]

                                if (matchedNetworksRedundant) {
                                    network.body = matchedNetworksRedundant.body
                                }
                            }
                        }
                    })

                    port.postMessage({ action: 'dump', data: Object.assign({}, existed, { [NETWORK_REDUNDANT]: undefined }) })
                } else if (activeTabId) {
                    const theActionEnum = CONSTS.ACTION_TYPES.get(action)
                    if (theActionEnum) {
                        let existed = ensureExist(activeTabId)

                        existed[theActionEnum.key.toLowerCase()].push(wrapMessageWithSeq(theActionEnum.value.wrapMessage(msg)))
                        tabs.set(activeTabId, existed)
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

                    existed[theActionEnum.key.toLowerCase()].push(wrapMessageWithSeq(theActionEnum.value.wrapMessage(msg)))
                    tabs.set(activeTabId, existed)
                }
            })
            break
        default:
            break
    }
})

chrome.runtime.onMessageExternal.addListener(
    function (request, sender, sendResponse) {
        if (activeTabId) {
            const { seq, type, url, body } = request
            switch (type) {
                case 'network':
                    let existed = ensureExist(activeTabId)
                    existed[NETWORK_REDUNDANT].push({ seq, url, body })
                    break
            }
        }
    })