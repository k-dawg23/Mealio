type LogLevel = "info" | "warn" | "error";

type LogMeta = Record<string, unknown>;

function serializeError(value: unknown) {
  if (value instanceof Error) {
    return {
      name: value.name,
      message: value.message,
      stack: value.stack
    };
  }

  return value;
}

export function logEvent(level: LogLevel, event: string, meta: LogMeta = {}) {
  const entry = {
    timestamp: new Date().toISOString(),
    level,
    event,
    ...Object.fromEntries(Object.entries(meta).map(([key, value]) => [key, serializeError(value)]))
  };

  const line = JSON.stringify(entry);

  if (level === "error") {
    console.error(line);
    return;
  }

  if (level === "warn") {
    console.warn(line);
    return;
  }

  console.info(line);
}
