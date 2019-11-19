import React, { useState, useEffect, Dispatch } from "react";
import { deviceStorage } from '../Services/devicestorage';
import Loading from '../Components/Loading';
import axios from 'axios';
import Constants from 'expo-constants';
import * as Config from "../config.json";
import { StyleSheet, View, Image, StatusBar, ScrollView } from 'react-native';
import { withTheme, Headline, TextInput, Text, Button } from "react-native-paper";
import errorHandler from "../Services/errorHandler";

const authenticate: string = '/users/authenticate';


export const LoginPage = (props) => {

    const { colors } = props.theme;
    const styles = StyleSheet.create({
        container: {
            marginTop: Constants.statusBarHeight,
            flex: 1,
            backgroundColor: colors.accent,
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
        },
        inputs: {
            backgroundColor: colors.accent,
            marginTop: 20,
        }



    });

    useEffect(() => {
        let id = null;
        let branch = null;
        async function isLoggedIn() {
            const login = await deviceStorage.getItem('login');
            const role = await deviceStorage.getItem('role');
            branch = await deviceStorage.getItem('branch');
            id = await deviceStorage.getItem('_id');
            if (login)
                return { id, login, role, branch };
            return false;
        }
        isLoggedIn()
            .then((res) => {
                if (res && res.login) {
                    if (res.role == 'Admin')
                        props.navigation.navigate('Admin',{id});
                    else {
                        props.navigation.navigate('Home', { branch, id });
                    }

                }
            }).catch(err => alert(err));



    }, [])

    const [username, setUsername]: [string, Dispatch<any>] = useState(null);
    const [password, setPassword]: [string, Dispatch<any>] = useState(null);
    const [loading, setLoading]: [boolean, Dispatch<any>] = useState(false);
    const handleAuthentication: () => void = async () => {
        if (username !== null && password !== null) {
            setLoading(true);
            try {
                const res = await axios({
                    url: Config.APIURL + authenticate,
                    method: 'post',
                    data: {
                        username,
                        password,
                    }
                });
                setLoading(false);
                if (res) {
                    const { createdAt, updatedAt, ...importantData } = res.data;
                    importantData.login = 'true';
                    Object.keys(importantData).map(async (key) => {
                        if (typeof importantData[key] === 'string')
                            await deviceStorage.saveItem(key, importantData[key]);

                    });
                    setUsername(null);
                    setPassword(null);
                    const branch = importantData.branch;
                    const id=importantData._id
                    const role = await deviceStorage.getItem('role');
                    if(role==='Admin')
                    props.navigation.navigate('Admin', { id,role });
                    else
                    props.navigation.navigate('Home', { branch,role });
                
                }
            }
            catch (e) {
                setLoading(false);
                errorHandler(e,handleAuthentication);
            }
            return;
        }
        alert('username or password cannot be empty');



    }







    return (
        <React.Fragment>

            <View style={[styles.container,]}>

                {loading ? <Loading /> : <ScrollView>




                    <View style={styles.logoContainer}>
                        <Image
                            style={styles.logo}
                            source={require('../assets/login.png')} />
                        <Headline style={{ fontWeight: "bold", color: colors.text }}>Welcome Back,</Headline>
                        <Text style={{ opacity: 0.75 }}>Sign in to continue</Text>

                    </View>



                    <View style={styles.inputContainer}>
                        <TextInput value={username} label="Username" onChangeText={text => setUsername(text)} style={styles.inputs} onSubmitEditing={() => { this.secondTextInput.focus(); }} blurOnSubmit={false} returnKeyType="go" keyboardType="email-address" />
                        <TextInput value={password} onChangeText={text => setPassword(text)} label="Password" style={styles.inputs} onSubmitEditing={handleAuthentication} secureTextEntry={true} multiline={false} ref={(input) => { this.secondTextInput = input; }} returnKeyType="done" />

                        <Button style={{ marginTop: 20 }} onPress={handleAuthentication} mode="contained" >
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
    header: null,
}



export default withTheme(LoginPage);