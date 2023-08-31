import { notification } from 'antd';
import './styles.css';

const notificationWithIcon = (type, title, description, style, placement, refContainer) => {
  notification[type]({
    message: title,
    description,
    style,
    className: 'ant-notification',
    placement: placement ?? 'topRight',
    duration: 3,
    getContainer: refContainer ? () => refContainer : null,
  });
};

export default notificationWithIcon;
