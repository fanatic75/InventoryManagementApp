import React, { useState, useEffect, Dispatch } from "react";
import {deviceStorage} from '../Services/devicestorage';
import Loading from '../Components/Loading';
import axios from 'axios';
import Constants from 'expo-constants';
import * as Config from "../config.json";
import { StyleSheet, View, Image, StatusBar, ScrollView } from 'react-native';
import { withTheme, Headline, TextInput, Text, Button } from "react-native-paper";

const authenticate : string = '/users/authenticate';


export const LoginPage = (props) => {
    
    const { colors } = props.theme;
    const styles = StyleSheet.create({
        container: {
            marginTop:Constants.statusBarHeight,
            flex: 1,
            backgroundColor:colors.background,
        },
        logoContainer: {
            flex: 2,
            margin: 50,
    
        },
        logo: {
            width: 270,
            height: 80,
            
            
        },
        inputContainer: {
            flex: 3,
            margin: 60
        }
    
    
    
    });


    useEffect(()=>{
        async function isLoggedIn(){
            const login=await deviceStorage.getItem('login');
            
            if(login)   
                return true;
            return false; 
        }   
       isLoggedIn()
       .then((res)=>{
            if(res)   
        props.navigation.navigate('Drawer');
       
       }).catch(err=>alert(err));
       
       
        
    },[])

    const [username, setUsername]: [string, Dispatch<any>] = useState(null);
    const [password, setPassword]: [string, Dispatch<any>] = useState(null);
    const [loading,setLoading]:[boolean,Dispatch<any>]=useState(false);
        const handleAuthentication:()=>void =  async ()=>{
            setLoading(true);
            try{
                const res= await axios({
                    url:Config.APIURL+authenticate,
                    method :'post',
                    data:{
                        username,
                        password,
                    }
                });
                setLoading(false);
                if(res){
                    const {createdAt,updatedAt,...importantData}=res.data;   
                    importantData.login='true';
                    Object.keys(importantData).map(async (key)=>{
                        if(typeof importantData[key]==='string')
                        await deviceStorage.saveItem(key,importantData[key]);
                        
                    });
                    setUsername(null);
                    setPassword(null);
                    props.navigation.navigate('Drawer');
                }
            }
            catch(e){
                setLoading(false);
                alert(e);
            }

           

        }

    

    



    return (
        <React.Fragment>

            <View style={[styles.container,]}>

                {loading?<Loading />:<ScrollView>




                    <View style={styles.logoContainer}>
                        <Image
                            style={styles.logo}
                            source={require('../assets/login.png')} />
                        <Headline style={{ fontWeight: "bold" ,color:colors.text}}>Welcome Back,</Headline>
                        <Text style={{ opacity: 0.75 }}>Sign in to continue</Text>

                    </View>



                    <View style={styles.inputContainer}>
                        <TextInput value={username} label="Username" onChangeText={text=>setUsername(text)}  onSubmitEditing={() => { this.secondTextInput.focus(); }} blurOnSubmit={false} returnKeyType="go" keyboardType="email-address" />
                        <TextInput value={password} onChangeText={text => setPassword(text)} label="Password"  onSubmitEditing={handleAuthentication} secureTextEntry={true} multiline={false} ref={(input) => { this.secondTextInput = input; }} returnKeyType="done" />

                        <Button style={{ marginTop: 10 }}  onPress={handleAuthentication} mode="contained" >
                            Login
                             </Button>


                    </View>





                </ScrollView>

                }
            </View>
        </React.Fragment>

    );

   

}
LoginPage.navigationOptions = {
    header:null,
}



export default withTheme(LoginPage);