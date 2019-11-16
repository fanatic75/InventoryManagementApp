import React, { useState, Dispatch } from 'react';
import { View } from 'react-native';
import { withTheme, Avatar, Button, Card, Title, Paragraph, IconButton } from 'react-native-paper';
import { StyleSheet } from 'react-native';
const Product = ({ name, stock, theme, quantity, isAddPressed, index, setProductState, productState }: { productState: Array<{ quantity: number, isAddPressed: boolean }>, index: number, name: string, stock: string, theme: any, quantity: number, setProductState: Dispatch<any>, isAddPressed: boolean }) => {
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
            const tempArray=[...productState];
            tempArray[index]['quantity']=quantity+1;
            tempArray[index]['isAddPressed']=true;


            setProductState(tempArray);
        }
        else
            alert('Cannot sell more than stock quantity');


    }

    const deleteQuantity = () => {
        const tempArray=[...productState];
        if (quantity < 2) {
            tempArray[index]['isAddPressed']=false;
            tempArray[index]['quantity']=0;

            
        }
        else
        tempArray[index]['quantity']=quantity-1;
        setProductState(tempArray);
    }

    return (
        <Card elevation={4} style={style.cardContainer} theme={theme}>
            <Card.Title style={{ flex: 1 }} title={name} />
            <Card.Content style={{ flex: 1 }}>
                <Title>Quantity Available </Title>
                <Title>{stock}</Title>
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