/* eslint-disable arrow-body-style */
import { postMethod } from "../../apiConfig";

export const getMenuApi = (data) => {
    return postMethod('/superadmin/get-all-modules', data);
};
/* eslint-disable arrow-body-style */
