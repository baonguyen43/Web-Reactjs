// import { classColumns } from 'constants/displayColumns';

import { classColumns } from 'constants/displayColumns';

export default {
  displayColumns: [
    ...classColumns,
    // {
    //   title: 'Trạng thái',
    //   key: 'status',
    //   width: '1%',
    //   render: 'renderExpression',
    //   expression: 'record.status === "ACTIVE" ? "Đang hoạt động" : "Đang bị khóa"',
    //   style: {
    //     fontWeight: 400,
    //     color: colors.font,
    //     cursor: 'pointer',
    //   },
    //   sort: false,
    // },
  ],
};
