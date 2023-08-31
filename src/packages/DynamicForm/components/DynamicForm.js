/* eslint-disable operator-linebreak */
/* eslint-disable no-undef */
/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
/* eslint-disable react/jsx-no-target-blank */
/* eslint-disable react/prop-types */
/* eslint-disable no-param-reassign */
/* eslint-disable react/no-array-index-key */
/* eslint-disable react/jsx-wrap-multilines */
/* eslint-disable react/jsx-props-no-spreading */
import 'packages/DynamicForm/rowClassNames.css';
import React from 'react';
import _ from 'lodash';
import moment from 'moment';
import { Form, Button, Skeleton, Card, Drawer, Space, Divider } from 'antd';
import { QuestionCircleFilled, EditFilled, SaveOutlined } from '@ant-design/icons';

import ReactMarkdown from 'react-markdown';
import { layout, tailLayout } from 'packages/DynamicForm/formLayouts';
import inputComponents from 'packages/DynamicForm/inputComponents';
import ReportHelper from 'helpers/ReportHelper';

import useDynamicForm from '../useDynamicForm';

const getOptionsAsync = async (f, parameters, appName) => {
  f.inputComponent.props.options = [];
  const options = await ReportHelper.Query(f.inputComponent.dataSource, parameters, f.inputComponent.dataSourceAppName ? f.inputComponent.dataSourceAppName : appName);
  if (f.inputComponent.props && f.inputComponent.props.options) {
    f.inputComponent.props.options = f.inputComponent.props.options.concat(options);
  } else {
    f.inputComponent.props.options = options;
  }
};

const formatParameters = (originalParameters) => {
  const parameters = { ...originalParameters };

  // Convert array to string for sql
  for (const p in parameters) {
    // Xử lý mảng
    if (Array.isArray(parameters[p]) && p !== 'answers') {
      const newValue = _.join(parameters[p], ',');
      parameters[p] = newValue;
    }

    // Xử lý ngày / tháng của moment
    if (moment.isMoment(parameters[p])) {
      parameters[p] = parameters[p].format('YYYY-MM-DD HH:mm:ss');
    }

    // Xử lý dateRange
    if (_.startsWith(p, 'dateRange')) {
      const dates = _.split(parameters[p], ',');
      const fromDate = moment(new Date(_.first(dates))).format('YYYY-MM-DD HH:mm:ss');
      const toDate = moment(new Date(_.last(dates))).format('YYYY-MM-DD HH:mm:ss');

      parameters[p] = _.join([fromDate, toDate], ',');
    }
  }

  return parameters;
};

