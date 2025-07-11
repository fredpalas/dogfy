import { Command } from './Command';

export interface CommandHandler<T extends Command, R = void> {
  subscribedTo(): Command;
  handle(command: T): Promise<R>;
}
