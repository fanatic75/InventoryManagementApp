import React from 'react';
import {  createAppContainer } from "react-navigation";
import { createDrawerNavigator } from 'react-navigation-drawer';
import { createStackNavigator } from 'react-navigation-stack';
import DrawerPage from './Pages/DrawerPage';
import LoginPage from './Pages/LoginPage'
import ProductsPage from './Pages/ProductsPage'
const MyStack = createStackNavigator({
  Home: { screen: ProductsPage },
  //Lamp: { screen: Lamp },
  //Profile:{screen:Profile},
 // Policy:{screen:Policy},
//  Help:{screen:Help},
 
});


const MyDrawer = createDrawerNavigator({
 
    Home: { screen: MyStack },
    
  }, {
      drawerPosition: "left",
      drawerWidth: 300,
      drawerType: "front",
      //@ts-ignore
      contentComponent: DrawerPage,
    });



const RootStack = createStackNavigator({
    Login: LoginPage,
    Drawer:MyDrawer,
  }, {
      initialRouteName: "Login",
      headerMode:'none',
    }
  );


  
const AppContainer = createAppContainer(RootStack);
export const Routes = () => {
return(
    <AppContainer />
)
}


