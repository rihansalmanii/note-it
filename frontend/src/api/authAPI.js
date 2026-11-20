import api from "./api";

export const login = async (formData) => {
    try {
        const response = await api.post("/auth/login", formData)
        console.log(formData)
        return response.data
    } catch(err) {
        console.log(err)
    }
}

export const register = async(formData) => {
    try {
        const response = await api.post("/auth/register", formData)
        return response.data
    } catch(err) {
        console.log(err)
    }
}

export const logout = async() => {
    try {
        const response = await api.post("/auth/logout")
        return response.data
    } catch(err) {
        console.log(err)
    }
}