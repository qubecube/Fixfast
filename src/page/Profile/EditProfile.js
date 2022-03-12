
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
const win = Dimensions.get('window');

export default class EditProfile extends Component {

    state = {
        loading: true,
        isCheckAlert: null,
        UserId: "",
        Fullname: "",
        Email: "",
        PhoneNo: "",
        Address: "",
        isProfile: "",
        getImagePhoto: "",
        getPhoto: false,
    }

    componentDidMount(){
        // var dataInScreen = this.props.route.params.dataInScreen;
        // console.log("dataInScreen",dataInScreen)
        // this.setState({ 
        //     dataInScreen: dataInScreen,
        // })
        this.onGetProfile()
    }

    async onGetProfile(){
        const isProfile = await AsyncStorage.getItem('isProfile');
        var isProfileDecrypt = JSON.parse(isProfile);
        console.log("isProfileDecrypt", isProfileDecrypt)
        this.setState({
            isProfile: isProfileDecrypt,
            UserId: isProfileDecrypt.UserId,
            Fullname: isProfileDecrypt.Fullname,
            Email: isProfileDecrypt.Email,
            PhoneNo: isProfileDecrypt.PhoneNo,
            Address: isProfileDecrypt.Address,
            loading: false,
        })
    }

    handleChoosePhoto(){
        const options = {
            storageOptions: {
                skipBackup: true,
                path: 'images',
                maxWidth: 250, 
                maxHeight: 250, 
                AccountImage: "",
                dataProfile: "",
            },
            title: 'เลือก',
            takePhotoButtonTitle: "ถ่ายรูปภาพ",
            chooseFromLibraryButtonTitle: "เลือกจากคลังภาพ",
            cancelButtonTitle: 'ยกเลิก',
        };
        console.log("showImagePicker", options)
        setTimeout(() =>
        launchImageLibrary(options , response => {
            console.log("showImagePicker",response)
            if (response.didCancel) {
                if(this.state.getImagePhoto == ""){
                    this.setState({
                        getImagePhoto: "",
                        getPhoto: false,
                    });
                }
            } else {
                this.setState({
                    getImagePhoto: response.uri,
                    getPhoto: true,
                });
                // this.onResizeImage(response.uri)
            }
        })
        , 500)
    }

    handleChange(event, name){
        var value = event.nativeEvent.text;
        if(name == "Fullname"){
            this.setState({ Fullname: value })
        } else if(name == "Email"){
            this.setState({ Email: value })
        } else if(name == "PhoneNo"){
            this.setState({ PhoneNo: value })
        } else if(name == "Address"){
            this.setState({ Address: value })
        }
    }

    validateForm(){
        let formIsValid = true;
        const { Fullname, Email, PhoneNo, Address } = this.state
        if (Fullname === ""){
            this.onOpenAlert("Err","กรอกชื่อนามสกุล")
            formIsValid = false;
        } else if (Email === ""){
            this.onOpenAlert("Err","กรอกอีเมล")
            formIsValid = false;
        } else if (PhoneNo === ""){
            this.onOpenAlert("Err","กรอกเบอร์โทรศัพท์")
            formIsValid = false;
        } else if(Address === ""){
            this.onOpenAlert("Err","กรอกที่อยู่")
            formIsValid = false;
        }
        return formIsValid;
    }

    onSubmit(){
        if(this.validateForm()){
            this.setState({ loading: true })
            const { UserId, Fullname, Email, PhoneNo, Address } = this.state
            var formData = new FormData();
            formData.append('UserId' , UserId)
            formData.append('Fullname' , Fullname)
            formData.append('Email' , Email)
            formData.append('PhoneNo' , PhoneNo)
            formData.append('Address' , Address)
            userAction.EditProfile(formData).then(e => {
                console.log("EditProfile", e)
                if(e.IsSuccess === true){
                    this.onEditProfileSuccess(e.Data)
                } else {
                    this.onOpenAlert("Err","แก้ไขข้อมูลส่วนตัวไม่ถูกต้อง")
                }
            });
        }
    }

