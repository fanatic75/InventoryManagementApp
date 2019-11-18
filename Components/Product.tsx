import React, {  Dispatch } from 'react';
import { View } from 'react-native';
import { withTheme,  Button, Card, Title,  IconButton } from 'react-native-paper';
import { StyleSheet } from 'react-native';
const Product = ({ name, stock, theme, quantity, isAddPressed, index, setProducts, products ,price}: { price:number,products:Array<any>, index: number, name: string, stock: string, theme: any, quantity: number, setProducts: Dispatch<any>, isAddPressed: boolean }) => {
    const { colors } = theme;
    const style = StyleSheet.create({
        cardContainer: {
            margin: 20,
            flex: 1,
            justifyContent: 'center',
            backgroundColor: colors.surface,
        },
        remove_add: {
            flexDirection: 'row',
            alignItems: 'center',
            borderColor: colors.primary,
            borderStyle: 'solid',
            borderWidth: 1,
            borderRadius: 4,
            padding: 3


        }

    });

    const addQuantity = () => {
        if (quantity.toString() < stock) {
            const tempArray=[...products];
            tempArray[index]['cartQuantity']=quantity+1;
            tempArray[index]['isAddPressed']=true;


            setProducts(tempArray);
        }
        else
            alert('Cannot sell more than stock quantity');


    }

    const deleteQuantity = () => {
        const tempArray=[...products];
        if (quantity < 2) {
            tempArray[index]['isAddPressed']=false;
            tempArray[index]['cartQuantity']=0;

            
        }
        else
        tempArray[index]['cartQuantity']=quantity-1;
        setProducts(tempArray);
    }

    return (
        <Card elevation={4} style={style.cardContainer} theme={theme}>
            <Card.Title style={{ flex: 1 }} title={name} />
            <Card.Content style={{ flex: 1 }}>
                <Title>Quantity Available </Title>
                <Title>{stock}</Title>
                <Title>Price per piece </Title>
                <Title>{price}</Title>
            </Card.Content>
            <Card.Actions style={{ flex: 1, margin: 10 }}>
                {!isAddPressed ? <Button style={{ width: 100, height: 50, alignItems: 'center', justifyContent: 'center' }} color={colors.primary} onPress={() => { addQuantity(); }} icon='plus' mode='outlined'>ADD</Button>
                    : <View style={style.remove_add} >
                        <IconButton color={colors.primary} icon='minus' size={20} onPress={() => deleteQuantity()} />
                        <Title style={{}}>{quantity}</Title>
                        <IconButton color={colors.primary} icon='plus' size={20} onPress={() => addQuantity()} />
                    </View>
                }
            </Card.Actions>
        </Card>
    )



}

//@ts-ignore
export default withTheme(Product);