import axios from 'axios';
import openNotification_Record  from 'components/Notification';

export const postMediaAnswerToAzure = (params, callback) => {
  var bodyFormData = new FormData();
  bodyFormData.append('jsonResult', params.jsonAzure);
  bodyFormData.append('readingText', params.readingText);

  axios({
    method: 'POST',
    url: 'https://ames.edu.vn/ames/api/amesapi/CalculateScore',
    //url: "https://ames.edu.vn/ames/api/amesApi/SaveFileAndCalculateScore",
    data: bodyFormData,
    config: { headers: { 'Content-Type': 'multipart/form-data' } }
  }).then(respone => {
    callback(respone.data);
  }).catch(function (error) {
    openNotification_Record('error', 'Thu âm bị lỗi!' ,'Bạn vui lòng thu âm lại!');
    // Error({
    //   title: "Thu âm bị lỗi!",
    //   content: "Bạn vui lòng thu âm lại!"
    // });
  });
};
