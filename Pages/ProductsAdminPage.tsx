import React, { useState, useEffect, useCallback } from 'react';
import {  SafeAreaView, ScrollView, RefreshControl, StyleSheet } from 'react-native';
import axios from 'axios';
import Constants from 'expo-constants';
import * as Config from '../config.json';
import { deviceStorage } from '../Services/devicestorage';
import errorHandler from '../Services/errorHandler';
import { Searchbar,  withTheme, FAB ,TextInput, } from 'react-native-paper';
import ProductsLists from '../Components/ProductsLists';
import wait from '../Services/wait';
import UpdateDialog from '../Components/UpdateDialog';
import Loading from '../Components/Loading';
import { withNavigationFocus } from 'react-navigation';

const styles = StyleSheet.create({
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
    },
})
const AdminPage = (props) => {

    



    const { colors } = props.theme;
    const [searchQuery, setSearchQuery] = useState('');
    const [refreshing, setRefreshing] = useState(false);
    const [products, setProducts] = useState(null);
    const [loading, setLoading] = useState(false);
    const [updateDialogVisibility, setUpdateDialogVisibility] = useState(false);
    const [name,setProductName]=useState(null);
    const [quantity,setProductQuantity]=useState(null);
    const [price,setProductPrice]=useState(null);

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        try {
            const token = await deviceStorage.getItem('token');
            if (token) {

                const res = await axios.get(Config.APIURL + '/branches/'+props.branchId+'/products', {
                    headers: {
                        'Authorization': 'Bearer ' + token
                    }
                });
                if (res) {
                    console.log(res.data);
                    console.log(res.data.products);
                    setProducts(res.data.products);
                }
                setLoading(false);
                return;
            }
            throw 'No Token Found';
        } catch (error) {
            setLoading(false);
            errorHandler(error);
        }
    }, []);



    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        fetchProducts();
        wait(2000).then(() => setRefreshing(false));

    }, [refreshing, fetchProducts]);

    const productExists = (product) => {
        return product.name.toLowerCase().includes(searchQuery.trim().toLowerCase());
    }
    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const registerProduct =async () => {
        
            try {
                const token = await deviceStorage.getItem('token');
                if (token) {
                        if(!name||!price||!quantity){
                            
                        throw 'Product Name/Price/Quatity is required';
                        }
                        const res = await axios.post(Config.APIURL + '/products/register', {
                            name,
                            quantity,
                            price,
                            branch:props.branchId
                        }, {
                            headers: {
                                'Authorization': 'Bearer ' + token,
                            }
    
                        });
                        if (res)
                            alert('Product created');
                       }
                        
    
                       
                       setProductName(null);
                       setProductPrice(null);
                       setProductQuantity(null);
                
            }
            catch (e) {
                errorHandler(e);
            }
        
    }
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.background, marginTop: Constants.statusBarHeight }}>
            
            <Searchbar
                placeholder="Search your Products"
                onChangeText={query => setSearchQuery(query)}
                value={searchQuery}
                style={{ margin: 10 }}
                theme={{ roundness: 10 }}
            />{
                loading ? <Loading /> : <ScrollView
                    style={{ flex: 1 }}
                    refreshControl={
                        <RefreshControl size={30} refreshing={refreshing} onRefresh={onRefresh} />
                    }


                >




                    {
                        products && products.map((product, index) => {
                            if (productExists(product))
                                return <ProductsLists navigation={props.navigation} products={products}  index={index} setLoading={setLoading} onRefresh={onRefresh} key={product._id} name={product.name} quantity={product.quantity} price={product.price} productId={product._id} />
                            return null;
                        })
                    }

                </ScrollView>

            }
            <UpdateDialog title='Register A Product' onRefresh={onRefresh} visibility={updateDialogVisibility} applyAction={registerProduct} setDialogVisibility={setUpdateDialogVisibility}>
                <TextInput
                    label="Enter Product Name"
                    style={{ margin: 10 }}
                    value={name}
                    onChangeText={value => setProductName(value)}

                />
                <TextInput
                    style={{ margin: 10 }}
                    label="Enter Product Price"
                    value={price}
                    keyboardType='numeric'
                    onChangeText={value => setProductPrice(value)}

                />
                <TextInput
                    style={{ margin: 10 }}
                    label="Enter Product Quantity"
                    value={quantity}
                    keyboardType='numeric'
                    onChangeText={value => setProductQuantity(value)}

                />

            </UpdateDialog>

           { props.isFocused &&<FAB
                small={false}
                icon={'plus'}
                onPress={() => setUpdateDialogVisibility(true)}

                style={[{ backgroundColor: colors.primary }, styles.fab]}
            />
            }

        </SafeAreaView>




    )
}




//@ts-ignore
export default withTheme(withNavigationFocus(AdminPage));