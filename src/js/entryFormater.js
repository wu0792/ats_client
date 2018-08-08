export class EntryFormater {
    /**
     * split by |
     * @param {value to format} value 
     */
    static splitByLine(value) {
        return (value || '').trim().split('|').filter(val => val)
    }
}