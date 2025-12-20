export const saveAuth = (token: string, role: string)=>{
    localStorage.setItem("token",token);
    localStorage.setItem("role",role);
}

export const clearAuth = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
}

export const getRole = () => localStorage.getItem("role");
export const isLoggedIn = () => !! localStorage.getItem("token");