/* eslint-disable arrow-body-style */
import { postMethod } from "../../apiConfig";

export const getStudentsApi = (data) => {
    return postMethod('/superadmin/get-students', data);
};

export const getStudentApi = (data) => {
    return postMethod('/superadmin/get-student', data);
};

export const createStudentApi = (data) => {
    return postMethod('/superadmin/create-student', data);
};

export const updateStudentApi = (data) => {
    return postMethod('/superadmin/update-student', data);
};

export const deleteStudentApi = (data) => {
    return postMethod('/superadmin/delete-student', data);
};
/* eslint-disable arrow-body-style */
