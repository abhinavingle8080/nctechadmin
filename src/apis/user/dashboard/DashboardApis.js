/* eslint-disable arrow-body-style */
import { postMethod } from "../../apiConfig";

export const getDashboardApi = (data) => {
    return postMethod('/user/get-dashboard', data);
};

/* eslint-disable arrow-body-style */
