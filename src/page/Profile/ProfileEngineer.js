
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
import { orderAction } from "../../_actions";

import Spinner from 'react-native-loading-spinner-overlay';
import ModalLib from 'react-native-modal';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import GetLocation from 'react-native-get-location';
const win = Dimensions.get('window');

export default class ProfileEngineer extends Component {

    state = {
        loading: true,
        isCheckAlert: null,
        GetEngineer: {},
        GetProfile: {},
    }

    componentDidMount(){
        var dataInScreen = this.props.route.params.dataInScreen;
        console.log("dataInScreen",dataInScreen)
        this.setState({ 
            dataInScreen: dataInScreen,
        })
        this.onGetLatLong(dataInScreen)
    }

    onGetLatLong(dataInScreen){
        GetLocation.getCurrentPosition({
            enableHighAccuracy: true,
            timeout: 15000,
        }).then(location => {
            this.setState({
                CustomerLat: location.latitude,
                CustomerLong: location.longitude,
            })
            this.onGetEngineer(dataInScreen, location.latitude, location.longitude)
        }).catch(error => {
            this.setState({
                CustomerLat: "",
                CustomerLong: "",
            })
            this.onGetEngineer(dataInScreen, "", "")
        })
    }

    onGetEngineer(dataInScreen, latStart, longStart){
        console.log("dataInScreen", dataInScreen)
        console.log("latStart", latStart)
        console.log("longStart", longStart)
        var formData = new FormData();
        formData.append('EngineerId' , dataInScreen.EngineerId)
        userAction.GetEngineerById(formData).then(e => {
            console.log("GetEngineerById", e)
            if(e.IsSuccess === true){
                var res = e.Data
                this.onGetEngineerNearCal(res, latStart, longStart)
            } else {
                this.onOpenAlert("Err","เกิดข้อผิดพลาด")
            }
        });
    }

    async onGetEngineerNearCal(res, latStart, longStart){
        var getDistance = await userAction.onGetEngineerNearCal(latStart, longStart, res.WorkLat, res.WorkLong);
        res['Distance'] = getDistance
        this.setState({
            GetEngineer: res,
        })
        this.onGetProfile(res.UserId)
    }

    async onGetProfile(UserId){
        var formData = new FormData();
        formData.append('UserId' , UserId)
        userAction.GetProfile(formData).then(e => {
            console.log("GetProfile", e)
            if(e.IsSuccess === true){
                this.setState({
                    GetProfile: e.Data,
                    loading: false,
                })
            } else {
                this.onOpenAlert("Err","เกิดข้อผิดพลาด")
            }
        });
    }

    async onGetOrder(){
        this.setState({ loading: true })
        const { GetEngineer, GetProfile } = this.state
        const isProfile = await AsyncStorage.getItem('isProfile');
        var isProfileDecrypt = JSON.parse(isProfile);
        var formData = new FormData();
        formData.append('UserId' , isProfileDecrypt.UserId)
        formData.append('UserFullname' , isProfileDecrypt.Fullname)
        formData.append('UserEmail' , isProfileDecrypt.Email)
        formData.append('UserPhoneNo' , isProfileDecrypt.PhoneNo)
        formData.append('UserAddress' , isProfileDecrypt.Address)
        formData.append('EngineerId' , GetEngineer.EngineerId)
        formData.append('EngineerFullname' , GetProfile.Fullname)
        formData.append('EngineerEmail' , GetProfile.Email)
        formData.append('EngineerPhoneNo' , GetProfile.PhoneNo)
        formData.append('EngineerAddress' , GetProfile.Address)
        formData.append('EngineerWorkName' , GetEngineer.WorkName)
        formData.append('OrderStatus' , "Progress")
        orderAction.CreateOrder(formData).then(e => {
            console.log("CreateOrder", e)
            if(e.IsSuccess === true){
                this.onSuccessCreateOrder()
            } else {
                this.onOpenAlert("Err","เกิดข้อผิดพลาด")
            }
        });
    }

