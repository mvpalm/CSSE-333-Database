import axios from 'axios';
import setAuthorizationToken from '../utils/setAuthorizationToken';
import jwtDecode from 'jwt-decode';
import { SET_CURRENT_USER, LOGOUT } from './types';

export function setCurrentUser(user, isLoading) {
  return {
    type: SET_CURRENT_USER,
    user,
    isLoading
  };
}

export function logout() {
  return dispatch => {
    localStorage.removeItem('jwtToken');
    setAuthorizationToken(false);
    dispatch(setCurrentUser({}, false));
    dispatch(clearState());
  };
}

export function clearState() {
  return {
    type: LOGOUT
  }
}

export function login(data) {
  return (dispatch) => {
    dispatch(setCurrentUser({}, true)); // display loading screen
    return axios.post('/api/auth', data).then(res => {
      localStorage.setItem('jwtToken', res.data.token);
      const token = res.data.token;
      setAuthorizationToken(token);
      dispatch(setCurrentUser(jwtDecode(token), false));
    })
  }
}

export function verifyInit(id) {
  return (dispatch) => {
    return axios.get(`/api/auth?id=${id}`);
  };
}
