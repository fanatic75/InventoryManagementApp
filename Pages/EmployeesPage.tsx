import React, { useState, useEffect, useCallback } from 'react';
import {  SafeAreaView, ScrollView, RefreshControl, StyleSheet } from 'react-native';
import axios from 'axios';
import Constants from 'expo-constants';
import * as Config from '../config.json';
import { deviceStorage } from '../Services/devicestorage';
import errorHandler from '../Services/errorHandler';
import { Searchbar,  withTheme, FAB ,TextInput, } from 'react-native-paper';
import EmployeeLists from '../Components/EmployeeLists';
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
const EmployeesPage = (props) => {

    



    const { colors } = props.theme;
    const [searchQuery, setSearchQuery] = useState('');
    const [refreshing, setRefreshing] = useState(false);
    const [employees, setEmployees] = useState(null);
    const [loading, setLoading] = useState(false);
    const [updateDialogVisibility, setUpdateDialogVisibility] = useState(false);
    const [username,setUsername]=useState(null);
    const [password,setPassword]=useState(null);
    const [firstName,setFirstName]=useState(null);
    const [lastName,setLastName]=useState(null);
    const [branch,setBranch]=useState(null);

    const fetchEmployees = useCallback(async () => {
        setLoading(true);
        try {
            const token = await deviceStorage.getItem('token');
            if (token) {

                const res = await axios.get(Config.APIURL + '/branches/'+props.branchId+'/employees', {
                    headers: {
                        'Authorization': 'Bearer ' + token
                    }
                });
                if (res) {
                    console.log(res.data);
                    console.log(res.data.users);
                    setEmployees(res.data.users);
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
        fetchEmployees();
        wait(2000).then(() => setRefreshing(false));

    }, [refreshing, fetchEmployees]);

    const employeesExists = (user) => {
        return user.username.toLowerCase().includes(searchQuery.trim().toLowerCase());
    }
    useEffect(() => {
        fetchEmployees();
    }, [fetchEmployees]);

    const registerEmployee =async () => {
        
            try {
                const token = await deviceStorage.getItem('token');
                if (token) {
                        if(!username||!password){
                            
                        throw 'Username and  Password  are required';
                        }
                        const res = await axios.post(Config.APIURL + '/users/register', {
                            username,
                            password,
                            firstName,
                            lastName,
                            branch:props.branchId
                        }, {
                            headers: {
                                'Authorization': 'Bearer ' + token,
                            }
    
                        });
                        if (res)
                            alert('Employee created');
                       }
                        
    
                       
                       setUsername(null);
                       setPassword(null);
                       setBranch(null);
                       setFirstName(null);
                       setLastName(null);
                       
                
            }
            catch (e) {
                errorHandler(e);
            }
        
    }
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.background, marginTop: Constants.statusBarHeight }}>
            
            <Searchbar
                placeholder="Search Employees"
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
                        employees && employees.map((employee, index) => {
                            if (employeesExists(employee))
                                return <EmployeeLists navigation={props.navigation} employees={employees}  index={index} setLoading={setLoading} onRefresh={onRefresh} key={employee._id} firstname={employee.firstname} lastName={employee.lastName} username={employee.username} password={employee.password} userId={employee._id} />
                            return null;
                        })
                    }

                </ScrollView>

            }
            <UpdateDialog title='Register An Employee' onRefresh={onRefresh} visibility={updateDialogVisibility} applyAction={registerEmployee} setDialogVisibility={setUpdateDialogVisibility}>
                <TextInput
                    label="Enter Employee Username"
                    style={{ margin: 10 }}
                    value={username}
                    onChangeText={value => setUsername(value)}

                />
                <TextInput
                    style={{ margin: 10 }}
                    label="Enter Employee Password"
                    value={password}
                    onChangeText={value => setPassword(value)}

                />
                <TextInput
                    style={{ margin: 10 }}
                    label="Enter Employee First Name"
                    value={firstName}
                    onChangeText={value => setFirstName(value)}

                />
                <TextInput
                    style={{ margin: 10 }}
                    label="Enter Employee Last Name"
                    value={lastName}
                    onChangeText={value => setLastName(value)}

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
export default withTheme(withNavigationFocus(EmployeesPage));