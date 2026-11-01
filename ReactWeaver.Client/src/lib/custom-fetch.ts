async function getBody(response: Response): Promise<unknown> {
  if ([204, 205, 304].includes(response.status)) {
    return undefined;
  }

  const text = await response.text();
  if (!text) {
    return undefined;
  }

  const contentType = response.headers.get("content-type") ?? "";
  if (contentType.includes("json")) {
    return JSON.parse(text);
  }

  return text;
}

export async function customFetch<T>(url: string, options: RequestInit): Promise<T> {
  const response = await fetch(url, options);
  const body = await getBody(response);

  if (!response.ok) {
    throw body ?? { status: response.status, title: response.statusText };
  }

  return body as T;
}

export type ErrorType<TError> = TError;

export type BodyType<TBody> = TBody;
