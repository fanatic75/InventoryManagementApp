import React, { useState, useEffect,useCallback } from 'react';
import {BackHandler , SafeAreaView,ScrollView,RefreshControl} from 'react-native';
import axios from 'axios';
import Constants from 'expo-constants';
import * as Config from '../config.json';
import {deviceStorage} from '../Services/devicestorage';
import errorHandler from '../Services/errorHandler';
import {Searchbar,Snackbar, withTheme, IconButton } from 'react-native-paper';
import { DrawerActions } from 'react-navigation-drawer';
import BranchLists from '../Components/BranchLists';
import wait from '../Services/wait';

import Loading from '../Components/Loading';
const pressToExit=1;

const AdminPage = (props) => {

    const fetchBranches = useCallback(async () => {
        setLoading(true);
        try {
            const token = await deviceStorage.getItem('token');
            if (token) {

                const res = await axios.get(Config.APIURL + '/branches/', {
                    headers: {
                        'Authorization': 'Bearer ' + token
                    }
                });
                if (res) {

                    setBranches(res.data);
                }
                setLoading(false);
                return;
            }
            throw 'No Token Found';
        } catch (error) {
            setLoading(false);
            errorHandler(error);
        }
    },[]);

   
   
    const { colors } = props.theme;
    const [snackBarVisibility, setSnackBarVisibility] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [refreshing, setRefreshing] = useState(false);
    const [branches, setBranches] = useState(null);
    const [loading,setLoading]=useState(false);
    const [exitCount,setExitCount]=useState(0);
    useEffect(() => {

        BackHandler.addEventListener("hardwareBackPress", () => {
            if (props.isFocused) {
                setSnackBarVisibility(true);
                if (exitCount === pressToExit) {

                    BackHandler.exitApp();

                }
                setExitCount(exitCount+1);

                return true;
            }
        });


        return () => {
            BackHandler.removeEventListener('hardwareBackPress', () => {
                setExitCount(0);
            });
        }
    }, [exitCount]);

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        fetchBranches();
        wait(2000).then(() => setRefreshing(false));

    }, [refreshing, fetchBranches]);

    const branchExists= (branch) => {
        return branch.branchName.toLowerCase().includes(searchQuery.trim().toLowerCase());
    }
    useEffect(() => {
        fetchBranches();
    }, [fetchBranches]);
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.background, marginTop: Constants.statusBarHeight }}>
             <Snackbar style={{ position: 'absolute', bottom: 0 }} duration={3000} onDismiss={() => { setSnackBarVisibility(false); setExitCount(0); }} visible={snackBarVisibility}>
                    "Press Back again to Exit the App."
            </Snackbar>
            <Searchbar
                    placeholder="Search your Branches"
                    onChangeText={query => setSearchQuery(query)}
                    value={searchQuery}
                    style={{ margin: 10 }}
                    theme={{ roundness: 10 }}
                />{
                    loading?<Loading />:<ScrollView
                    style={{ flex: 1 }}
                    refreshControl={
                        <RefreshControl size={30} refreshing={refreshing} onRefresh={onRefresh} />
                    }

                    
                >

                    
                         
                    
                    {
                        branches&&branches.map((branch,index)=>{
                           if(branchExists(branch))
                           return <BranchLists branches={branches} setBranches={setBranches} index={index} setLoading={setLoading} onRefresh={onRefresh}key={branch._id} branchAddress={branch.address&&branch.address}  branchName={branch.branchName} branchId={branch._id}/>
                            return null;
                        })
                    }
                </ScrollView>
                }
            
            </SafeAreaView>
            
            
            
        
    )
}



AdminPage.navigationOptions = ({ navigation }) => {
    return {
        title: "Admin",
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
export default withTheme(AdminPage);