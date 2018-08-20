export class UserActivityListener {
    constructor(ports, userActivityEnums) {
        this.ports = ports
        this.userActivityEnums = userActivityEnums
    }

    listen(theDocument, rootTargetSelectors) {
        let handlers = {}
        this.userActivityEnums.forEach(userActivityEnum => {
            handlers[userActivityEnum.key] = userActivityEnum.value.listen(theDocument, this.ports, rootTargetSelectors)
        })

        return handlers
    }

    stopListen(theDocument, handlers) {
        this.userActivityEnums.forEach((userActivityEnum) => {
            userActivityEnum.value.stopListen(theDocument, handlers[userActivityEnum.key])
        })
    }
}