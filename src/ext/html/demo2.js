var count = 1
setInterval(function () {
    document.querySelector('#count').value = count++
}, 1000)

var count2 = 1
document.addEventListener('DOMContentLoaded', function () {
    document.querySelector('#reload').addEventListener('click', function () {
        count2++
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            if (tabs.length) {
                var activeTab = tabs[0]

                chrome.tabs.reload(activeTab.id, { bypassCache: false }, function () {
                    alert(`count2:${count2}`)
                    // alert(`arugments:${JSON.stringify(Array.from(arguments))}`)
                })
            }
        })
    })
})


// var count2 = 1
// document.addEventListener('DOMContentLoaded', function () {
//     count2++
//     chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
//         if (tabs.length) {
//             var activeTab = tabs[0]

//             chrome.tabs.reload(activeTab.id, { bypassCache: false }, function () {
//                 alert(`count2:${count2}`)
//                 // alert(`arugments:${JSON.stringify(Array.from(arguments))}`)
//             })
//         }
//     })
// });