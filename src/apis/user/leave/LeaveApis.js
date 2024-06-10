/* eslint-disable arrow-body-style */
import { postMethod } from "../../apiConfig";

export const getLeavesApi = (data) => {
    return postMethod('/user/get-leaves', data);
};

export const getLeaveApi = (data) => {
    return postMethod('/user/get-leave', data);
};

export const createLeaveApi = (data) => {
    return postMethod('/user/create-leave', data);
};

export const updateLeaveApi = (data) => {
    return postMethod('/user/update-leave', data); 
};

export const deleteLeaveApi = (data) => {
    return postMethod('/user/delete-leave', data);
};


/* eslint-disable arrow-body-style */
