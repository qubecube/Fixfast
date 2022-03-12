
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

export default class Home extends Component {

    state = {
        loading: true,
        isCheckAlert: null,
        isLogin: false,
        CustomerLat: "",
        CustomerLong: "",
        GetEngineerNear: [],
        cehckGetEngineerNearData: false
    }


    componentDidMount(){
        this.onCheckLogin()
        this.focusListener = this.props.navigation.addListener('focus', () => {
            this.onCheckLogin()
        })
    }

    async onCheckLogin(){
        const isLogin = await AsyncStorage.getItem('isLogin');
        if(isLogin === "true"){
            this.onGetProfile()
        } else {
            this.setState({
                isLogin: false,
                loading: false,
            })
        }
    }

    async onGetProfile(){
        const isProfile = await AsyncStorage.getItem('isProfile');
        var isProfileDecrypt = JSON.parse(isProfile);
        this.setState({
            isProfile: isProfileDecrypt,
            UserId: isProfileDecrypt.UserId,
            isLogin: true,
        })
        this.onGetLatLong()
    }

    onGetLatLong(){
        GetLocation.getCurrentPosition({
            enableHighAccuracy: true,
            timeout: 15000,
        }).then(location => {
            console.log("location.latitude",location.latitude)
            console.log("location.longitude",location.longitude)
            this.setState({
                CustomerLat: location.latitude,
                CustomerLong: location.longitude,
            })
            this.onGetEngineerNear(location.latitude, location.longitude)
        }).catch(error => {
            this.setState({
                CustomerLat: "",
                CustomerLong: "",
            })
            this.onGetEngineerNear("", "")
        })
    }

    onGetEngineerNear(latStart, longStart){
        var formData = new FormData();
        userAction.GetEngineerAll().then(e => {
            if(e.IsSuccess === true){
                var res = e.Data
                this.onGetEngineerNearCal(res, latStart, longStart)
            } else {
                this.onOpenAlert("Err","เกิดข้อผิดพลาด")
            }
        });
    }

    async onGetEngineerNearCal(res, latStart, longStart){
        var resArr = []
        for(var i in res){
            var getDistance = await userAction.onGetEngineerNearCal(latStart, longStart, res[i].WorkLat, res[i].WorkLong);
            if(getDistance < 20){
                res[i]['WorkDistance'] = getDistance
                resArr.push(
                    res[i]
                )
            }
        }
        this.setState({
            GetEngineerNear: resArr,
            cehckGetEngineerNearData: resArr.length === 0 ? false : true,
            loading: false
        })
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

    onGetEngineerById(EngineerId){
        var setdataInScreen = {
            "EngineerId": EngineerId,
        }
        this.props.navigation.navigate('ProfileEngineer',{
            dataInScreen: setdataInScreen
        });
    }

    render() {
        const { isCheckAlert, GetEngineerNear, cehckGetEngineerNearData } = this.state
        console.log("GetEngineerNear",GetEngineerNear)
        var GetEngineerNearCards = [];
        GetEngineerNear.map((key,index) => {
            GetEngineerNearCards.push(
                <View style={[MainStyles.cardHome]}>
                    <TouchableOpacity 
                        activeOpacity={1}
                        style={Platform.OS === 'android' ? MainStyles.cardHomeContentAndriod : MainStyles.cardHomeContent}
                        onPress={() => this.onGetEngineerById(GetEngineerNear[index].EngineerId)}
                    > 
                        <Image
                            resizeMode={'cover'}
                            style={MainStyles.cardHomeImg}
                            source={require('../../../assets/image/banner.jpg')}
                        />
                        <View style={[MainStyles.cardHomeImgBade, { flexDirection: 'row' }]}>
                            <Image
                                resizeMode={'contain'}
                                style={{ width: 12, height: 12, marginTop: 1, marginRight: 5 }}
                                source={require('../../../assets/icon/star2.png')}
                            />
                            <Text allowFontScaling={false} style={MainStyles.cardHomeImgBadeText}>
                                {GetEngineerNear[index].WorkRating}
                            </Text>
                        </View>
                        <View style={MainStyles.newsCardTitleContent}>
                            <View style={{ flexDirection: 'row' }}>
                                <Image
                                    resizeMode={'cover'}
                                    style={MainStyles.newsCardTitleimage}
                                    source={require('../../../assets/image/banner.jpg')}
                                />
                                <Text allowFontScaling={false} numberOfLines={1} style={[MainStyles.Text14, MainStyles.textGray]}>
                                    {GetEngineerNear[index].WorkName}
                                </Text>
                            </View>
                            <Text allowFontScaling={false} numberOfLines={2} style={[MainStyles.Text12, MainStyles.textGray]}>
                                {GetEngineerNear[index].WorkDes}
                            </Text>
                            <View style={{ flexDirection: 'row', marginTop: 10 }}>
                                <Text allowFontScaling={false} style={MainStyles.newsCardTitletextLeft}>
                                    {GetEngineerNear[index].WorkDistance} กม.
                                </Text>
                                <Text allowFontScaling={false} style={MainStyles.newsCardTitletextRight}>
                                    ฿{GetEngineerNear[index].WorkPrice}
                                </Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>
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
                        FixFast
                    </Text>
                </View>
                <View style={styles.search}>
                    <TouchableOpacity 
                        activeOpacity={1}
                        style={styles.searchContentText}
                        onPress={() => this.props.navigation.navigate('Search')}
                    > 
                        <Text allowFontScaling={false} style={[MainStyles.Text16, MainStyles.textOrange]}>
                            ค้นหา
                        </Text>
                    </TouchableOpacity>
                    <View style={styles.searchContentIcon}>
                    <Image
                        resizeMode={'contain'}
                        style={styles.searchIcon}
                        source={require('../../../assets/icon/searchicon.png')}
                    />
                    </View>
                </View>
                <SafeAreaView style={styles.contentHome} forceInset={{ bottom: 'always', top : 'never'}}> 
                    <View style={[MainStyles.content]}>
                        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                            <Text allowFontScaling={false} style={[MainStyles.Text18, MainStyles.textOrangeBd]}>
                                ช่างใกล้ตัว
                            </Text>
                            {/* <View style={[MainStyles.cardContentHome]}> */}
                            <View style={{ display: 'flex' }}>
                            <View style={{ flexDirection: 'column', flex: 1 }}>
                                {cehckGetEngineerNearData ? GetEngineerNearCards 
                                :
                                <View style={MainStyles.notFoundContent}>
                                    <Text allowFontScaling={false} style={MainStyles.notFoundText}>ไม่พบข้อมูล</Text>
                                </View>
                                }
                            </View>
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
        paddingTop: 50,
        marginBottom: 10,
    },
    contentHome:{
        backgroundColor: '#ffffff', 
        flex: 1,
        marginTop: -25,
        borderTopRightRadius: 15,
        borderTopLeftRadius: 15,
    },
    search: {
        zIndex: 1,
        backgroundColor: '#ffffff',
        padding: 10,
        borderRadius: 10,
        marginLeft: 15, 
        marginRight: 15,
        shadowColor: "#000",
        shadowOffset: { height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        borderWidth: 1,
        borderColor: '#f3f3f3',
        flexDirection: 'row',
    },
    searchContentText:{
        width: '80%',
        paddingLeft: 10,
    },
    searchContentIcon: {
        paddingRight: 10,
        width: '20%',
        alignContent: 'flex-end',
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
        alignSelf: 'flex-end'
    },
    searchIcon: {
        width: 20,
        height: 20
    }, 
    bannerTitleContent: {
        marginTop: 100,
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
    },
});