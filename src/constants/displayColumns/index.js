import React from 'react';
import {
  CalendarOutlined,
  MailOutlined,
  PaperClipOutlined,
  PhoneOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Button, message, Space, Tooltip } from 'antd';
import colors from 'constants/colors';

// export const reviewColumns = [
//   {
//     title: 'Đánh giá kỹ năng',
//     key: 'review',
//     width: '1%',
//     children: [
//       {
//         title: 'Nghe',
//         key: 'listeningSkill',
//         width: '1%',
//         render: 'renderNumber',
//         formatString: '0.00',
//         style: {
//           fontWeight: 600,
//           color: colors.theme.danger,
//           minWidth: 80,
//         },
//         formatConditions: [
//           {
//             condition: 'record.listeningSkill >= 6.5',
//             style: {
//               color: colors.theme.success,
//             },
//           },
//         ],
//       },
//       {
//         title: 'Nói',
//         key: 'speakingSkill',
//         width: '1%',
//         render: 'renderNumber',
//         formatString: '0.00',
//         style: {
//           fontWeight: 600,
//           color: colors.theme.danger,
//           minWidth: 80,
//         },
//         formatConditions: [
//           {
//             condition: 'record.speakingSkill >= 6.5',
//             style: {
//               color: colors.theme.success,
//             },
//           },
//         ],
//       },
//       {
//         title: 'Đọc',
//         key: 'readingSkill',
//         width: '1%',
//         render: 'renderNumber',
//         formatString: '0.00',
//         style: {
//           fontWeight: 600,
//           color: colors.theme.danger,
//           minWidth: 80,
//         },
//         formatConditions: [
//           {
//             condition: 'record.readingSkill >= 6.5',
//             style: {
//               color: colors.theme.success,
//             },
//           },
//         ],
//       },
//       {
//         title: 'Viết',
//         key: 'writtingSkill',
//         width: '1%',
//         render: 'renderNumber',
//         formatString: '0.00',
//         style: {
//           fontWeight: 600,
//           color: colors.theme.danger,
//           minWidth: 80,
//         },
//         formatConditions: [
//           {
//             condition: 'record.writtingSkill >= 6.5',
//             style: {
//               color: colors.theme.success,
//             },
//           },
//         ],
//       },
//     ],
//   },
// ];

export const studentColumns = [
  {
    title: 'Học sinh',
    key: 'student-info',
    width: '1%',
    children: [
      {
        title: 'Mã',
        key: 'id',
        width: '1%',
        fixed: 'left',
        render: 'renderNoWrap',
        style: {
          fontWeight: 600,
          textAlign: 'right',
          cursor: 'pointer',
        },
        prefix: <UserOutlined className="tw-mr-2" />,
      },
      {
        title: 'Họ và tên',
        key: 'fullName',
        fixed: 'left',
        width: '1%',
        render: 'renderNoWrap',
        style: {
          fontWeight: 600,
          minWidth: 160,
          cursor: 'pointer',
        },
      },
    ],
  },
  {
    title: 'Thông tin liên lạc',
    key: 'contact-info',
    width: '1%',
    children: [
      {
        title: 'Email',
        key: 'email',
        width: '1%',
        render: 'renderNoWrap',
        style: {
          fontWeight: 400,
          cursor: 'pointer',
        },
        prefix: <MailOutlined className="tw-mr-2" />,
      },
      {
        title: 'Điện thoại',
        key: 'phone',
        width: '1%',
        render: 'renderNoWrap',
        style: {
          fontWeight: 400,
        },
        prefix: <PhoneOutlined className="tw-mr-2" />,
      },
    ],
  },

  {
    title: 'Ghi chú',
    key: 'description',
    width: '',
    render: 'renderText',
    soft: false,
    style: {
      fontWeight: '400',
    },
  },
];

// export const eBookColumns = [
//   {
//     title: 'Sách',
//     key: 'book',
//     width: '1%',
//     render: 'renderNoWrap',
//     filter: true,
//     style: {
//       fontWeight: 600,
//       minWidth: 90,
//     },
//   },
//   {
//     title: 'Unit',
//     key: 'unit',
//     width: '1%',
//     render: 'renderNoWrap',
//     filter: true,
//     style: {
//       minWidth: 90,
//     },
//   },
//   {
//     title: 'Exercise',
//     key: 'exercise',
//     width: '1%',
//     render: 'renderNoWrap',
//     filter: true,
//     style: {
//       minWidth: 110,
//     },
//   },
//   {
//     title: 'Page',
//     key: 'page',
//     render: 'renderNoWrap',
//     filter: true,
//     style: {
//       minWidth: 90,
//     },
//   },
// ];

