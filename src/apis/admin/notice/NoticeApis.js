/* eslint-disable arrow-body-style */
import { postMethod, postFormDataMethod } from "../../apiConfig";

export const getNoticesApi = (data) => {
    return postMethod('/superadmin/get-notices', data);
};

export const getNoticeApi = (data) => {
    return postMethod('/superadmin/get-notice', data);
};

export const createNoticeApi = (data) => {
    return postFormDataMethod('/superadmin/create-notice', data);
};

export const updateNoticeApi = (data) => {
    return postFormDataMethod('/superadmin/update-notice', data); 
};

export const deleteNoticeApi = (data) => {
    return postMethod('/superadmin/delete-notice', data);
};
