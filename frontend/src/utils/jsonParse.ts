// src/utils/jsonParse.ts
export const jsonParse = <T>(value: string | null): T | null => {
  try {
    return value ? (JSON.parse(value) as T) : null;
  } catch (error) {
    console.error('JSON parse error:', error);
    return null;
  }
};
