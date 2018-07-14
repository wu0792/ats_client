import * as CONSTS from './consts'

const Selector = require('css-selector-generator')
const selector = new Selector()

let tabId = 0,
    domHasLoaded = false,
    mutationObserver = null,
    connContentAndPanel = null

const connContentAndBackground = chrome.runtime.connect({ name: CONSTS.CONNECT_ID_INIT_CONTENT })

// watch dom modification
function watchDomMutations() {
    mutationObserver = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            const target = mutation.target,
                targetSelector = target && target.getRootNode() === document ? selector.getSelector(mutation.target) : ''

            if (targetSelector) {
                const message = {
                    action: CONSTS.ACTION_TYPES.DOM_MUTATION.key,
                    type: mutation.type,
                    target: targetSelector,
                    addedNodes: mutation.addedNodes,
                    attributeName: mutation.attributeName,
                    removedNodes: mutation.removedNodes
                }

                connContentAndBackground.postMessage(message)
                connContentAndPanel.postMessage(message)
            }
        })
    })

    mutationObserver.observe(document.documentElement, {
        attributes: true,
        characterData: true,
        childList: true,
        subtree: true,
        attributeOldValue: true,
        characterDataOldValue: true
    })
}

// stop watch dom modification
function stopWatchDomMutations() {
    if (mutationObserver) {
        mutationObserver.disconnect()
    }
}

function doListenUserKeydown(ev) {
    const { target, keyCode, ctrlKey, shiftKey, altKey } = ev,
        targetSelector = target && target.getRootNode() === document ? selector.getSelector(target) : ''

    if (targetSelector) {
        const message = { action: CONSTS.ACTION_TYPES.USER_ACTIVITY.key, target: targetSelector, keyCode, ctrlKey, shiftKey, altKey }
        connContentAndBackground.postMessage(message)
        connContentAndPanel.postMessage(message)
    }
}

//watch user input, hover
function watchUserActivity() {
    document.addEventListener('keydown', doListenUserKeydown)
}

//watch user input, hover
function stopWatchUserActivity() {
    document.removeEventListener('keydown', doListenUserKeydown)
}

document.addEventListener('DOMContentLoaded', function () {
    domHasLoaded = true
})

chrome.runtime.onConnect.addListener(function (port) {
    switch (port.name) {
        case CONSTS.CONNECT_ID_INIT_PANEL:
            connContentAndPanel = port
            port.onMessage.addListener(function (msg) {
                const { action, tabId: activeTabId } = msg

                if (action === 'init' && activeTabId) {
                    tabId = activeTabId

                    if (domHasLoaded) {
                        watchDomMutations()
                        watchUserActivity()
                    } else {
                        document.addEventListener('DOMContentLoaded', function () {
                            domHasLoaded = true

                            watchDomMutations()
                            watchUserActivity()
                        })
                    }
                } else if (action === 'stop') {
                    stopWatchDomMutations()
                    stopWatchUserActivity()
                }
            })
            break
        default:
            break
    }
})
