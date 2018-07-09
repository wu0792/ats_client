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

// track network activity
var tabs = new Map()
chrome.runtime.onConnect.addListener(function (port) {
    if (port.name == "ats_devtools") {
        port.onMessage.addListener(function (msg) {
            const { url, method, body, postData, date, tabId } = msg
            let existed = tabs.get(tabId)

            if (!existed) {
                existed = {
                    network: [],
                    mutation: []
                }
            }

            existed.network.push({ url, method, body, postData, date })
            tabs.set(tabId, existed)

            chrome.storage.local.get([`ats_${tabId}`], function (result) {
                console.log('Value currently is ' + result.key);
            });

            chrome.storage.local.set({ [`ats_${tabId}`]: { data: existed, update_at: new Date() } })

            console.log('receive network message, now the set is:')
            console.log(existed)
        })
    }
});