import React from 'react';
import { formValueSelector, reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import { Column, Row } from 'nav-frontend-grid';
import { Element } from 'nav-frontend-typografi';
import { Hovedknapp, Knapp } from 'nav-frontend-knapper';

import { isForeldrepengerFagsak } from 'fagsak/fagsakSelectors';
import Image from 'sharedComponents/Image';
import innvilgetImageUrl from 'images/innvilget_valgt.svg';
import Modal from 'sharedComponents/Modal';
import { CheckboxField, SelectField } from 'form/Fields';
import { required } from 'utils/validation/validators';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import kodeverkTyper from 'kodeverk/kodeverkTyper';
import bType from 'kodeverk/behandlingType';
import behandlingArsakType from 'kodeverk/behandlingArsakType';
import { getKodeverk } from 'kodeverk/duck';

import styles from './createNewBehandlingModal.less';

const createOptions = (bt, hasEnabledCreateNewBehandling, hasEnabledCreateRevurdering, intl) => {
  const isDisabled = (!hasEnabledCreateNewBehandling && bt.kode === bType.FORSTEGANGSSOKNAD)
    || (!hasEnabledCreateRevurdering && bt.kode === bType.REVURDERING);
  const navn = bt.kode === bType.REVURDERING
    ? intl.formatMessage({ id: 'CreateNewBehandlingModal.OpprettRevurdering' })
    : bt.navn;
  return isDisabled
    ? (
      <option key={bt.kode} value={bt.kode} disabled>
        {' '}
        {navn}
        {' '}
      </option>
    )
    : (
      <option key={bt.kode} value={bt.kode}>
        {' '}
        {navn}
        {' '}
      </option>
    );
};
/**
 * CreateNewBehandlingModal
 *
 * Presentasjonskomponent. Denne modalen vises etter at en saksbehandler har valgt opprett ny 1.gangsbehandling i behandlingsmenyen.
 * Ved å trykke på ok skal ny behandling(1.gangsbehandling) av sak opprettes.
 */
export const CreateNewBehandlingModal = ({
  showModal,
  handleSubmit,
  cancelEvent,
  intl,
  behandlingTyper,
  behandlingType,
  behandlingArsakTyper,
  hasEnabledCreateNewBehandling,
  hasEnabledCreateRevurdering,
}) => (
  <Modal
    className={styles.modal}
    isOpen={showModal}
    closeButton={false}
    contentLabel={intl.formatMessage({ id: 'CreateNewBehandlingModal.ModalDescription' })}
    onRequestClose={cancelEvent}
  >
    <form onSubmit={handleSubmit}>
      <Row>
        <Column xs="1">
          <Image className={styles.image} altCode="CreateNewBehandlingModal.OpprettNyForstegangsbehandling" src={innvilgetImageUrl} />
          <div className={styles.divider} />
        </Column>
        <Column xs="11">
          <div className={styles.label}>
            <Element>
              <FormattedMessage id="CreateNewBehandlingModal.OpprettNyForstegangsbehandling" />
            </Element>
          </div>
          <VerticalSpacer sixteenPx />
          <VerticalSpacer sixteenPx />
          <SelectField
            name="behandlingType"
            label=""
            placeholder={intl.formatMessage({ id: 'CreateNewBehandlingModal.SelectBehandlingTypePlaceholder' })}
            validate={[required]}
            selectValues={behandlingTyper.map(bt => createOptions(bt, hasEnabledCreateNewBehandling, hasEnabledCreateRevurdering, intl))}
            bredde="l"
          />
          <VerticalSpacer eightPx />
          { behandlingType === bType.FORSTEGANGSSOKNAD
          && (
          <CheckboxField
            name="nyBehandlingEtterKlage"
            label={intl.formatMessage({ id: 'CreateNewBehandlingModal.NyBehandlingEtterKlage' })}
          />
          )
          }
          { behandlingType === bType.REVURDERING
          && (
          <SelectField
            name="behandlingArsakType"
            label=""
            placeholder={intl.formatMessage({ id: 'CreateNewBehandlingModal.SelectBehandlingArsakTypePlaceholder' })}
            validate={[required]}
            selectValues={behandlingArsakTyper.map(b => <option key={b.kode} value={b.kode}>{b.navn}</option>)}
          />
          )
          }
          <div className={styles.right}>
            <Hovedknapp
              mini
              className={styles.button}
            >
              {intl.formatMessage({ id: 'CreateNewBehandlingModal.Ok' })}
            </Hovedknapp>
            <Knapp
              htmlType="button"
              mini
              onClick={cancelEvent}
              className={styles.cancelButton}
            >
              {intl.formatMessage({ id: 'CreateNewBehandlingModal.Avbryt' })}
            </Knapp>
          </div>
        </Column>
      </Row>
    </form>
  </Modal>
);

CreateNewBehandlingModal.propTypes = {
  showModal: PropTypes.bool.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  cancelEvent: PropTypes.func.isRequired,
  intl: intlShape.isRequired,
  behandlingTyper: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  behandlingType: PropTypes.string,
  behandlingArsakTyper: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  hasEnabledCreateNewBehandling: PropTypes.bool.isRequired,
  hasEnabledCreateRevurdering: PropTypes.bool.isRequired,
};

CreateNewBehandlingModal.defaultProps = {
  behandlingType: undefined,
};

const formName = 'CreateNewBehandlingModal';

const manuelleRevurderingsArsakerES = [
  behandlingArsakType.ANNET,
  behandlingArsakType.FEIL_I_LOVANDVENDELSE,
  behandlingArsakType.FEIL_ELLER_ENDRET_FAKTA,
  behandlingArsakType.FEIL_REGELVERKSFORSTAELSE,
  behandlingArsakType.FEIL_PROSESSUELL,
];


const manuelleRevurderingsArsakerFP = [
  behandlingArsakType.BEREEGNINGSGRUNNLAG,
  behandlingArsakType.MEDLEMSKAP,
  behandlingArsakType.OPPTJENING,
  behandlingArsakType.FORDELING,
  behandlingArsakType.INNTEKT,
  behandlingArsakType.DØD,
  behandlingArsakType.SØKERS_RELASJON,
  behandlingArsakType.SØKNADSFRIST,
  behandlingArsakType.KLAGE_U_INNTK,
  behandlingArsakType.KLAGE_M_INNTK,
];

const getBehandlingAarsaker = (state) => {
  const manuelleRevurderingsArsaker = isForeldrepengerFagsak(state)
    ? manuelleRevurderingsArsakerFP
    : manuelleRevurderingsArsakerES;
  return getKodeverk(kodeverkTyper.BEHANDLING_ARSAK_TYPE)(state).filter(bat => manuelleRevurderingsArsaker.indexOf(bat.kode) > -1)
    .sort((bat1, bat2) => bat2.navn.length - bat1.navn.length);
};

const mapStateToProps = state => ({
  behandlingTyper: getKodeverk(kodeverkTyper.BEHANDLING_TYPE)(state)
    .filter(bt => bt.kode !== bType.SOKNAD)
    .filter(bt => bt.kode !== bType.KLAGE)
    .sort((bt1, bt2) => bt1.navn.localeCompare(bt2.navn)),
  behandlingArsakTyper: getBehandlingAarsaker(state),
  behandlingType: formValueSelector(formName)(state, 'behandlingType'),
});

export default connect(mapStateToProps)(reduxForm({
  form: formName,
})(injectIntl(CreateNewBehandlingModal)));
