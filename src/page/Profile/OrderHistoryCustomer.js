
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
import SwipeableStyles from '../../styles/SwipeableStyles';

import { userAction } from "../../_actions";
import { orderAction } from "../../_actions";

import Spinner from 'react-native-loading-spinner-overlay';
import ModalLib from 'react-native-modal';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import GetLocation from 'react-native-get-location';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import Moment from 'moment';
import { Rating, AirbnbRating } from 'react-native-ratings';
const win = Dimensions.get('window');

export default class OrderHistoryCustomer extends Component {

    state = {
        loading: true,
        isCheckAlert: null,
        GetOrder: [],
        GetEngineer: {},
        GetProfile: {},
        Status: "Progress",
        CheckData: true,
        UserId: "",
        Rating: 3
    }

    async componentDidMount(){
        const isProfile = await AsyncStorage.getItem('isProfile');
        var isProfileDecrypt = JSON.parse(isProfile);
        var UserId = isProfileDecrypt.UserId
        this.setState({
            UserId: UserId
        })
        this.onGetOrder(UserId, 'Progress')
    }

    async onGetOrder(UserId, status){
        this.setState({ loading: true })
        var formData = new FormData();
        formData.append('UserId' , UserId)
        formData.append('OrderStatus' , status)
        console.log("GetOrder status", status)
        console.log("GetOrder UserId", UserId)
        orderAction.GetOrder(formData).then(e => {
            console.log("GetOrder", e)
            if(e.IsSuccess === true){
                var res = e.Data
                this.setState({
                    GetOrder: e.Data,
                    loading: false,
                    CheckData: true,
                    Status: status,
                    UserId: UserId,
                })
            } else {
                this.setState({
                    GetOrder: [],
                    CheckData: false,
                    loading: false,
                    Status: status,
                    UserId: UserId,
                })
            }
        });
    }

    async onUpdateStatus(OrderId, EngineerId, status){
        this.setState({ loading: true })
        var formData = new FormData();
        formData.append('OrderId' , OrderId)
        formData.append('OrderStatus' , status)
        orderAction.UpdateOrderStatus(formData).then(e => {
            console.log("UpdateOrderStatus", e)
            if(e.IsSuccess === true){
                if(status === "Success"){
                    this.onSetRating(EngineerId)
                } else{
                    this.onOpenAlert("Success","ทำรายการสำเร็จ")
                }
            } else {
                this.onOpenAlert("Err","เกิดข้อผิดพลาด")
            }
        });
    }

    onSetRating(EngineerId){
        alert = (<ModalLib isVisible={true}>
            <View style={ModalStyles.ModalContent}>
                <Text allowFontScaling={false} style={ModalStyles.ModalTitle}>เรตติ้ง</Text>
                <Text allowFontScaling={false} style={ModalStyles.ModalSubTitle2}>ให้คะแนนการจ้างงานในครั้งนี้</Text>
                <Rating
                    type='star'
                    onFinishRating={(value) => this.onSetRatingAmount(value)}
                />
                <View style={[ModalStyles.contentButton, { paddingTop: 25 }]}>
                    <TouchableOpacity
                        activeOpacity={1}
                        style={ModalStyles.btnOne}
                        onPress={() => this.onSetRatingEngineer(EngineerId)}
                    > 
                        <Text allowFontScaling={false} style={ModalStyles.btnOneText}>ยืนยัน</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ModalLib>)
        this.setState({ 
            isCheckAlert: alert,
            loading: false,
        });
    }

    onSetRatingAmount(value){
        this.setState({
            Rating: value,
        })
    }

