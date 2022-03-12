
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
import { LoginButton, AccessToken, LoginManager, GraphRequest, GraphRequestManager } from 'react-native-fbsdk';
import { GoogleSignin, GoogleSigninButton, statusCodes } from 'react-native-google-signin';
// import LineLogin from 'react-native-line-sdk'
import LineLogin from '@xmartlabs/react-native-line'

import ImgToBase64 from 'react-native-image-base64';
import { auth } from 'react-native-firebase';

const win = Dimensions.get('window');

export default class Profile extends Component {
    constructor(props){
        super(props);
        this.state={
            loading: true,
            isCheckAlert: null,
            isProfile: "",
            isLogin: false,
            isProfileData: {},

            Email: "mint5@gmail.com",
            Password: "111111",
            isSigninInProgress:false,
            userInfo:null
        }
        GoogleSignin.configure({
            scopes: [], // what API you want to access 
            webClientId: '947145506305-ile84sja3mv8m80rf909il714m46bpte.apps.googleusercontent.com',
            offlineAccess: true, 
            hostedDomain: '', 
            forceConsentPrompt: true,
            accountName: ''
        });
    }
   
    componentDidMount() {
        this.onCheckLogin()
        this.focusListener = this.props.navigation.addListener('focus', () => {
            this.onCheckLogin()
        })
    }

    async onCheckLogin(){
        const isLogin = await AsyncStorage.getItem('isLogin');
        if(isLogin === "true"){
            this.onGetProfileInPhone()
        } else {
            this.setState({
                isLogin: false,
                loading: false,
            })
        }
    }

    async onGetProfileInPhone(){
        const isProfile = await AsyncStorage.getItem('isProfile');
        var isProfileDecrypt = JSON.parse(isProfile);
        var UserId = isProfileDecrypt.UserId
        this.setState({
            isProfile: isProfileDecrypt,
            UserId: UserId
        })
        this.onGetProfile(UserId)
    }

    onGetProfile(UserId){
        var formData = new FormData();
        formData.append('UserId' , UserId)
        userAction.GetProfile(formData).then(e => {
            console.log("GetProfile", e)
            if(e.IsSuccess === true){
                this.setState({
                    isProfileData: e.Data,
                    isLogin: true,
                    loading: false,
                })
            } else {
                this.onOpenAlert("Err","Email หรือ Password ไม่ถูกต้อง")
            }
        });
    }

    handleChange(event, name){
        var value = event.nativeEvent.text;
        if(name == "Email"){
            this.setState({ Email: value })
        } else if(name == "Password"){
            this.setState({ Password: value })
        } 
    }
    validateForm(){
        let formIsValid = true;
        const { Email, Password } = this.state
        if (Email === ""){
            this.onOpenAlert("Err","กรอกอีเมล")
            formIsValid = false;
        } else if (Password === ""){
            this.onOpenAlert("Err","กรอกรหัสผ่าน")
            formIsValid = false;
        }
        return formIsValid;
    }
    onSubmitLogin(){
        if(this.validateForm()){
            this.setState({ loading: true })
            const { Fullname, Email, Password } = this.state
            var formData = new FormData();
            formData.append('Email' , Email)
            formData.append('Password' , Password)
            userAction.Login(formData).then(e => {
                if(e.IsSuccess === true){
                    this.onLoginSuccess(e.Data)
                } else {
                    this.onOpenAlert("Err","Email หรือ Password ไม่ถูกต้อง")
                }
            });
        }
    }
    async onLoginSuccess(Data){
        setTimeout(() => {
            this.setState({ loading: false })
        }, 200);
        var setProfile = {
            "UserId": Data.UserId,
            "Fullname": Data.Fullname,
            "Email": Data.Email,
            "PhoneNo": Data.PhoneNo,
            "Address": Data.Address,
            "Type": Data.Type
        }
        await AsyncStorage.setItem('isProfile', JSON.stringify(setProfile));
        await AsyncStorage.setItem('isLogin', 'true');
        this.componentDidMount();
    }

