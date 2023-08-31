/* eslint-disable no-param-reassign */
// STYLES
import 'packages/DynamicForm/rowClassNames.css';

// COMPONENTS
import React from 'react';
import _ from 'lodash';

// RENDER FUNCTIONS
import renderFunctions from './renderFunctions';

function buildDisplayColumns(columns) {
  const buildColumns = _.cloneDeep(columns);

  // displayColumns
  const displayColumns = [
    {
      title: '#',
      key: 'row-index',
      width: '1%',
      align: 'right',
      fixed: 'left',
      render: (text, record, index) => <span style={{ fontWeight: '400' }}>{index + 1}</span>,
      columnIndex: -99999,
    },
  ];

  buildColumns.forEach((c) => {
    const { title } = c;
    // title (no wrap)
    if (typeof title === 'string') {
      c.title = () => <div style={{ whiteSpace: 'nowrap', fontWeight: 600, ...c.titleStyle }}>{title}</div>;
    }

    if (!c.dataIndex && c.key) {
      c.dataIndex = c.key;
    }

    // columnIndex
    c.columnIndex = c.columnIndex ?? 1;

    if (c.render && typeof c.render === 'string') {
      if (c.render === 'renderDetails') {
        // RENDER DETAILS
        const params = { ...c.params };
        if (params.displayColumns) {
          params.displayColumns = buildDisplayColumns(params.displayColumns);
          c.render = renderFunctions.renderDetails(params, c.expression, c.formatString, c.prefix, c.suffix, c.formatConditions, c.style);
        }
      } else if (c.render === 'renderDeleteAction') {
        // RENDER DELETE ACTION
        c.render = renderFunctions.renderDeleteAction(c.params, c.expression, c.formatString, c.prefix, c.suffix, c.formatConditions, c.style);
      } else if (c.render === 'renderExpression') {
        // RENDER EXPRESSION
        c.render = renderFunctions[c.render](c.expression, c.formatString, c.prefix, c.suffix, c.formatConditions, c.style);
      } else if (c.render.indexOf('renderForm_') >= 0) {
        // RENDER FORM
        c.render = renderFunctions[c.render](c.params);
      } else if (c.render === 'renderLink') {
        // RENDER LINK
        c.render = renderFunctions[c.render](c.linkText, c.linkExpression, c.linkCondition, c.formatConditions, c.style);
      } else {
        // RENDER DEFAULT
        c.render = renderFunctions[c.render](c.formatString, c.prefix, c.suffix, c.formatConditions, c.style);
      }
    } else {
      // GROUP: CHILDREN
      // eslint-disable-next-line no-lonely-if
      if (c.children) {
        c.children.forEach((child) => {
          const childTitle = child.title;
          // title (no wrap)
          child.title = () => <div style={{ whiteSpace: 'nowrap', fontWeight: 600, ...child.titleStyle }}>{childTitle}</div>;

          if (!child.dataIndex && child.key) {
            child.dataIndex = child.key;
          }

          if (child.render && typeof child.render === 'string') {
            if (child.render === 'renderDetails') {
              // RENDER DETAILS
              const params = { ...child.params };
              if (params.displayColumns) {
                params.displayColumns = buildDisplayColumns(params.displayColumns);
                child.render = renderFunctions.renderDetails(params, child.formatString, child.prefix, child.suffix, child.formatConditions, child.style);
              }
            } else if (child.render === 'renderDeleteAction') {
              // RENDER DELETE ACTION
              child.render = renderFunctions.renderDeleteAction(child.params, child.expression, child.formatString, child.prefix, child.suffix, child.formatConditions, child.style);
            } else if (child.render === 'renderExpression') {
              // RENDER EXPRESSION
              child.render = renderFunctions[child.render](child.expression, child.formatString, child.prefix, child.suffix, child.formatConditions, child.style);
            } else if (child.render.indexOf('renderForm_') >= 0) {
              // RENDER FORM
              child.render = renderFunctions[child.render](child.params);
            } else if (child.render === 'renderLink') {
              // RENDER LINK
              child.render = renderFunctions[child.render](child.linkText, child.linkExpression, child.linkCondition, child.formatConditions, child.style);
            } else {
              // RENDER DEFAULT
              child.render = renderFunctions[child.render](child.formatString, child.prefix, child.suffix, child.formatConditions, child.style);
            }
          }

          // Sort
          if (child.dataType === 'number') {
            child.sorter = (a, b) => {
              if (!a[child.dataIndex]) a[child.dataIndex] = 0;
              if (!b[child.dataIndex]) b[child.dataIndex] = 0;

              return a[child.dataIndex] - b[child.dataIndex];
            };
          } else if (child.dataType === 'object' || child.children !== undefined || child.sort === false) {
            child.sorter = null;
          } else {
            child.sorter = (a, b) => {
              if (!a[child.dataIndex]) a[child.dataIndex] = '';
              if (!b[child.dataIndex]) b[child.dataIndex] = '';

              return a[child.dataIndex].toString().localeCompare(b[child.dataIndex].toString());
            };
          }
        });
      }
    }

    // Sort
    if (!c.children) {
      if (c.dataType === 'number') {
        c.sorter = (a, b) => {
          if (!a[c.dataIndex]) a[c.dataIndex] = 0;
          if (!b[c.dataIndex]) b[c.dataIndex] = 0;

          return a[c.dataIndex] - b[c.dataIndex];
        };
      } else if (c.dataType === 'object' || c.children !== undefined || c.sort === false) {
        c.sorter = null;
      } else {
        c.sorter = (a, b) => {
          if (!a[c.dataIndex]) a[c.dataIndex] = '';
          if (!b[c.dataIndex]) b[c.dataIndex] = '';

          return a[c.dataIndex].toString().localeCompare(b[c.dataIndex].toString());
        };
      }
    }
  });

  const sortedColumns = _.sortBy(displayColumns.concat(buildColumns), ['columnIndex']);

  return _.filter(sortedColumns, (c) => {
    return (c.visible && c.visible === true) || c.visible === undefined;
  });
}

export default buildDisplayColumns;
