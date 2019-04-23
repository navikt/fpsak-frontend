import { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';

import { saveInReduxState } from './formDuck';

interface Form {
  key: string;
  values: any;
}

interface TsProps {
  saveInReduxState: (form: Form) => void;
  stateKey: string;
  onUmount: boolean;
  values: any;
}

/**
 * StoreValuesInReduxState
 *
 * Lagrer verdier i redux state når komponenten blir kastet. Brukt for å mellomlagre form-state
 * ved navigering fra og til komponenter som har en final-form.
 */
export class StoreValuesInReduxState extends Component<TsProps> {
  static propTypes = {
    stateKey: PropTypes.string.isRequired,
    onUmount: PropTypes.bool.isRequired,
    values: PropTypes.shape({}).isRequired,
    saveInReduxState: PropTypes.func.isRequired,
  };

  componentWillUnmount = () => {
    const {
      saveInReduxState: save, stateKey, values, onUmount,
    } = this.props;
    if (onUmount) {
      save({
        key: stateKey,
        values,
      });
    }
  }

  render = () => null
}

const mapStateToProps = () => ({});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  ...bindActionCreators({
    saveInReduxState,
  }, dispatch),
});


export default connect(mapStateToProps, mapDispatchToProps)(StoreValuesInReduxState);
