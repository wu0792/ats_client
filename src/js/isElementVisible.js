export const isElementVisible = (elem) => {
    if (!elem || elem.offsetParent === null) {
        return false
    } else {
        let anyOffset = !!(elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length)
        if (!anyOffset) {
            return false
        } else {
            const style = window.getComputedStyle(elem)
            return style.display !== 'none' && style.visibility !== 'hidden'
        }
    }
}