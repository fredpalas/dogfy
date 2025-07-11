import { Command } from './Command';

export interface CommandBus {
  dispatch<R = void>(command: Command): Promise<R>;
}
