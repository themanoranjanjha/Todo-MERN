const BASE_URL = import.meta.env.VITE_BASE_URL;

export const endpoint = {
  SIGNIN_API: `${BASE_URL}/users/register`,
  LOGIN_API: `${BASE_URL}/users/login`,
  LOGOUT_API: `${BASE_URL}/users/logout`,
  RESETPASSTOKEN_API: `${BASE_URL}/users/refresh-token`,
};

export const todoEndpoint = {
  create: `${BASE_URL}/todos/create`,
  get: `${BASE_URL}/todos/gettodos`,
  update: (id) => `${BASE_URL}/todos/update/${id}`, // Pass id dynamically
  delete: (id) => `${BASE_URL}/todos/delete/${id}`, // Pass id dynamically
  getOne: (id) => `${BASE_URL}/todos/${id}`, // Pass id dynamically
  complete: (id) => `${BASE_URL}/todos/complete/${id}`, // Pass id dynamically
};
