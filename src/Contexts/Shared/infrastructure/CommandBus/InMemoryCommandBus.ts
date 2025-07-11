import { Command } from '../../domain/Command';
import { CommandBus } from "../../domain/CommandBus";
import { CommandHandlers } from './CommandHandlers';

export class InMemoryCommandBus implements CommandBus {
  constructor(private commandHandlers: CommandHandlers) {}

  async dispatch<R = void>(command: Command): Promise<R> {
    const handler = this.commandHandlers.get(command);

    return await handler.handle(command);
  }
}
