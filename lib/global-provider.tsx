// Global auth provider: shares current-user, loading, login status, and refetch through React context.
import { createContext, ReactNode, useContext } from "react";
import { getCurrentUser } from "./appwrite";
import { useAppwrite } from "./useAppwrite";

interface GlobalContextType {
    isLoggedIn: boolean;
    user: User | null;
    loading: boolean;
    refetch: (newParams?: Record<string, string | number>) => Promise<void>;
}

interface User {
    $id: string;
    name: string;
    email: string;
    avatar?: string;
}

// Undefined default lets the custom hook detect usage outside the provider.
const GlobalContext = createContext<GlobalContextType | undefined> (undefined);

export const GlobalProvider = ({ children }: {children: ReactNode
}) => {

    const {
        data: user,
        loading,
        refetch,
    } = useAppwrite({
        fn: getCurrentUser,
    });

    // The app treats any loaded Appwrite user as an authenticated session.
    const isLoggedIn = !!user;

    return (
        <GlobalContext.Provider 
          value={{
            isLoggedIn,
            user,
            loading,
            refetch,
         }}
        >
            {children}
        </GlobalContext.Provider>
    );
}; 

export const useGlobalContext = (): GlobalContextType => {
    const context = useContext(GlobalContext);
    if(!context) 
        throw new Error('useGlobalcontext must be used within a GlobalProvider');

    return context;
}

export default GlobalProvider;