import dotenv from 'dotenv'
import TelegramBot from "node-telegram-bot-api"

dotenv.config();

class TelegramBotMessage {
    constructor() {
        try {
            if(process.env.TELEGRAM_BOT_TOKEN) {
                this.bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true });
            }
        } catch (error) {
            console.log('init bot error', error)
        }
    }

    sendMesssage = (id, message) => {
        if (this.bot) {
            this.bot.sendMessage(id, message, { parse_mode: 'HTML' });
        }
    }

    sendMessageToLoginChannel = (message) => {

        this.sendMesssage(process.env.TELEGRAM_LOGIN_CHANNEL, message);

    }

    sendMessageToWithdrawalChannel = (message) => {

        this.sendMesssage(process.env.TELEGRAM_RUT_CHANNEL, message);

    }
}

export default new TelegramBotMessage()