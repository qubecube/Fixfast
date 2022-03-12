
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
const win = Dimensions.get('window');

export default class Signin extends Component {

    state = {
        loading: false,
        isCheckAlert: null,
        Fullname: "Nuttayapon",
        Email: "mint@gmail.com",
        Password: "111111",
        ConfirmPassword: "111111",
        dataInScreen: "",
    }

    componentDidMount(){
        // var dataInScreen = this.props.route.params.dataInScreen;
        // console.log("dataInScreen",dataInScreen)
        // this.setState({ 
        //     dataInScreen: dataInScreen,
        // })
    }

    handleChange(event, name){
        var value = event.nativeEvent.text;
        if(name == "Fullname"){
            this.setState({ Fullname: value })
        } else if(name == "Email"){
            this.setState({ Email: value })
        } else if(name == "Password"){
            this.setState({ Password: value })
        } else if(name == "ConfirmPassword"){
            this.setState({ ConfirmPassword: value })
        }
    }

    validateForm(){
        let formIsValid = true;
        const { Fullname, Email, Password, ConfirmPassword } = this.state
        if (Fullname === ""){
            this.onOpenAlert("Err","กรอกชื่อนามสกุล")
            formIsValid = false;
        } else if (Email === ""){
            this.onOpenAlert("Err","กรอกอีเมล")
            formIsValid = false;
        } else if (Password === ""){
            this.onOpenAlert("Err","กรอกรหัสผ่าน")
            formIsValid = false;
        } else if(ConfirmPassword === "" || ConfirmPassword !== Password){
            this.onOpenAlert("Err","รหัสผ่านไม่ตรงกัน")
            formIsValid = false;
        }
        return formIsValid;
    }

    onSubmit(){
        if(this.validateForm()){
            this.setState({ loading: true })
            const { Fullname, Email, Password } = this.state
            var formData = new FormData();
            formData.append('Fullname' , Fullname)
            formData.append('Email' , Email)
            formData.append('Password' , Password)
            formData.append('Type' , "Customer")
            userAction.Signin(formData).then(e => {
                console.log("Signin", e)
                if(e.IsSuccess === true){
                    this.onLoginSuccess(e.Data)
                } else {
                    this.onOpenAlert("Err","สมัครสมาชิกไม่สำเร็จ")
                }
            });
        }
    }

    onLoginSuccess(Data){
        alert = (<ModalLib isVisible={true}>
            <View style={ModalStyles.ModalContent}>
                <Text allowFontScaling={false} style={ModalStyles.ModalTitle}>แจ้งเตือน</Text>
                <Text allowFontScaling={false} style={ModalStyles.ModalSubTitle}>สมัครสมาชิกสำเร็จ</Text>
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
        const { isCheckAlert } = this.state
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
                    <Image
                        resizeMode={'contain'}
                        style={styles.contentProfileIcon}
                        source={require('../../../assets/icon/user.png')}
                    />
                </View>
                <SafeAreaView style={styles.contentHome} forceInset={{ bottom: 'always', top : 'never'}}> 
                    <View style={[MainStyles.content]}>
                        <ScrollView style={styles.scrollView} contentContainerStyle={{ height: 1000, flex:1 , flexGrow: 1}} showsVerticalScrollIndicator={false}>
                            <Text allowFontScaling={false} style={[MainStyles.Text18, MainStyles.textOrangeBd, MainStyles.textAlignCenter]}>
                            สมัครสมาชิก
                            </Text>
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
                            <View style={InputStyles.contentInputForm}>
                                <Text allowFontScaling={false} style={InputStyles.inputFormTextLight}>ยืนยันรหัสผ่าน <Text allowFontScaling={false} style={InputStyles.inputFormTextRed}>*</Text></Text>
                                <TextInput
                                    clearButtonMode="always" 
                                    allowFontScaling={false}
                                    style={InputStyles.inputForm}
                                    placeholder="กรอกรหัสผ่าน"
                                    placeholderTextColor={"#838383"}
                                    value={this.state.ConfirmPassword}
                                    onChange={e => this.handleChange(e,'ConfirmPassword')}
                                    secureTextEntry={true}
                                />
                            </View>
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
    },
    contentProfileIcon: {
        width: 100,
        height: 100
    },
});