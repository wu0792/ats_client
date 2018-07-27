const Selector = require('css-selector-generator')
const selector = new Selector()

const getSelector = (target, theDocument) => {
    let avaliableSelectors = [],
        selector1 = target && target.getRootNode() === theDocument ? selector.getSelector(target) : ''

    // css-selector-generator
    selector1 && avaliableSelectors.push(selector1)

    // get the selector by className and nodeName
    const getJoinedClassName = (node) => {
        return Array.from(node.classList).map(name => `.${name}`).join('')
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
        return Array.from(node.parentElement.children).indexOf(node) + 1
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
            const matchedElements = queryAllElements(joinedSelector),
                anySiblingElement = matchedElements.some(el => el !== stepTarget && el.parentElement === stepTarget.parentElement)

            if (anySiblingElement) {
                let nth = getNthOfNodeInParent(stepTarget),
                    intensiveSelector = selectors

                if (anySiblingElement) {
                    intensiveSelector = selectors.map((selector, index) => index === 0 ? `${selector}:nth-child(${nth})` : selector)
                }

                return getValidSelector(stepTarget, intensiveSelector)
            } else if (stepTarget.parentElement) {
                const parentElement = stepTarget.parentElement,
                    pNodeName = getNodeName(parentElement),
                    pClassNames = getJoinedClassName(parentElement),
                    selectorsWithParent = [`${pNodeName}${pClassNames}`, ...selectors]

                return getValidSelector(stepTarget.parentElement, selectorsWithParent)
            } else {
                return null
            }
        }
    }

    let className = getJoinedClassName(target),
        nodeName = getNodeName(target),
        classNameWithNodeName = `${nodeName}${className}`,
        selector2 = getValidSelector(target, [classNameWithNodeName])

    if (selector2) {
        avaliableSelectors.push(selector2)
    }

    return avaliableSelectors
}

module.exports = { getSelector }