import { useCallback, useState } from "react";


export const useRequest = () => {
    const [error, setError] = useState(null);

    const requests = useCallback(async (url, method, body = null, headers = {}) => {

        try {
            const response = await fetch(url, {
                method,
                body: JSON.stringify(body),
                headers
            });
    
            const data = response.json();
        
            return data;
        } catch (error) {
            setError(error);

            return error;
        }
    }, []);
        
   

    const ClearError = useCallback(() => {
        setError(null);
    }, []);

    return {requests, error, ClearError};
}