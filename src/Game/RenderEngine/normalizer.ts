// This is doing 2 things.
// 1. It creates a function that will merge the config and the default config to have a stable config
// 2. All number | [number, number] fields will be normalized to [number, number]


export function createConfigNormalizer<
  SourceConfig extends object,
  NormalizedConfig extends { [K in keyof SourceConfig]: any },
  TupledKey extends keyof SourceConfig
>(
  config: Partial<SourceConfig> | undefined,
  defaults: SourceConfig,
  tupledFields: readonly TupledKey[]
) {
  return function <K extends keyof SourceConfig>(key: K): NormalizedConfig[K] {
    const value = config?.[key] ?? defaults[key];

    if (tupledFields.includes(key as unknown as TupledKey)) {
      if (Array.isArray(value)) {
        return value as unknown as NormalizedConfig[K];
      }
      return [value, value] as unknown as NormalizedConfig[K];
    }

    return value as unknown as NormalizedConfig[K];
  };
}
