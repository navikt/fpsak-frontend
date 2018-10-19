import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  Field, formValueSelector, arrayPush as dispatchArrayPush, arraySplice as dispatchArraySplice,
} from 'redux-form';
import { FormattedMessage } from 'react-intl';
import { Column, Row } from 'nav-frontend-grid';
import { Normaltekst, Element, Undertekst } from 'nav-frontend-typografi';

import PropTypes from 'prop-types';
import Image from 'sharedComponents/Image';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import NavFieldGroup from 'form/fields/NavFieldGroup';
import ElementWrapper from 'sharedComponents/ElementWrapper';
import addCircleIcon from 'images/add-circle.svg';
import removeIcon from 'images/remove.svg';
import RegistrerVirksomhetModalForm from './RegistrerVirksomhetModalForm';

import styles from './registrerVirksomhetPanel.less';

const renderVirksomhetsnavn = ({ showRegistrerVirksomhetModal, index, ...fieldProps }) => (
  <ElementWrapper>
    {// eslint-disable-next-line jsx-a11y/click-events-have-key-events
    }
    <a
      onClick={() => showRegistrerVirksomhetModal(index)}
      onKeyDown={() => showRegistrerVirksomhetModal(index)}
      className={styles.customLink}
      role="link"
      tabIndex="0"
    >
      <Normaltekst>
        {' '}
        {fieldProps.input.value}
        {' '}
      </Normaltekst>
    </a>
  </ElementWrapper>
);

renderVirksomhetsnavn.propTypes = {
  showRegistrerVirksomhetModal: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
};

/**
 * RegistrererVirksomhetPanel
 *
 * Presentasjonskomponent. Komponenten vises som del av skjermbildet for registrering av
 * papirsøknad dersom søknad gjelder foreldrepenger og søker har arbeidet i egen virksomhet.
 * Viser registrerte virksomheter samt knapp for å legge til nye virksomheter.
 */
export class RegistrerVirksomhetPanel extends Component {
  constructor(props) {
    super(props);
    this.showRegistrerVirksomhetModal = this.showRegistrerVirksomhetModal.bind(this);
    this.hideRegistrerVirksomhetModal = this.hideRegistrerVirksomhetModal.bind(this);
    this.addVirksomhet = this.addVirksomhet.bind(this);
    this.removeVirksomhet = this.removeVirksomhet.bind(this);

    this.state = {
      editVirksomhet: null,
      editIndex: -1,
    };
  }

  showRegistrerVirksomhetModal(index) {
    if (index !== null && index !== undefined && index > -1) {
      const { virksomheter } = this.props;
      this.setState({
        editVirksomhet: virksomheter[index],
        editIndex: index,
      });
    } else {
      this.setState({
        editVirksomhet: {},
        editIndex: index,
      });
    }
  }

  hideRegistrerVirksomhetModal() {
    this.setState({
      editVirksomhet: null,
      editIndex: -1,
    });
  }

  addVirksomhet(values, dispatch, { valuesForRegisteredFieldsOnly }) {
    const { editIndex: index } = this.state;
    const {
      form, namePrefix, name, dispatchArraySplice: splice, dispatchArrayPush: push,
    } = this.props;
    const transformedValues = {
      ...valuesForRegisteredFieldsOnly,
      stillingsprosent: parseFloat(valuesForRegisteredFieldsOnly.stillingsprosent),
    };

    if (index !== null && index !== undefined && index > -1) {
      splice(form, `${namePrefix}.${name}`, index, 1, transformedValues);
    } else {
      push(form, `${namePrefix}.${name}`, transformedValues);
    }
    this.hideRegistrerVirksomhetModal();
  }

  removeVirksomhet(index) {
    const {
      form, namePrefix, name, dispatchArraySplice: splice,
    } = this.props;
    splice(form, `${namePrefix}.${name}`, index, 1);
  }

  render() {
    const {
      fields,
      readOnly,
      meta,
      formatMessage,
    } = this.props;
    const { editVirksomhet, editIndex } = this.state;
    return (
      <div className={styles.fieldsList}>
        <NavFieldGroup
          errorMessage={meta.error && (meta.dirty || meta.submitFailed) ? formatMessage(...meta.error) : null}
        >
          {fields.length > 0
          && (
          <ElementWrapper key={1}>
            <Row key="VirksomhetHeader">
              <Column xs="8">
                <Element><FormattedMessage id="Registrering.EgenVirksomhet.Name" /></Element>
              </Column>
            </Row>
            <hr className={styles.divider} />

            {fields.map((virksomhet, index) => (
              <ElementWrapper key={2}>
                <Row key={`${virksomhet}.navn`}>
                  <Column xs="8">
                    <Field
                      name={`${virksomhet}.navn`}
                      component={renderVirksomhetsnavn}
                      showRegistrerVirksomhetModal={() => this.showRegistrerVirksomhetModal(index)}
                      index={index}
                    />
                  </Column>
                  <Column xs="4">
                    {// eslint-disable-next-line jsx-a11y/click-events-have-key-events
                    }
                    <div
                      className={styles.removeButton}
                      onClick={() => this.removeVirksomhet(index)}
                      onKeyDown={() => this.removeVirksomhet(index)}
                      id="removebutton"
                      role="button"
                      tabIndex="0"
                    >
                      <Image src={removeIcon} />
                    </div>
                  </Column>
                </Row>
                <hr className={styles.divider} />
                <VerticalSpacer eightPx />
              </ElementWrapper>
            ))}
          </ElementWrapper>
          )
          }
          {// eslint-disable-next-line jsx-a11y/click-events-have-key-events
          }
          <div
            id="addbutton"
            className={styles.addVirksomhet}
            onClick={() => this.showRegistrerVirksomhetModal()}
            onKeyDown={() => this.showRegistrerVirksomhetModal()}
            role="button"
            tabIndex="0"
          >
            <Image
              className={styles.addCircleIcon}
              src={addCircleIcon}
            />
            <Undertekst className={styles.imageText}><FormattedMessage id="Registrering.EgenVirksomhet.Add" /></Undertekst>
          </div>
        </NavFieldGroup>
        <RegistrerVirksomhetModalForm
          showModal={!!editVirksomhet}
          onSubmit={this.addVirksomhet}
          closeEvent={this.hideRegistrerVirksomhetModal}
          readOnly={readOnly}
          initialValues={editVirksomhet}
          index={editIndex}
        />
      </div>
    );
  }
}

RegistrerVirksomhetPanel.propTypes = {
  fields: PropTypes.shape().isRequired,
  meta: PropTypes.shape().isRequired,
  namePrefix: PropTypes.string.isRequired,
  formatMessage: PropTypes.func.isRequired,
  dispatchArrayPush: PropTypes.func.isRequired,
  virksomheter: PropTypes.arrayOf(PropTypes.shape()),
  dispatchArraySplice: PropTypes.func.isRequired,
  form: PropTypes.string.isRequired,
  name: PropTypes.string,
  readOnly: PropTypes.bool,
};

RegistrerVirksomhetPanel.defaultProps = {
  readOnly: false,
  name: 'virksomheter',
  virksomheter: [],
};

const mapStateToProps = (state, initialProps) => ({
  virksomheter: formValueSelector(initialProps.form)(state, initialProps.namePrefix)
    ? formValueSelector(initialProps.form)(state, initialProps.namePrefix).virksomheter : null,
});

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators({
    dispatchArrayPush,
    dispatchArraySplice,
  }, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(RegistrerVirksomhetPanel);
