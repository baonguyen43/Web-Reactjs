/* eslint-disable react/prop-types */
/* eslint-disable react/no-string-refs */
import React from 'react';
import { Calendar } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import ReactBSAlert from 'react-bootstrap-sweetalert';
// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Modal,
  Container,
  Row,
  Col,
  Breadcrumb,
  BreadcrumbItem,
} from 'reactstrap';
// core components
import { dynamicApiAxios } from 'configs/api';
import moment from 'moment';
import Loading from 'components/Loading';
import Notifications from 'components/Notification';
import { Popconfirm, message } from 'antd';

class CalendarView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      events: [],
      alert: null,
      indexTimeSelected: null,
      StudentId: null,
      isDisabledBookButton: true,
      currentDate: moment(Date.now()).format('YYYY-MM-DD'),
    };
    this.calendar = null;
    // console.log('🚀 ~ file: Calendar.js ~ line 37 ~ CalendarView ~ constructor ~ events', this.state.events)
    // console.log('🚀 ~ file: Calendar.js ~ line 37 ~ CalendarView ~ constructor ~ events', this.state.currentDate)
  }

  componentDidMount = async () => {
    await this.getData();
  };

  getData = async () => {
    let StudentId = '';
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));

    const bookingCalendar = JSON.parse(localStorage.getItem('bookingCalendar'));

    const removeBookingCalendar = JSON.parse(localStorage.getItem('removeBookingCalendar'));

    if (bookingCalendar) {
      const date = moment(bookingCalendar.Date).format('DD/MM/YYYY');
      const time = 10;
      const text = `Bạn đã đăng ký thành công buổi học ${date}. Bạn hãy đến đúng giờ. Lưu ý: nếu bạn bỏ buổi mà không xóa đăng ký trước 24h hệ thống sẽ vẫn tự trừ giờ học của bạn”`;
      Notifications('warning', 'Thông báo', text, 'tc', time);
      localStorage.removeItem('bookingCalendar');
    }

    if (removeBookingCalendar) {
      const message = removeBookingCalendar.message;
      if (message === 'Hủy lịch thành công') {
        Notifications('success', 'Thông báo', message);
      } else {
        Notifications('danger', 'Thông báo', message, 'tc', 5);
      }

      localStorage.removeItem('removeBookingCalendar');
    }

    if (loggedInUser?.typeLogin.includes('ames')) {
      StudentId = loggedInUser.userMyames.StudentId;
    } else {
      StudentId = loggedInUser.userMyai.StudentId;
    }
    // const newDate = Date.now();

    // const date = moment(newDate).format('YYYY-MM-DD');

    const listResponse = await dynamicApiAxios.query.post('', {
      sqlCommand: '[EBM.SOFTECH.EDU.VN].dbo.p_AMES247_Calendar_Room_Booking_V4',
      parameters: {
        StudentId,
        FromDate: '2021-01-01',
        ToDate: this.state.currentDate,
      },
    });
    // console.log("🚀 ~ file: Calendar.js ~ line 93 ~ CalendarView ~ getData= ~ this.state.currentDate", this.state.currentDate)
    // console.log('🚀 ~ file: Calendar.js ~ line 93 ~ CalendarView ~ getData= ~ listResponse', listResponse)
    let data = listResponse.data.items;
    if (data.length) {
      data.forEach((item, index) => {
        if (!item.available) {
          if (!item.bookingInfo) return;
          const bookingInfoParse = JSON.parse(item.bookingInfo);
          const {
            // Date,
            RoomName,
            Floor,
            SlotName,
          } = bookingInfoParse[0];
          // const dateDefault = moment(Date).format('YYYY-MM-DD')
          item.title = `Time ${SlotName} - Room:${RoomName} - Floor ${Floor}`;
          // item.dateDefault = dateDefault
        }
      });
    } else {
      data = [
        {
          id: 1,
        },
      ];
    }
    let defaultDate = moment(Date.now()).format('YYYY-MM');

    if (bookingCalendar) {
      defaultDate = moment(bookingCalendar.Date).format('YYYY-MM-DD');
    }
    if (removeBookingCalendar) {
      defaultDate = moment(removeBookingCalendar.Date).format('YYYY-MM-DD');
    }
    // Lỗi ban đầu giữa defaultDate và this.state.currentDate
    // console.log(this.state.currentDate);
    this.setState({ events: JSON.parse(JSON.stringify(data)), StudentId }, () => this.createCalendar(defaultDate));
  };

  toClass = async (item, index) => {
    let StudentId = '';
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));

    if (loggedInUser?.typeLogin.includes('ames')) {
      StudentId = loggedInUser.userMyames.StudentId;
    } else {
      StudentId = loggedInUser.userMyai.StudentId;
    }

    await dynamicApiAxios.query.post('', {
      sqlCommand: '[EBM.SOFTECH.EDU.VN].dbo.p_API_EBM_Student_Mapping_TimeJoin_ByUser',
      parameters: {
        studentId: StudentId,
        roomId: item.RoomId,
      },
    });
  };

  toAttendanceStudent = async (item, index) => {
    try {
      const date = moment(Date.now()).format('YYYY-MM-DD');
      await dynamicApiAxios.query.post('', {
        sqlCommand: '[EBM.SOFTECH.EDU.VN].dbo.p_API_AMES247_StudentAttendance',
        parameters: {
          studentId: item.SlotId,
          classId: item.RoomId,
          date,
        },
      });
      // console.log("🚀 ~ file: Calendar.js ~ line 179 ~ CalendarView ~ toAttendanceStudent= ~ listResponse", listResponse)
    } catch (error) {
      // Notifications('danger', 'Thông báo', 'Có lỗi xảy ra vui lòng thử lại sau');
    }
  };

  createCalendar = (defaultDate) => {
    if (this.calendar) {
      this.calendar.destroy();
    }

    this.calendar = new Calendar(this.refs.calendar, {
      // height: 650,
      plugins: [dayGridPlugin],
      defaultView: 'dayGridMonth',
      defaultDate: defaultDate,
      selectable: true,
      selectHelper: true,
      editable: true,
      events: this.state.events,
      // Add new event
      select: (info) => {
        this.setState({
          modalAdd: true,
          startDate: info.startStr,
          endDate: info.endStr,
          radios: 'bg-info',
        });
      },

      // Edit calendar event action
      eventClick: ({ event }) => {
        if (!event) return null;
        const { bookingInfo, available, description } = event?.extendedProps;
        let showModalChange = available;
        let showModalDetail = !available;
        if (bookingInfo) {
          showModalChange = true;
        }
        if (showModalDetail) {
          showModalChange = false;
        }

        this.setState({
          modalChange: showModalChange,
          modalDetais: showModalDetail,
          eventId: event.id,
          eventDescription: JSON.parse(description),
          radios: 'bg-info',
          event: event,
        });
      },
    });

    this.calendar.render();
    this.setState({
      currentDate: this.calendar.view.title,
    });
  };

  bookCalendar = async () => {
    const {
      // indexTimeSelected,
      eventDescription,
      StudentId,
    } = this.state;
    for (let index = 0; index < eventDescription.length; index++) {
      const element = eventDescription[index];
      if (element.isSelected && !element.IsBooking) {
        const {
          RoomId,
          SlotId,
          Date,
          // SlotName
        } = element;
        const parameters = {
          RoomId,
          SlotId,
          Date,
          StudentId,
        };
        try {
          await dynamicApiAxios.query.post('', {
            sqlCommand: '[EBM.SOFTECH.EDU.VN].dbo.p_EBM_Book_Room_Slot',
            parameters,
          });
          this.setState({ indexTimeSelected: null, isDisabledBookButton: true });
          const bookingCalendarString = JSON.stringify(parameters);
          localStorage.setItem('bookingCalendar', bookingCalendarString);
        } catch (error) {
          Notifications('danger', 'Thông báo', 'Có lỗi xảy ra vui lòng thử lại sau');
        }
      }
    }
    await this.getData();
  };

  removeBookingCalendar = async (item) => {
    const { event, StudentId } = this.state;
    if (!event) return null;
    const bookingInfo = JSON.parse(event.extendedProps.bookingInfo);
    const bookingIndex = bookingInfo.findIndex((x) => x.SlotId === item.SlotId);
    if (!bookingInfo || bookingIndex === -1) return null;
    const { RoomId, SlotId, Date } = bookingInfo[bookingIndex];

    const parameters = {
      RoomId,
      SlotId,
      Date,
      StudentId,
    };

    try {
      const res = await dynamicApiAxios.query.post('', {
        sqlCommand: '[EBM.SOFTECH.EDU.VN].dbo.p_EBM_Remove_Book_Room_Slot',
        parameters,
      });
      const params = {
        ...parameters,
        message: res.data.items[0].message,
      };
      if (res.data.items[0].message !== 'Bạn không thể hủy lịch học trong vòng 24h') {
        item.isSelected = !item.isSelected;
        this.setState({ modalChange: !this.state.modalChange });
      }
      localStorage.setItem('removeBookingCalendar', JSON.stringify(params));
      await this.getData();
    } catch (error) {
      Notifications('danger', 'Có lỗi xảy ra vui lòng thử lại sau');
    }
  };

  changeView = (newView) => {
    this.calendar.changeView(newView);
    this.setState({
      currentDate: this.calendar.view.title,
    });
  };

  addNewEvent = () => {
    var newEvents = this.state.events;
    newEvents.push({
      title: this.state.eventTitle,
      start: this.state.startDate,
      end: this.state.endDate,
      className: this.state.radios,
      id: this.state.events[this.state.events.length - 1] + 1,
    });
    this.calendar.addEvent({
      title: this.state.eventTitle,
      start: this.state.startDate,
      end: this.state.endDate,
      className: this.state.radios,
      id: this.state.events[this.state.events.length - 1] + 1,
    });
    this.setState({
      modalAdd: false,
      events: newEvents,
      startDate: undefined,
      endDate: undefined,
      radios: 'bg-info',
      eventTitle: undefined,
    });
  };

  changeEvent = () => {
    var newEvents = this.state.events.map((prop, key) => {
      if (prop.id + '' === this.state.eventId + '') {
        this.state.event.remove();
        this.calendar.addEvent({
          ...prop,
          title: this.state.eventTitle,
          className: this.state.radios,
          description: this.state.eventDescription,
        });
        return {
          ...prop,
          title: this.state.eventTitle,
          className: this.state.radios,
          description: this.state.eventDescription,
        };
      } else {
        return prop;
      }
    });
    this.setState({
      modalChange: false,
      events: newEvents,
      radios: 'bg-info',
      eventTitle: undefined,
      eventDescription: undefined,
      eventId: undefined,
      event: undefined,
    });
  };

  selectTime = (item, index) => () => {
    item.isSelected = !item.isSelected;
    const isAnyItemSelected = this.state.eventDescription.findIndex((x) => x.isSelected) > -1;
    const isDisabledBookButton = !isAnyItemSelected;
    this.setState({ indexTimeSelected: index, isDisabledBookButton });
  };

  handleDisableNotification = (item) => {
    if (!item.Available) {
      message.error(item.Capacity ? 'Bạn không thể đặt lớp trong vòng 24h !' : 'Lớp đã hết chỗ !');
    }
  };

  renderModalChange = () => {
    const { eventDescription, modalChange } = this.state;
    return (
      <Modal
        isOpen={modalChange}
        toggle={() => this.setState({ modalChange: false })}
        className="modal-dialog-centered modal-secondary"
      >
        <div className="modal-body">
          <Form className="edit-event--form">
            <FormGroup>
              <label className="form-control-label text-primary" style={{ fontSize: 20, fontWeight: '600' }}>
                AMES ENGLISH
              </label>
            </FormGroup>
            <FormGroup>
              {eventDescription &&
                eventDescription.map((item, index) => {
                  let color = 'secondary';
                  if (item.IsBooking || item.isSelected) {
                    color = 'primary';
                  }

                  return item.IsBooking ? (
                    <div>
                      <p className="form-control-label" style={{ fontSize: 16 }}>
                        Choose a lesson time
                      </p>
                      <Popconfirm
                        okText="Yes"
                        cancelText="No"
                        onConfirm={() => this.removeBookingCalendar(item)}
                        placement="top"
                        title="Bạn có chắc chắn muốn huỷ buổi học này"
                      >
                        <div>
                          <Button
                            style={{ width: '100%' }}
                            disabled={!item.Available}
                            className="mt-2 mb-2"
                            color={color}
                          >
                            {`Room - ${item.RoomName} - ${item.SlotName} - ${item.ReservationRemaining} Remain`}
                            <i className="ml-2 text-white fas fa-trash"></i>
                          </Button>
                        </div>
                      </Popconfirm>
                    </div>
                  ) : (
                    <div key={index}>
                      <p className="form-control-label" style={{ fontSize: 16 }}>
                        {item.Tittle}
                      </p>

                      {item.GroupClass !== 'ONLINE' && item.GroupClass !== 'ACSS' && (
                        <div onClick={() => this.handleDisableNotification(item, index)}>
                          <Button
                            style={{ width: '100%', pointerEvents: !item.Available ? 'none' : null }}
                            disabled={!item.Available}
                            className="mt-2 mb-2"
                            color={color}
                            onClick={this.selectTime(item, index)}
                          >
                            {`Room - ${item.RoomName} - ${item.SlotName} - ${item.ReservationRemaining} Remain`}
                          </Button>
                        </div>
                      )}

                      {item.GroupClass === 'ONLINE' && (
                        <>
                          <Button
                            style={{ width: '100%', backgroundColor: '#012B57' }}
                            className="mt-2 mb-2"
                            color="white"
                            onClick={(e) => {
                              this.toClass(item);
                              e.preventDefault();
                              window.open(`${item.ClassRoomLink}`);
                            }}
                          >
                            <p
                              style={{ margin: 0, padding: 0, color: 'white' }}
                            >{`${item.RoomName} - ${item.SlotName}`}</p>
                            <p style={{ margin: 0, padding: 0, color: 'white' }}>{item.ClassRoomLink}</p>
                          </Button>
                        </>
                      )}

                      {item.GroupClass === 'ACSS' && (
                        <>
                          <Button
                            style={{ width: '100%', backgroundColor: '#012B57' }}
                            className="mt-2 mb-2"
                            color="white"
                            onClick={(e) => {
                              this.toAttendanceStudent(item);
                              e.preventDefault();
                              window.open(`${item.ClassRoomLink}`);
                            }}
                          >
                            <p
                              style={{ margin: 0, padding: 0, color: 'white' }}
                            >{`${item.RoomName} - ${item.SlotName}`}</p>
                            <p style={{ margin: 0, padding: 0, color: 'white' }}>{item.ClassRoomLink}</p>
                          </Button>
                        </>
                      )}
                    </div>
                  );
                })}
              <i className="form-group--bar" />
            </FormGroup>
            <input className="edit-event--id" type="hidden" />
          </Form>
        </div>
        <div className="modal-footer">
          <Button
            color="secondary"
            onClick={() => this.setState({ modalChange: false, indexTimeSelected: null, isDisabledBookButton: true })}
          >
            Close
          </Button>
          <Button
            disabled={this.state.isDisabledBookButton}
            className="ml-auto"
            color="primary"
            onClick={() => this.setState({ modalChange: false }, () => this.bookCalendar())}
          >
            Book
          </Button>
        </div>
      </Modal>
    );
  };

  renderModalDetails = () => {
    const { event, modalDetais } = this.state;
    if (!event) return null;
    const bookingInfo = JSON.parse(event.extendedProps.bookingInfo);
    if (!bookingInfo) return null;
    const dateFormat = moment(bookingInfo[0].Date).format('DD-MM-YYYY');
    const slotName = bookingInfo[0].SlotName;
    return (
      <Modal
        isOpen={modalDetais}
        toggle={() => this.setState({ modalDetais: false })}
        className="modal-dialog-centered modal-secondary modal-lg"
      >
        <div className="modal-body">
          <Form className="edit-event--form">
            <FormGroup>
              <label className="form-control-label text-primary" style={{ fontSize: 20, fontWeight: '600' }}>
                AMES ENGLISH
              </label>
            </FormGroup>
            <FormGroup>
              <p className="form-control-label">Study schedule has been completed</p>
              {bookingInfo && (
                <Button
                  style={{ width: '100%' }}
                  className="mt-2 mb-2"
                  color="primary"
                  onClick={(e) => e.preventDefault()}
                >
                  {`Day ${dateFormat} - ${slotName} - Room:${bookingInfo[0].RoomName} - Floor ${bookingInfo[0].Floor} `}
                </Button>
              )}
              <i className="form-group--bar" />
            </FormGroup>
            <input className="edit-event--id" type="hidden" />
          </Form>
        </div>
        <div className="modal-footer">
          <Button
            color="secondary"
            onClick={() => this.setState({ modalDetais: false, indexTimeSelected: null, isDisabledBookButton: true })}
          >
            Close
          </Button>
          <Popconfirm
            okText="Yes"
            cancelText="No"
            onConfirm={() => this.setState({ modalDetais: false }, () => this.removeBookingCalendar(bookingInfo[0]))}
            placement="top"
            title="Bạn có chắc chắn muốn huỷ buổi học này"
          >
            <Button className="ml-auto" color="primary">
              Remove Class
            </Button>
          </Popconfirm>
        </div>
      </Modal>
    );
  };

  deleteEventSweetAlert = () => {
    this.setState({
      alert: (
        <ReactBSAlert
          warning
          style={{ display: 'block', marginTop: '-100px' }}
          title="Are you sure?"
          onConfirm={() =>
            this.setState({
              alert: false,
              radios: 'bg-info',
              eventTitle: undefined,
              eventDescription: undefined,
              eventId: undefined,
            })
          }
          onCancel={() => this.deleteEvent()}
          confirmBtnCssClass="btn-secondary"
          cancelBtnBsStyle="danger"
          confirmBtnText="Cancel"
          cancelBtnText="Yes, delete it"
          showCancel
          btnSize=""
        >
          {"You won't be able to revert this!"}
        </ReactBSAlert>
      ),
    });
  };

  deleteEvent = () => {
    var newEvents = this.state.events.filter((prop) => prop.id + '' !== this.state.eventId);
    this.state.event.remove();
    this.setState({
      alert: (
        <ReactBSAlert
          success
          style={{ display: 'block', marginTop: '-100px' }}
          title="Success"
          onConfirm={() => this.setState({ alert: null })}
          onCancel={() => this.setState({ alert: null })}
          confirmBtnBsStyle="primary"
          confirmBtnText="Ok"
          btnSize=""
        >
          A few words about this sweet alert ...
        </ReactBSAlert>
      ),
      modalChange: false,
      events: newEvents,
      radios: 'bg-info',
      eventTitle: undefined,
      eventDescription: undefined,
      eventId: undefined,
      event: undefined,
    });
  };
  render() {
    if (!this.state.events.length) return <Loading />;

    return (
      <>
        {this.state.alert}
        <div className="header header-dark bg-gradient-default pb-6 content__title content__title--calendar">
          <Container fluid>
            <div className="header-body">
              <Row className="align-items-center py-4">
                <Col lg="6">
                  <h6 className="fullcalendar-title h2 text-white d-inline-block mb-0 mr-1">
                    {this.state.currentDate}
                  </h6>
                  <Breadcrumb
                    className="d-none d-md-inline-block ml-lg-4"
                    listClassName="breadcrumb-links breadcrumb-dark"
                  >
                    <BreadcrumbItem>
                      <a href="#pablo" onClick={(e) => e.preventDefault()}>
                        <i className="fas fa-home" />
                      </a>
                    </BreadcrumbItem>
                    <BreadcrumbItem>
                      <a href="#pablo" onClick={(e) => this.props.history.push('/ames')}>
                        Dashboard
                      </a>
                    </BreadcrumbItem>
                    <BreadcrumbItem aria-current="page" className="active">
                      Calendar
                    </BreadcrumbItem>
                  </Breadcrumb>
                </Col>
                <Col className="mt-3 mt-md-0 text-md-right" lg="6">
                  <Button
                    className="fullcalendar-btn-prev btn-neutral"
                    color="default"
                    onClick={() => {
                      const preMonth = moment(this.state.currentDate).subtract(1, 'M').format('YYYY-MM-DD');

                      this.calendar.prev();
                      this.setState(
                        {
                          currentDate: preMonth,
                          events: [],
                        },
                        () => {
                          this.getData();
                        }
                      );
                    }}
                    size="sm"
                  >
                    <i className="fas fa-angle-left" />
                  </Button>
                  <Button
                    className="fullcalendar-btn-next btn-neutral"
                    color="default"
                    onClick={() => {
                      const nextMonth = moment(this.state.currentDate).add(1, 'M').format('YYYY-MM-DD');
                      this.calendar.next();
                      this.setState(
                        {
                          currentDate: nextMonth,
                          events: [],
                        },
                        () => {
                          this.getData();
                        }
                      );
                    }}
                    size="sm"
                  >
                    <i className="fas fa-angle-right" />
                  </Button>
                </Col>
              </Row>
            </div>
          </Container>
        </div>
        <Container className="mt--6" fluid>
          <Row>
            <div className="col">
              <Card className="card-calendar">
                <CardHeader>
                  <div>
                    <h5 className="h3 mb-0">Calendar</h5>
                  </div>
                  <div className="float-right d-flex flex-row">
                    <span className="bg-success" style={{ width: 20, height: 20, borderRadius: 10 }} />
                    <span className="ml-2 mr-3 text-primary" style={{ fontSize: 15, fontWeight: '600' }}>
                      Available
                    </span>
                    <span className="bg-danger" style={{ width: 20, height: 20, borderRadius: 10 }} />
                    <span className="ml-2 mr-3 text-primary" style={{ fontSize: 15, fontWeight: '600' }}>
                      Unavailable
                    </span>
                    <span className="bg-primary" style={{ width: 20, height: 20, borderRadius: 10 }} />
                    <span className="ml-2 mr-3 text-primary" style={{ fontSize: 15, fontWeight: '600' }}>
                      Booked
                    </span>
                    {/* 123 */}
                  </div>
                </CardHeader>
                <CardBody className="p-0">
                  <div className="calendar" data-toggle="calendar" id="calendar" ref="calendar" />
                </CardBody>
              </Card>
              {this.renderModalChange()}
              {this.renderModalDetails()}
            </div>
          </Row>
        </Container>
      </>
    );
  }
}

export default CalendarView;
