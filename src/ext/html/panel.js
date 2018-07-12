//notify background
var connectionToBackground = chrome.runtime.connect({ name: "ats_devtools_background" })
var connectionToContent = chrome.runtime.connect({ name: "ats_devtools_content" })

connectionToContent.postMessage({ tabId: chrome.devtools.inspectedWindow.tabId })

chrome.devtools.network.onRequestFinished.addListener(
    function (request) {
        request.getContent(function (content) {
            const { request: innerRequest, startedDateTime: date } = request,
                { url, postData, method } = innerRequest,
                body = content,
                tabId = chrome.devtools.inspectedWindow.tabId

            connectionToBackground.postMessage({ type: 'network.request', url, method, body, postData, date, tabId })
        })
    })