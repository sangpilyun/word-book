export abstract class CqrsEvent {
  constructor(public readonly name: string) {}
}
