import axios from 'axios';

export const postMediaAnswerToApi = (params, callback) => {
  var base64Data;
  var reader = new FileReader();
  reader.readAsDataURL(params.blobFile);

  reader.onloadend = async () => {
    base64Data = reader.result;
    let DATA = new FormData();
    DATA.append('input', base64Data);
    DATA.append('extensionInput', params.extensionInput);
    DATA.append('readingText', params.readingText);
    DATA.append('studentID', params.studentID);
    DATA.append('questionId', params.questionId);
    DATA.append('takeExamTime', params.takeExamTime);
    DATA.append('device', params.device);

    await axios
      .post('https://cloud.softech.cloud/mobile/ames/api/UploadFileRecord', DATA)
      .then(res => callback(res))
      .catch(err => {
        callback('error');
      });
  };
};
