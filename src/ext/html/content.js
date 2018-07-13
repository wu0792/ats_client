const Selector = require('css-selector-generator')
const selector = new Selector()

let currentTabId = 0

function watchDomMutations() {
    var connection = chrome.runtime.connect({
        name: "ats_watch_dom_mutation"
    })

    var mutationObserver = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            const targetSelector = mutation.target && mutation.target.parentNode ? selector.getSelector(mutation.target) : ''

            if (targetSelector) {
                connection.postMessage({
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

function watchUserActivities() {
    var connection = chrome.runtime.connect({
        name: "ats_watch_user_activities"
    })

    document.addEventListener('keydown', function (ev) {
        /*
            ev.target:      <input id=​"kw" name=​"wd" class=​"s_ipt" value maxlength=​"255" autocomplete=​"off">​
            ev.keyCode:     96
            ev.ctrlKey:     false
            ev.shiftKey:    false
        */

        const { target, keyCode, ctrlKey, shiftKey } = ev,
            targetSelector = target && target.parentNode ? selector.getSelector(target) : ''

        if (targetSelector) {
            connection.postMessage({ target: selector.getSelector(target), keyCode, ctrlKey, shiftKey })
        }

    })
}

document.addEventListener('DOMContentLoaded', function () {

    watchDomMutations()
    watchUserActivities()

    // chrome.runtime.onConnect.addListener(function (port) {
    //     // track open devtools ats panel
    //     if (port.name == "ats_devtools_content") {
    //         port.onMessage.addListener(function (msg) {
    //             const { tabId } = msg
    //             currentTabId = tabId
    //         })

    //         watchDomMutations()
    //         watchUserActivities()
    //     }
    // })
})

