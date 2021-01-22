import React, { Component } from 'react';
import * as Yup from 'yup';
import {
  TextField,
  SelectField,
  RadioGroup,
  Button,
} from '../../components';
import * as constants from '../../configs/constants';
import style from './style';

class InputDemo extends Component {
  schema = Yup.object().shape({
    name: Yup.string().required(),
    sport: Yup.string().required(),
    role: Yup.string().when('sports',
      {
        is: 'cricket',
        then: Yup.string().required('What you do is required field'),
        otherwise: Yup.string().required('What you do is required field'),
      }),
  });

  constructor() {
    super();
    this.state = {
      name: '',
      sport: '',
      cricket: '',
      football: '',
      touched: {},
      // error: {},
    };
  }

  handelNameChange = (event) => {
    this.setState({ name: event.target.value }, () => {
    });
  }

  handelSportChange = (event) => {
    this.setState({ sport: event.target.value, football: '', cricket: '' }, () => {
    });
  }

  handelCricketRole = (event) => {
    this.setState({ cricket: event.target.value }, () => {
    });
  }

  handelFootballRole = (event) => {
    this.setState({ football: event.target.value }, () => {
    });
  }

  hasError = () => {
    const {
      name,
      sport,
      football,
      cricket,
    } = this.state;
    const data = {
      name: `${name}`,
      sport: `${sport}`,
      role: `${football}` || `${cricket}`,
    };
    try {
      // console.log(!this.schema.validateSync(this.state), '??????????????? Hserror');
      return !this.schema.validateSync(data);
    } catch (err) {
      return true;
    }
  }

  onToched = (componant) => {
    const { touched } = this.state;
    this.setState({ touched: { ...touched, [componant]: true } });
    // console.log(this.state, '------------------ONTOUCHED');
  }

  isTouched = () => {
    const { touched } = this.state;
    // console.log(Object.keys(touched), '=============length');
    return Object.keys(touched).length !== 0;
  }

  getError = (componant) => {
    const {
      name,
      sport,
      football,
      cricket,
    } = this.state;
    const data = {
      name: `${name}`,
      sport: `${sport}`,
      role: `${football}` || `${cricket}`,
    };
    const { touched } = this.state;
    if (touched[componant] && this.hasError) {
      try {
        this.schema.validateSyncAt(componant, data);
      } catch (err) {
        return err.message;
      }
    }
    return '';
  }

  render() {
    const {
      name, sport, cricket, football,
    } = this.state;
    return (
      <>
        <p>Name</p>
        <TextField
          value={name}
          error={this.getError('name')}
          onChange={this.handelNameChange}
          onBlur={() => this.onToched('name')}
        />
        <p>Select the game you play?</p>
        <SelectField
          value={sport}
          error={this.getError('sport')}
          defaultText={constants.defaultText}
          onChange={this.handelSportChange}
          onBlur={() => this.onToched('sport')}
          options={constants.sport}
        />
        {
          sport === constants.cricket ? (
            <div>
              {' '}
              <p>What you do?</p>
              <RadioGroup
                value={cricket}
                error={this.getError('role')}
                onChange={this.handelCricketRole}
                options={constants.cricketRole}
                onBlur={() => this.onToched('role')}
              />
              {' '}
            </div>
          ) : <p> </p>
        }
        {
          sport === constants.football ? (
            <div>
              <p>What you do?</p>
              {' '}
              <RadioGroup
                value={football}
                error={this.getError('role')}
                onChange={this.handelFootballRole}
                options={constants.footballRole}
                onBlur={() => this.onToched('role')}
              />
              {' '}
            </div>
          ) : <p> </p>
        }
        <div style={{ marginLeft: '90%' }}>
          <Button
            style={style.buttonStyle}
            value="Cancel"
          />
          <Button
            color="primary"
            disabled={this.hasError() || !this.isTouched()}
            style={style.buttonStyle}
            value="Submit"
          />
        </div>
      </>
    );
  }
}
export default InputDemo;
