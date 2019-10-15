import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { Normaltekst, Undertekst } from 'nav-frontend-typografi';
import { Hovedknapp, Knapp } from 'nav-frontend-knapper';

import editUtlandIcon from '@fpsak-frontend/assets/images/endre.svg';
import editUtlandDisabledIcon from '@fpsak-frontend/assets/images/endre_disablet.svg';
import { RadioGroupField, RadioOption } from '@fpsak-frontend/form';
import { omit, required } from '@fpsak-frontend/utils';
import { behandlingFormValueSelector } from '@fpsak-frontend/fp-felles';
import {
  ElementWrapper, FlexColumn, FlexContainer, FlexRow, Image,
} from '@fpsak-frontend/shared-components';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';

import utlandSakstypeKode from './utlandSakstypeKode';
import { UtlandEndretModal } from './UtlandEndretModal';

import styles from './utland.less';

const { MANUELL_MARKERING_AV_UTLAND_SAKSTYPE } = aksjonspunktCodes;

const getSakstypeId = (vurdering) => {
  switch (vurdering) {
    case utlandSakstypeKode.EØS_BOSATT_NORGE:
      return 'AdressePanel.utlandSakstype.EøsBosattNorge';
    case utlandSakstypeKode.BOSATT_UTLAND:
      return 'AdressePanel.utlandSakstype.BosattUtland';
    default:
      return 'AdressePanel.utlandSakstype.Nasjonal';
  }
};

export class UtlandImpl extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showEditUtland: false,
      currentUtlandStatus: props.initialValue,
      showModalUtlandEndret: false,
    };

    this.editUtland = this.editUtland.bind(this);
    this.lagreEndring = this.lagreEndring.bind(this);
    this.hideEditUtland = this.hideEditUtland.bind(this);
    this.hideModal = this.hideModal.bind(this);
  }

  editUtland() {
    this.setState({ showEditUtland: true });
  }

  hideEditUtland() {
    this.setState({
      showEditUtland: false,
    });
  }

  hideModal() {
    this.setState({
      showModalUtlandEndret: false,
    });
  }

  lagreEndring(selectedRadioOption) {
    const values = {};
    const { ...formProps } = this.props;
    const { currentUtlandStatus } = this.state;
    if (selectedRadioOption !== currentUtlandStatus) {
      values.gammelVerdi = currentUtlandStatus;
      values.nyVerdi = selectedRadioOption;
      this.setState({
        currentUtlandStatus: selectedRadioOption,
        showModalUtlandEndret: true,
      });
      this.hideEditUtland();
      formProps.onSubmit(values);
    }
    this.hideEditUtland();
  }

  render() {
    const {
      intl,
      readOnly,
      utlandSakstype,
      behandlingId,
      behandlingVersjon,
    } = this.props;
    const {
      currentUtlandStatus,
      showEditUtland,
      showModalUtlandEndret,
    } = this.state;
    const showUtlandStatus = !showEditUtland;
    const sakstypeId = getSakstypeId(currentUtlandStatus);
    return (
      <ElementWrapper>
        {showUtlandStatus && (
          <div className={styles.headerWrapper}>
            <div>
              <Undertekst>
                <FormattedMessage id="AdressePanel.utland" />
              </Undertekst>
              <Normaltekst>
                <FormattedMessage id={sakstypeId} />
              </Normaltekst>
            </div>
            <div className={styles.iconContainer}>
              <Image
                className={styles.editIcon}
                src={readOnly ? editUtlandDisabledIcon : editUtlandIcon}
                onClick={readOnly ? undefined : this.editUtland}
                alt={intl.formatMessage({ id: 'Utland.EndrePerioden' })}
              />
            </div>
          </div>
        )}
        {showEditUtland && (
          <div>
            <FlexContainer>
              <FlexRow wrap>
                <FlexColumn className={styles.fieldColumn}>
                  <Undertekst><FormattedMessage id="AdressePanel.utland" /></Undertekst>
                  <div className={styles.radioGroupMargin} />
                  <RadioGroupField
                    direction="vertical"
                    name="utlandSakstype"
                    // DOMName={`resultat_${id}`}
                    bredde="M"
                    // isEdited={isEdited}
                    validate={[required]}
                  >
                    <RadioOption
                      label={{ id: 'AdressePanel.utlandSakstype.Nasjonal' }}
                      value={utlandSakstypeKode.NASJONAL}
                    />
                    <RadioOption
                      label={{ id: 'AdressePanel.utlandSakstype.EøsBosattNorge' }}
                      value={utlandSakstypeKode.EØS_BOSATT_NORGE}
                      // style={inlineStyle.radioOption}
                    />
                    <RadioOption
                      label={{ id: 'AdressePanel.utlandSakstype.BosattUtland' }}
                      value={utlandSakstypeKode.BOSATT_UTLAND}
                    />
                  </RadioGroupField>
                </FlexColumn>
              </FlexRow>
            </FlexContainer>
            <div>
              <Hovedknapp
                className={styles.hovedknappMargin}
                mini
                onClick={() => this.lagreEndring(utlandSakstype)}
              >
                <FormattedMessage id="AdressePanel.utland.lagre" />
              </Hovedknapp>
              <Knapp
                htmlType="button"
                mini
                onClick={this.hideEditUtland}
              >
                <FormattedMessage id="AdressePanel.utland.avbryt" />
              </Knapp>
            </div>
          </div>
        )}
        <UtlandEndretModal
          behandlingId={behandlingId}
          behandlingVersjon={behandlingVersjon}
          showModal={showModalUtlandEndret}
          closeEvent={this.hideModal}
        />
      </ElementWrapper>
    );
  }
}

UtlandImpl.propTypes = {
  intl: PropTypes.shape().isRequired,
  initialValue: PropTypes.string,
  utlandSakstype: PropTypes.string,
  submitCallback: PropTypes.func.isRequired,
  readOnly: PropTypes.bool.isRequired,
  behandlingId: PropTypes.number.isRequired,
  behandlingVersjon: PropTypes.number.isRequired,
};

UtlandImpl.defaultProps = {
  initialValue: utlandSakstypeKode.NASJONAL,
  utlandSakstype: utlandSakstypeKode.NASJONAL,
};

const mapStateToPropsFactory = (initialState, initialOwnProps) => {
  const onSubmit = (values) => initialOwnProps.submitCallback([{
    kode: MANUELL_MARKERING_AV_UTLAND_SAKSTYPE,
    begrunnelse: values.nyVerdi,
    ...omit(values, 'nyVerdi'),
  }]);

  return (state, ownProps) => ({
    utlandSakstype: behandlingFormValueSelector('PersonInfoPanel', ownProps.behandlingId, ownProps.behandlingVersjon)(state, 'utlandSakstype'),
    onSubmit,
  });
};

export const Utland = connect(mapStateToPropsFactory)(injectIntl(UtlandImpl));
