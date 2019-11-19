import React, { useEffect, useState, useCallback } from 'react';
import { SafeAreaView, RefreshControl, ScrollView, View, FlatList, Dimensions } from 'react-native';
import { DrawerActions } from 'react-navigation-drawer';
import Constants from 'expo-constants';
import { BackHandler } from "react-native";
import { withTheme, IconButton, Snackbar, Searchbar, Button } from 'react-native-paper';
import ConfirmDialog from '../Components/ConfirmDialog';
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
    const [searchQuery, setSearchQuery] = useState('');
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [products, setProducts] = useState(null);
    const [confirmDialogVisibility, setConfrimDialogVisibility] = useState(false);



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
                        if (res.data.products) {
                            const productStateInitial = res.data.products.map((product) => {
                                return {
                                    isAddPressed: false,
                                    cartQuantity: 0,
                                    ...product,
                                }
                            });
                            setProducts(productStateInitial);
                        }
                setLoading(false);
                return;
            }
            throw 'No Token Found';
        } catch (error) {
            setLoading(false);
            errorHandler(error,fetchProducts);
        }
    }, [branch]);


    useEffect(() => {
        fetchProducts();
    }, [fetchProducts])






    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        fetchProducts();
        wait(2000).then(() => setRefreshing(false));

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


        return () => {
            BackHandler.removeEventListener('hardwareBackPress', () => {
                setExitCount(0);
            });
        }
    }, [exitCount]);





    const sellProducts = async () => {
        try {
            let orders = null;
            if (products) {
                orders = products.filter(product => {
                    return product.cartQuantity > 0
                }).map(product => {
                    return {
                        _id: product._id,
                        quantity: product.quantity - product.cartQuantity,
                    }
                });
            }
            const token = await deviceStorage.getItem('token');
            if (token) {
                const res = await axios.post(Config.APIURL + '/products/avs', {
                    orders: orders,


                }, {
                    headers: {
                        'Authorization': 'Bearer ' + token
                    }
                });
                if (res)
                    if (res.data)
                        if (res.data.message)
                            alert(res.data.message);
            }

        }
        catch (e) {
            errorHandler(e,sellProducts);
        }
    }

    const productExists = product => {
        return product.name.toLowerCase().includes(searchQuery.trim().toLowerCase());
    }


    return (
        <>
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
                    {products !== null && <ConfirmDialog onRefresh={onRefresh} visibility={confirmDialogVisibility} applyAction={sellProducts} setDialogVisibility={setConfrimDialogVisibility} content='Mark Items as sold' />}
                    {products !== null && <FlatList style={{ flexDirection: 'column' }} numColumns={Dimensions.get('window').width > 800 ? 3 : 2}
                        data={products} renderItem={({ item, index }: any) => {
                            if (searchQuery) {
                                if (productExists(item)) {
                                    if (item.quantity !== 0)
                                        return <Product
                                            name={item.name} price={item.price} quantity={item.cartQuantity} isAddPressed={item.isAddPressed} products={products} setProducts={setProducts} index={index} stock={item.quantity} />

                                } else {
                                    return null;
                                }
                            }

                            else {

                                if (item.quantity !== 0)
                                    return <Product
                                        name={item.name} price={item.price} quantity={item.cartQuantity} isAddPressed={item.isAddPressed} products={products} setProducts={setProducts} index={index} stock={item.quantity} />
                            }

                        }} keyExtractor={(item: any) => item._id} />}
                    {products && products.some(product => product.isAddPressed === true) && <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', margin: 10 }}>
                        <Button onPress={() => setConfrimDialogVisibility(true)} style={{ width: 200, height: 50, alignItems: 'center', justifyContent: 'center' }} color={colors.primary} mode='contained' icon='check' >MARK AS SOLD</Button>
                    </View>}




                </ScrollView>}
            </SafeAreaView>
        </>
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