import React, { useState } from 'react';
import ConfirmDialog from '../Components/ConfirmDialog';
import UpdateDialog from '../Components/UpdateDialog';
import { deviceStorage } from '../Services/devicestorage';
import * as Config from '../config.json';
import axios from 'axios';
import { Card, List, Divider, withTheme, TextInput } from 'react-native-paper';
import errorHandler from '../Services/errorHandler';
const EmployeeLists = (props) => {
    const [expanded, setExpanded] = useState(false);
    const [confirmDialogVisibility, setConfrimDialogVisibility] = useState(false);
    const [updateDialogVisibility, setUpdateDialogVisibility] = useState(false);
    const [username,setEmployeeUsername]=useState(props.employees[props.index]['username']);
    const [password,setEmployeePassword]=useState(props.employees[props.index]['password']);
    const [firstName,setEmployeeFirstName]=useState(props.employees[props.index]['firstName']);
    const [lastName,setEmployeeLastName]=useState(props.employees[props.index]['lastName'])

    const deleteConfirmation = 'Are you sure you want to delete this User?';
    const deleteEmployee = async () => {
        try {
            const token = await deviceStorage.getItem('token');
            if (token) {
                const res = await axios.delete(Config.APIURL + '/users/' + props.userId, {
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
    const updateEmployee = async () => {
        try {
            const token = await deviceStorage.getItem('token');
            if (token) {
                    if(!username){
                        
                    throw 'Username is required';
                    }
                    if(password){
                        const res = await axios.put(Config.APIURL + '/users/' + props.userId, {
                            username,
                            password,
                            firstName,
                            lastName
                        }, {
                            headers: {
                                'Authorization': 'Bearer ' + token,
                            }
    
                        });
                        if (res)
                            alert('Employee updated');
    
                    }else{
                        const res = await axios.put(Config.APIURL + '/users/' + props.userId, {
                            username,
                            firstName,
                            lastName
                        }, {
                            headers: {
                                'Authorization': 'Bearer ' + token,
                            }
    
                        });
                        if (res)
                            alert('Employee updated');
                    }


            }
        }
        catch (e) {
            errorHandler(e);
        }
    }

   

    return (
        <>
            <ConfirmDialog onRefresh={props.onRefresh} visibility={confirmDialogVisibility} applyAction={deleteEmployee} setDialogVisibility={setConfrimDialogVisibility} content={deleteConfirmation} />
            <UpdateDialog title='Update Emploee User Name/Password' onRefresh={props.onRefresh} visibility={updateDialogVisibility} applyAction={updateEmployee} setDialogVisibility={setUpdateDialogVisibility}>


            <TextInput
                    label="Enter Employee Username"
                    style={{ margin: 10 }}
                    value={username}
                    onChangeText={value => setEmployeeUsername(value)}

                />
                <TextInput
                    style={{ margin: 10 }}
                    label="Enter Employee Password"
                    value={password}
                    onChangeText={value => setEmployeePassword(value)}

                />
                <TextInput
                    style={{ margin: 10 }}
                    label="Enter Employee FirstName"
                    value={firstName}
                    onChangeText={value => setEmployeeFirstName(value)}

                />
                <TextInput
                    style={{ margin: 10 }}
                    label="Enter Employee Last Name"
                    value={lastName}
                    onChangeText={value => setEmployeeLastName(value)}

                />




            </UpdateDialog>
            <Card theme={{ roundness: 10 }} style={{ margin: 10 }}>
                <List.Accordion
                    title={props.username}
                    style={{ padding: 10 }}
                    description={'FirstName : '+props.firstname&&props.firstname+' Last Name: '+props.lastname&&props.lastname }
                    left={props => <List.Icon {...props} icon='account' />}
                    expanded={expanded}
                    onPress={() => setExpanded(!expanded)}

                >

                    <Divider style={{ height: 1 }} />
                   <List.Item left={props => <List.Icon {...props} icon="square-edit-outline" />} onPress={() => setUpdateDialogVisibility(true)} title="Update User" />
                    <List.Item left={props => <List.Icon {...props} icon="delete" />} onPress={() => setConfrimDialogVisibility(true)} title="Delete User" />
                </List.Accordion>
            </Card>

        </>
    )
}

export default withTheme(EmployeeLists);