    onEditProfileSuccess(Data){
        alert = (<ModalLib isVisible={true}>
            <View style={ModalStyles.ModalContent}>
                <Text allowFontScaling={false} style={ModalStyles.ModalTitle}>แจ้งเตือน</Text>
                <Text allowFontScaling={false} style={ModalStyles.ModalSubTitle}>แก้ไขข้อมูลส่วนตัวเรียบร้อย</Text>
                <View style={ModalStyles.contentButton}>
                    <TouchableOpacity
                        activeOpacity={1}
                        style={ModalStyles.btnOne}
                        onPress={() => this.onNextToScreen(Data)}
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

    async onNextToScreen(Data){
        this.setState({ 
            isCheckAlert: null,
            loading: false,
        })
        var setProfile = {
            "UserId": Data.UserId,
            "Fullname": Data.Fullname,
            "Email": Data.Email,
            "PhoneNo": Data.PhoneNo,
            "Address": Data.Address,
            "Type": Data.Type
        }
        console.log("setProfile",setProfile)
        await AsyncStorage.setItem('isProfile', JSON.stringify(setProfile));
        this.props.navigation.navigate('Home');
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
        const { isCheckAlert, getImagePhoto, getPhoto } = this.state
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
                <View style={styles.contentProfile}>
                    <TouchableOpacity
                        activeOpacity={1}
                        onPress={() => this.handleChoosePhoto()}
                    > 
                        {getPhoto ?
                        <View>
                            <Image
                                resizeMode={'contain'}
                                style={styles.contentProfileIcon}
                                source={{ uri: getImagePhoto }}
                            />
                        </View>
                        :
                        <View>
                            <View style={styles.contentProfileEdit}>
                                <Image
                                    resizeMode={'contain'}
                                    style={styles.contentProfileEditText}
                                    source={require('../../../assets/icon/famedit.png')}
                                />
                            </View>
                            <Image
                                resizeMode={'contain'}
                                style={styles.contentProfileIcon}
                                source={require('../../../assets/icon/user.png')}
                            />
                        </View>
                        }
                    </TouchableOpacity>
                </View>
                <SafeAreaView style={styles.contentHome} forceInset={{ bottom: 'always', top : 'never'}}> 
                    <View style={[MainStyles.content]}>
                        <ScrollView style={styles.scrollView} contentContainerStyle={{ height: 1000, flex:1 , flexGrow: 1}} showsVerticalScrollIndicator={false}>
                            <View style={InputStyles.contentInputForm}>
                                <Text allowFontScaling={false} style={InputStyles.inputFormTextLight}>ชื่อนามสกุล <Text allowFontScaling={false} style={InputStyles.inputFormTextRed}>*</Text></Text>
                                <TextInput
                                    clearButtonMode="always" 
                                    allowFontScaling={false}
                                    style={InputStyles.inputForm}
                                    placeholder="กรอกชื่อนามสกุล"
                                    placeholderTextColor={"#838383"}
                                    value={this.state.Fullname}
                                    onChange={e => this.handleChange(e,'Fullname')}
                                />
                            </View>
                            <View style={InputStyles.contentInputForm}>
                                <Text allowFontScaling={false} style={InputStyles.inputFormTextLight}>อีเมล <Text allowFontScaling={false} style={InputStyles.inputFormTextRed}>*</Text></Text>
                                <TextInput
                                    clearButtonMode="always" 
                                    allowFontScaling={false}
                                    style={InputStyles.inputForm}
                                    placeholder="กรอกอีเมล"
                                    placeholderTextColor={"#838383"}
                                    value={this.state.Email}
                                    onChange={e => this.handleChange(e,'Email')}
                                />
                            </View>
                            <View style={InputStyles.contentInputForm}>
                                <Text allowFontScaling={false} style={InputStyles.inputFormTextLight}>เบอร์โทรศัพท์ <Text allowFontScaling={false} style={InputStyles.inputFormTextRed}>*</Text></Text>
                                <TextInput
                                    maxLength={10}
                                    keyboardType="phone-pad"
                                    clearButtonMode="always" 
                                    allowFontScaling={false}
                                    style={InputStyles.inputForm}
                                    placeholder="กรอกเบอร์โทรศัพท์"
                                    placeholderTextColor={"#838383"}
                                    value={this.state.PhoneNo}
                                    onChange={e => this.handleChange(e,'PhoneNo')}
                                />
                            </View>
                            <View style={InputStyles.contentInputForm}>
                                <Text allowFontScaling={false} style={InputStyles.inputFormTextLight}>ที่อยู่ <Text allowFontScaling={false} style={InputStyles.inputFormTextRed}>*</Text></Text>
                                <TextInput
                                    numberOfLines={10}
                                    multiline={true}
                                    clearButtonMode="always" 
                                    allowFontScaling={false}
                                    style={InputStyles.inputFormArea}
                                    placeholder="กรอกที่อยู่"
                                    placeholderTextColor={"#838383"}
                                    value={this.state.Address}
                                    onChange={e => this.handleChange(e,'Address')}
                                />
                            </View>
                        </ScrollView>
                        <View style={[MainStyles.btnContent]}>
                            <TouchableOpacity
                                activeOpacity={1}
                                onPress={() => this.onSubmit()}
                                disabled={this.state.btnSubmit}
                                style={[MainStyles.btnOrange]}
                            > 
                                <Text allowFontScaling={false} style={MainStyles.btnOrangeText}>สมัครสมาชิก</Text>
                            </TouchableOpacity>
                        </View>
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
        paddingTop: 80,
    },
    contentHome:{
        backgroundColor: '#ffffff', 
        flex: 1,
        marginTop: -50,
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
    },
    contentProfile:{
        zIndex: 1,
        alignSelf: 'center',
        marginTop: 70,
        backgroundColor:'#ffffff',
        borderRadius: 50
    },
    contentProfileIcon: {
        width: 100,
        height: 100,
        opacity: 0.5
    },
    contentProfileEdit: {
        zIndex: 1,
        position: 'absolute', 
        top: 0, 
        left: 0, 
        right: 0, 
        bottom: 0, 
        justifyContent: 'center', 
        alignItems: 'center',
    },
    contentProfileEditText: {
        width: 50,
        height: 50,
        opacity: 1.5,
    }
});