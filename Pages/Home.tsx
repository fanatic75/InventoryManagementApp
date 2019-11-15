import React, { useEffect, useState } from 'react';
import {View} from 'react-native';
import {DrawerActions} from 'react-navigation-drawer';
import Constants from 'expo-constants';
import { BackHandler } from "react-native";
import { withTheme,IconButton, Snackbar, Searchbar } from 'react-native-paper';
import { withNavigationFocus } from 'react-navigation';
import { useFetch } from '../Services/useFetch';

const pressToExit = 1;

const Home = (props) => {
    const [snackBarVisibility,setSnackBarVisibility]=useState(false);
    const [exitCount,setExitCount]=useState(0);
    const [searchQuery,setSearchQuery]=useState(null);
    useEffect(()=>{

       BackHandler.addEventListener("hardwareBackPress",()=>{
            if(props.isFocused){
                setSnackBarVisibility(true);
                if(exitCount===pressToExit){

                    BackHandler.exitApp();
                    
                }
                setExitCount(1);    
                
                return true;
            }
        })
        return ()=>{
            BackHandler.removeEventListener('hardwareBackPress',()=>{
                setExitCount(0);
            });
        }
    },[exitCount]);

   // const {}=useFetch('')

    return(
        <View style={{flex:1,marginTop:Constants.statusBarHeight}}>
            <Snackbar style={{position:'absolute', bottom:0}} duration={3000} onDismiss={()=>{setSnackBarVisibility(false);setExitCount(0);}}  visible={snackBarVisibility}>
            "Press Back again to Exit the App."
            </Snackbar>
            <Searchbar 
             placeholder="Search your Products"
             onChangeText={query => setSearchQuery(query)}
             value={searchQuery}
             style={{ margin: 10 }}
             theme={{ roundness: 10 }}
            />
        </View>
    )
}

Home.navigationOptions =({navigation})=> {
    return {
        title: "Home",
            headerLeft: (<IconButton
                icon="menu"
                color="white"
                onPress={() => {
                    navigation.dispatch(DrawerActions.toggleDrawer());
                }}
            />
            ),
            headerStyle: {
                backgroundColor: '#521972',
            },
            headerTitleStyle: {
                alignSelf: 'center',
                textAlign: "center",
                justifyContent: 'center',
                flex: 1,
                fontWeight: 'bold',
                textAlignVertical: 'center',
                marginRight: 70


            },
            headerTintColor: '#fff',
        }

    }


//@ts-ignore
export default withTheme(withNavigationFocus(Home));