export const isElementVisible = (elem) => {
    return !!(elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length);
}