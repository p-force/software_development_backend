export type SocketsMessageType<T> = {
  event: string;
  userId: number;
  body: T;
};
