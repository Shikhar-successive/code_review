import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import { graphql } from '@apollo/react-hoc';
import { CircularProgress } from '@material-ui/core';
import { AddDialog, EditDialog, DeleteDialog } from './Componants';
import { Table } from '../../components';
import { getFormattedDate } from '../../libs/utils/getFormattedDate';
import { SnackbarContext } from '../../contexts/SnackBarProvider/SnackBarProvider';
import { callApi } from '../../libs/utils';
import { withLoaderAndMessage } from '../../components/hoc';
import { GET_USER } from './query';

const asend = 'asc';
const dsend = 'desc';
class TraineeList extends Component {
  EnhancedTable = withLoaderAndMessage(Table);

  constructor() {
    super();
    this.state = {
      open: false,
      orderBy: '',
      order: asend,
      page: 0,
      edit: false,
      deleteDialog: false,
      traineeInfo: {},
      spinner: true,
    };
  }

  async componentDidMount() {
    // const limit = 5;
    // const { page } = this.state;
    // const skip = page * limit;
    // console.log(skip);
    // const trainee = await callApi({}, 'get', '/trainee/getall', { skip, limit });
    // eslint-disable-next-line react/destructuring-assignment

    // console.log(this.props.data);
    // const { data: { getAllTrainee: { data: { totalRecords, records } }, loading } } = this.props;
    // this.setState({
    //   data: {
    //     details: records,
    //     traineeCount: totalRecords,
    //   },
    //   spinner: loading,
    // });
    // refetch({ variables: { skip, limit } });
    // console.log(records);

    // const trainee = await getAllTrainee({ variables: { skip, limit } });
    // if (trainee === 'Network Error') {
    //   this.setState({ spinner: false });
    // } else if (trainee.message === 'No data Found') {
    //   this.setState({
    //     data: {
    //       traineeCount: 0,
    //     },
    //     spinner: false,
    //   });
    // } else if (trainee) {
    //   const traineeData = trainee.data.records;
    //   this.setState({
    //     data: {
    //       details: traineeData,
    //       traineeCount: trainee.data.totalRecords,
    //     },
    //     spinner: false,
    //   });
    // } else if (localStorage.getItem('token') === null) {
    //   const { history } = this.props;
    //   history.push('/login');
    // }
  }

  onOpen = () => {
    this.setState({ open: true });
  };

  onCloseEvent = () => {
    this.setState({ open: false });
  };

  handleSubmit = async (openSnackbar, state) => {
    const userInfo = {
      name: state.name,
      email: state.email,
      password: state.password,
      role: 'trainee',
      createdBy: 'Admin',
    };
    this.setState({
      spinner: true,
    });
    const user = await callApi(userInfo, 'post', '/trainee/create');
    if (user.data) {
      openSnackbar(user.message, 'success');
      this.setState({
        spinner: false,
      }, () => this.componentDidMount());
      this.onCloseEvent();
      this.getTrainees();
    } else if (user === 'Network Error') {
      openSnackbar('Network Error', 'error');
      this.setState({ spinner: false });
      this.onCloseEvent();
    } else if (user.response.status) {
      if (localStorage.getItem('token') === null) {
        this.onCloseEvent();
        openSnackbar(user.response.data.message, 'error');
        const { history } = this.props;
        history.push('/login');
      }
      if (user.response.status === 403) {
        openSnackbar(user.response.data.message, 'error');
        this.setState({
          spinner: false,
        }, () => this.componentDidMount());
        this.onCloseEvent();
        this.getTrainees();
      }
    }
    return '';
  }

  editDialogOpen = (item) => {
    this.selectedItem = item;
    this.setState({ edit: true, traineeInfo: item });
  };

  editDialogClose = () => {
    this.selectedIem = null;
    this.setState({ edit: false });
  };

