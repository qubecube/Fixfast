
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

export default class ChangePassword extends Component {

    state = {
        loading: true,
        isCheckAlert: null,
        UserId: "",
        Password: "",
        NewPassword: "",
        ConfirmNewPassword: "",
    }

    componentDidMount(){
        this.onGetProfile()
    }

    async onGetProfile(){
        const isProfile = await AsyncStorage.getItem('isProfile');
        var isProfileDecrypt = JSON.parse(isProfile);
        console.log("isProfileDecrypt", isProfileDecrypt)
        this.setState({
            isProfile: isProfileDecrypt,
            UserId: isProfileDecrypt.UserId,
            loading: false,
        })
    }

    handleChange(event, name){
        var value = event.nativeEvent.text;
        if(name == "Password"){
            this.setState({ Password: value })
        } else if(name == "NewPassword"){
            this.setState({ NewPassword: value })
        } else if(name == "ConfirmNewPassword"){
            this.setState({ ConfirmNewPassword: value })
        }
    }

    validateForm(){
        let formIsValid = true;
        const { Password, NewPassword, ConfirmNewPassword } = this.state
        if (Password === ""){
            this.onOpenAlert("Err","กรอกรหัสผ่าน")
            formIsValid = false;
        } else if (NewPassword === ""){
            this.onOpenAlert("Err","กรอกรหัสผ่านใหม่")
            formIsValid = false;
        } else if(ConfirmNewPassword === "" || ConfirmNewPassword !== NewPassword){
            this.onOpenAlert("Err","รหัสผ่านไม่ตรงกัน")
            formIsValid = false;
        }
        return formIsValid;
    }

    onSubmit(){
        if(this.validateForm()){
            this.setState({ loading: true })
            const { UserId, Password, NewPassword } = this.state
            var formData = new FormData();
            formData.append('UserId' , UserId)
            formData.append('Password' , Password)
            formData.append('NewPassword' , NewPassword)
            userAction.ChangePassword(formData).then(e => {
                console.log("ChangePassword", e)
                if(e.IsSuccess === true){
                    this.onEditProfileSuccess()
                } else {
                    this.onOpenAlert("Err","รหัสผ่านไม่ถูกต้อง")
                }
            });
        }
    }

    onEditProfileSuccess(){
        alert = (<ModalLib isVisible={true}>
            <View style={ModalStyles.ModalContent}>
                <Text allowFontScaling={false} style={ModalStyles.ModalTitle}>แจ้งเตือน</Text>
                <Text allowFontScaling={false} style={ModalStyles.ModalSubTitle}>เปลี่ยนรหัสผ่านเรียบร้อย</Text>
                <View style={ModalStyles.contentButton}>
                    <TouchableOpacity
                        activeOpacity={1}
                        style={ModalStyles.btnOne}
                        onPress={() => this.onNextToScreen()}
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

    async onNextToScreen(){
        this.setState({ 
            isCheckAlert: null,
            loading: false,
        })
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
                <View style={styles.bannerTitleContent}>
                    <Text allowFontScaling={false} style={styles.bannerTitle}>
                        เปลี่ยนรหัสผ่าน
                    </Text>
                </View>
                <SafeAreaView style={styles.contentHome} forceInset={{ bottom: 'always', top : 'never'}}> 
                    <View style={[MainStyles.content]}>
                        <ScrollView style={styles.scrollView} contentContainerStyle={{ height: 1000, flex:1 , flexGrow: 1}} showsVerticalScrollIndicator={false}>
                            <View style={InputStyles.contentInputForm}>
                                <Text allowFontScaling={false} style={InputStyles.inputFormTextLight}>รหัสผ่านปัจจุบัน <Text allowFontScaling={false} style={InputStyles.inputFormTextRed}>*</Text></Text>
                                <TextInput
                                    clearButtonMode="always" 
                                    allowFontScaling={false}
                                    style={InputStyles.inputForm}
                                    placeholder="กรอกรหัสผ่านปัจจุบัน"
                                    placeholderTextColor={"#838383"}
                                    value={this.state.Password}
                                    onChange={e => this.handleChange(e,'Password')}
                                    secureTextEntry={true}
                                />
                            </View>
                            <View style={InputStyles.contentInputForm}>
                                <Text allowFontScaling={false} style={InputStyles.inputFormTextLight}>รหัสผ่านใหม่ <Text allowFontScaling={false} style={InputStyles.inputFormTextRed}>*</Text></Text>
                                <TextInput
                                    clearButtonMode="always" 
                                    allowFontScaling={false}
                                    style={InputStyles.inputForm}
                                    placeholder="กรอกรหัสผ่านใหม่"
                                    placeholderTextColor={"#838383"}
                                    value={this.state.NewPassword}
                                    onChange={e => this.handleChange(e,'NewPassword')}
                                    secureTextEntry={true}
                                />
                            </View>
                            <View style={InputStyles.contentInputForm}>
                                <Text allowFontScaling={false} style={InputStyles.inputFormTextLight}>ยืนยันรหัสผ่านใหม่ <Text allowFontScaling={false} style={InputStyles.inputFormTextRed}>*</Text></Text>
                                <TextInput
                                    clearButtonMode="always" 
                                    allowFontScaling={false}
                                    style={InputStyles.inputForm}
                                    placeholder="กรอกยืนยันรหัสผ่านใหม่"
                                    placeholderTextColor={"#838383"}
                                    value={this.state.ConfirmNewPassword}
                                    onChange={e => this.handleChange(e,'ConfirmNewPassword')}
                                    secureTextEntry={true}
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
                                <Text allowFontScaling={false} style={MainStyles.btnOrangeText}>ยืนยัน</Text>
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