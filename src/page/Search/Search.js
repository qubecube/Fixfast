
import React, {Component} from 'react';
import { 
    Text, 
    View, 
    StyleSheet, 
    ScrollView ,
    TouchableOpacity,
    Image,
    SafeAreaView,
    Platform,
    Dimensions,
    ImageBackground,
    TextInput,
    ActivityIndicator,
    AsyncStorage
} from 'react-native';
import MainStyles from '../../styles/MainStyles';
import InputStyles from '../../styles/InputStyles';
import ModalStyles from '../../styles/ModalStyles';

import { userAction } from "../../_actions";

import Spinner from 'react-native-loading-spinner-overlay';
import ModalLib from 'react-native-modal';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import GetLocation from 'react-native-get-location';
import { getDistance, geolib } from 'geolib';
const win = Dimensions.get('window');
export default class Search extends Component {

    state = {
        loading: true,
        isCheckAlert: null,
        GetEngineerType: []
    }

    componentDidMount(){
        this.onGetEngineerType()
    }

    onGetEngineerType(){
        userAction.GetEngineerType().then(e => {
            console.log("GetEngineerType", e)
            if(e.IsSuccess === true){
                var res = e.Data
                this.setState({
                    GetEngineerType: res,
                    loading: false
                })
            } else {
                this.onOpenAlert("Err","เกิดข้อผิดพลาด")
            }
        });
    }

    onOpenAlert(type, info){
        alert = (<ModalLib isVisible={true}>
            <View style={ModalStyles.ModalContent}>
                <Text allowFontScaling={false} style={ModalStyles.ModalTitle}>แจ้งเตือน</Text>
                <Text allowFontScaling={false} style={ModalStyles.ModalSubTitle}>{info}</Text>
                <View style={ModalStyles.contentButton}>
                    <TouchableOpacity
                        activeOpacity={1}
                        style={ModalStyles.btnOne}
                        onPress={() => this.onCloseAlert()}
                    > 
                        <Text allowFontScaling={false} style={ModalStyles.btnOneText}>ตกลง</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ModalLib>)
        this.setState({ 
            isCheckAlert: alert,
            loading: false,
        });
    }

    onCloseAlert(){
        this.setState({ 
            isCheckAlert: null,
            loading: false,
        });
    }

    onEngineerList(EngineerTypeId, EngineerTypeName){
        var setdataInScreen = {
            "EngineerTypeId": EngineerTypeId,
            "EngineerTypeName": EngineerTypeName,
        }
        this.props.navigation.navigate('EngineerListtype',{
            dataInScreen: setdataInScreen
        });
    }

    render() {
        const { isCheckAlert, GetEngineerType } = this.state
        var GetEngineerTypeCards = [];
        GetEngineerType.map((key,index) => {
            GetEngineerTypeCards.push(
                <TouchableOpacity 
                    activeOpacity={1}
                    style={styles.cardSearchContent}
                    onPress={() => this.onEngineerList(GetEngineerType[index].EngineerTypeId, GetEngineerType[index].EngineerTypeName)}
                > 
                    <View style={styles.cardSearchContentText}>
                        <Image
                            resizeMode={'cover'}
                            style={styles.cardSearchContentIcon}
                            source={require('../../../assets/tabbar/home2.png')}
                        />
                        <Text allowFontScaling={false} style={styles.cardSearchText}>
                            {GetEngineerType[index].EngineerTypeName}
                        </Text>
                    </View>
                </TouchableOpacity>
            );
        });
        return (
            <ImageBackground
                style={styles.banner}
                source={require('../../../assets/image/banner.jpg')}
            >
                {isCheckAlert}
                <Spinner
                    visible={this.state.loading}
                    overlayColor={"rgba(0,0,0, 0.65)"}
                    color={"#ff8c00"}
                />
                <View style={styles.bannerTitleContent}>
                    <Text allowFontScaling={false} style={styles.bannerTitle}>
                        หมวดหมู่
                    </Text>
                </View>
                <SafeAreaView style={styles.contentHome} forceInset={{ bottom: 'always', top : 'never'}}> 
                    <View style={[MainStyles.content]}>
                        <ScrollView style={styles.scrollView} contentContainerStyle={{ height: 1000, flex:1 , flexGrow: 1}} showsVerticalScrollIndicator={false}>
                            <View style={styles.contentCard}>
                                {GetEngineerTypeCards}
                            </View>
                        </ScrollView>
                    </View>
                </SafeAreaView>
            </ImageBackground>
        );
    }
}

const styles = StyleSheet.create({
    banner:{
        width: win.width,
        flex: 1,
    },
    scrollView:{
        paddingTop: 20,
    },
    contentHome:{
        backgroundColor: '#ffffff', 
        flex: 1,
        marginTop: 15,
        borderTopRightRadius: 15,
        borderTopLeftRadius: 15,
    },
    bannerTitleContent: {
        zIndex: 1,
        padding: 10,
        borderRadius: 10,
        marginTop: 50,
        marginLeft: 15, 
        marginRight: 15,
        flexDirection: 'row',
        justifyContent: 'center',
        opacity: 0.6
    },
    bannerTitle:{
        fontSize: 24,
        color: '#FFFFFF',
        fontFamily: 'Prompt-Bold',
        textAlign: 'center',
        marginLeft: 1, 
        marginRight: 1,
    },
    contentCard: {
        flexDirection: 'row',
        marginBottom: 15,
    },
    cardSearchContent:{
        shadowColor: "#333333",
        shadowOffset: { height:1 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        borderRadius:10,
        backgroundColor: '#ffffff',
        width: '31%',
        marginRight: '3%',
        backgroundColor: '#fff', 
        borderRadius: 10,
        borderColor: '#eceef0',
        borderWidth: 0.5,
        height: 100,  
    },
    cardSearchContentText: {
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center',
    },
    cardSearchContentIcon: {
        marginTop: 10,
        width: 20, 
        height: 20,   
    },
    cardSearchText: {
        fontSize: 12, 
        color: '#333333',
        textAlign: 'center',
        fontFamily: 'Prompt-Regular',
        lineHeight: 14,
        padding: 10
    },

});