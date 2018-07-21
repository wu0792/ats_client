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
            return `network: ${JSON.stringify(record)}`
        },
        key: 'network',
        wrapMessage: (msg) => {
            const { url, method, body, form } = msg
            return { url, method, body, form }
        }
    },
    NAVIGATE: {
        renderTitle: (record) => {
            const { url } = record

            return `页面跳转: url:${url}`
        },
        key: 'navigate',
        wrapMessage: (msg) => {
            const { url } = msg
            return { url }
        }
    },
    DOM_MUTATION: {
        renderTitle: (record) => {
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
                            added: mutation.addedNodes,
                            attribute: mutation.attributeName,
                            removed: mutation.removedNodes
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
    KEYDOWN: {
        renderTitle: (record) => {
            return `keydown: ${JSON.stringify(record)}`
        },
        key: 'keydown',
        wrapMessage: (msg) => {
            const { target, code, ctrl, shift, alt } = msg
            return { target, code, ctrl, shift, alt }
        },
        listen: (theDocument, ports) => {
            const handler = (ev) => {
                const { target, keyCode: code, ctrlKey: ctrl, shiftKey: shift, altKey: alt } = ev,
                    targetSelector = target && target.getRootNode() === theDocument ? selector.getSelector(target) : ''

                if (targetSelector) {
                    ports.forEach(port => port.postMessage({
                        action: ACTION_TYPES.KEYDOWN.key,
                        target: targetSelector,
                        code,
                        ctrl: ctrl || undefined,
                        shift: shift || undefined,
                        alt: alt || undefined
                    }))
                }
            }

            theDocument.addEventListener('keydown', handler, true)

            return handler
        },
        stopListen: (theDocument, handler) => {
            theDocument.removeEventListener('keydown', handler, true)
        }
    },
    MOUSE_OVER: {
        renderTitle: (record) => {
            return `mouseover: ${JSON.stringify(record)}`
        },
        key: 'mouseover',
        wrapMessage: (msg) => {
            const { target, x, y } = msg
            return { target, x, y }
        },
        listen: (theDocument, ports) => {
            const handler = (ev) => {
                const { target, clientX: x, clientY: y } = ev,
                    targetSelector = target && target.getRootNode() === theDocument ? selector.getSelector(target) : ''

                if (targetSelector) {
                    ports.forEach(port => port.postMessage({
                        action: ACTION_TYPES.MOUSE_OVER.key,
                        target: targetSelector,
                        x,
                        y
                    }))
                }
            }

            theDocument.addEventListener('mouseover', handler, true)

            return handler
        },
        stopListen: (theDocument, handler) => {
            theDocument.removeEventListener('mouseover', handler, true)
        }
    },
    CLICK: {
        renderTitle: (record) => {
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
                    const message = {
                        action: ACTION_TYPES.CLICK.key,
                        target: targetSelector
                    }

                    ports.forEach(port => port.postMessage(message))
                }
            }

            theDocument.addEventListener('click', handler, true)

            return handler
        },
        stopListen: (theDocument, handler) => {
            theDocument.removeEventListener('click', handler, true)
        }
    },
    SCROLL: {
        renderTitle: (record) => {
            return `Scroll: ${JSON.stringify(record)}`
        },
        key: 'scroll',
        wrapMessage: (msg) => {
            const { x, y } = msg
            return { x, y }
        },
        listen: (theDocument, ports) => {
            const handler = (ev) => {
                if (lastScrollDate === null || (new Date() - lastScrollDate) >= COMMON_THRESHOLD) {
                    lastScrollDate = new Date()
                    const message = {
                        action: ACTION_TYPES.SCROLL.key,
                        x: scrollX,
                        y: scrollY
                    }

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
    RESIZE: {
        renderTitle: (record) => {
            return `Resize: ${JSON.stringify(record)}`
        },
        key: 'resize',
        wrapMessage: (msg) => {
            const { width, height } = msg
            return { width, height }
        },
        listen: (theDocument, ports) => {
            const handler = (ev) => {
                if (lastResizeDate === null || (new Date() - lastResizeDate) >= COMMON_THRESHOLD) {
                    lastResizeDate = new Date()
                    const message = {
                        action: ACTION_TYPES.RESIZE.key,
                        width: innerWidth,
                        height: innerHeight
                    }

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