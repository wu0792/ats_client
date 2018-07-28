import Enum from 'enum'

const { getSelector } = require('./getSelector')

export const CONNECT_ID_INIT_PANEL = 'CONNECT_ID_INIT_PANEL'
export const CONNECT_ID_INIT_CONTENT = 'CONNECT_ID_INIT_CONTENT'
export const CONNECT_ID_WATCH_DOM_MUTATION = 'CONNECT_ID_WATCH_DOM_MUTATION'
export const CONNECT_ID_WATCH_USER_ACTIVITY = 'CONNECT_ID_WATCH_USER_ACTIVITY'

let lastScrollDate = null,
    lastResizeDate = null

const COMMON_THRESHOLD = 500

export const ACTION_TYPES = new Enum({
    NETWORK: {
        skipInContent: true,
        renderTitle: (record) => {
            return `network: ${JSON.stringify(record)}`
        },
        wrapMessage: (msg) => {
            const { url, method, body, form, status, header } = msg
            return { url, method, body, form, status, header }
        }
    },
    NAVIGATE: {
        skipInContent: true,
        renderTitle: (record) => {
            const { url } = record

            return `页面跳转: url:${url}`
        },
        wrapMessage: (msg) => {
            const { url } = msg
            return { url }
        }
    },
    MUTATION: {
        renderTitle: (record) => {
            return `dom: ${JSON.stringify(record)}`
        },
        wrapMessage: (msg) => {
            const { type, target } = msg
            return { type, target }
        },
        listen: (theDocument, ports) => {
            const mutationObserver = new MutationObserver(function (mutations) {
                mutations.forEach(function (mutation) {
                    const target = mutation.target,
                        targetSelector = getSelector(target, theDocument)

                    if (targetSelector) {
                        const message = {
                            action: ACTION_TYPES.MUTATION.key,
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
    CHANGE: {
        renderTitle: (record) => {
            return `change: ${JSON.stringify(record)}`
        },
        wrapMessage: (msg) => {
            const { target, value } = msg
            return { target, value }
        },
        listen: (theDocument, ports) => {
            const handler = (ev) => {
                const { target } = ev,
                    targetSelector = getSelector(target, theDocument)

                if (targetSelector) {
                    ports.forEach(port => port.postMessage({
                        action: ACTION_TYPES.CHANGE.key,
                        target: targetSelector,
                        value: target.value
                    }))
                }
            }

            theDocument.addEventListener('change', handler, true)

            return handler
        },
        stopListen: (theDocument, handler) => {
            theDocument.removeEventListener('change', handler, true)
        }
    },
    FOCUS: {
        renderTitle: (record) => {
            return `focus: ${JSON.stringify(record)}`
        },
        wrapMessage: (msg) => {
            const { target } = msg
            return { target }
        },
        listen: (theDocument, ports) => {
            const handler = (ev) => {
                const { target } = ev,
                    targetSelector = getSelector(target, theDocument)

                if (targetSelector) {
                    ports.forEach(port => port.postMessage({
                        action: ACTION_TYPES.FOCUS.key,
                        target: targetSelector
                    }))
                }
            }

            theDocument.addEventListener('focus', handler, true)

            return handler
        },
        stopListen: (theDocument, handler) => {
            theDocument.removeEventListener('focus', handler, true)
        }
    },
    BLUR: {
        renderTitle: (record) => {
            return `blur: ${JSON.stringify(record)}`
        },
        wrapMessage: (msg) => {
            const { target } = msg
            return { target }
        },
        listen: (theDocument, ports) => {
            const handler = (ev) => {
                const { target } = ev,
                    targetSelector = getSelector(target, theDocument)

                if (targetSelector) {
                    ports.forEach(port => port.postMessage({
                        action: ACTION_TYPES.BLUR.key,
                        target: targetSelector
                    }))
                }
            }

            theDocument.addEventListener('blur', handler, true)

            return handler
        },
        stopListen: (theDocument, handler) => {
            theDocument.removeEventListener('blur', handler, true)
        }
    },
    KEYDOWN: {
        renderTitle: (record) => {
            return `keydown: ${JSON.stringify(record)}`
        },
        wrapMessage: (msg) => {
            const { target, code } = msg
            return { target, code }
        },
        listen: (theDocument, ports) => {
            const handler = (ev) => {
                const { target, code, repeat } = ev
                if (repeat) {
                    return
                }

                const targetSelector = getSelector(target, theDocument)

                if (targetSelector) {
                    ports.forEach(port => port.postMessage({
                        action: ACTION_TYPES.KEYDOWN.key,
                        target: targetSelector,
                        code
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
    KEYUP: {
        renderTitle: (record) => {
            return `keyup: ${JSON.stringify(record)}`
        },
        wrapMessage: (msg) => {
            const { target, code } = msg
            return { target, code }
        },
        listen: (theDocument, ports) => {
            const handler = (ev) => {
                const { target, code, repeat } = ev
                if (repeat) {
                    return
                }

                const targetSelector = getSelector(target, theDocument)

                if (targetSelector) {
                    ports.forEach(port => port.postMessage({
                        action: ACTION_TYPES.KEYUP.key,
                        target: targetSelector,
                        code
                    }))
                }
            }

            theDocument.addEventListener('keyup', handler, true)

            return handler
        },
        stopListen: (theDocument, handler) => {
            theDocument.removeEventListener('keyup', handler, true)
        }
    },
    MOUSEDOWN: {
        renderTitle: (record) => {
            return `mousedown: ${JSON.stringify(record)}`
        },
        wrapMessage: (msg) => {
            const { target, code } = msg
            return { target, code }
        },
        listen: (theDocument, ports) => {
            const handler = (ev) => {
                const { target, button } = ev
                const targetSelector = getSelector(target, theDocument)

                if (targetSelector) {
                    ports.forEach(port => port.postMessage({
                        action: ACTION_TYPES.MOUSEDOWN.key,
                        target: targetSelector,
                        button
                    }))
                }
            }

            theDocument.addEventListener('mousedown', handler, true)

            return handler
        },
        stopListen: (theDocument, handler) => {
            theDocument.removeEventListener('mousedown', handler, true)
        }
    },
    MOUSEUP: {
        renderTitle: (record) => {
            return `mouseup: ${JSON.stringify(record)}`
        },
        wrapMessage: (msg) => {
            const { target, button } = msg
            return { target, button }
        },
        listen: (theDocument, ports) => {
            const handler = (ev) => {
                const { target, button } = ev
                const targetSelector = getSelector(target, theDocument)

                if (targetSelector) {
                    ports.forEach(port => port.postMessage({
                        action: ACTION_TYPES.MOUSEUP.key,
                        target: targetSelector,
                        button
                    }))
                }
            }

            theDocument.addEventListener('mouseup', handler, true)

            return handler
        },
        stopListen: (theDocument, handler) => {
            theDocument.removeEventListener('mouseup', handler, true)
        }
    },
    MOUSEOVER: {
        renderTitle: (record) => {
            return `mouseover: ${JSON.stringify(record)}`
        },
        wrapMessage: (msg) => {
            const { target, x, y } = msg
            return { target, x, y }
        },
        listen: (theDocument, ports) => {
            const handler = (ev) => {
                const { target, clientX: x, clientY: y } = ev,
                    targetSelector = getSelector(target, theDocument)

                if (targetSelector) {
                    ports.forEach(port => port.postMessage({
                        action: ACTION_TYPES.MOUSEOVER.key,
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
        wrapMessage: (msg) => {
            const { target } = msg
            return { target }
        },
        listen: (theDocument, ports) => {
            const handler = (ev) => {
                const { target } = ev,
                    targetSelector = getSelector(target, theDocument)

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