    onAskLogout(){
        alert = (<ModalLib isVisible={true}>
            <View style={ModalStyles.ModalContent}>
                <Text allowFontScaling={false} style={ModalStyles.ModalTitle}>แจ้งเตือน</Text>
                <Text allowFontScaling={false} style={ModalStyles.ModalSubTitle}>คุณต้องการออกจากระบบใช่หรือไม่</Text>
                <View style={ModalStyles.contentButton}>
                    <TouchableOpacity
                        activeOpacity={1}
                        style={ModalStyles.btnLeft}
                        onPress={() => this.onCloseAlert()}
                    > 
                        <Text allowFontScaling={false} style={ModalStyles.btnLeftText}>ไม่ใช่</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        activeOpacity={1}
                        style={ModalStyles.btnRight}
                        onPress={() => this.onLogout()}
                    > 
                        <Text allowFontScaling={false} style={ModalStyles.btnRightText}>ใช่</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ModalLib>)
        this.setState({ 
            isCheckAlert: alert,
            loading: false,
        });
    }
    async onLogout(){
        this.setState({ 
            isLogin: false,
            loading: true,
            isCheckAlert: null,
        })
        await AsyncStorage.setItem('isLogin', 'false');
        await AsyncStorage.setItem('isProfile', '');
        setTimeout(() => {
            this.componentDidMount();
            this.setState({ 
                isLogin: false,
                loading: false,
            })
        }, 200);
    }


    onSignin(){
        this.props.navigation.navigate('Signin')
    }
    onEditProfile(){
        this.props.navigation.navigate('EditProfile')
    }
    onRegisterEngineer(){
        this.props.navigation.navigate('RegisterEngineer')
    }
    onGetEngineerById(){
        this.setState({ loading: true })
        const { UserId } = this.state
        var formData = new FormData();
        formData.append('UserId' , UserId)
        userAction.GetEngineer(formData).then(e => {
            if(e.IsSuccess === true){
                this.setState({ loading: false })
                var res = e.Data
                var setdataInScreen = {
                    "EngineerId": res.EngineerId,
                }
                this.props.navigation.navigate('ProfileEngineer',{
                    dataInScreen: setdataInScreen
                });
            } else {
                this.onOpenAlert("Err","เกิดข้อผิดพลาด")
            }
        });
    }


