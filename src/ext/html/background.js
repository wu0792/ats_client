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

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        console.log(sender.tab ?
            "from a content script:" + sender.tab.url :
            "from the extension");
        if (request.greeting == "hello") {
            alert('send messeage')
            sendResponse({ farewell: "goodbye" });
        }
    });

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
        console.log(sender.tab ?
            "from a content script:" + sender.tab.url :
            "from the extension");

        if (request.getActiveTab === true) {
            activeTabId = request.tabId
            sendResponse({ data: "ok" })

            chrome.tabs.reload(activeTabId, { bypassCache: false }, function () {
                //  alert(`arugments:${JSON.stringify(Array.from(arguments))}`)
            })
        }
    });