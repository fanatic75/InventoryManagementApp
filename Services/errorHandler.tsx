import { deviceStorage } from "./devicestorage";
import Axios from "axios";
import * as Config from '../config.json';

export default function errorHandler (error,action) {
  if(typeof error==='string'){
    alert(error);
    return;
  }
  if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      if(error.response.data.message){
        console.log(error.response.data.message)
      if(error.response.data.message=='jwt expired')
      setNewRefreshToken(action)
      .then(action=>action())
      .catch(err=>alert(err))
      return;
      }

      else 
      console.log(error.response.data);
    
    } else if (error.request) {


        // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
      console.log(error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      
      
      if(error.message)
      alert('Error '+error.message);
      
    }
  }


  async function setNewRefreshToken(action){
    try{
      const id=await deviceStorage.getItem('_id');
      const token=await deviceStorage.getItem('refreshToken');
      const res=await Axios.post(Config.APIURL+'/users/token/'+id,{
        token,
      });
      if(res)
        if(res.data)
          deviceStorage.saveItem('token',res.data['token']);


    }catch(e){
      throw 'Please Sign In again.';
    }
    
    return action;
  }