import React from 'react';
import {withTheme, Paragraph,Dialog, Portal, Button} from 'react-native-paper';
const ConfirmDialog = (props) => {
    const {colors}=props.theme;


    const saveValue = async() => {
        await props.applyAction();
        hideDialog();
        props.onRefresh();
    }

    const hideDialog = () => {
        props.setDialogVisibility(false);
    }

    return (
        <Portal>
                <Dialog
                    theme={{roundness:10}}
                    visible={props.visibility}
                    onDismiss={hideDialog}>
                    <Dialog.Title>Please Confirm your Action</Dialog.Title>
                    <Dialog.Content>
                        <Paragraph style={{color:colors.text}}>
                            {props.content}
                        </Paragraph>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={()=>hideDialog()}>Cancel</Button>
                        <Button onPress={()=>saveValue()}>Confirm</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
    )
}



export default  withTheme(ConfirmDialog)