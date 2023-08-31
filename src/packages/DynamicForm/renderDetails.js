/* eslint-disable no-param-reassign */
/* eslint-disable react/no-array-index-key */
/* eslint-disable no-eval */
/* eslint-disable react/prop-types */
import React from 'react';
import _ from 'lodash';
import numeral from 'numeral';
import { Table, Button, Modal, Skeleton } from 'antd';
import { query } from 'helpers/QueryHelper';

const DetailsModal = ({ params, record, text, style }) => {
  const [visible, setVisible] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [results, setResults] = React.useState([]);

  const openModal = async () => {
    setVisible(true);
    setLoading(true);

    const parameters = {};

    params.parameters.forEach((p) => {
      parameters[p] = record[p];
    });

    const records = await query(params.sqlCommand, parameters, params.appName);
    setResults(records);
    setLoading(false);

    // FIXME:
    // configure filter
    // if (params) {
    //   params.displayColumns.forEach((c) => {
    //     if (c.filter) {
    //       const filterOptions = _.map(records, (r) => {
    //         return { text: r[c.dataIndex], value: r[c.dataIndex] };
    //       });

    //       const districtOption = _.uniqBy(filterOptions, 'text');

    //       c.filters = _.orderBy(districtOption, ['text'], ['asc']);
    //       c.onFilter = (value, r) => r[c.dataIndex].indexOf(value) === 0;
    //     }
    //   });
    // }
  };

  return (
    <React.Fragment>
      <Button type='link' size='small' onClick={openModal} style={{ whiteSpace: 'nowrap', ...style }}>
        {text}
      </Button>

      <Modal
        style={{ zIndex: 999 }}
        centered
        width='90vw'
        title={params.modalTitle || 'Thông tin chi tiết'}
        visible={visible}
        onCancel={() => {
          setVisible(false);
        }}
        footer={[
          <Button
            type='primary'
            key='close-modal'
            onClick={() => {
              setVisible(false);
            }}
          >
            Đóng
          </Button>,
        ]}
      >
        <div style={{ maxHeight: '80vh', minHeight: '60vh', overflowX: 'auto' }}>
          <Skeleton active loading={loading}>
            {results && results.length > 0 ? (
              <Table
                tableLayout='auto'
                rowKey={params.rowKey ? params.rowKey : 'rowKey'}
                size='small'
                sticky
                dataSource={results}
                columns={params.displayColumns}
                bordered
                loading={loading}
                pagination={false}
                scroll={params.tableScroll ? params.tableScroll : { x: true }}
                scrollToFirstRowOnChange
                // eslint-disable-next-line no-unused-vars
                rowClassName={(record, index) => {
                  // Không được bỏ 2 biến record, index vì hàm eval có dùng
                  let rowClassName = '';
                  if (params.formatConditions) {
                    for (let i = 0; i < params.formatConditions.length; i++) {
                      const condition = eval(params.formatConditions[i].condition);
                      if (condition) {
                        rowClassName = params.formatConditions[i].className;
                      }
                    }
                  }

                  return rowClassName;
                }}
                summary={(pageData) => {
                  return (
                    <Table.Summary.Row className='bg-gray-300 font-bold'>
                      {params.displayColumns.map((c, index) => {
                        // TITLE
                        if (c.summary && c.summary.title) {
                          return (
                            <Table.Summary.Cell key={c.key}>
                              <div className={c.summary.className} style={c.summary.style}>
                                {c.summary.title}
                              </div>
                            </Table.Summary.Cell>
                          );
                        }

                        if (!c.children) {
                          if (c.summary && c.summary.visible) {
                            return (
                              <Table.Summary.Cell key={c.key}>
                                <div className={c.summary.className} style={c.summary.style}>
                                  {/* SUM */}
                                  {numeral(
                                    _.reduce(
                                      pageData,
                                      (sum, r) => {
                                        return sum + r[c.dataIndex];
                                      },
                                      0,
                                    ),
                                  ).format(c.formatString)}
                                </div>
                              </Table.Summary.Cell>
                            );
                          }
                          return <Table.Summary.Cell key={c.key} />;
                        }

                        return (
                          <React.Fragment key={`cell-${index}`}>
                            {c.children.map((child) => {
                              if (child.summary && child.summary.visible) {
                                return (
                                  <Table.Summary.Cell key={child.key}>
                                    <div className={child.summary.className} style={(child.summary.style, { textAlign: 'right' })}>
                                      {numeral(
                                        _.reduce(
                                          pageData,
                                          (sum, r) => {
                                            return sum + r[child.dataIndex];
                                          },
                                          0,
                                        ),
                                      ).format(child.formatString)}
                                    </div>
                                  </Table.Summary.Cell>
                                );
                              }
                              return <Table.Summary.Cell key={child.key} />;
                            })}
                          </React.Fragment>
                        );
                      })}
                    </Table.Summary.Row>
                  );
                }}
              />
            ) : (
              <div style={{ textAlign: 'center' }}>Không có dữ liệu</div>
            )}
          </Skeleton>
        </div>
      </Modal>
    </React.Fragment>
  );
};

const renderDetails = (params, formatString, prefix, suffix, formatConditions, style) => (text, record, index) => {
  let formatStyle = {};
  let formatClassName = '';
  if (formatConditions) {
    for (let i = 0; i < formatConditions.length; i++) {
      const condition = eval(formatConditions[i].condition);
      if (condition) {
        formatStyle = formatConditions[i].style;
        formatClassName = formatConditions[i].className;
      }
    }
  }

  const content = params.label ? params.label : text;

  return {
    props: {
      className: formatClassName,
      style: { ...style, ...formatStyle },
    },
    children: <DetailsModal params={params} style={style} record={record} text={content} index={index} />,
  };
};

export { renderDetails };
