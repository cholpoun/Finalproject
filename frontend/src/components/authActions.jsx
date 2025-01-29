export const login = (userData) => {
  localStorage.setItem('token', userData.token);
  localStorage.setItem('userId', userData.id);
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('userId');
};