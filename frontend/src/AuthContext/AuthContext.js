import { useQuery } from '@tanstack/react-query';
import { createContext, useContext, useEffect, useState } from 'react';
import { checkUserAuthStatusAPI } from '../api/user/usersAPI';

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
	const [isAuthenticated, setIsAuthenticated] = useState(false);

	const {data, isError, isLoading, isSuccess} = useQuery({
		queryFn: checkUserAuthStatusAPI,
		queryKey: ['checkAuth'],
	});

	useEffect(() => {
		if(isSuccess) {
			setIsAuthenticated(data)
		}
	}, [data, isSuccess])

	const login = () => {
		setIsAuthenticated(true)
	}
	const logout = () => {
		setIsAuthenticated(false)
	}
	return (
		<AuthContext.Provider value={{ isAuthenticated, isError, isLoading, isSuccess, login, logout}}>
			{children}
		</AuthContext.Provider>
	)
}

export const useAuth = () => {
	return useContext(AuthContext);
}