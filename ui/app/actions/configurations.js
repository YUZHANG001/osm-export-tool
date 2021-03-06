import axios from "axios";
import { push } from "react-router-redux";
import { initialize, startSubmit, stopSubmit } from "redux-form";

import { selectAuthToken } from "../selectors";
import types from ".";

export const getConfigurations = (filters = {}, page = 1) => (
  dispatch,
  getState
) => {
  const itemsPerPage = 20;
  const token = selectAuthToken(getState());

  dispatch({
    type: types.FETCHING_CONFIGURATIONS
  })

  return axios({
    baseURL: window.EXPORTS_API_URL,
    headers: {
      Authorization: `Bearer ${token}`
    },
    params: {
      ...filters,
      limit: itemsPerPage,
      offset: Math.max(0, (page - 1) * itemsPerPage)
    },
    url: "/api/configurations"
  }).then(({ data: response }) =>
    dispatch({
      type: types.RECEIVED_CONFIGURATIONS_LIST,
      activePage: page,
      itemsPerPage,
      response
    })
  );
};

export const createConfiguration = (data, formName) => async (
  dispatch,
  getState
) => {
  const token = selectAuthToken(getState());

  dispatch(startSubmit(formName));

  try {
    await axios({
      baseURL: window.EXPORTS_API_URL,
      headers: {
        Authorization: `Bearer ${token}`
      },
      url: "/api/configurations",
      method: "POST",
      contentType: "application/json; version=1.0",
      data
    });

    dispatch({
      type: types.CONFIGURATION_CREATED
    });

    dispatch(getConfigurations());
  } catch (err) {
    return dispatch(
      stopSubmit(formName, {
        ...err.response.data,
        _error: "Your configuration is invalid. Please check the fields above."
      })
    );
  }
};

export const updateConfiguration = (uid, data, formName) => async (
  dispatch,
  getState
) => {
  const token = selectAuthToken(getState());

  dispatch(startSubmit(formName));

  try {
    await axios({
      baseURL: window.EXPORTS_API_URL,
      headers: {
        Authorization: `Bearer ${token}`
      },
      url: `/api/configurations/${uid}`,
      method: "PUT",
      contentType: "application/json; version=1.0",
      data
    });

    dispatch({
      type: types.CONFIGURATION_CREATED,
      id: uid
    });

    dispatch(getConfigurations())
  } catch (err) {
    return dispatch(
      stopSubmit(formName, {
        ...err.response.data,
        _error: "Your configuration is invalid. Please check the fields above."
      })
    );
  }
};

export const getConfiguration = uid => (dispatch, getState) => {
  const token = selectAuthToken(getState());

  return axios({
    baseURL: window.EXPORTS_API_URL,
    headers: {
      Authorization: `Bearer ${token}`
    },
    url: `/api/configurations/${uid}`
  }).then(rsp => {
    dispatch({
      type: types.RECEIVED_CONFIGURATION,
      configuration: rsp.data
    });

    dispatch(initialize("ConfigurationForm", rsp.data));
  });
};

export const deleteConfiguration = uid => async (dispatch, getState) => {
  const token = selectAuthToken(getState());

  try {
    await axios({
      baseURL: window.EXPORTS_API_URL,
      headers: {
        Authorization: `Bearer ${token}`
      },
      url: `/api/configurations/${uid}`,
      method: "DELETE"
    });

    dispatch({
      type: types.CONFIGURATION_DELETED,
      id: uid
    });

    dispatch(getConfigurations())

    dispatch(push("/configurations"));
  } catch (err) {
    console.warn(err);
  }
};
