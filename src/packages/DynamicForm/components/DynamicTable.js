/* eslint-disable no-unused-vars */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-eval */
/* eslint-disable react/prop-types */
/* eslint-disable no-param-reassign */
/* eslint-disable react/no-array-index-key */
/* eslint-disable react/jsx-wrap-multilines */
/* eslint-disable react/jsx-props-no-spreading */
import 'packages/DynamicForm/rowClassNames.css';
import React from 'react';
import PropTypes from 'prop-types';
import _, { join } from 'lodash';
import numeral from 'numeral';

import { Table, Skeleton, Row, Col, Space, Tooltip, Checkbox, Popover, Tree } from 'antd';
import { ReloadOutlined, SettingOutlined } from '@ant-design/icons';
import buildDisplayColumns from '../buildDisplayColumns';
import DensityIcons from './DensityIcons';

// ------------------------------------------------------------------------------------------------
// REACT COMPONENT
// ------------------------------------------------------------------------------------------------
function DynamicTable({ loading, dataSource, initialTableData, expandable = null, rowKey = null, onReload, showToolbar = false, showSummary = false, pagination, extraColumns = null, ...rest }) {
  // SETTINGS
  const [tableSize, setTableSize] = React.useState('small');
  const [selectedColumns, setSelectedColumns] = React.useState(
    _.concat(initialTableData.displayColumns, extraColumns ?? []).map((c) => {
      return c.key;
    }),
  );

  // const [columns, setColumns] = React.useState([]);

  const [tableData, setTableData] = React.useState(null);
  const primaryKey = rowKey || initialTableData?.rowKey || initialTableData?.displayColumns[0].key || 'rowKey';

  React.useEffect(() => {
    if (initialTableData !== null) {
      // displayColumns
      const data = _.cloneDeep(initialTableData);
      data.displayColumns = buildDisplayColumns(_.concat(initialTableData.displayColumns, extraColumns ?? []));

      setTableData(data);

      // console.log('🔥 Display columns', initialTableData.displayColumns);
      // console.log('👍 Final display columns', data.displayColumns);
    }
  }, [initialTableData, extraColumns]);

  // FIXME: Please fixed filter
  React.useEffect(() => {
    // configure filter
    if (tableData) {
      tableData.displayColumns.forEach((c) => {
        if (c.filter) {
          const filterOptions = _.map(dataSource, (r) => {
            return { text: r[c.dataIndex], value: r[c.dataIndex] };
          });

          const districtOption = _.uniqBy(filterOptions, 'text');

          c.filters = _.orderBy(districtOption, ['text'], ['asc']);
          c.onFilter = (value, record) => record[c.dataIndex].indexOf(value) === 0;
        }
      });
    }
  }, [dataSource, tableData]);

  const showColumns = _.filter(tableData?.displayColumns, (dc) => {
    return _.find(selectedColumns, (c) => {
      return dc.key === c || dc.key === 'row-index';
    });
  });

  const summary = React.useCallback(
    (pageData) => {
      let columns = [];
      if (expandable) {
        columns = [...showColumns, { key: 'expandable-column' }];
      } else {
        columns = showColumns;
      }

      return (
        <Table.Summary.Row className='font-bold'>
          {columns.map((c, index) => {
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
                    <div className={c.summary.className} style={{ whiteSpace: 'nowrap', textAlign: 'right', ...c.summary.style }}>
                      {/* SUM */}
                      {`${numeral(
                        _.reduce(
                          pageData,
                          (sum, record) => {
                            return sum + record[c.dataIndex];
                          },
                          0,
                        ),
                      ).format(c.formatString)}${c.summary.suffix === undefined ? '' : c.summary.suffix}`}
                    </div>
                  </Table.Summary.Cell>
                );
              }
              return <Table.Summary.Cell key={c.key} />;
            }

            return (
              <React.Fragment key={`cell${index}`}>
                {c.children.map((child) => {
                  if (child.summary && child.summary.visible) {
                    return (
                      <Table.Summary.Cell key={child.key}>
                        <div className={child.summary.className} style={{ whiteSpace: 'nowrap', textAlign: 'right', ...child.summary.style }}>
                          {`${numeral(
                            _.reduce(
                              pageData,
                              (sum, record) => {
                                return sum + record[child.dataIndex];
                              },
                              0,
                            ),
                          ).format(child.formatString)}${child.summary.suffix === undefined ? '' : child.summary.suffix}`}
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
    },
    [expandable, showColumns],
  );

  return (
    <div style={{ marginTop: 24 }}>
      {showToolbar && (
        <Row gutter={[16, 16]} style={{ marginBottom: 12, paddingRight: 6 }}>
          <Col flex={1} />
          <Col flex='none'>
            <Space size='middle' align='end'>
              {onReload && typeof onReload === 'function' && (
                <Tooltip title='Tải lại dữ liệu'>
                  <ReloadOutlined onClick={onReload} />
                </Tooltip>
              )}
              <DensityIcons
                tableSize={tableSize}
                onChange={(size) => {
                  setTableSize(size);
                }}
              />
              <Popover
                arrowPointAtCenter
                trigger='click'
                placement='bottomRight'
                content={() => {
                  return (
                    <React.Fragment>
                      <Tree
                        style={{ marginLeft: -20 }}
                        itemHeight={24}
                        // height={280}
                        showLine={false}
                        blockNode
                        checkable
                        treeData={_.concat(initialTableData.displayColumns, extraColumns ?? []).map((c) => {
                          return { key: c.key, title: c.title };
                        })}
                        checkedKeys={selectedColumns}
                        onCheck={(checkedKeys, e) => {
                          if (e.checked) {
                            setSelectedColumns([...selectedColumns, e.node.key]);
                          } else {
                            setSelectedColumns(checkedKeys);
                          }
                        }}
                      />
                    </React.Fragment>
                  );
                }}
              >
                <SettingOutlined />
              </Popover>
            </Space>
          </Col>
        </Row>
      )}

      <Skeleton active loading={loading}>
        {tableData && dataSource && dataSource.length > 0 && (
          <Table
            tableLayout='auto'
            rowKey={primaryKey}
            size={tableSize}
            sticky
            dataSource={dataSource}
            expandable={expandable}
            columns={showColumns}
            bordered
            loading={loading}
            pagination={!pagination ? false : pagination}
            scroll={tableData.tableScroll ? tableData.tableScroll : { x: true }}
            scrollToFirstRowOnChange
            rowClassName={(record, index) => {
              // Không được bỏ 2 biến record, index vì hàm eval có dùng
              let rowClassName = '';
              if (tableData.formatConditions) {
                for (let i = 0; i < tableData.formatConditions.length; i++) {
                  const condition = eval(tableData.formatConditions[i].condition);
                  if (condition) {
                    rowClassName = tableData.formatConditions[i].className;
                  }
                }
              }

              return rowClassName;
            }}
            summary={showSummary ? summary : null}
            {...rest}
          />
        )}
      </Skeleton>
    </div>
  );
}

DynamicTable.propTypes = {
  loading: PropTypes.bool,
  dataSource: PropTypes.array,
  initialTableData: PropTypes.object,
  expandable: PropTypes.object,
  rowKey: PropTypes.string,
  showToolbar: PropTypes.bool,
  showSummary: PropTypes.bool,
  extraColumns: PropTypes.array,
};

DynamicTable.defaultProps = {
  loading: false,
  dataSource: [],
  rowKey: null,
  initialTableData: null,
  expandable: null,
  showToolbar: false,
  showSummary: false,
  extraColumns: [],
};

export default DynamicTable;
