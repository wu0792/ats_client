export class UserActivityListener {
    constructor(ports, userActivityEnums) {
        this.ports = ports
        this.userActivityEnums = userActivityEnums
    }

    listen(theDocument, rootTargetSelectors) {
        let handlers = []
        this.userActivityEnums.forEach(userActivityEnum => {
            handlers.push(userActivityEnum.value.listen(theDocument, this.ports, rootTargetSelectors))
        })

        return handlers
    }

    stopListen(theDocument, handlers) {
        this.userActivityEnums.forEach((userActivityEnum, index) => {
            userActivityEnum.value.stopListen(theDocument, handlers[index])
        })
    }
}