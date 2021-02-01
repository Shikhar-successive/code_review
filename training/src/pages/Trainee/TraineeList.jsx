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
    const userInfo = {
      name: state.name,
      email: state.email,
      password: state.password,
      role: 'trainee',
      createdBy: 'Admin',
    };
    const {
      name, email, password, role, createdBy,
    } = userInfo;
    this.setState({ spinner: true });
    try {
      const { create } = this.props;
      const user = await create({
        variables: {
          name, email, password, role, createdBy,
        },
      });
      if (user.data.create.data.email === email) {
        openSnackbar(user.data.create.message, 'success');
        const { data: { refetch } } = this.props;
        this.setState({
          spinner: false,
          page: 0,
        }, () => refetch({ skip: 0, limit: 5 }));
        this.onCloseEvent();
      } else if (user.data.create.message === 'User is Unauthorized') {
        this.setState({
          spinner: false,
        });
        this.onCloseEvent();
        openSnackbar(user.data.create.message, 'error');
      } else if (user.data.create.message === 'Token Expired') {
        this.setState({
          spinner: false,
        });
        this.onCloseEvent();
        const { history } = this.props;
        history.push('/login');
        openSnackbar(user.data.create.message, 'error');
      }
    } catch (error) {
      if (error.message.includes('Network error')) {
        this.setState({
          spinner: false,
        });
        this.onCloseEvent();
        openSnackbar(error.message, 'error');
      }
    }
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
    const {
      originalId, name, email, role, updatedBy,
    } = userInfo;
    this.setState({
      spinner: true,
    });
    try {
      const { update } = this.props;
      const updateUser = await update({
        variables: {
          originalId, name, email, role, updatedBy,
        },
      });
      if (updateUser.data.update.data.email === email) {
        openSnackbar(updateUser.data.update.message, 'success');
        const { data: { refetch } } = this.props;
        this.setState({
          spinner: false,
        }, () => refetch());
        this.editDialogClose();
      } else if (updateUser.data.update.message === 'User is Unauthorized') {
        this.setState({
          spinner: false,
        });
        this.editDialogClose();
        openSnackbar(updateUser.data.update.message, 'error');
      } else if (updateUser.data.update.message === 'Token Expired') {
        this.setState({
          spinner: false,
        });
        this.onCloseEvent();
        const { history } = this.props;
        history.push('/login');
        openSnackbar(updateUser.data.update.message, 'error');
      }
    } catch (error) {
      if (error.message.includes('Network error')) {
        this.setState({
          spinner: false,
        });
        this.editDialogClose();
        openSnackbar(error.message, 'error');
      }
    }
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
        const deleteRec = await deleteUser({
          variables: {
            originalId,
          },
        });
        if (deleteRec.data.deleteUser.data.id === originalId) {
          openSnackbar(deleteRec.data.deleteUser.message, 'success');
          if (page > 0) {
            if (((totalRecords - 1) % 5) > 0) {
              this.setState({
                spinner: false,
              }, () => refetch());
              this.deleteDialogClose();
            } else if (((totalRecords - 1) % 5) === 0) {
              if (!((totalRecords - 1) / 5 === page)) {
                this.setState({
                  spinner: false,
                }, () => refetch());
                this.deleteDialogClose();
              } else if ((totalRecords - 1) / 5 === page) {
                this.setState({
                  spinner: false,
                  page: page -= 1,
                }, () => refetch({ skip: page * 5, limit: 5 }));
                this.deleteDialogClose();
              }
            }
          } else if (page === 0) {
            this.setState({
              spinner: false,
            }, () => refetch());
            this.deleteDialogClose();
          }
        } else if (deleteRec.data.deleteUser.message === 'User is Unauthorized') {
          this.setState({
            spinner: false,
          }, () => refetch());
          this.deleteDialogClose();
          openSnackbar(deleteRec.data.deleteUser.message, 'error');
        } else if (deleteRec.data.deleteUser.message === 'Token Expired') {
          this.setState({
            spinner: false,
          });
          this.onCloseEvent();
          const { history } = this.props;
          history.push('/login');
          openSnackbar(deleteRec.data.deleteUser.message, 'error');
        }
      } catch (error) {
        if (error.message.includes('Network error')) {
          this.setState({
            spinner: false,
          });
          this.deleteDialogClose();
          openSnackbar(error.message, 'error');
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
    const { data: { refetch } } = this.props;
    const { history } = this.props;
    try {
      const response = await refetch();
      if (response) {
        history.push(`/trainee/${data.originalId}`);
      }
    } catch (error) {
      history.push('/login');
      openSnackbar('Token Expired', 'error');
    }
  }

  handlePageChange = (event, page) => {
    const { data: { refetch } } = this.props;
    const limit = 5;
    const skip = page * limit;
    this.setState({ page }, () => refetch({ skip, limit }));
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
              onPageChange={this.handlePageChange}
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
