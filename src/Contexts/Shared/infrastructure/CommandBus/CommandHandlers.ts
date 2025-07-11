import { Command } from '../../domain/Command';
import { CommandHandler } from '../../domain/CommandHandler';
import { CommandNotRegisteredError } from '../../domain/CommandNotRegisteredError';

export class CommandHandlers extends Map<Command, CommandHandler<any, any>> {
  constructor(commandHandlers: Array<CommandHandler<any, any>>) {
    super();

    commandHandlers.forEach(commandHandler => {
      this.set(commandHandler.subscribedTo(), commandHandler);
    });
  }

  public get(command: Command): CommandHandler<any, any> {
    const commandHandler = super.get(command.constructor);

    if (!commandHandler) {
      throw new CommandNotRegisteredError(command);
    }

    return commandHandler;
  }
}
