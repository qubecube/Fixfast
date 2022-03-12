import { Base_API } from "../_constants/matcher";
import axios from "axios";

export const orderAction = {
    CreateOrder,
    GetOrder,
    GetOrdeEngineer,
    UpdateOrderStatus,
    UpdateRatings
};

function CreateOrder(data) {
    return axios.post(`${Base_API.Api}/CreateOrder`, data).then(res => {
        return res.data;
    }) .catch(e => {
        return "ErrorApi";
    });
}

function GetOrder(data) {
    return axios.post(`${Base_API.Api}/GetOrder`, data).then(res => {
        return res.data;
    }) .catch(e => {
        return "ErrorApi";
    });
}

function GetOrdeEngineer(data) {
    return axios.post(`${Base_API.Api}/GetOrdeEngineer`, data).then(res => {
        return res.data;
    }) .catch(e => {
        return "ErrorApi";
    });
}

function UpdateOrderStatus(data) {
    return axios.post(`${Base_API.Api}/UpdateOrderStatus`, data).then(res => {
        return res.data;
    }) .catch(e => {
        return "ErrorApi";
    });
}

function UpdateRatings(data) {
    return axios.post(`${Base_API.Api}/UpdateRatings`, data).then(res => {
        return res.data;
    }) .catch(e => {
        return "ErrorApi";
    });
}

