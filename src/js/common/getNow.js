export const getNow = () => +new Date()

export const getNowString = () => {
    const now = new Date(),
        hour = now.getHours(),
        min = now.getMinutes(),
        sec = now.getSeconds()

    return `${hour < 10 ? '0' : ''}${hour}:${min < 10 ? '0' : ''}${min}:${sec < 10 ? '0' : ''}${sec}`
}