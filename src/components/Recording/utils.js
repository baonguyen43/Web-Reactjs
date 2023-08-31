import notification from 'components/Notification';

// handle user media capture

export const captureUserMedia = async (callback) => {
  navigator.getUserMedia({ audio: true }, callback, (error) =>
    notification(
      'danger',
      'Thông báo',
      'Trình duyệt của bạn chưa hỗ trợ thu âm vui lòng thiết lập cài đặt.'
    )
  );
  //console.log(callback)
};
