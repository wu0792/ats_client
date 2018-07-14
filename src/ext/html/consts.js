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
        }
    },
    DOM_MUTATION: {
        renderTitle: (record) => {
            const { type, target, addedNodes, attributeName, removedNodes } = record

            return `dom修改: ${JSON.stringify(record)}`
        }
    },
    USER_ACTIVITY: {
        renderTitle: (record) => {
            const { target: targetSelector, keyCode, ctrlKey, shiftKey, altKey } = record
            return `界面操作: ${JSON.stringify(record)}`
        }
    }
})