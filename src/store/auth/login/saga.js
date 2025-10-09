import { call, put, takeEvery, takeLatest } from "redux-saga/effects";
import CryptoJS from "crypto-js";

// Login Redux States
import { LOGIN_USER, LOGOUT_USER, SOCIAL_LOGIN } from "./actionTypes";
import { apiError, loginSuccess, logoutUserSuccess } from "./actions";

//Include Both Helper File with needed methods
import { getFirebaseBackend } from "../../../helpers/firebase_helper";
import {
  postFakeLogin,
  postJwtLogin,
  postSocialLogin,
} from "../../../helpers/fakebackend_helper";
import axios from "axios";
import { toast } from "react-toastify";

const fireBaseBackend = getFirebaseBackend();

function* loginUser({ payload: { user, history } }) {
  try {
    axios
      .post(
        "https://camp-coding.tech/quest/platform/admin/dashboard_users/login.php",
        user
      )
      .then((res) => {
        if (res.status == "success") {
          alert("Your account has been successfully Logged in!");
          const encryptedValue = CryptoJS.AES.encrypt(
            JSON.stringify(res.message),
            "*&&^##/ElMatary/Dashboard/Users/##^&&*"
          ).toString();
          localStorage.setItem("authUser", encodeURIComponent(encryptedValue));
          window.location.href = "/dashboard";
        } else {
          alert(res.message);
        }
      });
  } catch (error) {
    alert(error.message);
    yield put(apiError(error));
  }
}

function* logoutUser() {
  try {
    localStorage.removeItem("authUser");
    if (process.env.REACT_APP_DEFAULTAUTH === "firebase") {
      const response = yield call(fireBaseBackend.logout);
      yield put(logoutUserSuccess(LOGOUT_USER, response));
    } else {
      yield put(logoutUserSuccess(LOGOUT_USER, true));
    }
  } catch (error) {
    yield put(apiError(LOGOUT_USER, error));
  }
}

// function* socialLogin({ payload: { data, history, type } }) {
//   try {
//     if (process.env.REACT_APP_DEFAULTAUTH === "firebase") {
//       const fireBaseBackend = getFirebaseBackend();
//       const response = yield call(fireBaseBackend.socialLoginUser, data, type);
//       localStorage.setItem("authUser", JSON.stringify(response));
//       yield put(loginSuccess(response));
//     } else {
//       const response = yield call(postSocialLogin, data);
//       localStorage.setItem("authUser", JSON.stringify(response));
//       yield put(loginSuccess(response));
//     }
//     history("/dashboard");
//   } catch (error) {
//     yield put(apiError(error));
//   }
// }

function* authSaga() {
  yield takeEvery(LOGIN_USER, loginUser);
  // yield takeLatest(SOCIAL_LOGIN, socialLogin);
  yield takeEvery(LOGOUT_USER, logoutUser);
}

export default authSaga;
