import { UuidGenerator } from "../domain/UuidGenerator";
import { v7 as uuid } from 'uuid';

export class JsUuidGenerator implements UuidGenerator
{
  generate(): string {
    return uuid().toString();
  }
}
