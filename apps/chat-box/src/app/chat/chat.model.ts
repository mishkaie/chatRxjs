export interface Chat {
    messages: {id: userOrBot, message: string}[],
    userId: number
}

export enum userOrBot {
    bot = 0,
    user = 1
}