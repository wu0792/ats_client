var mutationSet = new Map()
/**
 * [
 *   1: {
 *      url: 'abc.com',
 *      mutaions: [
 *          {
 *              type: 'add',
 *              selector: '#searchBtn'
 *          }
 *      ]
 *   }
 * ]
 */

function getActiveTab(cb) {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        if (tabs.length) {
            var activeTab = tabs[0]

            cb({ id: activeTab.id, url: activeTab.url })
        }
    })
}

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.ats_domMutation === true) {
            let cb = function ({ id, url }) {
                let existed = mutationSet.get(id)
                if (!existed) {
                    existed = {
                        url,
                        mutation: []
                    }
                }

                existed.mutation.push({
                    time: new Date(),
                    type: 'add',
                    selector: '#btn123'
                })

                mutationSet.set(id, existed)

                console.log('receive mutation message, now the set is:')
                console.log(mutationSet)
            }

            getActiveTab(cb)
        }
    });

var tabs = new Map()

function ensureExist(tabId) {
    let existed = tabs.get(tabId)

    return existed || {
        network: [],
        mutation: [],
        activity: []
    }
}

chrome.runtime.onConnect.addListener(function (port) {
    // track network activity
    if (port.name == "ats_devtools") {
        port.onMessage.addListener(function (msg) {
            const { url, method, body, postData, date, tabId = 0 } = msg
            let existed = ensureExist(tabId)

            existed.network.push({ url, method, body, postData, date })
            tabs.set(tabId, existed)

            chrome.storage.local.set({ [`ats_${tabId}`]: { data: existed, update_at: new Date() } })

            console.log('receive network message, now the set is:')
            console.log(existed)
        })
    }
    //track dom mutations
    else if (port.name === 'ats_watch_dom_mutation') {
        port.onMessage.addListener(function (msg) {
            const { tabId = 0, type, target } = msg

            let existed = ensureExist(tabId)

            existed.mutation.push({ tabId, type, target })
            tabs.set(tabId, existed)

            chrome.storage.local.set({ [`ats_${tabId}`]: { data: existed, update_at: new Date() } })

            console.log('receive mutation message, now the set is:')
            console.log(existed)
        })
    }
    //track user activities
    else if (port.name === 'ats_watch_user_activities') {
        port.onMessage.addListener(function (msg) {
            const { tabId = 0, target, keyCode, ctrlKey, shiftKey } = msg

            let existed = ensureExist(tabId)

            existed.activity.push({ target, keyCode, ctrlKey, shiftKey })
            tabs.set(tabId, existed)

            chrome.storage.local.set({ [`ats_${tabId}`]: { data: existed, update_at: new Date() } })

            console.log('receive user activity message, now the set is:')
            console.log(existed)
        })
    }
})

