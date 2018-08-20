import Enum from 'enum'
import { isElementVisible } from './isElementVisible'
import { isElChildOf } from './isElChildOf'

const { getSelector } = require('./getSelector')

export const CONNECT_ID_INIT_PANEL = 'CONNECT_ID_INIT_PANEL'
export const CONNECT_ID_INIT_CONTENT = 'CONNECT_ID_INIT_CONTENT'
export const CONNECT_ID_WATCH_DOM_MUTATION = 'CONNECT_ID_WATCH_DOM_MUTATION'
export const CONNECT_ID_WATCH_USER_ACTIVITY = 'CONNECT_ID_WATCH_USER_ACTIVITY'

let lastScrollDate = null,
    lastResizeDate = null

const COMMON_THRESHOLD = 500
const buttonTip = `title='0：左键；1：右键；2：滚轮键'`

/**
 * at which phase should the action type be listen:
 * INIT:  after we start the capture
 * RECORD: after we start record, generally it's dom mutation
 * NEVER: never be listened in content js
 */
export const LISTEN_IN_CONTENT_PHASE = {
    INIT: 0,
    RECORD: 1,
    NEVER: 2
}

export const ACTION_TYPES = new Enum({
    NETWORK: {
        listenInContentPhase: LISTEN_IN_CONTENT_PHASE.NEVER,
        renderTitle: (record) => {
            return `network: ${JSON.stringify(record)}`
        },
        renderSummary: (record) => {
            return `<span class='icon network' title='[network]网络请求'></span><div class='entry network'>${record.url}</div>`
        },
        renderDetail: (id, record) => {
            return `<div class='detail'>
                        <div class='item'>
                        <div class='title'>ID：</div>
                        <div class='value'>${id}</div>
                        </div>
                        <div class='item'>
                        <div class='title'>TYPE：</div>
                        <div class='value'>[network]网络请求</div>
                        </div>
                        <div class='item'>
                        <div class='title'>URL：</div>
                        <div class='value'>${record.url}</div>
                        </div>
                        <div class='item'>
                        <div class='title'>METHOD：</div>
                        <div class='value'>${record.method}</div>
                        </div>
                        <div class='item'>
                        <div class='title'>STATUS：</div>
                        <div class='value'>${record.status}</div>
                        </div>
                        <div class='item'>
                        <div class='title'>BODY：</div>
                        <div class='value'>
                            <textarea entry_field='body'>${record.body}</textarea>
                        </div>
                        </div>
                    </div>`
        },
        wrapMessage: (msg) => {
            const { url, method, body, form, status, header } = msg
            return { url, method, body, form, status, header }
        }
    },
    NAVIGATE: {
        listenInContentPhase: LISTEN_IN_CONTENT_PHASE.NEVER,
        renderTitle: (record) => {
            const { url } = record

            return `页面跳转: url:${url}`
        },
        renderSummary: (record) => {
            return `<span class='icon navigate' title='[navigate]页面跳转'></span><div class='entry navigate'>${record.url}</div>`
        },
        renderDetail: (id, record) => {
            return `<div class='detail'>
                        <div class='item'>
                        <div class='title'>ID：</div>
                        <div class='value'>${id}</div>
                        </div>
                        <div class='item'>
                        <div class='title'>TYPE：</div>
                        <div class='value'>[navigate]页面跳转</div>
                        </div>
                        <div class='item'>
                        <div class='title'>URL：</div>
                        <div class='value'>${record.url}</div>
                        </div>
                    </div>`
        },
        wrapMessage: (msg) => {
            const { url } = msg
            return { url }
        }
    },
    MUTATION: {
        listenInContentPhase: LISTEN_IN_CONTENT_PHASE.RECORD,
        renderTitle: (record) => {
            return `dom: ${JSON.stringify(record)}`
        },
        renderSummary: (record) => {
            return `<span class='icon mutation' title='[mutation]页面DOM元素变化'></span><div class='entry mutation'>${record.target}</div>`
        },
        renderDetail: (id, record) => {
            return `<div class='detail'>
                        <div class='item'>
                        <div class='title'>ID：</div>
                        <div class='value'>${id}</div>
                        </div>
                        <div class='item'>
                        <div class='title'>TYPE：</div>
                        <div class='value'>[mutation]页面DOM元素变化</div>
                        </div>
                        <div class='item'>
                        <div class='title'>TYPE：</div>
                        <div class='value'>${record.type}</div>
                        </div>
                        <div class='item'>
                        <div class='title'>TARGET：</div>
                        <div class='value'>
                            <textarea entry_field='target' entry_format='splitByLine'>${record.target.join('|')}</textarea>
                        </div>
                        </div>
                    </div>`
        },
        wrapMessage: (msg) => {
            const { type, target } = msg
            return { type, target }
        },
        listen: (theDocument, ports, rootTargetSelectors) => {
            const notifyPorts = (targetSelector, mutation) => {
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

            const mutationObserver = new MutationObserver(function (mutations) {
                mutations.forEach(function (mutation) {
                    let target = mutation.target

                    //record #text's parentElement
                    while (target.nodeName === '#text' && target.parentElement) {
                        target = target.parentElement
                    }

                    let el = target,
                        valid = true
                    while (el !== null) {
                        // skip the unnecessary record
                        if (['HEAD'].indexOf(el.nodeName) >= 0) {
                            valid = false
                            break
                        }

                        el = el.parentElement
                    }

                    if (valid === false) {
                        return
                    }

                    const isVisible = isElementVisible(target)
                    if (!isVisible) {
                        return
                    }

                    if (rootTargetSelectors && rootTargetSelectors.length) {
                        let isInRootTargets = false

                        rootTargetSelectors.forEach(rootTargetSelector => {
                            let rootTargets = Array.from(theDocument.querySelectorAll(rootTargetSelector))
                            if (rootTargets.some(rootTarget => isElChildOf(target, rootTarget))) {
                                isInRootTargets = true
                                return false
                            }
                        })

                        if (!isInRootTargets) {
                            return
                        }
                    }

                    const targetSelector = getSelector(target, theDocument)

                    if (targetSelector) {
                        notifyPorts(targetSelector, mutation)
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

            let toRecordTargetSelectors = rootTargetSelectors.length ? rootTargetSelectors : ['body']
            toRecordTargetSelectors.forEach(selector => {
                notifyPorts([selector], {
                    type: 'init'
                })
            })

            return mutationObserver
        },
        stopListen: (_theDocument, mutationObserver) => {
            mutationObserver.disconnect()
        }
    },
    CHANGE: {
        listenInContentPhase: LISTEN_IN_CONTENT_PHASE.RECORD,
        renderTitle: (record) => {
            return `change: ${JSON.stringify(record)}`
        },
        renderSummary: (record) => {
            return `<span class='icon change' title='[change]内容改变'></span><div class='entry change'>${record.target}</div>`
        },
        renderDetail: (id, record) => {
            return `<div class='detail'>
                        <div class='item'>
                        <div class='title'>ID：</div>
                        <div class='value'>${id}</div>
                        </div>
                        <div class='item'>
                        <div class='title'>TYPE：</div>
                        <div class='value'>[change]文本框/下拉框内容改变</div>
                        </div>
                        <div class='item'>
                        <div class='title'>TARGET：</div>
                        <div class='value'>
                            <textarea entry_field='target' entry_format='splitByLine'>${record.target.join('|')}</textarea>
                        </div>
                        </div>
                        <div class='item'>
                        <div class='title'>VALUE：</div>
                        <div class='value'>
                            <textarea entry_field='value'>${record.value}</textarea>
                        </div>
                        </div>
                    </div>`
        },
        wrapMessage: (msg) => {
            const { target, value } = msg
            return { target, value }
        },
        listen: (theDocument, ports, rootTargetSelectors) => {
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
        listenInContentPhase: LISTEN_IN_CONTENT_PHASE.RECORD,
        renderTitle: (record) => {
            return `focus: ${JSON.stringify(record)}`
        },
        wrapMessage: (msg) => {
            const { target } = msg
            return { target }
        },
        renderSummary: (record) => {
            return `<span class='icon focus' title='[focus]元素得到焦点'></span><div class='entry focus'>${record.target}</div>`
        },
        renderDetail: (id, record) => {
            return `<div class='detail'>
                        <div class='item'>
                        <div class='title'>ID：</div>
                        <div class='value'>${id}</div>
                        </div>
                        <div class='item'>
                        <div class='title'>TYPE：</div>
                        <div class='value'>[focus]元素得到焦点</div>
                        </div>
                        <div class='item'>
                        <div class='title'>TARGET：</div>
                        <div class='value'>
                            <textarea entry_field='target' entry_format='splitByLine'>${record.target.join('|')}</textarea>
                        </div>
                        </div>
                    </div>`
        },
        listen: (theDocument, ports, rootTargetSelectors) => {
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
        listenInContentPhase: LISTEN_IN_CONTENT_PHASE.RECORD,
        renderTitle: (record) => {
            return `blur: ${JSON.stringify(record)}`
        },
        wrapMessage: (msg) => {
            const { target } = msg
            return { target }
        },
        renderSummary: (record) => {
            return `<span class='icon blur' title='[blur]元素丢失焦点'></span><div class='entry blur'>${record.target}</div>`
        },
        renderDetail: (id, record) => {
            return `<div class='detail'>
                        <div class='item'>
                        <div class='title'>ID：</div>
                        <div class='value'>${id}</div>
                        </div>
                        <div class='item'>
                        <div class='title'>TYPE：</div>
                        <div class='value'>[blur]元素丢失焦点</div>
                        </div>
                        <div class='item'>
                        <div class='title'>TARGET：</div>
                        <div class='value'>
                            <textarea entry_field='target' entry_format='splitByLine'>${record.target.join('|')}</textarea>
                        </div>
                        </div>
                    </div>`
        },
        listen: (theDocument, ports, rootTargetSelectors) => {
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
        listenInContentPhase: LISTEN_IN_CONTENT_PHASE.RECORD,
        renderTitle: (record) => {
            return `keydown: ${JSON.stringify(record)}`
        },
        wrapMessage: (msg) => {
            const { target, code } = msg
            return { target, code }
        },
        renderSummary: (record) => {
            return `<span class='icon keydown' title='[keydown]键盘按下'></span><div class='entry keydown'>${record.target}</div>`
        },
        renderDetail: (id, record) => {
            return `<div class='detail'>
                        <div class='item'>
                        <div class='title'>ID：</div>
                        <div class='value'>${id}</div>
                        </div>
                        <div class='item'>
                        <div class='title'>TYPE：</div>
                        <div class='value'>[keydown]键盘按下</div>
                        </div>
                        <div class='item'>
                        <div class='title'>TARGET：</div>
                        <div class='value'>
                            <textarea entry_field='target'>${record.target.join('|')}</textarea>
                        </div>
                        </div>
                        <div class='item'>
                        <div class='title'>CODE：</div>
                        <div class='value'>
                            <textarea entry_field='code'>${record.code}</textarea>
                        </div>
                        </div>
                    </div>`
        },
        listen: (theDocument, ports, rootTargetSelectors) => {
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
        listenInContentPhase: LISTEN_IN_CONTENT_PHASE.RECORD,
        renderTitle: (record) => {
            return `keyup: ${JSON.stringify(record)}`
        },
        wrapMessage: (msg) => {
            const { target, code } = msg
            return { target, code }
        },
        renderSummary: (record) => {
            return `<span class='icon keyup' title='[keyup]键盘弹起'></span><div class='entry keyup'>${record.target}</div>`
        },
        renderDetail: (id, record) => {
            return `<div class='detail'>
                        <div class='item'>
                        <div class='title'>ID：</div>
                        <div class='value'>${id}</div>
                        </div>
                        <div class='item'>
                        <div class='title'>TYPE：</div>
                        <div class='value'>[keyup]键盘弹起</div>
                        </div>
                        <div class='item'>
                        <div class='title'>TARGET：</div>
                        <div class='value'>
                            <textarea entry_field='target' entry_format='splitByLine'>${record.target.join('|')}</textarea>
                        </div>
                        </div>
                        <div class='item'>
                        <div class='title'>CODE：</div>
                        <div class='value'>
                            <textarea>${record.code}</textarea>
                        </div>
                        </div>
                    </div>`
        },
        listen: (theDocument, ports, rootTargetSelectors) => {
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
        listenInContentPhase: LISTEN_IN_CONTENT_PHASE.RECORD,
        renderTitle: (record) => {
            return `mousedown: ${JSON.stringify(record)}`
        },
        wrapMessage: (msg) => {
            const { target, button } = msg
            return { target, button }
        },
        renderSummary: (record) => {
            return `<span class='icon mousedown' title='[mousedown]鼠标键按下'></span><div class='entry mousedown'>${record.target}</div>`
        },
        renderDetail: (id, record) => {
            return `<div class='detail'>
                        <div class='item'>
                        <div class='title'>ID：</div>
                        <div class='value'>${id}</div>
                        </div>
                        <div class='item'>
                        <div class='title'>TYPE：</div>
                        <div class='value'>[mousedown]鼠标键按下</div>
                        </div>
                        <div class='item'>
                        <div class='title'>TARGET：</div>
                        <div class='value'>
                            <textarea entry_field='target' entry_format='splitByLine'>${record.target.join('|')}</textarea>
                        </div>
                        </div>
                        <div class='item'>
                        <div class='title' ${buttonTip}>BUTTON：</div>
                        <div class='value'>
                            <textarea ${buttonTip} entry_field='button'>${record.button}</textarea>
                        </div>
                        </div>
                    </div>`
        },
        listen: (theDocument, ports, rootTargetSelectors) => {
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
        listenInContentPhase: LISTEN_IN_CONTENT_PHASE.RECORD,
        renderTitle: (record) => {
            return `mouseup: ${JSON.stringify(record)}`
        },
        wrapMessage: (msg) => {
            const { target, button } = msg
            return { target, button }
        },
        renderSummary: (record) => {
            return `<span class='icon mouseup' title='[mouseup]鼠标键弹起'></span><div class='entry mouseup'>${record.target}</div>`
        },
        renderDetail: (id, record) => {
            return `<div class='detail'>
                        <div class='item'>
                        <div class='title'>ID：</div>
                        <div class='value'>${id}</div>
                        </div>
                        <div class='item'>
                        <div class='title'>TYPE：</div>
                        <div class='value'>[mouseup]鼠标键弹起</div>
                        </div>
                        <div class='item'>
                        <div class='title'>TARGET：</div>
                        <div class='value'>
                            <textarea entry_field='target' entry_format='splitByLine'>${record.target.join('|')}</textarea>
                        </div>
                        </div>
                        <div class='item'>
                        <div class='title' ${buttonTip}>BUTTON：</div>
                        <div class='value'>
                        <textarea entry_field='button' ${buttonTip}>${record.button}</textarea>
                        </div>
                        </div>
                    </div>`
        },
        listen: (theDocument, ports, rootTargetSelectors) => {
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
        listenInContentPhase: LISTEN_IN_CONTENT_PHASE.RECORD,
        renderTitle: (record) => {
            return `mouseover: ${JSON.stringify(record)}`
        },
        wrapMessage: (msg) => {
            const { target, x, y } = msg
            return { target, x, y }
        },
        renderSummary: (record) => {
            return `<span class='icon mouseover' title='[mouseover]鼠标HOVER'></span><div class='entry mouseover'>${record.target}</div>`
        },
        renderDetail: (id, record) => {
            return `<div class='detail'>
                        <div class='item'>
                        <div class='title'>ID：</div>
                        <div class='value'>${id}</div>
                        </div>
                        <div class='item'>
                        <div class='title'>TYPE：</div>
                        <div class='value'>[mouseover]鼠标HOVER</div>
                        </div>
                        <div class='item'>
                        <div class='title'>TARGET：</div>
                        <div class='value'>
                            <textarea entry_field='target' entry_format='splitByLine'>${record.target.join('|')}</textarea>
                        </div>
                        </div>
                    </div>`
        },
        listen: (theDocument, ports, rootTargetSelectors) => {
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
    SCROLL: {
        listenInContentPhase: LISTEN_IN_CONTENT_PHASE.INIT,
        renderTitle: (record) => {
            return `Scroll: ${JSON.stringify(record)}`
        },
        wrapMessage: (msg) => {
            const { x, y } = msg
            return { x, y }
        },
        renderSummary: (record) => {
            return `<span class='icon scroll' title='[scroll]屏幕滚动'></span><div class='entry scroll'>(x: ${record.x}, y:${record.y})</div>`
        },
        renderDetail: (id, record) => {
            return `<div class='detail'>
                        <div class='item'>
                        <div class='title'>ID：</div>
                        <div class='value'>${id}</div>
                        </div>
                        <div class='item'>
                        <div class='title'>TYPE：</div>
                        <div class='value'>[scroll]屏幕滚动</div>
                        </div>
                        <div class='item'>
                        <div class='title'>X：</div>
                        <div class='value'>
                            <textarea entry_field='x'>${record.x}</textarea>
                        </div>
                        </div>
                        <div class='item'>
                        <div class='title'>Y：</div>
                        <div class='value'>
                            <textarea entry_field='y'>${record.y}</textarea>
                        </div>
                        </div>                        
                    </div>`
        },
        listen: (theDocument, ports, rootTargetSelectors) => {
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
        listenInContentPhase: LISTEN_IN_CONTENT_PHASE.INIT,
        renderTitle: (record) => {
            return `Resize: ${JSON.stringify(record)}`
        },
        wrapMessage: (msg) => {
            const { width, height } = msg
            return { width, height }
        },
        renderSummary: (record) => {
            return `<span class='icon resize' title='[resize]屏幕尺寸改变'></span><div class='entry resize'>(width: ${record.width}, height: ${record.height})</div>`
        },
        renderDetail: (id, record) => {
            return `<div class='detail'>
                        <div class='item'>
                        <div class='title'>ID：</div>
                        <div class='value'>${id}</div>     
                        </div>
                        <div class='item'>
                        <div class='title'>TYPE：</div>
                        <div class='value'>[resize]屏幕尺寸改变</div>
                        </div>
                        <div class='item'>
                        <div class='title'>WIDTH：</div>
                        <div class='value'>
                            <textarea entry_field='width'>${record.width}</textarea>
                        </div>
                        </div>
                        <div class='item'>
                        <div class='title'>HEIGHT：</div>
                        <div class='value'>
                            <textarea entry_field='height'>${record.height}</textarea>
                        </div>
                        </div>                        
                    </div>`
        },
        listen: (theDocument, ports, rootTargetSelectors) => {
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

            theDocument.defaultView.dispatchEvent(new Event('resize'))

            return handler
        },
        stopListen: (theDocument, handler) => {
            theDocument.defaultView.removeEventListener('resize', handler)
        }
    },
})