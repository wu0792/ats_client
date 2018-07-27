const Selector = require('css-selector-generator')
const selector = new Selector()

const getSelector = (target, theDocument) => {
    let avaliableSelectors = [],
        selector1 = target && target.getRootNode() === theDocument ? selector.getSelector(target) : ''

    // css-selector-generator
    selector1 && avaliableSelectors.push(selector1)

    // get the selector by className and nodeName
    const getJoinedClassName = (node) => {
        return Array.from(node.classList || []).map(name => `.${name}`).join('')
    }

    const queryAllElements = (selector) => {
        return Array.from(theDocument.querySelectorAll(selector))
    }

    const getNodeName = (node) => {
        return node.nodeName.toLowerCase()
    }

    const checkIfUniqe = (toCheckSelector) => {
        let list = Array.from(theDocument.querySelectorAll(toCheckSelector))

        return list.length === 1 && list[0] === target
    }

    const getNthOfNodeInParent = (node) => {
        return node.parentElement ? (Array.from(node.parentElement.children).indexOf(node) + 1) : 0
    }

    const appendNthSelector = (selector, nth) => {
        return nth ? `${selector}:nth-child(${nth})` : ''
    }

    const getBasicSelectorForEl = (el) => {
        const pNodeName = getNodeName(el),
            pClassNames = getJoinedClassName(el),
            nth = getNthOfNodeInParent(el),
            nthSelector = appendNthSelector('', nth)

        return `${pNodeName}${pClassNames}${nthSelector}`
    }

    let searchTimes = 0
    console.log(`getSelector`)
    let getValidSelector = (stepTarget, selectors) => {
        if (searchTimes >= 10) {
            return null
        }

        console.log(`getValidSelector:${searchTimes++}`)
        const joinedSelector = selectors.join(' ')

        if (checkIfUniqe(joinedSelector)) {
            return joinedSelector
        } else {
            if (stepTarget.parentElement) {
                const parentElement = stepTarget.parentElement,
                    parentSelector = getBasicSelectorForEl(parentElement),
                    selectorsWithParent = [parentSelector, ...selectors]

                return getValidSelector(stepTarget.parentElement, selectorsWithParent)
            } else {
                return null
            }
        }
    }

    let selector2 = getValidSelector(target, [getBasicSelectorForEl(target)])

    if (selector2) {
        avaliableSelectors.push(selector2)
    }

    return avaliableSelectors
}

module.exports = { getSelector }