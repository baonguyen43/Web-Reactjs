/* eslint-disable no-unused-vars */
/* eslint-disable no-param-reassign */
import React from 'react';
import _ from 'lodash';
import moment from 'moment';
import ReportHelper from 'helpers/ReportHelper';

const getOptionsAsync = async (f, appName) => {
  f.inputComponent.props.options = [];

  if (_.isString(f.inputComponent.dataSource)) {
    if (_.startsWith(f.inputComponent.dataSource, 'http')) {
      const options = await ReportHelper.GetDataFromApi(f.inputComponent.dataSource, f.inputComponent.responseNode);
      f.inputComponent.props.options = options;
    } else {
      const options = await ReportHelper.Query(f.inputComponent.dataSource, {}, f.inputComponent.dataSourceAppName ? f.inputComponent.dataSourceAppName : appName);

      console.log(f.inputComponent);

      if (f.inputComponent.props && f.inputComponent.props.options) {
        f.inputComponent.props.options = f.inputComponent.props.options.concat(options);
      } else {
        f.inputComponent.props.options = options;
      }
    }
  } else if (_.isObject(f.inputComponent.dataSource)) {
    /*
    "dataSource": {
      "type": "api",
      "url": "https://strapi.softech.cloud/workplace-settings",
      "responseNode": "LogTypes"
    }
    */
    if (f.inputComponent.dataSource.type === 'api') {
      const options = await ReportHelper.GetDataFromApi(f.inputComponent.dataSource.url, f.inputComponent.dataSource.responseNode);
      f.inputComponent.props.options = options;
    }
  }
};

export default (initialFormData) => {
  const [formData, setFormData] = React.useState(null);

  React.useEffect(() => {
    // INIT FORM
    async function init() {
      const data = { ...initialFormData };

      // formFields
      // filter (visible)
      const formFields = _.filter(data.formFields, (f) => {
        return ((f.visible && f.visible === true) || f.visible === undefined) && f.inputComponent.type !== 'QueryString';
      });

      //
      const promises = [];
      formFields.forEach((f) => {
        if (!f.inputComponent.dependencies && f.inputComponent.dataSource) {
          promises.push(getOptionsAsync(f, data.appName));
        }
      });
      await Promise.all(promises);

      data.formFields = formFields;

      // initialValues
      const initialValues = {};
      formFields.forEach((f) => {
        initialValues[f.name] = f.initialValue;

        if (f.inputComponent.type === 'DatePicker.RangePicker') {
          // DatePicker.RangePicker'
          if (f.initialValue) {
            switch (f.initialValue) {
              case 'year':
                initialValues[f.name] = [moment().startOf('Y'), moment().endOf('Y')];
                break;
              case 'month':
                initialValues[f.name] = [moment().startOf('M'), moment().endOf('M')];
                break;
              case 'week':
                initialValues[f.name] = [moment().startOf('W'), moment().endOf('W')];
                break;

              default:
                initialValues[f.name] = moment(f.initialValue, 'YYYY-MM-DD');
                break;
            }
          } else {
            initialValues[f.name] = [moment(), moment()];
          }
        } else if (f.inputComponent.type === 'DatePicker') {
          // DatePicker
          if (f.initialValue) {
            switch (f.initialValue) {
              case 'startOfYear':
                initialValues[f.name] = moment().startOf('Y');
                break;
              case 'endOfYear':
                initialValues[f.name] = moment().endOf('Y');
                break;
              case 'startOfMonth':
                initialValues[f.name] = moment().startOf('M');
                break;
              case 'endOfMonth':
                initialValues[f.name] = moment().endOf('M');
                break;
              case 'startOfWeek':
                initialValues[f.name] = moment().startOf('W');
                break;
              case 'endOfWeek':
                initialValues[f.name] = moment().endOf('W');
                break;
              default:
                initialValues[f.name] = moment(f.initialValue, 'YYYY-MM-DD');
                break;
            }
          } else {
            initialValues[f.name] = moment();
          }
        } else if (f.inputComponent.type === 'Select') {
          // const firstOption = _.first(f.inputComponent.props.options);
          // if (firstOption) {
          //   initialValues[f.name] = firstOption.value;
          // }

          if (f.initialValue) {
            switch (f.initialValue) {
              case 'currentMonth':
                initialValues[f.name] = moment().format('M');
                break;
              case 'currentYear':
                initialValues[f.name] = moment().format('YYYY');
                break;
              default:
                initialValues[f.name] = f.initialValue;
                break;
            }
          }
        } else if (f.inputComponent.type === 'InputNumber') {
          //
          if (f.initialValue) {
            switch (f.initialValue) {
              case 'currentMonth':
                initialValues[f.name] = moment().format('M');
                break;
              case 'currentYear':
                initialValues[f.name] = moment().format('YYYY');
                break;
              default:
                initialValues[f.name] = f.initialValue;
                break;
            }
          }
        }
      });

      // initialValues
      data.initialValues = initialValues;

      setFormData(data);
      // console.log('⭐ Final form data', data);
    }
    if (initialFormData) {
      init();
    }
  }, [initialFormData]);

  return formData;
};
