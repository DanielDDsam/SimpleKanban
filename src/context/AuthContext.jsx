import {auth} from "../firebase/firebase.config";
import {useContext, createContext, useEffect, useState} from "react";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
export const authContext = createContext();

export const useAuth = () => {
    const context = useContext(authContext);
    if(!context) {
        throw new Error("useAuth debe estar dentro del proveedor AuthContext");
    }
    return context;
}

export const AuthProvider = ({children}) => {

    const [user, setUser] = useState("");
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((currentUser) => {
            if(currentUser) {
                setUser(currentUser);
            } else {
                console.log("No hay usuario");
            }
        });
        return () => unsubscribe();
    }, []);

    const register = async (email, password) => {
        
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        console.log(userCredential)
   
    }
    const login = async (email, password) => {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log(userCredential)
    }
    const loginWithGoogle = async () => {
        const provider = new GoogleAuthProvider();
        const userCredential = await signInWithPopup(auth, provider);
        console.log(userCredential)
    }
    const logout = () => {
        const userCredential = signOut(auth);
        console.log(userCredential)
    }
    return (
        <authContext.Provider value={{
            register,
            login,
            loginWithGoogle,
            logout,
            user
        }}>
            {children}
        </authContext.Provider>
    );
}