import ChatSettting from "../models/ChatSettting.js";
import moment from "moment";

export async function getChatSettings() {
    const data = ChatSettting.findOne({});
    if (data) {
        return data
    }
    return null;
}


export function checkWorkTime(settings) {
    try {
        const nowTime = moment().utcOffset("+07:00").format("HH:mm")
        const nowDay = moment().utcOffset("+07:00").isoWeekday()
        const workTime = settings.schedule[nowDay - 1];
        if(!workTime) return true;
        if(workTime.from <= nowTime && workTime.to >= nowTime) return true
        return false;
    } catch (error) {
        return true
    }

}