  handleEdit = async (openSnackbar, state) => {
    const userInfo = {
      originalId: state.traineeId,
      name: state.name,
      email: state.email,
      role: 'trainee',
      updatedBy: 'Admin',
    };
    this.setState({
      spinner: true,
    });
    const updateUser = await callApi(userInfo, 'put', '/trainee/update');
    if (updateUser.data) {
      openSnackbar(updateUser.message, 'success');
      this.setState({
        spinner: false,
      }, () => this.componentDidMount());
      this.editDialogClose();
      this.getTrainees();
    } else if (updateUser === 'Network Error') {
      openSnackbar('Network Error', 'error');
      this.setState({ spinner: false });
      this.editDialogClose();
    } else if (updateUser.response.status) {
      if (localStorage.getItem('token') === null) {
        this.onCloseEvent();
        openSnackbar(updateUser.response.data.message, 'error');
        const { history } = this.props;
        history.push('/login');
      } else if (updateUser.response.status === 403) {
        openSnackbar(updateUser.response.data.message, 'error');
        this.setState({
          spinner: false,
        }, () => this.componentDidMount());
        this.editDialogClose();
        this.getTrainees();
      }
    }
    return '';
  }

  deleteDialogOpen = (item) => {
    this.selectedIem = item;
    this.setState({ deleteDialog: true, traineeInfo: item });
  };

  deleteDialogClose = () => {
    this.selectedIem = null;
    this.setState({ deleteDialog: false });
  };

  handleDelete = async (openSnackbar) => {
    this.setState({
      spinner: true,
    });
    let { page } = this.state;
    const { traineeInfo, data } = this.state;
    if (traineeInfo.createdAt >= '2019-02-14') {
      const deleteRec = await callApi({}, 'delete', `/trainee/delete/${traineeInfo.originalId}`);
      if (deleteRec.data) {
        openSnackbar(deleteRec.message, 'success');
        if (page > 0) {
          if (((data.traineeCount - 1) % 5) > 0) {
            console.log(traineeInfo);
            this.setState({
              spinner: false,
            }, () => this.componentDidMount());
            this.deleteDialogClose();
            this.getTrainees();
            console.log(data.traineeCount);
            console.log(page, '---page 1');
          } else if (((data.traineeCount - 1) % 5) === 0) {
            if (!((data.traineeCount - 1) / 5 === page)) {
              console.log(Math.round(data.traineeCount / 5) === page, '2');
              console.log(page);
              this.setState({
                spinner: false,
                // page: page -= 1,
              }, () => this.componentDidMount());
              this.deleteDialogClose();
              this.getTrainees();
              console.log(data.traineeCount);
              console.log(page, '---page 2');
            } else if ((data.traineeCount - 1) / 5 === page) {
              console.log(Math.round(data.traineeCount / 5) === page, '2aa');
              console.log(page);
              this.setState({
                spinner: false,
                page: page -= 1,
              }, () => this.componentDidMount());
              this.deleteDialogClose();
              this.getTrainees();
              console.log(data.traineeCount);
              console.log(page, '---page 2aa');
            }
          }
        } else if (page === 0) {
          this.setState({
            spinner: false,
          }, () => this.componentDidMount());
          this.deleteDialogClose();
          this.getTrainees();
          console.log(data.traineeCount);
          console.log(page, '---page 4');
        }
      } else if (deleteRec === 'Network Error') {
        openSnackbar('Network Error', 'error');
        this.setState({ spinner: false });
        this.deleteDialogClose();
      } else if (deleteRec.response.status) {
        if (localStorage.getItem('token') === null) {
          this.onCloseEvent();
          openSnackbar(deleteRec.response.data.message, 'error');
          const { history } = this.props;
          history.push('/login');
        } else if (deleteRec.response.status === 403) {
          openSnackbar(deleteRec.response.data.message, 'error');
          this.setState({
            spinner: false,
          }, () => this.componentDidMount());
          this.deleteDialogClose();
          this.getTrainees();
        }
      }
    }
  }

