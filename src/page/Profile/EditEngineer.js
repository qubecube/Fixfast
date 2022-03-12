
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
import ImagePicker from 'react-native-image-picker';
import GetLocation from 'react-native-get-location';
const win = Dimensions.get('window');

export default class EditEngineer extends Component {

    state = {
        loading: false,
        isCheckAlert: null,
        EngineerId: "",
        UserId: "",
        WorkName: "Test",
        WorkDes: "TestTestTestTest",
        WorkPrice: "100",
        WorkTime: "2 วัน",
        WorkLat: "",
        WorkLong: "",
        getPhoto: false,
        getImagePhoto: "",

        GetEngineer: {},
    }

    componentDidMount(){
        this.onGetProfile()
    }

    async onGetProfile(){
        const isProfile = await AsyncStorage.getItem('isProfile');
        var isProfileDecrypt = JSON.parse(isProfile);
        this.setState({
            isProfile: isProfileDecrypt,
            UserId: isProfileDecrypt.UserId,
        })
        this.onGetEngineer(isProfileDecrypt.UserId)
    }

    onGetEngineer(UserId){
        var formData = new FormData();
        formData.append('UserId' , UserId)
        userAction.GetEngineer(formData).then(e => {
            console.log("GetEngineer", e)
            if(e.IsSuccess === true){
                var res = e.Data
                this.setState({
                    GetEngineer: res,
                    EngineerId: res.EngineerId,
                    WorkName: res.WorkName,
                    WorkDes: res.WorkDes,
                    WorkPrice: res.WorkPrice,
                    WorkTime: res.WorkTime,
                    WorkLat: res.WorkLat,
                    WorkLong: res.WorkLong,
                    getImagePhoto: res.WorkImage,
                })
                this.onGetLatLong()
            } else {
                this.onOpenAlert("Err","เกิดข้อผิดพลาด")
            }
        });
    }

    onGetLatLong(){
        GetLocation.getCurrentPosition({
            enableHighAccuracy: true,
            timeout: 15000,
        }).then(location => {
            this.setState({
                WorkLat: location.latitude,
                WorkLong: location.longitude,
                loading: false,
            })
        }).catch(error => {
            this.setState({
                WorkLat: "",
                WorkLong: "",
                loading: false,
            })
        })
    }

    handleChange(event, name){
        var value = event.nativeEvent.text;
        if(name == "WorkName"){
            this.setState({ WorkName: value })
        } else if(name == "WorkDes"){
            this.setState({ WorkDes: value })
        } else if(name == "WorkPrice"){
            this.setState({ WorkPrice: value })
        } else if(name == "WorkTime"){
            this.setState({ WorkTime: value })
        }
    }

    validateForm(){
        let formIsValid = true;
        const { WorkName, WorkDes, WorkPrice, WorkTime, getPhoto } = this.state
        if (WorkName === ""){
            this.onOpenAlert("Err","กรอกชื่องาน")
            formIsValid = false;
        } else if (WorkDes === ""){
            this.onOpenAlert("Err","กรอกรายละเอียดงาน")
            formIsValid = false;
        } else if (WorkPrice === ""){
            this.onOpenAlert("Err","กรอกราคา")
            formIsValid = false;
        } else if (WorkTime === ""){
            this.onOpenAlert("Err","กรอกระยะเวลาทำงาน")
            formIsValid = false;
        }
        // } else if (getPhoto === false){
        //     this.onOpenAlert("Err","อัพโหลดรูปภาพ")
        //     formIsValid = false;
        // }
        return formIsValid;
    }

    onSubmit(){
        if(this.validateForm()){
            this.setState({ loading: true })
            const { EngineerId, WorkName, WorkDes, WorkPrice, WorkTime, getImagePhoto, WorkLat, WorkLong } = this.state
            var formData = new FormData();
            formData.append('EngineerId' , EngineerId)
            formData.append('WorkName' , WorkName)
            formData.append('WorkDes' , WorkDes)
            formData.append('WorkPrice' , WorkPrice)
            formData.append('WorkTime' , WorkTime)
            formData.append('WorkImage' , getImagePhoto)
            formData.append('WorkLat' , WorkLat)
            formData.append('WorkLong' , WorkLong)
            userAction.EditEngineer(formData).then(e => {
                console.log("EditEngineer", e)
                if(e.IsSuccess === true){
                    this.onEditEngineerSuccess()
                } else {
                    this.onOpenAlert("Err","แกไขข้อมูลไม่สำเร็จแล้ว")
                }
            });
        }
    }

