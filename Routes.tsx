import React from 'react';
import {  createAppContainer } from "react-navigation";
import { createDrawerNavigator } from 'react-navigation-drawer';
import { createStackNavigator } from 'react-navigation-stack';
import DrawerPage from './Pages/DrawerPage';
import LoginPage from './Pages/LoginPage'
import ProductsPage from './Pages/ProductsPage'
import AdminPage from './Pages/AdminPage';
import Loading from './Components/Loading';
import ProductsEmployees from './Pages/ProductsEmployees';
import AdminEmployeesPage from './Pages/AdminEmployeesPage';
const MyStack = createStackNavigator({
  Loading:{screen:Loading},
  //@ts-ignore
  Admin:{screen:AdminPage},
  Home: { screen: ProductsPage },
  ProductsEmployees:{screen:ProductsEmployees},
  AdminEmployeesPage:{screen:AdminEmployeesPage}
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
    Loading:Loading,
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