export default function DynamicForm({ loading, onSubmit, onError, onExportToExcel, showHeader = false, initialFormData, initialValues, onValuesChange, formInstance, ...rest }) {
  // HOOK
  const formData = useDynamicForm(initialFormData);

  const [form] = Form.useForm();
  const [disable, setDisable] = React.useState(false);
  // State
  const [drawerVisible, setDrawerVisible] = React.useState(false);

  // Submit
  const onFinish = async (values) => {
    const parameters = formatParameters(values);

    // console.log('Final parameters:', parameters);
    if (onSubmit && typeof onSubmit === 'function') {
      onSubmit(parameters);
    }
  };

  // Validate Failed
  const onFinishFailed = (errorInfo) => {
    // console.log('Failed:', errorInfo);
    if (onError && typeof onError === 'function') {
      onError(errorInfo);
    }
  };

  React.useEffect(() => {
    if (formData) {
      form.resetFields();
    }
  }, [formData, form]);

  const Header = showHeader ? Card : ({ children }) => <div>{children}</div>;

  return (
    <Skeleton active loading={!formData}>
      {formData && (
        <React.Fragment>
          <Drawer
            title='Diễn giải / Ghi chú'
            width='40%'
            placement='right'
            closable
            onClose={() => {
              setDrawerVisible(false);
            }}
            visible={drawerVisible}
          >
            <ReactMarkdown source={formData && formData.notes} />
          </Drawer>

          <Header
            title={formData.formName}
            bordered={false}
            style={{ width: '100%' }}
            extra={
              <React.Fragment>
                <Space>
                  <Button
                    shape='circle'
                    icon={<QuestionCircleFilled />}
                    onClick={() => {
                      setDrawerVisible(true);
                    }}
                  />

                  <a target='_blank' href={`https://strapi.softech.cloud/admin/plugins/content-manager/collectionType/application::form.form/${formData.id}`}>
                    <Button shape='circle' icon={<EditFilled />} onClick={() => {}} />
                  </a>
                </Space>
              </React.Fragment>
            }
          >
            {/* --------------------------------------------------------------------------------------------- */}
            {/* FORM */}
            {/* --------------------------------------------------------------------------------------------- */}
            {
              <div>
                <Form
                  form={formInstance || form}
                  layout={formData.layout ? formData.layout.type : 'horizontal'}
                  // {...layout}
                  labelCol={formData.layout ? formData.layout.labelCol : layout.labelCol}
                  wrapperCol={formData.layout ? formData.layout.wrapperCol : layout.wrapperCol}
                  name={formData.formName ? formData.formName : 'dynamic-form'}
                  initialValues={initialValues || formData.initialValues}
                  requiredMark={formData.requiredMark}
                  onFinish={onFinish}
                  onFinishFailed={onFinishFailed}
                  onValuesChange={async (changedValues, allValues) => {
                    const promises = [];
                    formData.formFields.forEach((f) => {
                      if (f.inputComponent.dependencies) {
                        // dependencies
                        const found = _.find(f.inputComponent.dependencies, (dependency) => {
                          return Object.keys(changedValues)[0] === dependency;
                        });

                        if (found) {
                          if (f.inputComponent.dataSource) {
                            // reset options
                            const nullValue = {};
                            nullValue[f.name] = null;
                            form.setFieldsValue(nullValue);

                            // build parameters
                            const parameters = {};
                            const keys = Object.keys(allValues);
                            keys.forEach((v) => {
                              f.inputComponent.dependencies.forEach((d) => {
                                if (v === d) {
                                  if (allValues[v]) {
                                    parameters[v] = allValues[v];
                                  }
                                }
                              });
                            });

                            // check parameters
                            const numberOfFields = Object.keys(parameters).length;
                            const numberOfDepedencies = f.inputComponent.dependencies.length;
                            if (numberOfFields === numberOfDepedencies) {
                              promises.push(getOptionsAsync(f, parameters, formData.appName));
                            }
                          }
                        }
                      }
                    });
                    if (promises.length > 0) {
                      setDisable(true);
                      await Promise.all(promises);
                      setDisable(false);
                    }

                    if (onValuesChange && typeof onValuesChange === 'function') {
                      onValuesChange(changedValues, allValues);
                    }
                  }}
                  {...rest}
                >
                  {/* Dynamic fields */}
                  {formData.formFields.map((f) => {
                    if (f.inputComponent.type === 'Divider') {
                      return (
                        <Divider orientation='center' plain>
                          <strong>{f.label}</strong>
                        </Divider>
                        // <hr />
                      );
                    }
                    const inputComponent = React.createElement(inputComponents[f.inputComponent.type], f.inputComponent.props);
                    return (
                      <Form.Item hasFeedback={f.hasFeedback} dependencies={f.dependencies} key={f.name} label={f.label} name={f.name} rules={f.rules} valuePropName={f.inputComponent.type === 'Checkbox' ? 'checked' : 'value'}>
                        {inputComponent}
                      </Form.Item>
                    );
                  })}

                  {/* Submit */}
                  {!formInstance && (
                    <Form.Item wrapperCol={formData.tailLayout ? formData.tailLayout.wrapperCol : tailLayout.wrapperCol}>
                      <Button size='middle' block={formData?.layout?.type === 'vertical'} loading={loading} disabled={disable} type='primary' htmlType='submit'>
                        {formData.submitButtonText ? formData.submitButtonText : 'Submit'}
                      </Button>
                      {onExportToExcel && typeof onExportToExcel === 'function' && (
                        <Button
                          loading={loading}
                          icon={<SaveOutlined />}
                          type='default'
                          htmlType='button'
                          style={{ marginLeft: 8 }}
                          onClick={async () => {
                            const parameters = formatParameters(form.getFieldsValue());
                            onExportToExcel(parameters);
                          }}
                        >
                          Xuất ra Excel
                        </Button>
                      )}
                    </Form.Item>
                  )}
                </Form>
              </div>
            }
          </Header>
        </React.Fragment>
      )}
    </Skeleton>
  );
}