  handleSort = (field) => {
    const { order, orderBy } = this.state;
    let tabOrder = asend;
    if (orderBy === field && order === asend) {
      tabOrder = dsend;
    }
    this.setState({ orderBy: field, order: tabOrder });
  }

  handleSelect = async (openSnackbar, data) => {
    localStorage.setItem('traineeDetail', JSON.stringify(data));
    const response = await this.getTrainees();
    if (response === 'Network Error') {
      openSnackbar('Network Error', 'error');
    } else if (localStorage.getItem('token') === null) {
      openSnackbar('token expired', 'error');
      const { history } = this.props;
      history.push('/login');
    } else {
      const { history } = this.props;
      history.push(`/trainee/${data.originalId}`);
    }
  }

  handlePageChange = (event, page) => {
    const { data: { refetch } } = this.props;
    const limit = 5;
    const skip = page * limit;
    console.log('handlePageChange', page);
    console.log('reeee', refetch);
    this.setState({ page }, () => refetch({ skip, limit }));
  }

  getTrainees = async () => {
    const trainee = await callApi({}, 'get', '/trainee/getall');
    return trainee;
  }

  render() {
    // console.log('propsss', this.props);
    // const { data } = this.props;
    const { data: { loading } } = this.props;
    // console.log(data);
    const {
      open,
      deleteDialog,
      order,
      orderBy,
      page,
      edit,
      traineeInfo,
      spinner,
    } = this.state;
    const limit = 5;
    if (loading) {
      return <CircularProgress size={24} />;
    }
    const { data: { getAllTrainee: { data: { totalRecords, records } } } } = this.props;
    return (
      <SnackbarContext.Consumer>
        {(openSnackbar) => (
          <>
            <div style={{ display: 'flex', justifyContent: 'end' }}>
              <Button color="primary" variant="contained" onClick={this.onOpen} style={{ marginTop: '5px' }}>
                Add Trainee
              </Button>
              <AddDialog
                open={open}
                onClose={this.onCloseEvent}
                onSubmit={(state) => this.handleSubmit(openSnackbar, state)}
                loading={spinner}
              />
            </div>
            <this.EnhancedTable
              id="id"
              data={records}
              column={[
                {
                  field: 'name',
                  label: 'Name',
                },
                {
                  field: 'email',
                  label: 'Email Address',
                  format: (value) => value && value.toUpperCase(),
                },
                {
                  field: 'createdAt',
                  label: 'Date',
                  align: 'right',
                  format: getFormattedDate,
                },
              ]}
              actions={[
                {
                  icon: <EditIcon />,
                  handler: this.editDialogOpen,
                },
                {
                  icon: <DeleteIcon />,
                  handler: this.deleteDialogOpen,
                },
              ]}
              orderBy={orderBy}
              order={order}
              onSort={this.handleSort}
              onSelect={(detail) => this.handleSelect(openSnackbar, detail)}
              count={totalRecords}
              page={page}
              onPageChange={this.handlePageChange}
              rowsPerPage={limit}
              loading={loading}
              dataLength={totalRecords}
            />
            <>
              { edit && (
                <EditDialog
                  details={traineeInfo}
                  open={edit}
                  onClose={this.editDialogClose}
                  onSubmit={(state) => this.handleEdit(openSnackbar, state)}
                  item={this.selectedItem}
                  loading={spinner}
                />
              )}
              { deleteDialog && (
                <DeleteDialog
                  open={deleteDialog}
                  onClose={this.deleteDialogClose}
                  onDelete={() => this.handleDelete(openSnackbar)}
                  loading={spinner}
                />
              )}
            </>
          </>
        )}
      </SnackbarContext.Consumer>
    );
  }
}
TraineeList.propTypes = {
  history: PropTypes.instanceOf(Object).isRequired,
  data: PropTypes.instanceOf(Object).isRequired,
  // getAllTrainee: PropTypes.instanceOf(Object).isRequired,
};

export default graphql(GET_USER, {
  options: {
    variables: { skip: 0, limit: 5 },
  },
})(TraineeList);
