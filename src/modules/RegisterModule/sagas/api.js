import CryptoJS from 'crypto-js';
import { ames247Axios } from 'configs/api';

// export function* postRegisterFromApi({ fullname, password, phone, divisionId, email }) {
//   let request = {
//     uri: "https://cloud.softech.cloud/mobile/ames/api/WebAmes/EBM/Student/Register",
//     configs: {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json; charset=utf-8",
//         "AppName": "WEB_MY_AMES",
//       },
//       body: JSON.stringify({
//         fullname,
//         password: CryptoJS.MD5(password).toString(),
//         phone,
//         divisionId,
//         email
//       })
//     }
//   };
//   let response = yield fetch(request.uri, request.configs).then(j => j.json()).then(v => {
//     return v;
//   });
//   return response;
// }

export function* postRegisterFromApi({ password, email }) {

  let request = {
    uri: 'https://cloud.softech.vn/mobile/ames247/api/ames-register',
    configs: {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'AppName': 'WEB_MY_AMES',
      },
      body: JSON.stringify({
        password: CryptoJS.MD5(password).toString(),
        email
      })
    }
  };
  let response = yield fetch(request.uri, request.configs).then(j => j.json()).then(v => {
    return v;
  });
  return response;
}

export function* postRegisterAIApi({ voucher, fullname, password, phone }) {
  const body = {
    Phone: phone,
    Fullname: fullname,
    Password: CryptoJS.MD5(password).toString(),
    ActivatedCode: voucher,
  };

  const response = yield ames247Axios.post('/register-v4', body);
  return response;
}

export function* postRegisterViettelFromApi({ email, password, fullname, voucher, course, phone }) {
  let request = {
    uri: 'https://cloud.softech.cloud/mobile/api/viettel/register',
    configs: {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'AppName': 'WEB_MY_AMES',
      },
      body: JSON.stringify({
        Email: email,
        Fullname: fullname,
        Password: CryptoJS.MD5(password).toString(),
        VoucherCode: voucher,
        CourseId: course,
        Phone: phone,
      })
    }
  };
  let response = yield fetch(request.uri, request.configs).then(j => j.json()).then(v => {
    return v;
  });
  return response;
}

export function* postCodeActiveApi({ phone, otp }) {
  let request = {
    uri: 'https://cloud.softech.cloud/mobile/ames/api/WebAmes/EBM/AuthenticationViaSmsOtp',
    configs: {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'AppName': 'WEB_MY_AMES',
      },
      body: JSON.stringify({
        phone,
        otp
      })
    }
  };
  let response = yield fetch(request.uri, request.configs).then(j => j.json()).then(v => {
    return v;
  });
  return response;
}

export function* postCodeConfrimApi({ phone, otp, password }) {
  let request = {
    uri: 'https://cloud.softech.cloud/mobile/ames/api/myames/ResetPasswordConfirmation',
    configs: {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'AppName': 'WEB_MY_AMES',
      },
      body: JSON.stringify({
        userName: phone,
        otp,
        password,
      })
    }
  };
  let response = yield fetch(request.uri, request.configs).then(j => j.json()).then(v => {
    return v;
  });
  return response;
}