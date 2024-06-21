type EntityId = string;

interface EntityCollection<TEntityState> {
  readonly ids: Array<string>;
  readonly states: Record<string, TEntityState>;
}

export { type EntityId, type EntityCollection };