    onSetRatingEngineer(EngineerId){
        this.setState({ loading: true })
        const { Rating } = this.state
        var formData = new FormData();
        formData.append('EngineerId' , EngineerId)
        formData.append('WorkRating' , Rating)
        orderAction.UpdateRatings(formData).then(e => {
            console.log("UpdateRatings", e)
            if(e.IsSuccess === true){
                this.onOpenAlert("Success","ทำรายการสำเร็จ")
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
        this.componentDidMount()
    }

    render() {
        const { isCheckAlert, GetOrder, CheckData } = this.state
        var GetOrderCards = [];
        GetOrder.map((key,index) => {
            var DateExpiry = Moment(GetOrder[index].CreateDate,'DD-MM-YYYY hh:mm:ss').format("L")
            GetOrderCards.push(
                <Swipeable
                    renderRightActions={(progress, dragx) => {
                        return (
                            <View style={[SwipeableStyles.FlexDirectionRow]}>
                                <TouchableOpacity 
                                    style={[SwipeableStyles.contentCardEdit]}
                                    activeOpacity={1}
                                    onPress={() => this.onUpdateStatus(GetOrder[index].OrderId, GetOrder[index].EngineerId, "Success")}
                                >
                                    <Text allowFontScaling={false} style={styles.contentCardDeleteText}>สำเร็จ</Text>
                                </TouchableOpacity>
                                <TouchableOpacity 
                                    style={[SwipeableStyles.contentCardDelete]}
                                    activeOpacity={1}
                                    onPress={() => this.onUpdateStatus(GetOrder[index].OrderId, GetOrder[index].EngineerId, "Cancel")}
                                >
                                    <Text allowFontScaling={false} style={styles.contentCardDeleteText}>ยกเลิก</Text>
                                </TouchableOpacity>
                            </View>
                        );
                    }}
                >
                <View  style={[styles.contentCard]} >
                    <View style={[styles.contentCardTop]}>
                        <View style={[MainStyles.ContentCard2Col]}>
                            <Text allowFontScaling={false} style={[MainStyles.Text12, MainStyles.textGrayLight]}>วันที่จ้าง :</Text>
                            <Text allowFontScaling={false} style={[MainStyles.Text12, MainStyles.textGray]}>{DateExpiry}</Text>
                        </View>
                        <Text allowFontScaling={false} style={[MainStyles.Text14, MainStyles.textGrayBd]}>{GetOrder[index].EngineerWorkName}</Text>
                    </View>
                    <View style={[MainStyles.BorderBottomGrayWhite]}></View>
                    <View style={[styles.contentCardBottom]}>
                        <View style={[MainStyles.ContentCard2Col]}>
                            <Text allowFontScaling={false} style={[MainStyles.Text12, MainStyles.textGrayLight]}>ชื่อช่าง :</Text>
                            <Text allowFontScaling={false} style={[MainStyles.Text12, MainStyles.textGray]}>{GetOrder[index].EngineerFullname}</Text>
                        </View>
                        <View style={[MainStyles.ContentCard2Col]}>
                            <Text allowFontScaling={false} style={[MainStyles.Text12, MainStyles.textGrayLight]}>เบอร์โทรช่าง :</Text>
                            <Text allowFontScaling={false} style={[MainStyles.Text12, MainStyles.textGray]}>{GetOrder[index].EngineerPhoneNo}</Text>
                        </View>
                        <View style={[MainStyles.ContentCard2Col]}>
                            <Text allowFontScaling={false} style={[MainStyles.Text12, MainStyles.textGrayLight]}>อีเมลช่าง :</Text>
                            <Text allowFontScaling={false} style={[MainStyles.Text12, MainStyles.textGray]}>{GetOrder[index].EngineerEmail}</Text>
                        </View>
                        <View style={[MainStyles.ContentCard2Col]}>
                            <Text allowFontScaling={false} style={[MainStyles.Text12, MainStyles.textGrayLight]}>ที่อยูู่ช่าง :</Text>
                            <Text allowFontScaling={false} style={[MainStyles.Text12, MainStyles.textGray]}>{GetOrder[index].EngineerAddress}</Text>
                        </View>
                    </View>
                </View>
                </Swipeable>
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
                        ออร์เดอร์
                    </Text>
                </View>
                <SafeAreaView style={styles.contentHome} forceInset={{ bottom: 'always', top : 'never'}}> 
                    <View style={[MainStyles.content]}>
                            <View style={{ flexDirection: 'row', marginTop: 15 }}>
                                <TouchableOpacity 
                                    activeOpacity={1}
                                    style={this.state.Status === "Progress" ? styles.cardSearchContentActive : styles.cardSearchContent}
                                    onPress={() => this.onGetOrder(this.state.UserId, "Progress")}
                                > 
                                    <Text allowFontScaling={false} style={this.state.Status === "Progress" ? styles.cardSearchTextActive : styles.cardSearchText}>
                                        ดำเนินการ
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity 
                                    activeOpacity={1}
                                    style={this.state.Status === "Success" ? styles.cardSearchContentActive : styles.cardSearchContent}
                                    onPress={() => this.onGetOrder(this.state.UserId, "Success")}
                                > 
                                    <Text allowFontScaling={false} style={this.state.Status === "Success" ? styles.cardSearchTextActive : styles.cardSearchText}>
                                        สำเร็จ
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity 
                                    activeOpacity={1}
                                    style={this.state.Status === "Cancel" ? styles.cardSearchContentActive : styles.cardSearchContent}
                                    onPress={() => this.onGetOrder(this.state.UserId, "Cancel")}
                                > 
                                    <Text allowFontScaling={false} style={this.state.Status === "Cancel" ? styles.cardSearchTextActive : styles.cardSearchText}>
                                        ยกเลิก
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                            <View style={{ flexDirection: 'column' }}>
                                {CheckData ? GetOrderCards 
                                :
                                <View style={MainStyles.notFoundContent}>
                                    <Text allowFontScaling={false} style={MainStyles.notFoundText}>ไม่พบข้อมูล</Text>
                                </View>
                                }
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
        marginTop: 15,
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
    },
    cardSearchContentActive: {
        shadowColor: "#333333",
        shadowOffset: { height:1 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        borderRadius:10,
        backgroundColor: '#ff8c00',
        width: '31%',
        marginRight: '3%',
        borderRadius: 10,
        borderColor: '#eceef0',
        borderWidth: 0.5,
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
        fontSize: 14, 
        color: '#333333',
        textAlign: 'center',
        fontFamily: 'Prompt-Regular',
        padding: 10
    },
    cardSearchTextActive: {
        fontSize: 14, 
        color: '#ffffff',
        textAlign: 'center',
        fontFamily: 'Prompt-Regular',
        padding: 10
    },


    contentCard:{
        backgroundColor: '#fff',
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: { height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        borderWidth: 1,
        borderColor: '#f3f3f3',
        marginBottom: 15,
    },
    contentCardTop: {
        flexDirection: 'column',
        paddingLeft: 15,
        paddingRight: 15,
        paddingTop: 15,
    },
    contentCardBottom: {
        flexDirection: 'column',
        paddingLeft: 15,
        paddingRight: 15,
        paddingBottom: 15,
    },
    contentCard2Col: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },

    contentCardDelete:{
        backgroundColor: '#e81500',
        flexDirection: 'column',
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10,
        marginBottom: 15,
        marginLeft: -10,
        padding: 15,
        shadowColor: "#000",
        shadowOffset: { height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        borderWidth: 1,
        borderColor: '#f3f3f3',
        justifyContent: 'center',
    },
    contentCardDeleteText:{
        fontSize: 12, 
        color: '#fff',
        fontFamily: 'Prompt-Regular',
        textAlign: 'center'
    },

});