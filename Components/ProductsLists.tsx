import React, { useState } from 'react';
import ConfirmDialog from '../Components/ConfirmDialog';
import UpdateDialog from '../Components/UpdateDialog';
import { deviceStorage } from '../Services/devicestorage';
import * as Config from '../config.json';
import axios from 'axios';
import { Card, List, Divider, withTheme, TextInput } from 'react-native-paper';
import errorHandler from '../Services/errorHandler';
const ProductsLists = (props) => {
    const [expanded, setExpanded] = useState(false);
    const [confirmDialogVisibility, setConfrimDialogVisibility] = useState(false);
    const [updateDialogVisibility, setUpdateDialogVisibility] = useState(false);
    const [name,setProductName]=useState(props.products[props.index]['name']);
    const [quantity,setProductQuantity]=useState(props.products[props.index]['quantity']);
    const [price,setProductPrice]=useState(props.products[props.index]['price']);

    const deleteConfirmation = 'Are you sure you want to delete this Product?';
    const deleteABranch = async () => {
        try {
            const token = await deviceStorage.getItem('token');
            if (token) {
                const res = await axios.delete(Config.APIURL + '/products/' + props.productId, {
                    headers: {
                        'Authorization': 'Bearer ' + token,
                    }
                });
                if (res)
                    res.data.message && alert(res.data.message);
            }
        }
        catch (e) {
            errorHandler(e);
        }
    }
    const updateProduct = async () => {
        try {
            const token = await deviceStorage.getItem('token');
            if (token) {
                    if(!name||!price||!quantity){
                        
                    throw 'Product Name/Price/Quantity is required';
                    }
                    const res = await axios.put(Config.APIURL + '/products/' + props.productId, {
                        name,
                        price,
                        quantity
                    }, {
                        headers: {
                            'Authorization': 'Bearer ' + token,
                        }

                    });
                    if (res)
                        alert('Product updated');



            }
        }
        catch (e) {
            errorHandler(e);
        }
    }

   

    return (
        <>
            <ConfirmDialog onRefresh={props.onRefresh} visibility={confirmDialogVisibility} applyAction={deleteABranch} setDialogVisibility={setConfrimDialogVisibility} content={deleteConfirmation} />
            <UpdateDialog title='Update Branch Name/Address' onRefresh={props.onRefresh} visibility={updateDialogVisibility} applyAction={updateProduct} setDialogVisibility={setUpdateDialogVisibility}>


            <TextInput
                    label="Enter Product Name"
                    style={{ margin: 10 }}
                    value={name}
                    onChangeText={value => setProductName(value)}

                />
                <TextInput
                    style={{ margin: 10 }}
                    label="Enter Product Price"
                    keyboardType='numeric'
                    value={price.toString()}
                    onChangeText={value => setProductPrice(value)}

                />
                <TextInput
                    style={{ margin: 10 }}
                    label="Enter Product Quantity"
                    keyboardType='numeric'
                    value={quantity.toString()}
                    onChangeText={value => setProductQuantity(value)}

                />




            </UpdateDialog>
            <Card theme={{ roundness: 10 }} style={{ margin: 10 }}>
                <List.Accordion
                    title={props.name}
                    style={{ padding: 10 }}
                    description={'Quantity : '+props.quantity+' Price: '+props.price }
                    left={props => <List.Icon {...props} icon='food' />}
                    expanded={expanded}
                    onPress={() => setExpanded(!expanded)}

                >

                    <Divider style={{ height: 1 }} />
                   <List.Item left={props => <List.Icon {...props} icon="square-edit-outline" />} onPress={() => setUpdateDialogVisibility(true)} title="Update Product" />
                    <List.Item left={props => <List.Icon {...props} icon="delete" />} onPress={() => setConfrimDialogVisibility(true)} title="Delete Product" />
                </List.Accordion>
            </Card>

        </>
    )
}

export default withTheme(ProductsLists);