    onEditEngineerSuccess(){
        alert = (<ModalLib isVisible={true}>
            <View style={ModalStyles.ModalContent}>
                <Text allowFontScaling={false} style={ModalStyles.ModalTitle}>แจ้งเตือน</Text>
                <Text allowFontScaling={false} style={ModalStyles.ModalSubTitle}>แกไขข้อมูลสำเร็จแล้ว</Text>
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



    handleChoosePhoto(){
        const { lang } = this.state
        const options = {
            storageOptions: {
                skipBackup: true,
                path: 'images',
                maxWidth: 250, 
                maxHeight: 250, 
                AccountImage: "",
                dataProfile: "",
            },
            title: lang == "th" ? 'เลือก' : 'Select a Photo',
            takePhotoButtonTitle: lang == "th" ? "ถ่ายรูปภาพ" : "Take Photo",
            chooseFromLibraryButtonTitle: lang == "th" ? "เลือกจากคลังภาพ" : "Choose from Library",
            cancelButtonTitle: lang == "th" ? 'ยกเลิก' : 'Cancel',
        };
        ImagePicker.showImagePicker(options, (response) => {
            console.log("showImagePicker", response)
            if (response.didCancel) {
                if(this.state.getImagePhoto == ""){
                    this.setState({
                        getImagePhoto: "",
                        getPhoto: false,
                        checkHaveAddImage: false
                    });
                }
            } else {
                this.setState({
                    getImagePhoto: response.uri,
                    getPhoto: true,
                    checkHaveAddImage: true
                });
                // this.onResizeImage(response.uri)
            }
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
                        สมัครเป็นช่าง
                    </Text>
                </View>
                <SafeAreaView style={styles.contentHome} forceInset={{ bottom: 'always', top : 'never'}}> 
                    <View style={[MainStyles.content]}>
                        <ScrollView style={styles.scrollView} contentContainerStyle={{ height: 1000, flex:1 , flexGrow: 1}} showsVerticalScrollIndicator={false}>
                            <View style={InputStyles.contentInputForm}>
                                <Text allowFontScaling={false} style={InputStyles.inputFormTextLight}>ชื่องาน <Text allowFontScaling={false} style={InputStyles.inputFormTextRed}>*</Text></Text>
                                <TextInput
                                    clearButtonMode="always" 
                                    allowFontScaling={false}
                                    style={InputStyles.inputForm}
                                    placeholder="กรอกชื่องาน"
                                    placeholderTextColor={"#838383"}
                                    value={this.state.WorkName}
                                    onChange={e => this.handleChange(e,'WorkName')}
                                />
                            </View>
                            <View style={InputStyles.contentInputForm}>
                                <Text allowFontScaling={false} style={InputStyles.inputFormTextLight}>รายละเอียดงาน <Text allowFontScaling={false} style={InputStyles.inputFormTextRed}>*</Text></Text>
                                <TextInput
                                    numberOfLines={10}
                                    multiline={true}
                                    clearButtonMode="always" 
                                    allowFontScaling={false}
                                    style={InputStyles.inputFormArea}
                                    placeholder="กรอกรายละเอียดงาน"
                                    placeholderTextColor={"#838383"}
                                    value={this.state.WorkDes}
                                    onChange={e => this.handleChange(e,'WorkDes')}
                                />
                            </View>
                            <View style={InputStyles.contentInputForm}>
                                <Text allowFontScaling={false} style={InputStyles.inputFormTextLight}>ราคา <Text allowFontScaling={false} style={InputStyles.inputFormTextRed}>*</Text></Text>
                                <TextInput
                                    clearButtonMode="always" 
                                    allowFontScaling={false}
                                    style={InputStyles.inputForm}
                                    placeholder="กรอกราคา"
                                    placeholderTextColor={"#838383"}
                                    value={this.state.WorkPrice}
                                    onChange={e => this.handleChange(e,'WorkPrice')}
                                />
                            </View>
                            <View style={InputStyles.contentInputForm}>
                                <Text allowFontScaling={false} style={InputStyles.inputFormTextLight}>ระยะเวลาทำงาน <Text allowFontScaling={false} style={InputStyles.inputFormTextRed}>*</Text></Text>
                                <TextInput
                                    maxLength={10}
                                    keyboardType="phone-pad"
                                    clearButtonMode="always" 
                                    allowFontScaling={false}
                                    style={InputStyles.inputForm}
                                    placeholder="กรอกระยะเวลาทำงาน"
                                    placeholderTextColor={"#838383"}
                                    value={this.state.WorkTime}
                                    onChange={e => this.handleChange(e,'WorkTime')}
                                />
                            </View>
                            <View style={InputStyles.contentInputForm}>
                                <Text allowFontScaling={false} style={InputStyles.inputFormTextLight}>รูปภาพ <Text allowFontScaling={false} style={InputStyles.inputFormTextRed}>*</Text></Text>
                                <View style={styles.cardAddBookBank}>
                                    <TouchableOpacity 
                                        activeOpacity={1}
                                        onPress={() => this.handleChoosePhoto()}
                                    >
                                        <Image
                                            resizeMode={'contain'}
                                            style={{  
                                                height: 400,
                                                width: '100%',
                                            }}
                                            source={this.state.getPhoto ? { uri : this.state.getImagePhoto } : ""}
                                        />
                                    </TouchableOpacity>
                                </View>
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

   
    cardAddBookBank:{
        flexDirection: 'column',
        marginBottom: 10,
    },
    AddBookBank:{
        flexDirection: 'row',
        flex: 1,
        marginTop: 10,
        borderStyle: 'dashed',
        borderWidth: 1,
        borderColor:"#c3c3c3",
        borderRadius: 10,
        width: '50%',
        paddingBottom: 80,
        paddingTop: 50,
        justifyContent: 'center'
        
    },
    AddBookBankTitle:{
        fontSize: 20, 
        fontFamily: 'Prompt-Regular',
        textAlign: 'center',
        color: '#ff8c00'
    },
});