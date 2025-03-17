export const constructQueryParams = (
  params: Record<string, any>, // Allow objects and arrays
): string => {
  const serialize = (key: string, value: any): string => {
    if (value === undefined || value === null) return ''; // Skip null/undefined

    if (typeof value === 'object') {
      return Object.entries(value)
        .map(([subKey, subValue]) => serialize(`${key}[${subKey}]`, subValue))
        .join('&');
    }

    return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
  };

  const queryString = Object.entries(params)
    .map(([key, value]) => serialize(key, value))
    .filter(Boolean) // Remove empty strings
    .join('&');

  return queryString ? `?${queryString}` : '';
};
