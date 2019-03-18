import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import { Normaltekst, Undertekst } from 'nav-frontend-typografi';
import editUtlandIcon from '@fpsak-frontend/assets/images/endre.svg';
import editUtlandDisabledIcon from '@fpsak-frontend/assets/images/endre_disablet.svg';
import { Hovedknapp, Knapp } from 'nav-frontend-knapper';
import { RadioOption, RadioGroupField } from '@fpsak-frontend/form';
import {
  ElementWrapper, FlexContainer, FlexColumn, FlexRow, Image,
} from '@fpsak-frontend/shared-components';
import { required } from '@fpsak-frontend/utils';
import { behandlingFormValueSelector } from 'behandlingForstegangOgRevurdering/src/behandlingForm';
import { getBehandlingIsOnHold, hasReadOnlyBehandling } from 'behandlingForstegangOgRevurdering/src/behandlingSelectors';

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
      readOnly,
      utlandSakstype,
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
                onClick={this.editUtland}
                altCode="UttakInfoPanel.EndrePerioden"
              />
            </div>
          </div>
        )
        }
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
        )
        }
        <UtlandEndretModal
          showModal={showModalUtlandEndret}
          closeEvent={this.hideModal}
        />
      </ElementWrapper>
    );
  }
}

UtlandImpl.propTypes = {
  initialValue: PropTypes.string,
  utlandSakstype: PropTypes.string,
  submitCallback: PropTypes.func.isRequired,
  readOnly: PropTypes.bool.isRequired,
};

UtlandImpl.defaultProps = {
  initialValue: utlandSakstypeKode.NASJONAL,
  utlandSakstype: utlandSakstypeKode.NASJONAL,
};

const mapStateToProps = (state, ownProps) => {
  const selectedRadioOption = behandlingFormValueSelector('PersonInfoPanel')(state, 'utlandSakstype');
  return {
    utlandSakstype: selectedRadioOption,
    readOnly: getBehandlingIsOnHold(state) || hasReadOnlyBehandling(state),
    onSubmit: values => ownProps.submitCallback([{
      kode: MANUELL_MARKERING_AV_UTLAND_SAKSTYPE,
      begrunnelse: selectedRadioOption,
      ...values,
    }]),
  };
};

export const Utland = connect(mapStateToProps)(UtlandImpl);
