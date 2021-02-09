import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import { graphql } from '@apollo/react-hoc';
import { AddDialog, EditDialog, DeleteDialog } from './Componants';
import { Table } from '../../components';
import { getFormattedDate } from '../../libs/utils/getFormattedDate';
import { SnackbarContext } from '../../contexts/SnackBarProvider/SnackBarProvider';
import { callApi } from '../../libs/utils';
import { withLoaderAndMessage } from '../../components/hoc';
import { GET_USER } from './query';
import { TRAINEE_UPDATED, TRAINEE_DELETED } from './subscription';

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
      spinner: false,
    };
  }

  async componentDidMount() {
    const { data: { subscribeToMore } } = this.props;
    subscribeToMore({
      document: TRAINEE_UPDATED,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData) {
          return prev;
        }
        const { getAllTrainee: { data: { records } } } = prev;
        const { data: { traineeUpdated } } = subscriptionData;
        const updatedRecords = [...records].map((record) => {
          if (record.originalId === traineeUpdated.data.originalId) {
            return {
              ...record,
              ...traineeUpdated.data,
            };
          }
          return record;
        });
        return {
          getAllTrainee: {
            ...prev.getAllTrainee,
            data: {
              ...prev.getAllTrainee.data,
              records: updatedRecords,
            },
          },
        };
      },
    });
    subscribeToMore({
      document: TRAINEE_DELETED,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData) {
          return prev;
        }
        const { getAllTrainee: { data: { records } } } = prev;
        const { data: { traineeDeleted: { data } } } = subscriptionData;
        const newRecord = [...records].filter((record) => !(record.originalId === data.id));
        return {
          getAllTrainee: {
            ...prev.getAllTrainee,
            data: {
              ...prev.getAllTrainee.data,
              count: prev.getAllTrainee.data.count - 1,
              records: newRecord,
            },
          },
        };
      },
    });
  }

  onOpen = () => {
    this.setState({ open: true });
  };

  onCloseEvent = () => {
    this.setState({ open: false });
  };

  handleSubmit = async (openSnackbar, state) => {
    const {
      name,
      email,
      password,
    } = state;
    this.setState({ spinner: true });
    try {
      const { create } = this.props;
      const user = await create({
        variables: {
          name, email, password, role: 'trainee', createdBy: 'Admin',
        },
      });
      if (user.data.create.data.email === email) {
        const { data: { refetch } } = this.props;
        this.setState({
          spinner: false,
          page: 0,
        }, () => refetch({ skip: 0, limit: 5 }));
        openSnackbar(user.data.create.message, 'success');
        return this.onCloseEvent();
      }
      if (user.data.create.message === 'User is Unauthorized') {
        this.setState({
          spinner: false,
        });
        openSnackbar(user.data.create.message, 'error');
        return this.onCloseEvent();
      }
      if (user.data.create.message === 'Token Expired') {
        localStorage.removeItem('token');
        this.setState({
          spinner: false,
        });
        this.onCloseEvent();
        const { history } = this.props;
        openSnackbar(user.data.create.message, 'error');
        return history.push('/login');
      }
    } catch (error) {
      if (error.message.includes('Network error')) {
        this.setState({
          spinner: false,
        });
        openSnackbar(error.message, 'error');
        return this.onCloseEvent();
      }
    }
    return null;
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
    const { originalId, name, email } = state;
    this.setState({
      spinner: true,
    });
    try {
      const { update } = this.props;
      const updateUser = await update({
        variables: {
          originalId, name, email, role: 'trainee', updatedBy: 'Admin',
        },
      });
      if (updateUser.data.update.data.email === email) {
        const { data: { refetch } } = this.props;
        this.setState({
          spinner: false,
        }, () => refetch());
        openSnackbar(updateUser.data.update.message, 'success');
        return this.editDialogClose();
      } if (updateUser.data.update.message === 'User is Unauthorized') {
        this.setState({
          spinner: false,
        });
        openSnackbar(updateUser.data.update.message, 'error');
        return this.editDialogClose();
      } if (updateUser.data.update.message === 'Token Expired') {
        localStorage.removeItem('token');
        this.setState({
          spinner: false,
        });
        this.onCloseEvent();
        const { history } = this.props;
        openSnackbar(updateUser.data.update.message, 'error');
        return history.push('/login');
      }
    } catch (error) {
      if (error.message.includes('Network error')) {
        this.setState({
          spinner: false,
        });
        openSnackbar(error.message, 'error');
        return this.editDialogClose();
      }
    }
    return null;
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
    let { page } = this.state;
    const { traineeInfo } = this.state;
    const { originalId } = traineeInfo;
    const { data: { refetch, getAllTrainee: { data: { totalRecords } } } } = this.props;
    this.setState({
      spinner: true,
    });
    if (traineeInfo.createdAt >= '2019-02-14') {
      const { deleteUser } = this.props;
      try {
        const deleteRec = await deleteUser({ variables: { originalId } });
        if (deleteRec.data.deleteUser.data.id === originalId) {
          openSnackbar(deleteRec.data.deleteUser.message, 'success');
          if (page > 0) {
            if (((totalRecords - 1) % 5) > 0) { // if record is NOT last on the page
              this.setState({
                spinner: false,
              }, () => refetch());
              return this.deleteDialogClose();
            }
            if (((totalRecords - 1) % 5) === 0) { // if record is last on the page
              if (!((totalRecords - 1) / 5 === page)) { // if record is deleted from one page back
                this.setState({
                  spinner: false,
                }, () => refetch());
                return this.deleteDialogClose();
              }
              if ((totalRecords - 1) / 5 === page) {
                this.setState({
                  spinner: false,
                  page: page -= 1,
                }, () => refetch({ skip: page * 5, limit: 5 }));
                return this.deleteDialogClose();
              }
            }
            return null;
          }
          if (page === 0) {
            this.setState({
              spinner: false,
            }, () => refetch());
            return this.deleteDialogClose();
          }
          return null;
        }
        if (deleteRec.data.deleteUser.message === 'User is Unauthorized') {
          this.setState({
            spinner: false,
          }, () => refetch());
          openSnackbar(deleteRec.data.deleteUser.message, 'error');
          return this.deleteDialogClose();
        }
        if (deleteRec.data.deleteUser.message === 'Token Expired') {
          localStorage.removeItem('token');
          this.setState({
            spinner: false,
          });
          this.onCloseEvent();
          const { history } = this.props;
          openSnackbar(deleteRec.data.deleteUser.message, 'error');
          return history.push('/login');
        }
      } catch (error) {
        if (error.message.includes('Network error')) {
          this.setState({
            spinner: false,
          });
          openSnackbar(error.message, 'error');
          return this.deleteDialogClose();
        }
      }
    }
    return null;
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
    const { data: { refetch } } = this.props;
    const { history } = this.props;
    try {
      const response = await refetch();
      if (response) {
        return history.push(`/trainee/${data.originalId}`);
      }
    } catch (error) {
      localStorage.removeItem('token');
      history.push('/login');
      return openSnackbar('Token Expired', 'error');
    }
    return null;
  }

  handlePageChange = async (event, page, openSnackbar) => {
    const { data: { refetch } } = this.props;
    const limit = 5;
    const skip = page * limit;
    try {
      const response = await refetch({ skip, limit });
      if (response.data.getAllTrainee.data.records) {
        return this.setState({ page }, () => refetch({ skip, limit }));
      }
    } catch (error) {
      localStorage.removeItem('token');
      const { history } = this.props;
      history.push('/login');
      return openSnackbar('Token expired', 'error');
    }
    return null;
  }

  getTrainees = async () => {
    const trainee = await callApi({}, 'get', '/trainee/getall');
    return trainee;
  }

  render() {
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
    const {
      data: {
        loading, getAllTrainee: { data: { totalRecords = 0, records = [] } = {} } = {},
      },
    } = this.props;
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
              onPageChange={(event, tablePage) => this.handlePageChange(
                event, tablePage, openSnackbar,
              )}
              rowsPerPage={limit}
              loading={loading}
              dataLength={totalRecords || 0}
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
  create: PropTypes.func,
  update: PropTypes.func,
  deleteUser: PropTypes.func,
};

TraineeList.defaultProps = {
  create: () => {},
  update: () => {},
  deleteUser: () => {},
};

export default graphql(GET_USER, {
  options: {
    variables: { skip: 0, limit: 5 },
  },
})(TraineeList);
