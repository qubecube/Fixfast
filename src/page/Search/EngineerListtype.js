
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

export default class EngineerListtype extends Component {

    state = {
        loading: true,
        isCheckAlert: null,
        isLogin: false,
        GetEngineerListtype: [],
        GetEngineerListtypeData: true,
        dataInScreen: {},
    }


    componentDidMount(){
        var dataInScreen = this.props.route.params.dataInScreen;
        this.setState({ 
            dataInScreen: dataInScreen,
        })
        this.onGetEngineerListtype(dataInScreen)
    }

    onGetEngineerListtype(dataInScreen){
        var formData = new FormData();
        formData.append('EngineerTypeId' , dataInScreen.EngineerTypeId)
        userAction.GetEngineerListtype(formData).then(e => {
            console.log("GetEngineerListtype", e)
            if(e.IsSuccess === true){
                var res = e.Data
                this.setState({
                    GetEngineerListtype: res,
                    GetEngineerListtypeData: res.length === 0 ? false : true,
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

    onGetEngineerById(EngineerId){
        var setdataInScreen = {
            "EngineerId": EngineerId,
        }
        this.props.navigation.navigate('ProfileEngineer',{
            dataInScreen: setdataInScreen
        });
    }

    render() {
        const { isCheckAlert, GetEngineerListtype, GetEngineerListtypeData, dataInScreen } = this.state
        var GetEngineerListtypeCards = [];
        GetEngineerListtype.map((key,index) => {
            GetEngineerListtypeCards.push(
                <View style={[MainStyles.cardFull]}>
                    <TouchableOpacity 
                        activeOpacity={1}
                        style={Platform.OS === 'android' ? MainStyles.cardHomeContentAndriod : MainStyles.cardHomeContent}
                        onPress={() => this.onGetEngineerById(GetEngineerListtype[index].EngineerId)}
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
                                {GetEngineerListtype[index].WorkRating}
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
                                    {GetEngineerListtype[index].WorkName}
                                </Text>
                            </View>
                            <Text allowFontScaling={false} numberOfLines={2} style={[MainStyles.Text12, MainStyles.textGray]}>
                                {GetEngineerListtype[index].WorkDes}
                            </Text>
                            <View style={{ flexDirection: 'row', marginTop: 10 }}>
                                <Text allowFontScaling={false} style={MainStyles.newsCardTitletextLeft}>
                                    {GetEngineerListtype[index].WorkDistance} กม.
                                </Text>
                                <Text allowFontScaling={false} style={MainStyles.newsCardTitletextRight}>
                                    ฿{GetEngineerListtype[index].WorkPrice}
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
                        {dataInScreen.EngineerTypeName}
                    </Text>
                </View>
                <SafeAreaView style={styles.contentHome} forceInset={{ bottom: 'always', top : 'never'}}> 
                    <View style={[MainStyles.content]}>
                        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                            <View style={{ flexDirection: 'column', flex: 1 }}>
                                {GetEngineerListtypeData ? GetEngineerListtypeCards 
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