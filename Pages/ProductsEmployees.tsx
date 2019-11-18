import React, { useState } from 'react';
import { Dimensions } from 'react-native';
import { TabView, SceneMap } from 'react-native-tab-view';
import { withTheme } from 'react-native-paper';
import ProductsAdminPage from '../Pages/ProductsAdminPage';
import EmployeesPage from '../Pages/EmployeesPage';
const ProductsEmployees = (props) => {

    const [tabState, setTabState] = useState({
        index: 0,
        routes: [
            {
                key: 'first', title: 'Products'
            },
            {
                key: 'second', title: 'Employees'
            }
        ],
    });

    return (
        <TabView
            navigationState={tabState}
            
            renderScene={ ({ route }) => {
                switch (route.key) {
                  case 'first':
                    return <ProductsAdminPage branchId={props.navigation.getParam('branchId')}/>;
                  case 'second':
                    return <EmployeesPage branchId={props.navigation.getParam('branchId')} />;
                  default:
                    return null;
                }
              }}
            onIndexChange={index => setTabState({ index, routes: tabState.routes })}
            initialLayout={{ width: Dimensions.get('window').width }}
        />

    );
}

export default withTheme(ProductsEmployees);