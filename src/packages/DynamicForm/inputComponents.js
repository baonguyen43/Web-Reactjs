/* eslint-disable jsx-a11y/media-has-caption */
/* eslint-disable no-unused-vars */
/* eslint-disable no-param-reassign */
/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { useDebounceFn } from 'ahooks';
import _ from 'lodash';
import { AutoComplete, Input, InputNumber, Radio, Checkbox, Select, DatePicker, TimePicker, Rate, Slider, Switch, TreeSelect, Mentions, Button, Tooltip, Upload, Space } from 'antd';
import { CheckOutlined, DeleteOutlined, MinusOutlined, PlusOutlined, StopOutlined, UploadOutlined } from '@ant-design/icons';
import colors from 'constants/colors';

const MySelect = React.forwardRef((props, ref) => {
  return (
    <Select
      ref={ref}
      {...props}
      getPopupContainer={(triggerNode) => {
        return triggerNode.parentNode;
      }}
    />
  );
});

const MyDatePicker = React.forwardRef((props, ref) => {
  return (
    <DatePicker
      ref={ref}
      {...props}
      getPopupContainer={(triggerNode) => {
        return triggerNode.parentNode;
      }}
    />
  );
});

const SelectMultiple = React.forwardRef((props, ref) => {
  return <Select ref={ref} {...props} allowClear optionFilterProp='label' showArrow mode='multiple' />;
});

const SelectWithSearch = React.forwardRef((props, ref) => {
  return <Select ref={ref} {...props} allowClear optionFilterProp='label' showArrow showSearch virtual={false} />;
});

const CheckBoxGroup = React.forwardRef((props, ref) => {
  return (
    <React.Fragment>
      <div style={{ marginTop: 4, marginBottom: 12 }}>
        <Button
          type='default'
          size='small'
          icon={<CheckOutlined style={{ color: colors.theme.success }} />}
          onClick={() => {
            const all = _.map(props.options, 'value');
            props.onChange(all);
          }}
        >
          Chọn tất cả
        </Button>

        <Button
          style={{ marginLeft: 6 }}
          type='default'
          size='small'
          icon={<StopOutlined style={{ color: colors.theme.danger }} />}
          onClick={() => {
            props.onChange([]);
          }}
        >
          Bỏ chọn tất cả
        </Button>
      </div>
      <Checkbox.Group ref={ref} {...props} />
    </React.Fragment>
  );
});

const MyAutoComplete = React.forwardRef((props, ref) => {
  return <AutoComplete ref={ref} {...props} filterOption={(inputValue, option) => option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1} />;
});

// ------------------------------------------------------------------------------------------------
// QUIZ
const Quiz_AnswerInputs = React.forwardRef((props, ref) => {
  const [answers, setAnswers] = React.useState(props.value);
  // console.log('🚀', props.value);

  const { run } = useDebounceFn(
    (state) => {
      props.onChange(state);
    },
    { wait: 500 },
  );

  return (
    <div ref={ref}>
      {answers.map((answer, index) => {
        return (
          <div key={answer.id} className='tw-flex tw-items-center tw-mb-2'>
            <Input
              style={{ borderColor: answer.isCorrect && colors.theme.primary }}
              value={answer.answer}
              className='mr-4'
              onChange={(e) => {
                const item = _.find(answers, (x) => x.id === index + 1);
                item.answer = e.target.value;
                setAnswers([...answers]);
                run([...answers]);
              }}
            />
            <Tooltip title='Set correct answer' placement='left'>
              <Radio
                checked={answer.isCorrect}
                onChange={(e) => {
                  const newAnswers = _.cloneDeep(answers);
                  _.forEach(newAnswers, (x) => {
                    x.isCorrect = false;
                  });

                  const item = _.find(newAnswers, (x) => x.id === index + 1);
                  item.isCorrect = e.target.checked;
                  setAnswers(newAnswers);
                  props.onChange(newAnswers);
                }}
              />
            </Tooltip>
            <Tooltip title='Remove this answer' placement='right'>
              <Button
                size='small'
                type='dashed'
                shape='circle'
                danger
                className='tw-ml-4'
                icon={<MinusOutlined size='small' />}
                onClick={() => {
                  const newState = _.filter(answers, (x) => x.id !== answer.id);
                  setAnswers(newState);
                  props.onChange(newState);
                }}
              />
            </Tooltip>
          </div>
        );
      })}
      <Tooltip title='Add more answer' placement='right'>
        <Button
          type='dashed'
          shape='circle'
          className='tw-mt-2'
          icon={<PlusOutlined size='small' />}
          onClick={() => {
            const newState = [...answers];
            newState.push({ id: answers.length + 1, answer: '', isCorrect: false });
            setAnswers(newState);
            props.onChange(newState);
          }}
        />
      </Tooltip>
    </div>
  );
});

