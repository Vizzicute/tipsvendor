"use client";

import { IContextType, IUser } from '@/types';
import React, { createContext, useContext, useEffect, useState} from 'react'

export const INITIAL_USER = {
    id: '',
    name: '',
    email: '',
    country: '',
    address: '',
    imageUrl: '',
    role: '',
    subscription: [],
    createdAt: '',
};

const INITIAL_STATE = {
    user: INITIAL_USER,
    isLoading: false,
    isAuthenticated: false,
    setUser: () => {},
    setIsAuthenticated: () => {},
    checkAuthUser: async () => false as boolean,
}

const AuthContext = createContext<IContextType>(INITIAL_STATE);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [ user, setUser ] = useState<IUser>(INITIAL_USER);
    const [ isLoading, setIsLoading ] = useState(true);
    const [ isAuthenticated, setIsAuthenticated ] = useState(false);

    const checkAuthUser = async () => {
        setIsLoading(true);
        try {
            const currentAccount = localStorage.getItem('authUser');
            if(!currentAccount) return false;
            const parsedUser = JSON.parse(currentAccount);

            if(parsedUser) {
                setUser({
                    id: parsedUser.$id,
                    name: parsedUser.name,
                    email: parsedUser.email,
                    country: parsedUser.country,
                    address: parsedUser.address,
                    imageUrl: parsedUser.imageUrl,
                    role: parsedUser.role,
                    subscription: parsedUser.subscription,
                    createdAt: parsedUser.$createdAt
                });

                setIsAuthenticated(true);

                return true;
            }
            return false;
        } catch (error) {
            console.log(error);
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const storedUser = localStorage.getItem('authUser');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
            setIsAuthenticated(true);
            setIsLoading(false);
            return;
        }
        checkAuthUser();
    }, []);

    const signOut = () => {
        localStorage.removeItem('authUser');
        setUser(INITIAL_USER);
        setIsAuthenticated(false);
    };

    const value = {
        user,
        setUser,
        isLoading,
        isAuthenticated,
        setIsAuthenticated,
        checkAuthUser,
        signOut,
    };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthProvider

export const useUserContext = () => useContext(AuthContext);