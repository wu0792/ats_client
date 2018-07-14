import * as CONNECT_ID from './consts'

const Selector = require('css-selector-generator')
const selector = new Selector()

let domHasLoaded = false,
    mutationObserver = null

const connectionWatchContent = chrome.runtime.connect({ name: CONNECT_ID.CONNECT_ID_WATCH_CONTENT })

// watch dom modification
function watchDomMutations() {
    mutationObserver = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            const target = mutation.target,
                targetSelector = target && target.getRootNode() === document ? selector.getSelector(mutation.target) : ''

            if (targetSelector) {
                connectionWatchContent.postMessage({
                    action: 'dom_mutation',
                    type: mutation.type,
                    target: targetSelector,
                    addedNodes: mutation.addedNodes,
                    attributeName: mutation.attributeName,
                    removedNodes: mutation.removedNodes
                })
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
        connectionWatchContent.postMessage({ action: 'user_activities', target: targetSelector, keyCode, ctrlKey, shiftKey, altKey })
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

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        switch (request.name) {
            case CONNECT_ID.CONNECT_ID_WATCH_PANEL:
                switch (request.action) {
                    case 'start':
                        console.log('start listen dom mutation and user activities')

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
                        break
                    case 'stop':
                        console.log('content stop watch dom mutation and user activities')
                        stopWatchDomMutations()
                        stopWatchUserActivity()
                        break
                    default:
                        break
                }
        }
    })