import { SafeAreaView } from 'react-navigation';
import React, { useEffect, useState } from "react";
import Constants from 'expo-constants';

import { View, StyleSheet, ScrollView } from "react-native";
import { withTheme, List, Title } from "react-native-paper";
import { deviceStorage } from '../Services/devicestorage';


const DrawerPage = (props: { theme: any, navigation: any }) => {
    
    const [name, setName] = useState(null);
    const [role,setRole]=useState(null);
    useEffect( ()=>{
        async function findRole(){
            const role=await await deviceStorage.getItem('role');
        
            setRole(role);

        }
        findRole();
    },[role])
    useEffect(() => {
        async function getName() {
            const name = await deviceStorage.getItem('username');

            return name;
        }
        getName().then((name) => {
            setName(name);
        }).catch(err=>alert(err));
    }, [name]);
    return (
        <View style={{marginTop:Constants.statusBarHeight}}>
        <ScrollView>
        <SafeAreaView style={styles.container} forceInset={{ top:'always', horizontal: 'never' }}>
           
           
                <View style={styles.firstSection}>

                    <View style={[styles.profile]}>
                        <Title style={[{ marginTop:10,marginBottom: 20 }, { color: 'white' }]}>{name}</Title>
                    </View>
                    <View >
                        <List.Section>
                          

                            <List.Item
                                title="Signout"
                                onPress={() => {
                                    deviceStorage.deleteStorage();
                                    props.navigation.navigate('Login');
                                }}

                                left={() => <List.Icon icon="exit-to-app" />}
                            />
                             {role==='Admin'&& <List.Item
                                title="Admin"
                                onPress={() => {
                                    props.navigation.navigate('AdminEmployeesPage');
                                }}

                                left={() => <List.Icon icon="account" />}
                            />}
                        </List.Section>
                    </View>
                </View>
               
           
        </SafeAreaView>
         </ScrollView>
         </View>

    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    firstSection: {
        flex: 1
    },
    secondSection: {
        flex: 1,
    },
    profile: {
        flex: 1,
        backgroundColor:"#521972",
        alignItems: "center",
        justifyContent:"center"
    }
});


export default withTheme(DrawerPage);