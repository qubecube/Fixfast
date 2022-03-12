
import React, {Component} from 'react';
import { Image, Text, View, StyleSheet, TouchableOpacity, Platform, StatusBar, AsyncStorage  } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator, useHeaderHeight } from '@react-navigation/stack';

import TabNavigator from './TabNavigator';
import Home from '../page/Home/Home';
import Search from '../page/Search/Search';
import EngineerListtype from '../page/Search/EngineerListtype';

import Profile from '../page/Profile/Profile';
import Signin from '../page/Profile/Signin';
import EditProfile from '../page/Profile/EditProfile';
import ChangePassword from '../page/Profile/ChangePassword';
import RegisterEngineer from '../page/Profile/RegisterEngineer';
import EditEngineer from '../page/Profile/EditEngineer';
import ProfileEngineer from '../page/Profile/ProfileEngineer';
import OrderHistoryCustomer from '../page/Profile/OrderHistoryCustomer';
import OrderHistoryEngineer from '../page/Profile/OrderHistoryEngineer';

import Setting from '../page/Setting/Setting';

const Stack = createStackNavigator();
function StackNaviga() {
    const MainPageOptionNoBack = {
        gestureEnabled: false,
        headerShown: false, 
        cardStyle: { backgroundColor: '#fff' }, 
        tabBarVisible: false 
    }
    const OptionOnlyArrowBack = {
        title: '',
        headerBackTitleVisible: false,
        headerTransparent: true,
        headerStyle: { backgroundColor: '#000000', shadowOpacity: 0, elevation: 0, },
        cardStyle: { backgroundColor: '#000000' },
        headerBackImage: () => (
            <Image
                resizeMode={'contain'}
                source={require("../../assets/icon/backapp.png")}
                style={[TabBarBottomStyles.setheaderBackImage]}
            />
        ),
    }
    return (
            <NavigationContainer>
                <Stack.Navigator>
                    <Stack.Screen name="Home" component={TabNavigator} options={MainPageOptionNoBack} />
                    <Stack.Screen name="Search" component={Search} options={MainPageOptionNoBack} />
                    <Stack.Screen name="Profile" component={Profile} options={MainPageOptionNoBack} />
                    <Stack.Screen name="Setting" component={Setting} options={MainPageOptionNoBack} />
                    
                    <Stack.Screen name="Signin" component={Signin} options={OptionOnlyArrowBack} />
                    <Stack.Screen name="EditProfile" component={EditProfile} options={OptionOnlyArrowBack} />
                    <Stack.Screen name="ChangePassword" component={ChangePassword} options={OptionOnlyArrowBack} />
                    <Stack.Screen name="RegisterEngineer" component={RegisterEngineer} options={OptionOnlyArrowBack} />
                    <Stack.Screen name="EditEngineer" component={EditEngineer} options={OptionOnlyArrowBack} />
                    <Stack.Screen name="ProfileEngineer" component={ProfileEngineer} options={OptionOnlyArrowBack} />
                    <Stack.Screen name="OrderHistoryCustomer" component={OrderHistoryCustomer} options={OptionOnlyArrowBack} />
                    <Stack.Screen name="OrderHistoryEngineer" component={OrderHistoryEngineer} options={OptionOnlyArrowBack} />
                    <Stack.Screen name="EngineerListtype" component={EngineerListtype} options={OptionOnlyArrowBack} />
                </Stack.Navigator>
            </NavigationContainer>
    );
}


export default class MainRoutes extends Component {
    render() {
        return (
            <>
                <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />
                <StackNaviga/>
            </>
        );
    }
}


const TabBarBottomStyles = StyleSheet.create({
    setheaderBackImage:{
        height: 20, 
        marginLeft: Platform.OS == "ios" ? 5 : -5 
    }
});