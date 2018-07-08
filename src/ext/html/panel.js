//notify background
var connection = chrome.runtime.connect({
    name: "ats_devtools"
})

chrome.devtools.network.onRequestFinished.addListener(
    function (request) {
        request.getContent(function (content) {
            let url = request.request.url,
                method = request.request.method,
                body = content,
                date = request.startedDateTime,
                tabId = chrome.devtools.inspectedWindow.tabId

            connection.postMessage({ type: 'network.request', url, method, body, date, tabId })
        })
    })