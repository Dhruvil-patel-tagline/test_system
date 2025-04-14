export const getCookie = (name) => {
  const cookies = document.cookie.split("; ");
  for (let cookie of cookies) {
    const [key, value] = cookie.split("=");
    if (key === name) {
      try {
        return JSON.parse(decodeURIComponent(value));
      } catch {
        return decodeURIComponent(value);
      }
    }
  }
  return null;
};
