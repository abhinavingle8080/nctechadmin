/* eslint-disable arrow-body-style */
import { postMethod } from "../../apiConfig";

export const getCoursesApi = (data) => {
    return postMethod('/superadmin/get-courses', data);
};

export const getCourseApi = (data) => {
    return postMethod('/superadmin/get-course', data);
};

export const createCourseApi = (data) => {
    return postMethod('/superadmin/create-course', data);
};

export const updateCourseApi = (data) => {
    return postMethod('/superadmin/update-course', data);
};

export const deleteCourseApi = (data) => {
    return postMethod('/superadmin/delete-course', data);
};
/* eslint-disable arrow-body-style */
