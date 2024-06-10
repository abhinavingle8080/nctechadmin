import { postMethod } from "../../apiConfig";

export const getDesignationsApi = (data) => postMethod('/superadmin/get-designations', data);


export const getDesignationApi = (data) => postMethod('/superadmin/get-designation', data);


export const createDesignationApi = (data) => postMethod('/superadmin/create-designation', data);


export const updateDesignationApi = (data) => postMethod('/superadmin/update-designation', data);

export const deleteDesignationApi = (data) => postMethod('/superadmin/delete-designation', data);
