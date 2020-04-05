const key = 'app_session';

export const createSessionId = () => {
  const id = [...Array(32)].map(() => Math.random().toString(36)[2]).join('');
  localStorage.setItem(key, id);
  return id;
};

export const getSessionId = () => {
  return localStorage.getItem(key);
};

export const refreshSessionId = () => {
  localStorage.clear();
  return createSessionId();
};

export const clearSessionId = () => {
  localStorage.clear();
};
