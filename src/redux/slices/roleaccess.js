import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    rolepermissions: [],
    rolemodules: [],
};

const roleAccessSlice = createSlice({
    name: 'roleaccess',
    initialState,
    reducers: {
        getRolePermissionsSuccess(state, action) {
            state.rolepermissions = action.payload;
        },
        getRoleModulesSuccess(state, action) {
            state.rolemodules = action.payload;
        },
        updateRolePermissionsSuccess(state, action) {
            state.rolepermissions = action.payload;
        },
        updateRoleModulesSuccess(state, action) {
            state.rolemodules = action.payload;
        },
        resetRoleAccess(state) {
            Object.assign(state, initialState);
        },
    },
});

export default roleAccessSlice.reducer;

// Action creators
export const fetchRolePermissions = (roleId) => async (dispatch, getState) => {
    const { roleaccess } = getState();

    if (roleaccess.rolepermissions.length > 0) {
        return;
    }

    try {
        // Uncomment and modify as per your API response structure
        // const res = await getRoleModulesByRolesApi({ role_id: roleId });
        // dispatch(roleAccessSlice.actions.getRolePermissionsSuccess(res?.data?.modules));
    } catch (error) {
        console.log(error);
        // Handle errors here, dispatch an error action or show a notification
    }
};

export const fetchRoleModules = () => async (dispatch, getState) => {
    const { roleaccess } = getState();

    if (roleaccess.rolemodules.length > 0) {
        return;
    }

    try {
        // Uncomment and modify as per your API response structure
        // const res = await getMenuApi();
        // dispatch(roleAccessSlice.actions.getRoleModulesSuccess(res?.data?.data));
    } catch (error) {
        console.log(error);
        // Handle errors here, dispatch an error action or show a notification
    }
};

export const updateRolePermissions = (roleId) => async (dispatch) => {
    try {
        // Uncomment and modify as per your API response structure
        // const res = await getRoleModulesByRolesApi({ role_id: roleId });
        // dispatch(roleAccessSlice.actions.getRolePermissionsSuccess(res?.data?.modules));
    } catch (error) {
        console.log(error);
        // Handle errors here, dispatch an error action or show a notification
    }
};

export const updateRoleModules = () => async (dispatch) => {
    try {
        // Uncomment and modify as per your API response structure
        // const res = await getMenuApi();
        // dispatch(roleAccessSlice.actions.getRoleModulesSuccess(res?.data?.data));
    } catch (error) {
        console.log(error);
        // Handle errors here, dispatch an error action or show a notification
    }
};

export const resetRoleAccess = () => async (dispatch) => {
    dispatch(roleAccessSlice.actions.resetRoleAccess());
};
