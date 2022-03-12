import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    ModalContent:{
        paddingTop: 30,
        paddingBottom: 20,
        paddingLeft: 20,
        paddingRight: 20,
        backgroundColor: '#fff', 
        borderRadius: 7,
    },
    ModalContent2:{
        paddingTop: 20,
        paddingBottom: 20,
        paddingLeft: 20,
        paddingRight: 20,
        backgroundColor: '#fff', 
        borderRadius: 7,
    },
    ModalContent3:{
        height: 400,
        paddingTop: 20,
        paddingBottom: 20,
        paddingLeft: 20,
        paddingRight: 20,
        backgroundColor: '#fff', 
        borderRadius: 7,
    },
    ModalContentNoPaddingVer:{
        paddingTop: 30,
        paddingBottom: 20,
        backgroundColor: '#fff', 
        borderRadius: 7,
    },
    ModalTitle:{
        fontSize: 20, 
        color: '#ff8c00',
        fontFamily: 'Prompt-Bold',
        // fontWeight: '500',
        textAlign: 'center',
    },
    ModalTitleLeft:{
        fontSize: 20, 
        color: '#ff8c00',
        fontFamily: 'Prompt-Bold',
        // fontWeight: '500',
        textAlign: 'left',
    },
    ModalTitleSm:{
        fontSize: 18, 
        color: '#ff8c00',
        fontFamily: 'Prompt-Bold',
        // fontWeight: '500',
        textAlign: 'center',
    },
    ModalSubTitle:{
        fontSize: 16, 
        color: '#333333',
        fontFamily: 'Prompt-Regular',
        textAlign: 'center',
        marginTop: 20,
        marginBottom: 30,
    },
    ModalSubTitle2: {
        fontSize: 16, 
        color: '#333333',
        fontFamily: 'Prompt-Regular',
        textAlign: 'center',
        marginTop: 20,
        marginBottom: 30,
    },
    ModalSubTitle1:{
        fontSize: 16, 
        color: '#333333',
        fontFamily: 'Prompt-Regular',
        textAlign: 'center',
        marginTop: 20,
    },
    ModalSubTitle2:{
        fontSize: 16, 
        color: '#333333',
        fontFamily: 'Prompt-Regular',
        textAlign: 'center',
        marginTop: 10,
        marginBottom: 15,
    },
    ModalSubTitle3:{
        fontSize: 16, 
        color: '#333333',
        fontFamily: 'Prompt-Regular',
        marginTop: 20,
        marginBottom: 10,
    },
    ModalSubTitleBig:{
        fontSize: 18, 
        color: '#333333',
        fontFamily: 'Prompt-Regular',
        textAlign: 'center',
        marginTop: 20,
        marginBottom: 30,
    },
    content2Button: {
        width: '100%',
        flexDirection: "row",
    },
    contentButton: {
        flexDirection: "row",
    },
    contentButtonTwoRow: {
        marginTop : 10,
    },
    btnOne: {
        width: '100%',
        backgroundColor: '#ff8c00',
        borderRadius: 40,
        padding: 7,
    },
    btnOneWhite: {
        width: '100%',
        backgroundColor: '#ffffff',
        borderRadius: 40,
        padding: 7,
        borderWidth: 1,
        borderColor: '#ff8c00',
    },
    btnOneDisable: {
        width: '100%',
        backgroundColor: '#8e8e8e',
        borderRadius: 40,
        opacity: 0.4,
        padding: 7,
    },
    btnOneText: {
        fontSize: 16, 
        color: '#ffffff',
        fontFamily: 'Prompt-Bold',
        textAlign: 'center',
    },
    btnOneTextbtnWhite: {
        fontSize: 16, 
        color: '#ff8c00',
        fontFamily: 'Prompt-Bold',
        textAlign: 'center',
    },
    btnLeft: {
        borderWidth: 1,
        width: '48%',
        backgroundColor: '#fff',
        borderRadius: 40,
        borderColor: '#ff8c00',
        padding: 7,
    },
    btnLeftText: {
        fontSize: 16, 
        color: '#ff8c00',
        fontFamily: 'Prompt-Bold',
        textAlign: 'center',
        // fontWeight: '500',
    },
    btnLeftGray: {
        borderWidth: 1,
        width: '48%',
        backgroundColor: '#bfbfbf',
        borderRadius: 40,
        borderColor: '#bfbfbf',
        padding: 7,
    },
    btnLeftGrayText: {
        fontSize: 16, 
        color: '#ffffff',
        fontFamily: 'Prompt-Bold',
        textAlign: 'center',
        // fontWeight: '500',
    },
    btnRight: {
        width: '48%',
        backgroundColor: '#ff8c00',
        borderRadius: 40,
        padding: 7,
        marginLeft: '4%'
    },
    btnRightText: {
        fontSize: 16, 
        color: '#fff',
        fontFamily: 'Prompt-Bold',
        textAlign: 'center',
        // fontWeight: '500',
    },
    ModalContentClose:{
        position: 'absolute', 
        right: 10, 
        top: 10,
    },
    ModalContentCloseLg:{
        position: 'absolute', 
        right: 10, 
        top: -15,
    },
    ModalContentCloseIconSmall:{
        width: 25, 
        height: 25
    },
    ModalContentCloseIcon:{
        width: 30, 
        height: 30
    },
    ModalTextRow:{
        flexDirection: 'row',
    },
    ModalTextRowLeft:{
        fontSize: 16, 
        color: '#333333',
        fontFamily: 'Prompt-Regular',
    },
    ModalTextRowRight:{
        flex: 1, 
        textAlign: 'right',
        fontSize: 16, 
        fontFamily: 'Prompt-Regular',
        color: '#333333',
    },
    ModalTextRowRightGreen:{
        flex: 1, 
        textAlign: 'right',
        fontSize: 16, 
        fontFamily: 'Prompt-Regular',
        color: '#79c32d',
    },
    ModalTextRowRightRed:{
        flex: 1, 
        textAlign: 'right',
        fontSize: 16, 
        fontFamily: 'Prompt-Regular',
        color: '#c3414c',
    },
    ModalTextRightGreen:{
        textAlign: 'right',
        fontSize: 16, 
        fontFamily: 'Prompt-Regular',
        color: '#79c32d',
    },
    ModalTextRightRed:{
        textAlign: 'right',
        fontSize: 16, 
        fontFamily: 'Prompt-Regular',
        color: '#c3414c',
    },
    ModalTextGreenMD:{
        fontSize: 18, 
        color: '#ff8c00',
        fontFamily: 'Prompt-Bold',
        // fontWeight: '500',
    },
    ModalRemarkRed:{
        fontSize: 12, 
        color: '#c3414c',
        fontFamily: 'Prompt-Regular',
    },
    ModalTextDark:{
        fontSize: 16, 
        fontFamily: 'Prompt-Bold',
        // fontWeight: '500',
        color: '#333333',
    },
    ModalTextGrayCenter:{
        margin: 20,
        fontSize: 16, 
        color: '#333333',
        fontFamily: 'Prompt-Regular',
        textAlign: 'center',
    },
    ModalTextGray:{
        margin: 10,
        fontSize: 16, 
        color: '#333333',
        fontFamily: 'Prompt-Regular',
    },

    ModalListContentCheck: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    ModalListContentCheckActive:{
        height: 23,
        width: 23,
        borderRadius: 50,
        borderWidth: 1,
        borderColor: '#ff8c00',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 15,
    },
    ModalListContentCheckInsideActive:{
        height: 15,
        width: 15,
        borderRadius: 50,
        backgroundColor: '#ff8c00'
    },
    ModalListContentCheckNon:{
        height: 23,
        width: 23,
        backgroundColor: '#fff',
        borderRadius: 50,
        borderWidth: 1,
        borderColor: '#c3c3c3',
        marginRight: 15,
    },

    ModalSelect:{
        paddingTop: 30,
        paddingBottom: 20,
        backgroundColor: '#fff', 
        borderRadius: 7,
    },
});