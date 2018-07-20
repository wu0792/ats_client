import Enum from 'enum'

const Selector = require('css-selector-generator')
const selector = new Selector()

export const CONNECT_ID_INIT_PANEL = 'CONNECT_ID_INIT_PANEL'
export const CONNECT_ID_INIT_CONTENT = 'CONNECT_ID_INIT_CONTENT'
export const CONNECT_ID_WATCH_DOM_MUTATION = 'CONNECT_ID_WATCH_DOM_MUTATION'
export const CONNECT_ID_WATCH_USER_ACTIVITY = 'CONNECT_ID_WATCH_USER_ACTIVITY'

let lastScrollDate = null,
    lastResizeDate = null

const COMMON_THRESHOLD = 500

export const ACTION_TYPES = new Enum({
    NETWORK: {
        renderTitle: (record) => {
            const { url, method, body, postData, date } = record,
                methodFragmentStr = method === 'POST' ? `postData:${postData}, ` : ''

            return `网络请求: url:${url}, method:${method}, ${methodFragmentStr}reponse: ${body}, date:${date}`
        },
        key: 'network',
        wrapMessage: (msg) => {
            const { url, method, body, postData, date } = msg
            return { url, method, body, postData, date }
        }
    },
    DOM_MUTATION: {
        renderTitle: (record) => {
            const { type, target, addedNodes, attributeName, removedNodes } = record

            return `dom: ${JSON.stringify(record)}`
        },
        key: 'mutation',
        wrapMessage: (msg) => {
            const { type, target } = msg
            return { type, target }
        },
        listen: (theDocument, ports) => {
            const mutationObserver = new MutationObserver(function (mutations) {
                mutations.forEach(function (mutation) {
                    const target = mutation.target,
                        targetSelector = target && target.getRootNode() === theDocument ? selector.getSelector(mutation.target) : ''

                    if (targetSelector) {
                        const message = {
                            action: ACTION_TYPES.DOM_MUTATION.key,
                            type: mutation.type,
                            target: targetSelector,
                            addedNodes: mutation.addedNodes,
                            attributeName: mutation.attributeName,
                            removedNodes: mutation.removedNodes
                        }

                        ports.forEach(port => port.postMessage(message))
                    }
                })
            })

            mutationObserver.observe(theDocument.documentElement, {
                attributes: true,
                characterData: true,
                childList: true,
                subtree: true,
                attributeOldValue: true,
                characterDataOldValue: true
            })

            return mutationObserver
        },
        stopListen: (_theDocument, mutationObserver) => {
            mutationObserver.disconnect()
        }
    },
    USER_ACTIVITY_KEYDOWN: {
        renderTitle: (record) => {
            const { target: targetSelector, keyCode, ctrlKey, shiftKey, altKey } = record
            return `KeyDown: ${JSON.stringify(record)}`
        },
        key: 'keydown',
        wrapMessage: (msg) => {
            const { target, keyCode, ctrlKey, shiftKey, altKey } = msg
            return { target, keyCode, ctrlKey, shiftKey, altKey }
        },
        listen: (theDocument, ports) => {
            const handler = (ev) => {
                const { target, keyCode, ctrlKey, shiftKey, altKey } = ev,
                    targetSelector = target && target.getRootNode() === theDocument ? selector.getSelector(target) : ''

                if (targetSelector) {
                    ports.forEach(port => port.postMessage({
                        action: ACTION_TYPES.USER_ACTIVITY_KEYDOWN.key,
                        target: targetSelector,
                        keyCode,
                        ctrlKey,
                        shiftKey,
                        altKey
                    }))
                }
            }

            theDocument.addEventListener('keydown', handler)

            return handler
        },
        stopListen: (theDocument, handler) => {
            theDocument.removeEventListener('keydown', handler)
        }
    },
    USER_ACTIVITY_CLICK: {
        renderTitle: (record) => {
            const { target: targetSelector, keyCode, ctrlKey, shiftKey, altKey } = record
            return `Click: ${JSON.stringify(record)}`
        },
        key: 'click',
        wrapMessage: (msg) => {
            const { target } = msg
            return { target }
        },
        listen: (theDocument, ports) => {
            const handler = (ev) => {
                const { target } = ev,
                    targetSelector = target && target.getRootNode() === theDocument ? selector.getSelector(target) : ''

                if (targetSelector) {
                    const message = { action: ACTION_TYPES.USER_ACTIVITY_CLICK.key, target: targetSelector }
                    ports.forEach(port => port.postMessage(message))
                }
            }

            theDocument.addEventListener('click', handler, true)

            return handler
        },
        stopListen: (theDocument, handler) => {
            theDocument.removeEventListener('click', handler)
        }
    },
    USER_ACTIVITY_SCROLL: {
        renderTitle: (record) => {
            const { target: targetSelector, keyCode, ctrlKey, shiftKey, altKey } = record
            return `Scroll: ${JSON.stringify(record)}`
        },
        key: 'scroll',
        wrapMessage: (msg) => {
            const { scrollX, scrollY } = msg
            return { scrollX, scrollY }
        },
        listen: (theDocument, ports) => {
            const handler = (ev) => {
                if (lastScrollDate === null || (new Date() - lastScrollDate) >= COMMON_THRESHOLD) {
                    lastScrollDate = new Date()
                    const message = { action: ACTION_TYPES.USER_ACTIVITY_SCROLL.key, scrollX, scrollY }
                    ports.forEach(port => port.postMessage(message))
                }
            }

            theDocument.addEventListener('scroll', handler)

            return handler
        },
        stopListen: (theDocument, handler) => {
            theDocument.removeEventListener('scroll', handler)
        }
    },
    USER_ACTIVITY_RESIZE: {
        renderTitle: (record) => {
            const { target: targetSelector, keyCode, ctrlKey, shiftKey, altKey } = record
            return `Resize: ${JSON.stringify(record)}`
        },
        key: 'resize',
        wrapMessage: (msg) => {
            const { innerWidth, innerHeight } = msg
            return { innerWidth, innerHeight }
        },
        listen: (theDocument, ports) => {
            const handler = (ev) => {
                if (lastResizeDate === null || (new Date() - lastResizeDate) >= COMMON_THRESHOLD) {
                    lastResizeDate = new Date()
                    const message = { action: ACTION_TYPES.USER_ACTIVITY_RESIZE.key, innerWidth, innerHeight }
                    ports.forEach(port => port.postMessage(message))
                }
            }

            theDocument.defaultView.addEventListener('resize', handler)

            return handler
        },
        stopListen: (theDocument, handler) => {
            theDocument.defaultView.removeEventListener('resize', handler)
        }
    },
})