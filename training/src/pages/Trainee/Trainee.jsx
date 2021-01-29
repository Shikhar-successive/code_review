import React from 'react';
import PropTypes from 'prop-types';
import { Switch, Route } from 'react-router-dom';
import { Mutation } from '@apollo/react-components';
import TraineeList from './TraineeList';
import TraineeDetail from './TraineeDetail';
import { CREATE_USER, UPDATE_USER, DELETE_USER } from './mutation';

const Trainee = ({ match, history }) => (
  <Switch>
    <Route exact path={`${match.path}`}>
      <Mutation mutation={CREATE_USER}>
        {(create) => (
          <Mutation mutation={UPDATE_USER}>
            {(update) => (
              <Mutation mutation={DELETE_USER}>
                {(deleteUser) => (
                  <TraineeList
                    create={create}
                    update={update}
                    deleteUser={deleteUser}
                    match={match}
                    history={history}
                  />
                )}
              </Mutation>
            )}
          </Mutation>
        )}
      </Mutation>
    </Route>
    <Route exact path={`${match.path}/:id`} component={() => <TraineeDetail history={history} />} />
  </Switch>
);

Trainee.propTypes = {
  match: PropTypes.objectOf(PropTypes.any).isRequired,
  history: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default Trainee;

// import React from 'react';
// import PropTypes from 'prop-types';
// import { Switch, Route } from 'react-router-dom';
// import { Query } from '@apollo/client';
// import TraineeList from './TraineeList';
// import TraineeDetail from './TraineeDetail';
// import { GET_USER } from './query';

// const Trainee = ({ match, history }) => (
//   <Switch>
//     <Route exact path={`${match.path}`}>
//       <Query query={GET_USER}>
//         {(getAll) => (
//           <TraineeList getAll={getAll} match={match} history={history} />
//         )}
//       </Query>
//     </Route>
//     <Route exact path={`${match.path}/:id`}
//  component={() => <TraineeDetail history={history} />} />
//   </Switch>
// );

// Trainee.propTypes = {
//   match: PropTypes.objectOf(PropTypes.any).isRequired,
//   history: PropTypes.objectOf(PropTypes.any).isRequired,
// };

// export default Trainee;
