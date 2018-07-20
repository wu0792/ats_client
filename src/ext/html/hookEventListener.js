// const oldAddEventListener = EventTarget.prototype.addEventListener
// EventTarget.prototype.addEventListener = function (eventName, handler, opts) {
//     console.log(`addEventListener.${eventName}:`)
//     console.log(handler)
//     console.log(this)
//     oldAddEventListener.bind(this)(eventName, handler, opts)
// }

// window.alert = function (msg) {
//     console.log('hey:' + msg)
// }

// alert('hi')