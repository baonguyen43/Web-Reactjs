import { axiosAMES } from 'configs/api';


const levels = [{
  level: 'Starters',
  title: 'Cấp độ Mầm Non và Lớp 1 - Starters',
}, {
  level: 'Movers',
  title: 'Cấp độ Lớp 2 và Lớp 3 - Movers',
}, {
  level: 'Flyers',
  title: 'Cấp độ Lớp 4 và Lớp 5 - Flyers',
}];

export function* getSessionsMyames({ classId, studentId }) {

 
  if (classId === '0') {
    return levels;
  }
  else {
    const res = yield axiosAMES.get(`GetClassSession/${classId}/${studentId}`);

    if (res.data.message === 'OK') {
      res.data.results.className = res.data.className;
      return res.data.results;
    };

    if (res.data.message === 'Error') {
      return 'Error'
    }
  }
}
