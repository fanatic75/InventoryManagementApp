import React from "react";
import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { deviceStorage } from "./devicestorage";
import * as Config from  '../config.json';
export const useFetch :(url:string,options?:AxiosRequestConfig)=>{response:AxiosResponse,error:AxiosError,isLoading:Boolean} = ( url:string,options? : AxiosRequestConfig) => {
    const [response , setResponse] = React.useState(null);
    const [error, setError] = React.useState(null);
    const [isLoading, setIsLoading] = React.useState(false);
    React.useEffect(() => {
      const fetchData = async () => {
        setIsLoading(true);
        try {
          const token =await deviceStorage.getItem('token');
          if(token){
            
          const res = await axios.get(Config.APIURL+url,{headers:{
            'Authorization':'Bearer '+token
          },...options});
          setResponse(res);
          setIsLoading(false);
          return;
          }
          throw 'No Token Found';
        } catch (error) {
          setIsLoading(false);
          console.log(error);
          setError(error);
        }
      };
      fetchData();
    },[]);
    return { response, error, isLoading };
      };