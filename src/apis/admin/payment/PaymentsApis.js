/* eslint-disable arrow-body-style */
import { postMethod } from "../../apiConfig";

export const getPaymentsApi = (data) => {
    return postMethod('/superadmin/get-payments', data);
};

export const getPaymentApi = (data) => {
    return postMethod('/superadmin/get-payment', data);
};

export const createPaymentApi = (data) => {
    return postMethod('/superadmin/create-payment', data);
};

export const updatePaymentApi = (data) => {
    return postMethod('/superadmin/update-payment', data);
};

export const deletePaymentApi = (data) => {
    return postMethod('/superadmin/delete-payment', data);
};
/* eslint-enable arrow-body-style */
