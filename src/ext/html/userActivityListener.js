export class UserActivityListener {
    constructor(ports, userActivityEnums) {
        this.ports = ports
        this.userActivityEnums = userActivityEnums
    }

    listen(theDocument) {
        let handlers = []
        this.userActivityEnums.forEach(userActivityEnum => {
            handlers.push(userActivityEnum.value.listen(theDocument, this.ports))
        })

        return handlers
    }

    stopListen(theDocument, handlers) {
        this.userActivityEnums.forEAch((userActivityEnum, index) => {
            userActivityEnum.value.stopListen(theDocument, handlers[index])
        })
    }
}