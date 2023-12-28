/**
 * Интерфейс отправки сообщения в телеграм
 */
export interface TelegramSendMessageInterface {
  chatId: number;
  message: string;
}
