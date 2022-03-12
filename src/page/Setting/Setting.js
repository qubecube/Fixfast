
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
export default class Settingd extends Component {

    state = {
        loading: true,
        isCheckAlert: null,
        GetContactus: {},
    }

    componentDidMount(){
        this.onContactus()
    }

    onContactus(){
        userAction.Contactus().then(e => {
            console.log("Contactus", e)
            if(e.IsSuccess === true){
                var res = e.Data
                this.setState({
                    GetContactus: res[0],
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


    onOpenLink(e){
        if(e == "fb"){
            Linking.openURL("https://web.facebook.com/Fixfastthailand");
        } else if(e == "line"){
            Linking.openURL('')
        } 
    }

    render() {
        const { isCheckAlert, GetContactus } = this.state
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
                        ตั้งค่า
                    </Text>
                </View>
                <SafeAreaView style={styles.contentHome} forceInset={{ bottom: 'always', top : 'never'}}> 
                    <View style={[MainStyles.content]}>
                        <ScrollView style={styles.scrollView} contentContainerStyle={{ height: 1000, flex:1 , flexGrow: 1}} showsVerticalScrollIndicator={false}>
                            <Text allowFontScaling={false} style={[MainStyles.Text18, MainStyles.textOrangeBd]}>
                                เกี่ยวกับแอพ
                            </Text>
                            <View style={styles.ListContent}>
                                <TouchableOpacity
                                    activeOpacity={1}
                                    onPress={() => this.props.navigation.navigate('Notification')}
                                >
                                    <View style={styles.List}>
                                        <View style={styles.ListContentIcon}>
                                            <Text allowFontScaling={false} style={[styles.ListText, MainStyles.textGray]}>เวอร์ชั่น</Text>
                                        </View>
                                        <View style={styles.ListContentArrowVersion}>
                                            <Text allowFontScaling={false} style={[styles.ListText, MainStyles.textGray, MainStyles.rightText]}>1.0 (1)</Text>
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
                                            <Text allowFontScaling={false} style={[styles.ListText, MainStyles.TextDarkGray]}>ข้อตกลงและเงื่อนไข</Text>
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
                            </View>
                            <Text allowFontScaling={false} style={[MainStyles.Text18, MainStyles.textOrangeBd]}>
                                ติดต่อเรา
                            </Text>
                            <View style={styles.ListContent}>
                                <TouchableOpacity
                                    activeOpacity={1}
                                >
                                    <View style={styles.List}>
                                        <View style={styles.ListContentIcon}>
                                            <Text allowFontScaling={false} style={[styles.ListText, MainStyles.textGray]}>หมายเลขโทรศัพท์</Text>
                                        </View>
                                        <View style={styles.ListContentArrowVersion}>
                                            <Text allowFontScaling={false} style={[styles.ListText, MainStyles.textGray, MainStyles.rightText]}>{GetContactus.ContactPhone}</Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                                <View  style={styles.ListLine}></View>
                                <TouchableOpacity
                                    activeOpacity={1}
                                >
                                    <View style={styles.List}>
                                        <View style={styles.ListContentIcon}>
                                            <Text allowFontScaling={false} style={[styles.ListText, MainStyles.TextDarkGray]}>อีเมล</Text>
                                        </View>
                                        <View style={styles.ListContentArrowVersion}>
                                            <Text allowFontScaling={false} style={[styles.ListText, MainStyles.textGray, MainStyles.rightText]}>{GetContactus.ContactEmail}</Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                                <View  style={styles.ListLine}></View>
                                <TouchableOpacity
                                    activeOpacity={1}
                                    onPress={() => this.onOpenLink("fb")}
                                >
                                    <View style={styles.List}>
                                        <View style={styles.ListContentIcon}>
                                            <Text allowFontScaling={false} style={[styles.ListText, MainStyles.TextDarkGray]}>Facebook</Text>
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
                                    onPress={() => this.onOpenLink("line")}
                                >
                                    <View style={styles.List}>
                                        <View style={styles.ListContentIcon}>
                                            <Text allowFontScaling={false} style={[styles.ListText, MainStyles.TextDarkGray]}>Line</Text>
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
        width: '50%',
        flexDirection: 'row',
    },
    ListContentArrowVersion: {
        width: '50%',
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
});