    onSuccessCreateOrder(){
        alert = (<ModalLib isVisible={true}>
            <View style={ModalStyles.ModalContent}>
                <Text allowFontScaling={false} style={ModalStyles.ModalTitle}>แจ้งเตือน</Text>
                <Text allowFontScaling={false} style={ModalStyles.ModalSubTitle}>จ้างงานสำเร็จ</Text>
                <View style={ModalStyles.contentButton}>
                    <TouchableOpacity
                        activeOpacity={1}
                        style={ModalStyles.btnOne}
                        onPress={() => this.onNextToOrderHistory()}
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

    onNextToOrderHistory(){
        this.setState({ 
            isCheckAlert: null,
            loading: false,
        });
        this.props.navigation.navigate('OrderHistoryCustomer');
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

    render() {
        const { isCheckAlert, GetEngineer, GetProfile } = this.state
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
                    <View style={{ flexDirection: 'row' }}>
                        <Image
                            resizeMode={'contain'}
                            style={{
                                width: 50,
                                height: 50
                            }}
                            source={require('../../../assets/icon/user.png')}
                        />
                        <Text allowFontScaling={false} style={styles.cardSearchTextTop}>
                            {GetProfile.Fullname}    
                        </Text>
                    </View>
                </View>
                <SafeAreaView style={styles.contentHome} forceInset={{ bottom: 'always', top : 'never'}}> 
                    <View style={[MainStyles.content]}>
                        <ScrollView style={styles.scrollView} contentContainerStyle={{ height: 1000, flex:1 , flexGrow: 1}} showsVerticalScrollIndicator={false}>
                            <Text allowFontScaling={false} style={[MainStyles.Text18, MainStyles.textOrangeBd]}>
                                {GetEngineer.WorkName}
                            </Text>
                            <View style={{ flexDirection: 'row', marginTop: 5 }}>
                                <View style={{
                                    backgroundColor: '#ff8c00',
                                    borderRadius: 5,
                                    paddingRight: 10,
                                    paddingLeft: 10,
                                    flexDirection: 'row', 
                                    marginRight: 10
                                }}>
                                    <Image
                                        resizeMode={'contain'}
                                        style={{ width: 12, height: 12, marginTop: 3, marginRight: 5 }}
                                        source={require('../../../assets/icon/star2.png')}
                                    />
                                    <Text allowFontScaling={false} style={[MainStyles.Text12, MainStyles.textWhite]}>
                                        {GetEngineer.WorkRating}
                                    </Text>
                                </View>
                                <Text allowFontScaling={false} style={[MainStyles.Text12, MainStyles.textGrayLight, { marginRight: 10 }]}>
                                    |
                                </Text>
                                <Image
                                    resizeMode={'contain'}
                                    style={{ width: 15, height: 15, marginTop: 2, marginRight: 5 }}
                                    source={require('../../../assets/icon/icon_pin.png')}
                                />
                                <Text allowFontScaling={false} style={[MainStyles.Text12, MainStyles.textGrayLight]}>
                                    {GetEngineer.Distance}
                                </Text>
                            </View>
                            <View style={styles.contentCard}>
                                <TouchableOpacity 
                                    activeOpacity={1}
                                    style={styles.cardSearchContent}
                                > 
                                    <View style={styles.cardSearchContentText}>
                                        <Image
                                            resizeMode={'cover'}
                                            style={styles.cardSearchContentIcon}
                                            source={require('../../../assets/icon/baht.png')}
                                        />
                                        <Text allowFontScaling={false} style={styles.cardSearchText}>
                                            ราคา {GetEngineer.WorkPrice}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity 
                                    activeOpacity={1}
                                    style={styles.cardSearchContent}
                                > 
                                    <View style={styles.cardSearchContentText}>
                                        <Image
                                            resizeMode={'cover'}
                                            style={styles.cardSearchContentIcon}
                                            source={require('../../../assets/icon/clock.png')}
                                        />
                                        <Text allowFontScaling={false} style={styles.cardSearchText}>
                                            เวลาทำงาน {GetEngineer.WorkTime}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                            <View  style={styles.ListLine}></View>
                            <Text allowFontScaling={false} style={[MainStyles.Text14, MainStyles.textGrayLight, MainStyles.mt10]}>
                                รายละเอียดงาน
                            </Text>
                            <Text allowFontScaling={false} style={[MainStyles.Text14, MainStyles.textGray, MainStyles.mt5]}>
                                {GetEngineer.WorkDes}
                            </Text>
                        </ScrollView>
                        {GetProfile.Type === 'Engineer' ?
                        null
                        :
                        <View style={[MainStyles.btnContent]}>
                            <TouchableOpacity
                                activeOpacity={1}
                                onPress={() => this.onGetOrder()}
                                style={[MainStyles.btnOrange]}
                            > 
                                <Text allowFontScaling={false} style={MainStyles.btnOrangeText}>จ้างงาน</Text>
                            </TouchableOpacity>
                        </View>
                        }
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
        paddingLeft: 10,
        borderRadius: 10,
        marginTop: 150,
        flexDirection: 'row',
    },
    bannerTitle:{
        fontSize: 24,
        color: '#FFFFFF',
        fontFamily: 'Prompt-Bold',
        textAlign: 'center',
    },
    ListContent:{
        marginTop: 10,
        marginBottom: 15,
        flexDirection: 'column',
    },
    List:{
        flexDirection: 'row',
    },
    ListContentIcon: {
        width: '60%',
        flexDirection: 'row',
    },
    ListContentArrowVersion: {
        width: '40%',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    ListText:{
        fontSize: 14, 
        fontFamily: 'Prompt-Regular',
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    ListContentArrow: {
        width: '30%',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    ListArrow:{
        height: 15,
        width: 15,
    },
    ListLine:{
        borderWidth: 0.5,
        borderColor: '#e4e4e4',
        marginTop: 10,
        marginBottom: 10,
    },
    contentCard: {
        flexDirection: 'row',
        marginBottom: 15,
        marginTop: 15,
    },
    cardSearchContent:{
        shadowColor: "#333333",
        shadowOffset: { height:1 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        borderRadius:10,
        backgroundColor: '#ffffff',
        width: '49%',
        marginRight: '2%',
        backgroundColor: '#fff', 
        borderRadius: 10,
        borderColor: '#eceef0',
        borderWidth: 0.5,
        height: 80,  
    },
    cardSearchContentText: {
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center',
    },
    cardSearchContentIcon: {
        marginTop: 10,
        width: 17, 
        height: 17,   
    },
    cardSearchText: {
        fontSize: 14, 
        color: '#333333',
        textAlign: 'center',
        fontFamily: 'Prompt-Regular',
        lineHeight: 14,
        padding: 10,
        paddingTop: 15,
    },

    cardSearchContentTop:{
        shadowColor: "#333333",
        shadowOffset: { height:1 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        borderRadius:10,
        backgroundColor: '#ffffff',
        width: '70%',
        backgroundColor: '#fff', 
        borderRadius: 10,
        borderColor: '#eceef0',
        borderWidth: 0.5,
        height: 80,  
        flexDirection: 'row'
    },
    cardSearchTextTop: {
        fontSize: 16, 
        color: '#ffffff',
        textAlign: 'center',
        fontFamily: 'Prompt-Regular',
        lineHeight: 14,
        padding: 10,
        paddingTop: 20,
        alignSelf: 'flex-end',
    },
});