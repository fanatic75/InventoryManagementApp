import React, { useEffect, useState, useCallback } from 'react';
import { SafeAreaView, RefreshControl, ScrollView, View, FlatList, Dimensions } from 'react-native';
import { DrawerActions } from 'react-navigation-drawer';
import Constants from 'expo-constants';
import { BackHandler } from "react-native";
import { withTheme, IconButton, Snackbar, Searchbar } from 'react-native-paper';
import { withNavigationFocus } from 'react-navigation';
import axios from 'axios';
import * as Config from '../config.json';
import errorHandler from '../Services/errorHandler';
import wait from '../Services/wait';
import { deviceStorage } from '../Services/devicestorage';
import Loading from '../Components/Loading';
import Product from '../Components/Product';
const pressToExit = 1;

const ProductsPage = (props) => {
    const { colors } = props.theme;
    const branch = props.navigation.getParam('branch');
    const [snackBarVisibility, setSnackBarVisibility] = useState(false);
    const [searchQuery, setSearchQuery] = useState(null);
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [products, setProducts] = useState(null);

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        try {
            const token = await deviceStorage.getItem('token');
            if (token) {

                const res = await axios.get(Config.APIURL + '/branches/' + branch + '/products', {
                    headers: {
                        'Authorization': 'Bearer ' + token
                    }
                });
                if (res)
                    if (res.data)
                        if (res.data.products)
                            setProducts(res.data.products);
                setLoading(false);
                return;
            }
            throw 'No Token Found';
        } catch (error) {
            setLoading(false);
            errorHandler(error);
        }
    }, [branch]);


    useEffect(() => {
        fetchProducts();
        console.log('use effect with fetch products');
        }, [fetchProducts])




    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        fetchProducts();
        wait(2000).then(() => setRefreshing(false));
        console.log('use effect for refresh');

    }, [refreshing, fetchProducts]);
    const [exitCount, setExitCount] = useState(0);
    useEffect(() => {

        BackHandler.addEventListener("hardwareBackPress", () => {
            if (props.isFocused) {
                setSnackBarVisibility(true);
                if (exitCount === pressToExit) {

                    BackHandler.exitApp();

                }
                setExitCount(1);

                return true;
            }
        });
        console.log('use effect for exit button');

        return () => {
            BackHandler.removeEventListener('hardwareBackPress', () => {
                setExitCount(0);
            });
        }
    }, [exitCount]);


    const productExists = product => {
        return product.name.toLowerCase().includes(searchQuery.trim().toLowerCase());
    }


    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.background, marginTop: Constants.statusBarHeight }}>
            <Snackbar style={{ position: 'absolute', bottom: 0 }} duration={3000} onDismiss={() => { setSnackBarVisibility(false); setExitCount(0); }} visible={snackBarVisibility}>
                "Press Back again to Exit the App."
            </Snackbar>
            <Searchbar
                placeholder="Search your Products"
                onChangeText={query => setSearchQuery(query)}
                value={searchQuery}
                style={{ margin: 10 }}
                theme={{ roundness: 10 }}
            />
            {loading ? <Loading /> : <ScrollView
                style={{ flex: 1 }}
                refreshControl={
                    <RefreshControl size={30} refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                <FlatList style={{ flexDirection: 'column' }} numColumns={Dimensions.get('window').width>600?3:2}
                    data={products} renderItem={({ item }:any) => {
                        if (searchQuery)
                            return productExists(item) ? <Product 
                                name={item.name} stock={item.quantity} /> : null;
                        else
                            return <Product 
                                name={item.name} stock={item.quantity} />

                    }} keyExtractor={(item:any) => item._id}/>


            </ScrollView>}
        </SafeAreaView>
    )
}

ProductsPage.navigationOptions = ({ navigation }) => {
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
export default withTheme(withNavigationFocus(ProductsPage));