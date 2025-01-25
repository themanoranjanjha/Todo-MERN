const BASE_URL = import.meta.env.VITE_BASE_URL;


export const endpoint = {
    register: `${BASE_URL}/users/register`,
    login : `${BASE_URL}/users/login`,
    logout : `${BASE_URL}/users/logout`,
    refreshToken : `${BASE_URL}/users//refresh-token`,

};

export const todoEndpoint = {
    create : `${BASE_URL}/todos/create`,
    get : `${BASE_URL}/todos/gettodos`,
    update : `${BASE_URL}/todos/update/${id}`,
    delete : `${BASE_URL}/todos/delete/${id}`,
    getOne : `${BASE_URL}/todos/${id}`,
    coplete : `${BASE_URL}/todos/complete/${id}`,
}