import React from 'react';
import { connect } from 'react-redux';
import { injectIntl, intlShape, FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import { Hovedknapp } from 'nav-frontend-knapper';
import { Normaltekst } from 'nav-frontend-typografi';
import { behandlingForm } from 'behandlingFpsak/behandlingForm';
import { RadioGroupField, RadioOption } from '@fpsak-frontend/form';
import { required } from '@fpsak-frontend/utils';
import { Column, Row } from 'nav-frontend-grid';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { Modal, VerticalSpacer, Image } from '@fpsak-frontend/shared-components';
import behandleImageURL from '@fpsak-frontend/assets/images/behandle_valgt.svg';
import styles from './graderingUtenBGModal.less';

const lagArbeidsgiverString = (arbeidsforhold) => {
  if (arbeidsforhold.length < 1) {
    return '';
  }
  if (arbeidsforhold.length === 1) {
    return arbeidsforhold[0].navn;
  }
  const arbeidsgiverNavn = arbeidsforhold.map(arb => arb.navn);
  const sisteNavn = arbeidsgiverNavn.splice(arbeidsforhold.length - 1);
  const tekst = arbeidsgiverNavn.join(', ');
  return `${tekst} og ${sisteNavn}`;
};

const radioFieldName = 'graderingUtenBGSettPåVent';

export const GraderingUtenBGModalImpl = ({
  showModal,
  closeEvent,
  handleSubmit,
  intl,
  arbeidsforhold,
  ...formProps
}) => (
  <Modal
    className={styles.modal}
    isOpen={showModal}
    contentLabel="Gradering uten BG"
    onRequestClose={closeEvent}
    closeButton={false}
  >
    <form onSubmit={handleSubmit}>
      <Row>
        <Column xs="1">
          <Image className={styles.image} src={behandleImageURL} />
          <div className={styles.divider} />
        </Column>
        <Column xs="8">
          <Normaltekst>
            <FormattedMessage id="Beregningsgrunnlag.Modal.Tittel" values={{ arbeidsgivere: lagArbeidsgiverString(arbeidsforhold) }} />
          </Normaltekst>
        </Column>
      </Row>
      <VerticalSpacer twentyPx />
      <Row>
        <Column xs="9">
          <RadioGroupField
            name={radioFieldName}
            validate={[required]}
            direction="vertical"
            readOnly={false}
            isEdited={false}
          >
            <RadioOption
              label={intl.formatMessage({ id: 'Beregningsgrunnlag.Modal.FordelingErRiktig' })}
              value={false}
            />
            <RadioOption
              label={intl.formatMessage({ id: 'Beregningsgrunnlag.Modal.FordelingMåVurderes' })}
              value
            />
          </RadioGroupField>
        </Column>
      </Row>
      <Row>
        <Column xs="8" />
        <Column xs="1">
          <VerticalSpacer eightPx />
          <Hovedknapp
            mini
            className={styles.button}
            disabled={formProps.pristine}
            onClick={formProps.handleSubmit}
          >
            {intl.formatMessage({ id: 'Beregningsgrunnlag.Modal.Ok' })}
          </Hovedknapp>
        </Column>
      </Row>
    </form>
  </Modal>
);

GraderingUtenBGModalImpl.propTypes = {
  showModal: PropTypes.bool,
  closeEvent: PropTypes.func.isRequired,
  intl: intlShape.isRequired,
  arbeidsforhold: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  handleSubmit: PropTypes.func.isRequired,
};

GraderingUtenBGModalImpl.defaultProps = {
  showModal: false,
};

GraderingUtenBGModalImpl.transformValues = (values) => {
  const skalSettesPaaVent = values[radioFieldName];
  return {
    kode: aksjonspunktCodes.VURDER_GRADERING_UTEN_BEREGNINGSGRUNNLAG,
    skalSettesPaaVent,
  };
};

const mapToStateToProps = (state, ownProps) => ({});

const GraderingUtenBGModal = connect(mapToStateToProps)(behandlingForm({
  enableReinitialize: true,
})(injectIntl(GraderingUtenBGModalImpl)));

export default GraderingUtenBGModal;
