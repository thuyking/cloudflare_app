import axios from "axios";

interface ErrorResponseBody {
  message?: unknown;
  error?: unknown;
  errors?: unknown;
}

function isErrorResponseBody(data: unknown): data is ErrorResponseBody {
  return (
    typeof data === "object" &&
    data !== null
  );
}

function stringifyUnknownMessage(value: unknown): string | null {
  if (typeof value === "string" && value.trim()) {
    return value;
  }

  if (Array.isArray(value)) {
    const messages = value
      .map((item) => stringifyUnknownMessage(item))
      .filter((item): item is string => Boolean(item));

    return messages.length > 0 ? messages.join(", ") : null;
  }

  if (isErrorResponseBody(value)) {
    return (
      stringifyUnknownMessage(value.message) ??
      stringifyUnknownMessage(value.error) ??
      stringifyUnknownMessage(value.errors)
    );
  }

  return null;
}

export function getErrorMessage(
  error: unknown,
  fallbackMessage = "Something went wrong. Please try again.",
): string {
  if (axios.isAxiosError(error)) {
    return stringifyUnknownMessage(error.response?.data) ?? fallbackMessage;
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallbackMessage;
}
