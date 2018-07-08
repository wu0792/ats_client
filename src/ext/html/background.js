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
                        mutations: []
                    }
                }

                existed.mutations.push({
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