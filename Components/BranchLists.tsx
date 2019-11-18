import React, { useState } from 'react';
import ConfirmDialog from '../Components/ConfirmDialog';
import UpdateDialog from '../Components/UpdateDialog';
import { deviceStorage } from '../Services/devicestorage';
import * as Config from '../config.json';
import axios from 'axios';
import { Card, List, Divider, withTheme, TextInput } from 'react-native-paper';
import errorHandler from '../Services/errorHandler';
const BranchLists = (props) => {
    const [expanded, setExpanded] = useState(false);
    const [confirmDialogVisibility, setConfrimDialogVisibility] = useState(false);
    const [updateDialogVisibility, setUpdateDialogVisibility] = useState(false);
    const [branchName,setBranchName]=useState(props.branches[props.index]['branchName']);
    const [branchAddress,setBranchAddress]=useState(props.branches[props.index]['address']?props.branches[props.index]['address']:'');
    const deleteConfirmation = 'Are you sure you want to delete this Branch?';
    const deleteABranch = async () => {
        try {
            const token = await deviceStorage.getItem('token');
            if (token) {
                const res = await axios.delete(Config.APIURL + '/branches/' + props.branchId, {
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
    const updateBranch = async () => {
        try {
            const token = await deviceStorage.getItem('token');
            if (token) {
                    if(!branchName){
                        
                    throw 'Branch Name is required';
                    }
                    const res = await axios.put(Config.APIURL + '/branches/' + props.branchId, {
                        branchName: branchName,
                        address: branchAddress,
                    }, {
                        headers: {
                            'Authorization': 'Bearer ' + token,
                        }

                    });
                    if (res)
                        alert('branch updated');



            }
        }
        catch (e) {
            errorHandler(e);
        }
    }

   

    return (
        <>
            <ConfirmDialog onRefresh={props.onRefresh} visibility={confirmDialogVisibility} applyAction={deleteABranch} setDialogVisibility={setConfrimDialogVisibility} content={deleteConfirmation} />
            <UpdateDialog onRefresh={props.onRefresh} visibility={updateDialogVisibility} applyAction={updateBranch} setDialogVisibility={setUpdateDialogVisibility}>


                <TextInput
                    label="Enter Branch Name"
                    style={{ margin: 10 }}
                    value={branchName}
                    onChangeText={value => setBranchName(value)}

                />
                <TextInput
                    style={{ margin: 10 }}
                    label="Enter Branch Address"
                    value={branchAddress}
                    onChangeText={value => setBranchAddress(value)}

                />




            </UpdateDialog>
            <Card theme={{ roundness: 10 }} style={{ margin: 10 }}>
                <List.Accordion
                    title={props.branchName}
                    style={{ padding: 10 }}
                    description={props.branchAddress ? props.branchAddress : "Touch to Open"}
                    left={props => <List.Icon {...props} icon='store' />}
                    expanded={expanded}
                    onPress={() => setExpanded(!expanded)}

                >

                    <Divider style={{ height: 1 }} />
                    <List.Item left={props => <List.Icon {...props} icon='open-in-app' />} title="Open Branch" />
                    <List.Item left={props => <List.Icon {...props} icon="square-edit-outline" />} onPress={() => setUpdateDialogVisibility(true)} title="Edit Branch Name/Address" />
                    <List.Item left={props => <List.Icon {...props} icon="delete" />} onPress={() => setConfrimDialogVisibility(true)} title="Delete Branch" />
                </List.Accordion>
            </Card>

        </>
    )
}

export default withTheme(BranchLists);