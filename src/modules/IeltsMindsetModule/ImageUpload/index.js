import { Upload, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import React from 'react';

const ImageUpload = (props) => {
    return (
        <Upload
            {...props}
            action=""
            // name="logo"
            listType={props.listType}
            method=""
            accept={props.accept ? props.accept : ".png, .jpg"}
            onPreview={props.onPreview}
            beforeUpload={(file) => {
                // if (props.isImageUpload) {
                //     const isJPG = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'audio/mp3';
                //     if (!isJPG) {
                //         message.error('You can only upload JPG or PNG file!');
                //         return false;
                //     } else {
                //         return true;
                //     }
                // }
            }}
        >
            <Button icon={<UploadOutlined />}></Button>
        </Upload>
    );
}

export default ImageUpload;