// export const eBookReviewColumns = [
//   {
//     title: 'Kết quả làm bài',
//     key: 'results',
//     children: [
//       {
//         title: 'Thấp nhất',
//         key: 'minScore',
//         render: 'renderNumber',
//         formatString: '0.00',
//         style: {
//           fontWeight: 600,
//           color: colors.theme.danger,
//           minWidth: 100,
//         },
//         formatConditions: [
//           {
//             condition: 'record.minScore >= 6.5',
//             style: {
//               color: colors.theme.success,
//             },
//           },
//         ],
//       },
//       {
//         title: 'Trung bình',
//         key: 'avgScore',
//         width: '1%',
//         render: 'renderNumber',
//         formatString: '0.00',
//         style: {
//           fontWeight: 600,
//           color: colors.theme.danger,
//           minWidth: 100,
//         },
//         formatConditions: [
//           {
//             condition: 'record.avgScore >= 6.5',
//             style: {
//               color: colors.theme.success,
//             },
//           },
//         ],
//       },
//       {
//         title: 'Cao nhất',
//         key: 'maxScore',
//         render: 'renderNumber',
//         formatString: '0.00',
//         style: {
//           fontWeight: 600,
//           color: colors.theme.danger,
//           minWidth: 100,
//         },
//         formatConditions: [
//           {
//             condition: 'record.maxScore >= 6.5',
//             style: {
//               color: colors.theme.success,
//             },
//           },
//         ],
//       },
//     ],
//   },
// ];

// export const eBookReviewDetailedColumns = [
//   {
//     title: 'Kết quả làm bài',
//     children: [
//       {
//         title: 'Điểm',
//         key: 'score',
//         render: 'renderNumber',
//         formatString: '0.00',
//         style: {
//           fontWeight: 600,
//           color: colors.theme.danger,
//           minWidth: 80,
//         },
//         formatConditions: [
//           {
//             condition: 'record.score >= 6.5',
//             style: {
//               color: colors.theme.success,
//             },
//           },
//         ],
//       },
//       {
//         title: 'Kết quả',
//         key: 'result',
//         render: 'renderText',
//         style: {
//           fontWeight: 600,
//           minWidth: 80,
//           textAlign: 'center',
//         },
//       },
//       {
//         title: 'Đánh giá',
//         key: 'rate',
//         render: 'renderRateDisabled',
//         style: {
//           fontSize: 14,
//           whiteSpace: 'nowrap',
//         },
//       },
//     ],
//   },
// ];

export const classColumns = [
  // {
  //   title: 'Mã lớp',
  //   key: 'code',
  //   width: '1%',
  //   fixed: 'left',
  //   sort: false,
  //   render: 'renderNoWrap',
  //   style: {
  //     fontWeight: 600,
  //     color: colors.font,
  //   },
  // },
  {
    title: 'Tên lớp',
    key: 'className',
    render: 'renderNoWrap',
    style: {
      fontWeight: 600,
      color: colors.font,
      cursor: 'pointer',
    },
    prefix: <TeamOutlined className="tw-mr-2" />,
  },
  {
    title: 'Trạng thái',
    key: 'status',
    width: 85,
    render: 'renderNoWrap',
    sort: false,
    style: {
      fontWeight: 400,
      color: colors.font,
      minWidth: 50,
    },
  },
  {
    title: 'Sĩ số',
    key: 'numberOfStudent',
    width: '1%',
    render: 'renderNumber',
    sort: false,
    style: {
      fontWeight: 400,
      color: colors.font,
      minWidth: 50,
    },
  },
  {
    title: 'Ghi chú',
    key: 'note',
    render: 'renderNoWrap',
    width: 80,
    style: {
      fontWeight: 400,
      color: colors.font,
    },
    sort: false,
  },
];

// export const fileColumns = [
//   {
//     title: 'Tập tin đính kèm',
//     key: 'fileName',
//     render: 'renderPreviewFile',
//     sort: false,
//     style: {
//       fontWeight: 500,
//       cursor: 'pointer',
//       whiteSpace: 'nowrap',
//       color: colors.font,
//     },
//     prefix: <PaperClipOutlined className="tw-mr-2" />,
//   },
//   {
//     title: 'Kích thước',
//     key: 'fileSize',
//     render: 'renderNumber',
//     formatString: '0.0 b',
//     width: '1%',
//     sort: false,
//     style: {
//       fontWeight: 400,
//       minWidth: 100,
//     },
//   },
//   {
//     title: 'Loại',
//     key: 'contentType',
//     width: '1%',
//     render: 'renderNoWrap',
//     sort: false,
//     style: {
//       fontWeight: 400,
//     },
//   },
//   {
//     title: 'Ngày tạo',
//     key: 'createdDate',
//     width: '1%',
//     render: 'renderDateTime',
//     sort: false,
//     style: {
//       fontWeight: 400,
//     },
//     prefix: <CalendarOutlined className="tw-mr-2" />,
//   },
// ];
