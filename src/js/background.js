import * as CONSTS from './consts'
import { getNow } from '../common';

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

                    var version = "1.0";

                    chrome.debugger.attach({ //debug at current tab
                        tabId: tabId
                    }, version, onAttach.bind(null, tabId))

                    function onAttach(tabId) {
                        chrome.debugger.sendCommand({ //first enable the Network
                            tabId: tabId
                        }, "Network.enable")

                        chrome.debugger.onEvent.addListener(allEventHandler)
                    }

                    function allEventHandler(debuggeeId, message, params) {
                        if (tabId !== debuggeeId.tabId) {
                            return
                        }

                        if (message === "Network.responseReceived") { //response return 
                            chrome.debugger.sendCommand({
                                tabId: tabId
                            }, "Network.getResponseBody", {
                                    "requestId": params.requestId
                                }, function (response) {
                                    // chrome.debugger.detach(debuggeeId);
                                    let url = params.response ? params.response.url : ''
                                    if (url) {
                                        if (params.response && params.response.headers && (params.response.headers["content-type"] || params.response.headers["Content-Type"] || '').toLowerCase().indexOf('image') >= 0) {
                                            return
                                        } else {
                                            let existed = ensureExist(tabId)
                                            existed[NETWORK_REDUNDANT].push({ url, body: response ? response.body : null })
                                        }
                                    }
                                });
                        }
                    }
                } else if (action === 'save') {
                    let existed = ensureExist(activeTabId),
                        networks = existed[CONSTS.ACTION_TYPES.NETWORK.key.toLowerCase()],
                        networksRedundant = existed[NETWORK_REDUNDANT]

                    networks.forEach(network => {
                        let { id, url, body, status } = network
                        if (body === null && Math.floor(status / 100) !== 3) {
                            let networksOfSameUrl = networks.filter(item => item.url === url),
                                sequence = networksOfSameUrl.findIndex(item => item.id === id)

                            if (sequence >= 0) {
                                let networksRedundantOfSameUrl = networksRedundant.filter(item => item.url === url),
                                    matchedNetworksRedundant = networksRedundantOfSameUrl[sequence]

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

