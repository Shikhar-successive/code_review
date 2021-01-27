import React from 'react';
import PropTypes from 'prop-types';
import { Switch, Route } from 'react-router-dom';
import TraineeList from './TraineeList';
import TraineeDetail from './TraineeDetail';

const Trainee = ({ match, history }) => (
  <Switch>
    <Route exact path={`${match.path}`}>
      <TraineeList match={match} history={history} />
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
