import { useCallback, useState } from "react";

import {Alert} from "@material-ui/lab";



export const useMessage = () => useCallback(data => {
    console.log(data);
    if(data.access)
        {
            return(
                <Alert severity="success">
                    Успешно авторизованы
                </Alert>
            )
        }
    else if(!data.access){
        return(
            <Alert severity="info">
                {data.message}
            </Alert>
        )
    }

}, [])
