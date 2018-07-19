import Enum from 'enum'

export const CONNECT_ID_INIT_PANEL = 'CONNECT_ID_INIT_PANEL'
export const CONNECT_ID_INIT_CONTENT = 'CONNECT_ID_INIT_CONTENT'
export const CONNECT_ID_WATCH_DOM_MUTATION = 'CONNECT_ID_WATCH_DOM_MUTATION'
export const CONNECT_ID_WATCH_USER_ACTIVITY = 'CONNECT_ID_WATCH_USER_ACTIVITY'

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
        }
    },
})