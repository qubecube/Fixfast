import React, {Component} from 'react';
import { Image, Text, View, StyleSheet, TouchableOpacity, Platform, StatusBar, AsyncStorage } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator, useHeaderHeight } from '@react-navigation/stack';

import MainStyles from '../styles/MainStyles';
import Home from '../page/Home/Home';
import Search from '../page/Search/Search';
import Profile from '../page/Profile/Profile';
import Setting from '../page/Setting/Setting';

const Tab = createBottomTabNavigator();
const TabBar = () => {
    return (
        <Tab.Navigator
            initialRouteName="Home"
            tabBarComponent="TabBarTop"
            tabBarPosition="top"
            tabBarOptions={{
                style: {
                    borderTopWidth: 0, 
                    elevation: 2,
                    shadowColor: '#000000',
                    shadowOffset: { height: 5 },
                    shadowOpacity: 0.3,
                    shadowRadius: 5,
                    height: 70,
                    // height: 100,
                },
                // tabStyle:{ borderTopColor:'purple', borderTopWidth:4,},
            }}
            
        >
            <Tab.Screen 
                name="Home" 
                component={Home} 
                options={{
                    tabBarLabel: ({ focused }) => (
                        <Text allowFontScaling={false} style={[ MainStyles.Text11, focused ? MainStyles.textGray : MainStyles.textGrayLight, { marginTop: -30 }]}> หน้าหลัก </Text>
                    ),
                    tabBarIcon: ({ focused }) => (
                        <Image
                            resizeMode={'contain'}
                            source={ focused ? require('../../assets/tabbar/home2.png') : require('../../assets/tabbar/home.png')  }
                            style={ focused ? { height: 15, marginTop: -25 } : { height: 15, marginTop: -25 } }
                        />
                    )
                }}
                hideTabBar={true}
            />
            <Tab.Screen 
                name="Search" 
                component={Search} 
                options={{
                    tabBarLabel: ({ focused }) => (
                        <Text allowFontScaling={false} style={[ MainStyles.Text11, focused ? MainStyles.textGray : MainStyles.textGrayLight, { marginTop: -30 }]}> หมวดหมู่ </Text>
                    ),
                    tabBarIcon: ({ focused }) => (
                        <Image
                            resizeMode={'contain'}
                            source={ focused ? require('../../assets/tabbar/search2.png') : require('../../assets/tabbar/search.png')  }
                            style={ focused ? { height: 15, marginTop: -25 } : { height: 15, marginTop: -25 } }
                        />
                    )
                }}
                hideTabBar={true}
            />
            <Tab.Screen 
                name="Profile" 
                component={Profile} 
                options={{
                    tabBarLabel: ({ focused }) => (
                        <Text allowFontScaling={false} style={[ MainStyles.Text11, focused ? MainStyles.textGray : MainStyles.textGrayLight, { marginTop: -30 }]}> โปรไฟล์ </Text>
                    ),
                    tabBarIcon: ({ focused }) => (
                        <Image
                            resizeMode={'contain'}
                            source={ focused ? require('../../assets/tabbar/profile2.png') : require('../../assets/tabbar/profile.png')  }
                            style={ focused ? { height: 15, marginTop: -25 } : { height: 15, marginTop: -25 } }
                        />
                    )
                }}
                hideTabBar={true}
            />
            <Tab.Screen 
                name="Setting" 
                component={Setting} 
                options={{
                    tabBarLabel: ({ focused }) => (
                        <Text allowFontScaling={false} style={[ MainStyles.Text11, focused ? MainStyles.textGray : MainStyles.textGrayLight, { marginTop: -30 }]}> ตั้งค่า </Text>
                    ),
                    tabBarIcon: ({ focused }) => (
                        <Image
                            resizeMode={'contain'}
                            source={ focused ? require('../../assets/tabbar/settings2.png') : require('../../assets/tabbar/settings.png')  }
                            style={ focused ? { height: 15, marginTop: -25 } : { height: 15, marginTop: -25 } }
                        />
                    )
                }}
                hideTabBar={true}
            />
        </Tab.Navigator>
    );
}
export default TabBar;