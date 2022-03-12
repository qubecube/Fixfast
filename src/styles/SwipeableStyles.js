import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    FlexDirectionRow: {
        flexDirection: 'row',
        marginLeft: -20,
    },
    contentCardDelete:{
        marginBottom: 15,
        marginRight: 6,
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10,
        backgroundColor: '#e81500',
        padding: 25,
        justifyContent: 'center'
    },
    contentCardEdit:{
        marginBottom: 15,
        paddingLeft: 35,
        backgroundColor: '#37c825',
        paddingTop: 20,
        paddingBottom: 20,
        paddingRight: 20,
        justifyContent: 'center'
    },
    contentCardDeleteText:{
        fontSize: 12, 
        color: '#fff',
        fontFamily: 'DBAdmanX',
        textAlign: 'center'
    },


    contentOnlyCardDelete:{
        marginTop: 10,
        marginRight: 6,
        paddingLeft: 20,
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10,
        backgroundColor: '#e81500',
    },
    contentOnlyCardEdit:{
        marginTop: 10,
        marginRight: 6,
        paddingLeft: 20,
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10,
        backgroundColor: '#00A4E4',
    },
});
