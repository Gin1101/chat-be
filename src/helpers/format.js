import moment from "moment"
export function formatNumber(number) {
    try {
        return new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(number)
    } catch (error) {
        return number
    }
}


export function formatDateTime(t, formatString='HH:mm:ss DD-MM-YYYY') {
    return moment(new Date(t)).utcOffset("+0700").format(formatString)
}