
export const getValueFromLocalStorage = (key: string): string | undefined => {
  const value = window.localStorage.getItem(key);
  return value !== 'undefined' && value !== null ? value : undefined;
};

export const setValueInLocalStorage = (key: string, value: any) => {
  window.localStorage.setItem(key, value);
};

export const removeValueFromLocalStorage = (key: string) => {
  window.localStorage.removeItem(key);
};
