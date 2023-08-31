/* eslint-disable react/display-name */
/* eslint-disable react/react-in-jsx-scope */
const columnConfig = (config) => {
  const columns = [
    {
      title: 'STT',
      dataIndex: 'key',
      render: (text, record, index) => index + 1,
    },
    {
      title: 'Tên bài làm',
      dataIndex: 'assignment',
      width: '60%',
      render: (value, record) => config.assignment(value, record),
      // sorter: (a, b) => (a.assigment < b.assigment) - (a.assigment > b.assigment),
    },
    {
      title: 'Hoàn thành',
      dataIndex: 'progress',
      render: (value) => config.progess(value),
      width: '30%',
    },
    {
      title: 'Điểm số',
      dataIndex: 'score',
      render: (score) => config.score(score),
      width: '10%',
    },
  ];
  return columns
}

export default columnConfig;