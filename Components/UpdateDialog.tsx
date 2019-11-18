import React from 'react';
import { withTheme ,Portal,Dialog,Button} from 'react-native-paper';
const UpdateDialog = (props)=>{

    const saveValue =async  () => {
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
                    theme={{ roundness: 10 }}
                    visible={props.visibility}
                    onDismiss={hideDialog}>
                    <Dialog.Title>{props.title}</Dialog.Title>
                    <Dialog.Content>
                       {props.children}
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={()=>hideDialog()}>Cancel</Button>
                        <Button onPress={()=>saveValue()}>Save</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
    )
}

export default withTheme(UpdateDialog);