    onLoginFacebook(){
        LoginManager.logInWithPermissions(['public_profile', 'email']).then(
            (result) => {
                if (result.isCancelled) {
                    console.log('Login cancelled')
                } else {
                    AccessToken.getCurrentAccessToken(['public_profile', 'email']).then(
                        (data) => {
                            const { accessToken } = data
                            console.log(accessToken);
                            this.onLoginFacebookGetProfile(accessToken)
                        }
                    )
                }
            },
            (error) => {
                console.log('Login fail with error: ' + error)
            }
        )
    }
    onLoginFacebookGetProfile(token){
        this.setState({ loading: true })
        fetch('https://graph.facebook.com/v2.5/me?fields=email,first_name,last_name,friends&access_token=' + token)
        .then((response) => {
            response.json().then((json) => {
                const ID = json.id
                const Email = json.email
                const Fullname = json.first_name
                this.onGetImageSocial(token, "FB", Fullname, Email)
            })
        })
        .catch(() => {
            console.log('ERROR GETTING DATA FROM FACEBOOK')
        })
    }
    onGetImageSocial(token, Social, Fullname, Email){
        const graphRequest = new GraphRequest('/me', {
            accessToken: token,
            parameters: {
              fields: {
                string: 'picture.type(large)',
              },
            },
        }, (error, result) => {
            if (error) {
                console.error(error)
            } else {
                console.log(result.picture.data.url)
                this.onBase64ImageSocial(Social, Fullname, Email, result.picture.data.url)
            }
        })
        new GraphRequestManager().addRequest(graphRequest).start()
    }
    async onLoginGoogle(){
        try {
            await GoogleSignin.hasPlayServices();
            const { accessToken, idToken } = await GoogleSignin.signIn();
            const currentUser = await GoogleSignin.getCurrentUser();
            var getProfile = currentUser.user
            this.onBase64ImageSocial("GG", getProfile.name, getProfile.email, getProfile.photo)
            console.log("currentUser", currentUser)
            const credential = auth.GoogleAuthProvider.credential(
                idToken,
                accessToken,
            );
            console.log("credentialcredential", credential)
            await auth().signInWithCredential(credential);
        } catch (error) {
            console.log("sdfsdf", error)
        }
   }
    onBase64ImageSocial(Social, Fullname, Email, Image){
        this.setState({ loading: true })
        ImgToBase64.getBase64String(Image)
        .then((base64String) => {
            this.onRegisterSocial(Social, Fullname, Email, base64String)
        })
    }
    onRegisterSocial(Social, Fullname, Email, Image){
        console.log("Social",Social)
        console.log("Fullname",Fullname)
        console.log("Email",Email)
        console.log("Image",Image)
        var formData = new FormData();
        formData.append('Fullname' , Fullname)
        formData.append('Email' , Email)
        formData.append('Password' , "")
        formData.append('Social' , Social)
        formData.append('Image', Image)
        formData.append('Type' , "Customer")
        userAction.Signin(formData).then(e => {
            console.log("Signin", e)
            if(e.IsSuccess === true){
                this.onRegisterSocialSuccess(e.Data)
            } else {
                this.onOpenAlert("Err","สมัครสมาชิกไม่สำเร็จ")
            }
        });
    }
    onRegisterSocialSuccess(Data){
        alert = (<ModalLib isVisible={true}>
            <View style={ModalStyles.ModalContent}>
                <Text allowFontScaling={false} style={ModalStyles.ModalTitle}>แจ้งเตือน</Text>
                <Text allowFontScaling={false} style={ModalStyles.ModalSubTitle}>สมัครสมาชิกสำเร็จ</Text>
                <View style={ModalStyles.contentButton}>
                    <TouchableOpacity
                        activeOpacity={1}
                        style={ModalStyles.btnOne}
                        onPress={() => this.onRegisterSocialSuccessNextToScreen(Data)}
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
    async onRegisterSocialSuccessNextToScreen(Data){
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
        await AsyncStorage.setItem('isLogin', 'true');
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
        const { isLogin, isCheckAlert, isProfileData } = this.state
        console.log("isProfileData", isProfileData.Type)
        return (
            <ImageBackground
                style={styles.banner}
                source={require('../../../assets/image/banner.jpg')}
            >
                {isCheckAlert}
                <Spinner
                    visible={this.state.loading}
                    overlayColor={"#ffffff"}
                    color={"#ff8c00"}
                />
                <View style={styles.contentProfile}>
                    <Image
                        resizeMode={'contain'}
                        style={styles.contentProfileIcon}
                        source={isLogin ? { uri: `data:image/jpeg;base64,${isProfileData.Image}` } : require('../../../assets/icon/user.png') }
                    />
                </View>
                <SafeAreaView style={styles.contentHome} forceInset={{ bottom: 'always', top : 'never'}}> 
                    {isLogin ?
                    <View style={[MainStyles.content]}>
                        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                            
                            <View style={[MainStyles.FlexDirectionRow]}>
                                <Text allowFontScaling={false} style={[MainStyles.Text18, MainStyles.textOrangeBd]}>
                                    ข้อมูลส่วนตัว
                                </Text>
                                <View style={styles.contentBtnSmall}>
                                    <TouchableOpacity
                                        activeOpacity={1}
                                        onPress={() => this.onEditProfile()}
                                        style={[MainStyles.btnOrangeSm]}
                                    > 
                                        <Text allowFontScaling={false} style={MainStyles.btnOrangeSmText}>แก้ไข</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View style={styles.ListContent}>
                                <TouchableOpacity
                                    activeOpacity={1}
                                    onPress={() => this.props.navigation.navigate('Notification')}
                                >
                                    <View style={styles.List}>
                                        <View style={styles.ListContentIcon}>
                                            <Text allowFontScaling={false} style={[styles.ListText, MainStyles.textGray]}>ชื่อ-นามสกุล</Text>
                                        </View>
                                        <View style={styles.ListContentArrowVersion}>
                                            <Text allowFontScaling={false} style={[styles.ListText, MainStyles.textGray, MainStyles.rightText]}>{isProfileData.Fullname}</Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                                <View  style={styles.ListLine}></View>
                                <TouchableOpacity
                                    activeOpacity={1}
                                    onPress={() => this.props.navigation.navigate('Notification')}
                                >
                                    <View style={styles.List}>
                                        <View style={styles.ListContentIcon}>
                                            <Text allowFontScaling={false} style={[styles.ListText, MainStyles.TextDarkGray]}>อีเมล</Text>
                                        </View>
                                        <View style={styles.ListContentArrowVersion}>
                                            <Text allowFontScaling={false} style={[styles.ListText, MainStyles.textGray, MainStyles.rightText]}>{isProfileData.Email}</Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                                <View  style={styles.ListLine}></View>
                                <TouchableOpacity
                                    activeOpacity={1}
                                    onPress={() => this.props.navigation.navigate('Notification')}
                                >
                                    <View style={styles.List}>
                                        <View style={styles.ListContentIcon}>
                                            <Text allowFontScaling={false} style={[styles.ListText, MainStyles.TextDarkGray]}>หมายเลขโทรศัพท์</Text>
                                        </View>
                                        <View style={styles.ListContentArrowVersion}>
                                            <Text allowFontScaling={false} style={[styles.ListText, MainStyles.textGray, MainStyles.rightText]}>{isProfileData.PhoneNo}</Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                                <View  style={styles.ListLine}></View>
                                <TouchableOpacity
                                    activeOpacity={1}
                                    onPress={() => this.props.navigation.navigate('Notification')}
                                >
                                    <View style={styles.List}>
                                        <View style={styles.ListContentIcon}>
                                            <Text allowFontScaling={false} style={[styles.ListText, MainStyles.TextDarkGray]}>ที่อยู่</Text>
                                        </View>
                                        <View style={styles.ListContentArrowVersion}>
                                            <Text allowFontScaling={false} style={[styles.ListText, MainStyles.textGray, MainStyles.rightText]}>{isProfileData.Address}</Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                                <View  style={styles.ListLine}></View>
                            </View>
                            <View style={[MainStyles.FlexDirectionRow]}>
                                <Text allowFontScaling={false} style={[MainStyles.Text18, MainStyles.textOrangeBd]}>
                                    บัญชี
                                </Text>
                                {isProfileData.Type === "Customer" ?
                                <View style={styles.contentBtnSmall}>
                                    <TouchableOpacity
                                        activeOpacity={1}
                                        onPress={() => this.onRegisterEngineer()}
                                        style={[MainStyles.btnOrangeSm]}
                                    > 
                                        <Text allowFontScaling={false} style={MainStyles.btnOrangeSmText}>สมัครเป็นช่าง</Text>
                                    </TouchableOpacity>
                                </View>
                                :
                                <View></View>
                                }
                            </View>
                            {isProfileData.Type === "Customer" ?
                            <View style={styles.ListContent}>
                                <TouchableOpacity
                                    activeOpacity={1}
                                    onPress={() => this.props.navigation.navigate('OrderHistoryCustomer')}
                                >
                                    <View style={styles.List}>
                                        <View style={styles.ListContentIcon}>
                                            <Text allowFontScaling={false} style={[styles.ListText, MainStyles.textGray]}>ประวัติการใช้บริการ</Text>
                                        </View>
                                        <View style={styles.ListContentArrow}>
                                            <Image
                                                resizeMode={'contain'}
                                                style={styles.ListArrow}
                                                source={require('../../../assets/icon/arrownextgray.png')}
                                            />
                                        </View>
                                    </View>
                                </TouchableOpacity>
                                <View  style={styles.ListLine}></View>
                                <TouchableOpacity
                                    activeOpacity={1}
                                    onPress={() => this.props.navigation.navigate('ChangePassword')}
                                >
                                    <View style={styles.List}>
                                        <View style={styles.ListContentIcon}>
                                            <Text allowFontScaling={false} style={[styles.ListText, MainStyles.textGray]}>ตั้งรหัสผ่านใหม่</Text>
                                        </View>
                                        <View style={styles.ListContentArrow}>
                                            <Image
                                                resizeMode={'contain'}
                                                style={styles.ListArrow}
                                                source={require('../../../assets/icon/arrownextgray.png')}
                                            />
                                        </View>
                                    </View>
                                </TouchableOpacity>
                                <View  style={styles.ListLine}></View>
                                <TouchableOpacity
                                    activeOpacity={1}
                                    onPress={() => this.props.navigation.navigate('Notification')}
                                >
                                    <View style={styles.List}>
                                        <View style={styles.ListContentIcon}>
                                            <Text allowFontScaling={false} style={[styles.ListText, MainStyles.textGray]}>ฝากงานให้ช่างติดต่อกลับ</Text>
                                        </View>
                                        <View style={styles.ListContentArrow}>
                                            <Image
                                                resizeMode={'contain'}
                                                style={styles.ListArrow}
                                                source={require('../../../assets/icon/arrownextgray.png')}
                                            />
                                        </View>
                                    </View>
                                </TouchableOpacity>
                                <View  style={styles.ListLine}></View>
                            </View>
                            :
                            <View style={styles.ListContent}>
                                <TouchableOpacity
                                    activeOpacity={1}
                                    onPress={() => this.onGetEngineerById()}
                                >
                                    <View style={styles.List}>
                                        <View style={styles.ListContentIcon}>
                                            <Text allowFontScaling={false} style={[styles.ListText, MainStyles.textGray]}>ดูโปรไฟล์งาน</Text>
                                        </View>
                                        <View style={styles.ListContentArrow}>
                                            <Image
                                                resizeMode={'contain'}
                                                style={styles.ListArrow}
                                                source={require('../../../assets/icon/arrownextgray.png')}
                                            />
                                        </View>
                                    </View>
                                </TouchableOpacity>
                                <View  style={styles.ListLine}></View>
                                <TouchableOpacity
                                    activeOpacity={1}
                                    onPress={() => this.props.navigation.navigate('EditEngineer')}
                                >
                                    <View style={styles.List}>
                                        <View style={styles.ListContentIcon}>
                                            <Text allowFontScaling={false} style={[styles.ListText, MainStyles.textGray]}>แก้ไขงาน</Text>
                                        </View>
                                        <View style={styles.ListContentArrow}>
                                            <Image
                                                resizeMode={'contain'}
                                                style={styles.ListArrow}
                                                source={require('../../../assets/icon/arrownextgray.png')}
                                            />
                                        </View>
                                    </View>
                                </TouchableOpacity>
                                <View  style={styles.ListLine}></View>
                                <TouchableOpacity
                                    activeOpacity={1}
                                    onPress={() => this.props.navigation.navigate('OrderHistoryEngineer')}
                                >
                                    <View style={styles.List}>
                                        <View style={styles.ListContentIcon}>
                                            <Text allowFontScaling={false} style={[styles.ListText, MainStyles.textGray]}>ประวัติการรับจ้าง</Text>
                                        </View>
                                        <View style={styles.ListContentArrow}>
                                            <Image
                                                resizeMode={'contain'}
                                                style={styles.ListArrow}
                                                source={require('../../../assets/icon/arrownextgray.png')}
                                            />
                                        </View>
                                    </View>
                                </TouchableOpacity>
                                <View  style={styles.ListLine}></View>
                                <TouchableOpacity
                                    activeOpacity={1}
                                    onPress={() => this.props.navigation.navigate('ChangePassword')}
                                >
                                    <View style={styles.List}>
                                        <View style={styles.ListContentIcon}>
                                            <Text allowFontScaling={false} style={[styles.ListText, MainStyles.textGray]}>ตั้งรหัสผ่านใหม่</Text>
                                        </View>
                                        <View style={styles.ListContentArrow}>
                                            <Image
                                                resizeMode={'contain'}
                                                style={styles.ListArrow}
                                                source={require('../../../assets/icon/arrownextgray.png')}
                                            />
                                        </View>
                                    </View>
                                </TouchableOpacity>
                                <View  style={styles.ListLine}></View>
                            </View>
                            }
                        </ScrollView>
                        <View style={[MainStyles.btnContent]}>
                            <TouchableOpacity
                                activeOpacity={1}
                                onPress={() => this.onAskLogout()}
                                style={[MainStyles.btnOrange]}
                            > 
                                <Text allowFontScaling={false} style={MainStyles.btnOrangeText}>ออกจากระบบ</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    :
                    <View style={[MainStyles.content]}>
                        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                            <Text allowFontScaling={false} style={[MainStyles.Text18, MainStyles.textOrangeBd, MainStyles.textAlignCenter]}>
                                เข้าสู่ระบบ
                            </Text>
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
                                <Text allowFontScaling={false} style={InputStyles.inputFormTextLight}>รหัสผ่าน <Text allowFontScaling={false} style={InputStyles.inputFormTextRed}>*</Text></Text>
                                <TextInput
                                    clearButtonMode="always" 
                                    allowFontScaling={false}
                                    style={InputStyles.inputForm}
                                    placeholder="กรอกรหัสผ่าน"
                                    placeholderTextColor={"#838383"}
                                    value={this.state.Password}
                                    onChange={e => this.handleChange(e,'Password')}
                                    secureTextEntry={true}
                                />
                            </View>
                            <View style={[MainStyles.FlexDirectionRow, MainStyles.mt5]}>
                                <TouchableOpacity
                                    activeOpacity={1}
                                    style={[MainStyles.Flex, MainStyles.AlignItemsFlexEnd ]}
                                    onPress={() => this.onForGotpass()}
                                    // onPress={() => this.props.navigation.navigate('SignInForGotPass')}
                                > 
                                    <Text allowFontScaling={false} style={[MainStyles.text14, MainStyles.textOrange]}>ลืมรหัสผ่าน?</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={[MainStyles.btnContent]}>
                                <TouchableOpacity
                                    activeOpacity={1}
                                    onPress={() => this.onSubmitLogin()}
                                    style={this.state.btnSubmit ? MainStyles.btnDisabled : MainStyles.btnOrange}
                                > 
                                    <Text allowFontScaling={false} style={MainStyles.btnOrangeText}>เข้าสู่ระบบ</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={[MainStyles.btnContent]}>
                                <TouchableOpacity
                                    activeOpacity={1}
                                    onPress={() => this.onLoginFacebook()}
                                    style={[MainStyles.btnBlue, MainStyles.mb5]}
                                > 
                                    <Text allowFontScaling={false} style={MainStyles.btnBlueText}>ล็อกอินด้วย Facebook</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    activeOpacity={1}
                                    onPress={()=> this.onLoginGoogle()}
                                    style={[MainStyles.btnRed, MainStyles.mb5]}
                                > 
                                    <Text allowFontScaling={false} style={MainStyles.btnRedText}>ล็อกอินด้วย Google</Text>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                        <View style={[MainStyles.btnContent]}>
                            <TouchableOpacity
                                activeOpacity={1}
                                onPress={() => this.onSignin()}
                                style={[MainStyles.btnOrange]}
                            > 
                                <Text allowFontScaling={false} style={MainStyles.btnOrangeText}>สมัครสมาชิก</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    }
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
        paddingTop: 60,
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
    },
    contentProfileIcon: {
        width: 100,
        height: 100,
        borderRadius: 50
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
    contentBtnSmall:{
        flex: 1,
        alignItems: 'flex-end',
    }
});