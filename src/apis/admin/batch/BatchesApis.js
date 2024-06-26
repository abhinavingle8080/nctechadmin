// this is BatchesApis.js
import { postMethod } from "../../apiConfig";
/* eslint-disable arrow-body-style */
export const getBatchesApi = (data) => {
    return postMethod('/superadmin/get-batches', data);
};

export const getBatchApi = (data) => {
    return postMethod('/superadmin/get-batch', data);
};

export const createBatchApi = (data) => {
    return postMethod('/superadmin/create-batch', data);
};

export const updateBatchApi = (data) => {
    return postMethod('/superadmin/update-batch', data);
};

export const deleteBatchApi = (data) => {
    return postMethod('/superadmin/delete-batch', data);
};
/* eslint-enable arrow-body-style */
