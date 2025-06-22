import { useState, useEffect, createContext } from 'react';


export const AuthContext = createContext(); 

export const AuthProvider = ({children}) => {
    // Estado para usuario autenticado
    const [auth, setAuth] = useState(null);
    const [cargando, setCargando] = useState(true);
    
    // Función para actualizar auth y guardar en localStorage
    const actualizarAuth = (userData) => {
        setAuth(userData);
        if (userData) {
            localStorage.setItem('auth_data', JSON.stringify(userData));
        } else {
            localStorage.removeItem('auth_data');
        }
    };
    
    useEffect(() => {
        const recuperarSesion = () => {
            const token = localStorage.getItem('token');
            
            if(!token) {
                setCargando(false);
                return;
            }
            
            // Recuperar datos almacenados
            const savedAuth = localStorage.getItem('auth_data');
            if (savedAuth) {
                try {
                    const userData = JSON.parse(savedAuth);
                    setAuth(userData);
                } catch (e) {
                    console.error("Error al recuperar sesión:", e);
                    localStorage.removeItem('token');
                    localStorage.removeItem('auth_data');
                    setAuth(null);
                }
            } else {
                // No hay datos guardados, no podemos recuperar la sesión
                localStorage.removeItem('token');
                setAuth(null);
            }
            
            setCargando(false);
        };
        
        recuperarSesion();
    }, []);
    
    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('auth_data');
        setAuth(null);
    };
    
    return (
        <AuthContext.Provider
            value={{
                auth,
                setAuth: actualizarAuth, // Usamos la nueva función
                cargando,
                logout
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;