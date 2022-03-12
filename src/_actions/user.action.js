import { Base_API } from "../_constants/matcher";
import axios from "axios";
import { getDistance, geolib } from 'geolib';

export const userAction = {
    onGetEngineerNearCal,
    Signin,
    Login,
    EditProfile,
    ChangePassword,
    RegisterEngineer,
    GetProfile,
    GetEngineer,
    EditEngineer,
    GetEngineerAll,
    GetEngineerById,
    GetEngineerType,
    GetEngineerListtype,
    Contactus
};


function onGetEngineerNearCal(latStart, longStart, latEnd, longEnd){
    var GetEngineerNear = getDistance(
        { latitude: latStart, longitude: longStart },
        { latitude: latEnd, longitude: longEnd },
    );
    var convertDistance = GetEngineerNear / 1000
    var resDistance = convertDistance.toFixed(2);
    return resDistance;
}

function Signin(data) {
    return axios.post(`${Base_API.Api}/Signin`, data).then(res => {
        return res.data;
    }) .catch(e => {
        return "ErrorApi";
    });
}

function Login(data) {
    return axios.post(`${Base_API.Api}/Login`, data).then(res => {
        return res.data;
    }) .catch(e => {
        return "ErrorApi";
    });
}

function EditProfile(data) {
    return axios.post(`${Base_API.Api}/EditProfile`, data).then(res => {
        return res.data;
    }) .catch(e => {
        return "ErrorApi";
    });
}

function ChangePassword(data) {
    return axios.post(`${Base_API.Api}/ChangePassword`, data).then(res => {
        return res.data;
    }) .catch(e => {
        return "ErrorApi";
    });
}

function RegisterEngineer(data) {
    return axios.post(`${Base_API.Api}/RegisterEngineer`, data).then(res => {
        return res.data;
    }) .catch(e => {
        return "ErrorApi";
    });
}

function GetProfile(data) {
    return axios.post(`${Base_API.Api}/GetProfile`, data).then(res => {
        return res.data;
    }) .catch(e => {
        return "ErrorApi";
    });
}

function GetEngineer(data) {
    return axios.post(`${Base_API.Api}/GetEngineer`, data).then(res => {
        return res.data;
    }) .catch(e => {
        return "ErrorApi";
    });
}

function EditEngineer(data) {
    return axios.post(`${Base_API.Api}/EditEngineer`, data).then(res => {
        return res.data;
    }) .catch(e => {
        return "ErrorApi";
    });
}

function GetEngineerAll() {
    return axios.get(`${Base_API.Api}/GetEngineerAll`).then(res => {
        return res.data;
    }) .catch(e => {
        return "ErrorApi";
    });
}

function GetEngineerById(data) {
    return axios.post(`${Base_API.Api}/GetEngineerById`, data).then(res => {
        return res.data;
    }) .catch(e => {
        return "ErrorApi";
    });
}

function GetEngineerType() {
    return axios.get(`${Base_API.Api}/GetEngineerType`).then(res => {
        return res.data;
    }) .catch(e => {
        return "ErrorApi";
    });
}

function GetEngineerListtype(data) {
    return axios.post(`${Base_API.Api}/GetEngineerListtype`, data).then(res => {
        return res.data;
    }) .catch(e => {
        return "ErrorApi";
    });
}

function Contactus() {
    return axios.get(`${Base_API.Api}/Contactus`).then(res => {
        return res.data;
    }) .catch(e => {
        return "ErrorApi";
    });
}
