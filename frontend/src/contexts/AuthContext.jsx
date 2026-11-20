import { createContext, useContext, useEffect, useState } from "react"

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {

    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const token = await window.electronAPI?.getToken()
                setIsAuthenticated(!!token)
            } catch (err) {
                console.log("auth check failed", err)
                setIsLoading(false)
            } finally {
                setIsLoading(false)
            }
        };

        checkAuth();
    })

    return (
        <AuthContext.Provider value={{isLoading, isAuthenticated, setIsAuthenticated, setIsLoading}}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)