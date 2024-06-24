/* eslint-disable arrow-body-style */
import { postMethod, postFormDataMethod } from "../../apiConfig";

export const getStudentsApi = (data) => {
    return postMethod('/superadmin/get-students', data);
};

export const getStudentApi = (data) => {
    return postMethod('/superadmin/get-student', data);
};

export const createStudentApi = (data) => {
    return postFormDataMethod('/superadmin/create-student', data);
};

export const updateStudentApi = (data) => {
    return postFormDataMethod('/superadmin/update-student', data);
};

export const deleteStudentApi = (data) => {
    return postMethod('/superadmin/delete-student', data);
};
/* eslint-disable arrow-body-style */
