// chrome.runtime.onMessage.addListener(function (message, callback) {
//     if (message.data == 'setAlarm') {
//         chrome.alarms.create({ delayInMinutes: 5 })
//     } else if (message.data == 'runLogic') {
//         chrome.tabs.executeScript({ file: 'logic.js' });
//     } else if (message.data == 'changeColor') {
//         chrome.tabs.executeScript(
//             { code: 'document.body.style.backgroundColor="orange"' });
//     };
// });

// chrome.runtime.onMessage.addListener(
//     function (request, sender, sendResponse) {
//         console.log(sender.tab ?
//             "from a content script:" + sender.tab.url :
//             "from the extension");
//         if (request.greeting == "hello") {
//             alert('send messeage')
//             sendResponse({ farewell: "goodbye" });
//         }
//     });

// var hasClicked = false
// chrome.browserAction.onClicked.addListener(function () {
//     if (hasClicked === false) {
//         hasClicked = true
//         window.open('./html/demo2.html', 'testwindow', 'width=700,height=600');
//     }
// });    

var activeTabId = 0
chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        // chrome.webRequest.onBeforeRequest.addListener(function (detail) {
        //     console.log(`arguments from  the onBeforeRequest: ${JSON.stringify(detail)}`)
        // })

        if (request.getActiveTab === true) {
            activeTabId = request.tabId
            console.log(`activeTabId:${activeTabId}`)

            var mutationObserver = new MutationObserver(function (mutations) {
                mutations.forEach(function (mutation) {
                    console.log(mutation);
                });
            })

            mutationObserver.observe(document.documentElement, {
                attributes: true,
                characterData: true,
                childList: true,
                subtree: true,
                attributeOldValue: true,
                characterDataOldValue: true
            })

            // chrome.tabs.executeScript(activeTabId, {
            //     code: `window.abc = 321`
            // });

            // chrome.tabs.reload(activeTabId, { bypassCache: false }, function () {
            //     //notify that reload is finished
            //     sendResponse({ data: "ok" })
            //     //  alert(`arugments:${JSON.stringify(Array.from(arguments))}`)

            //     // chrome.devtools.network.onRequestFinished.addListener(function () {
            //     //     var a = 1
            //     // })
            // })
        }
    });

// chrome.webRequest.onBeforeRequest.addListener(function (detail) {
//     console.log(`onBeforeRequest: ${JSON.stringify(detail)}`)
// }, {
//         urls: ["http://*/*", "https://*/*"]
//     })

// chrome.webRequest.onCompleted.addListener(function () {
//     console.log(`onCompleted: ${JSON.stringify(Array.from(arguments))}`)
// }, {
//         urls: ["http://*/*", "https://*/*"]
//     })

// chrome.devtools.network.onRequestFinished.addListener(
//     function (request) {
//         // if (request.response.bodySize > 40 * 1024) {
//         //     chrome.devtools.inspectedWindow.eval(
//         //         'console.log("Large image: " + unescape("' +
//         //         escape(request.request.url) + '"))');
//         // }
//         console.log(`onRequestFinished: ${JSON.stringify(Array.from(arguments))}`)
//     });

// chrome.extension.onRequest.addListener(function (request) {
//     if (request.command !== 'sendToConsole')
//         return;

//     chrome.tabs.executeScript(request.tabId, {
//         code: "(" + tab_log + ")('" + request.args + "');",
//     });
// });