const quiz_settings_answers_direction_options = [
  { label: 'Vertical', value: 'vertical' },
  { label: 'Horizontal', value: 'horizontal' },
];

const Quiz_Settings_Answers_Direction = React.forwardRef((props, ref) => {
  return (
    <div>
      <Radio.Group ref={ref} {...props} options={quiz_settings_answers_direction_options} />
    </div>
  );
});

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

// UPLOAD IMAGE
const UploadImage = React.forwardRef((props, ref) => {
  const [previewImage, setPreviewImage] = React.useState(props.value);

  return (
    <Space className='tw-flex tw-items-start'>
      <Upload
        ref={ref}
        fileList={[]}
        beforeUpload={async (file) => {
          const image = await getBase64(file);
          setPreviewImage(image);
        }}
        onChange={(info) => {
          props.onChange(previewImage);
        }}
      >
        <Button type='dashed' shape='circle' color={colors.theme.primary} icon={<UploadOutlined />} />
      </Upload>
      {previewImage && (
        <Button
          type='dashed'
          shape='circle'
          danger
          icon={<DeleteOutlined />}
          onClick={() => {
            setPreviewImage(null);
            props.onChange(null);
          }}
        />
      )}
      {previewImage && <img src={previewImage} alt='' style={{ height: 160 }} className='tw-rounded' />}
    </Space>
  );
});

// UPLOAD AUDIO
const UploadAudio = React.forwardRef((props, ref) => {
  const [previewAudio, setPreviewAudio] = React.useState(props.value);

  return (
    <Space>
      <Upload
        ref={ref}
        fileList={[]}
        beforeUpload={async (file) => {
          const audio = await getBase64(file);
          setPreviewAudio(audio);
        }}
        onChange={(info) => {
          props.onChange(previewAudio);
        }}
      >
        <Button type='dashed' shape='circle' icon={<UploadOutlined />} />
      </Upload>

      {previewAudio && (
        <Button
          type='dashed'
          shape='circle'
          danger
          icon={<DeleteOutlined />}
          onClick={() => {
            setPreviewAudio(null);
            props.onChange(null);
          }}
        />
      )}
      {previewAudio && <audio src={previewAudio} controls style={{ height: 36 }} />}
    </Space>
  );
});

const inputComponents = {
  Input,
  InputNumber,
  'Input.TextArea': Input.TextArea,
  // DatePicker: MyDatePicker,
  DatePicker: MyDatePicker,
  'DatePicker.RangePicker': DatePicker.RangePicker,
  TimePicker,
  Select: MySelect,
  SelectWithSearch,
  'Select.Multiple': SelectMultiple,
  Radio,
  'Radio.Group': Radio.Group,
  Switch,
  Checkbox,
  'Checkbox.Group': CheckBoxGroup,
  Rate,
  Slider,
  TreeSelect,
  Mentions,
  AutoComplete: MyAutoComplete,
  // QUIZ
  Quiz_AnswerInputs,
  Quiz_Settings_Answers_Direction,
  UploadImage,
  UploadAudio,
};

export default inputComponents;
