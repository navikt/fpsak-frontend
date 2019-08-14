import React from 'react';
import klageVurderingType from '@fpsak-frontend/kodeverk/src/klageVurdering';
import { required } from '@fpsak-frontend/utils';
import { injectIntl, intlShape } from 'react-intl';
import { connect } from 'react-redux';
import { VerticalSpacer, ArrowBox } from '@fpsak-frontend/shared-components';
import { Row, Column } from 'nav-frontend-grid';
import {
  RadioGroupField, RadioOption, SelectField,
} from '@fpsak-frontend/form';
import PropTypes from 'prop-types';
import { getKodeverk } from 'behandlingKlage/src/duckBehandlingKlage';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import { BehandlingspunktBegrunnelseTextField } from '@fpsak-frontend/fp-behandling-felles';
import klageVurderingOmgjoerType from '@fpsak-frontend/kodeverk/src/klageVurderingOmgjoer';
import styles from '../SharedUtills/behandleKlageForm.less';

export const KlageVurderingRadioOptionsKaImpl = ({
  readOnly,
  medholdReasons,
  klageVurdering,
  intl,
}) => {
  const medholdOptions = medholdReasons.map(mo => <option key={mo.kode} value={mo.kode}>{mo.navn}</option>);
  return (
    <div>
      <BehandlingspunktBegrunnelseTextField
        readOnly={readOnly}
        textCode="VedtakKlageForm.VurderingForKlage"
      />
      <VerticalSpacer sixteenPx />
      <Row>
        <Column xs="4">
          <RadioGroupField
            name="klageVurdering"
            validate={[required]}
            direction="vertical"
            readOnly={readOnly}
          >
            <RadioOption value={klageVurderingType.STADFESTE_YTELSESVEDTAK} label={{ id: 'Klage.ResolveKlage.KeepVedtakNk' }} />
            <RadioOption value={klageVurderingType.MEDHOLD_I_KLAGE} label={{ id: 'Klage.ResolveKlage.ChangeVedtak' }} />
          </RadioGroupField>
        </Column>
        <Column xs="4">
          <RadioGroupField
            name="klageVurdering"
            validate={[required]}
            readOnly={readOnly}
            className={readOnly ? styles.selectReadOnly : null}
            direction="vertical"
          >
            <RadioOption value={klageVurderingType.HJEMSENDE_UTEN_Å_OPPHEVE} label={{ id: 'Klage.Behandle.Hjemsendt' }} />
            <RadioOption value={klageVurderingType.OPPHEVE_YTELSESVEDTAK} label={{ id: 'Klage.ResolveKlage.NullifyVedtak' }} />
          </RadioGroupField>
        </Column>
      </Row>
      {(klageVurdering === klageVurderingType.MEDHOLD_I_KLAGE)
    && (
      <ArrowBox>
        <SelectField
          readOnly={readOnly}
          name="klageMedholdArsak"
          selectValues={medholdOptions}
          className={readOnly ? styles.selectReadOnly : null}
          label={intl.formatMessage({ id: 'Klage.ResolveKlage.Cause' })}
          validate={[required]}
          bredde="xl"
        />
        <VerticalSpacer sixPx />
        <RadioGroupField
          name="klageVurderingOmgjoer"
          validate={[required]}
          readOnly={readOnly}
          className={readOnly ? styles.selectReadOnly : null}
          direction="vertical"
        >
          <RadioOption value={klageVurderingOmgjoerType.GUNST_MEDHOLD_I_KLAGE} label={{ id: 'Klage.Behandle.Omgjort' }} />
          <RadioOption value={klageVurderingOmgjoerType.UGUNST_MEDHOLD_I_KLAGE} label={{ id: 'Klage.Behandle.Ugunst' }} />
          <RadioOption value={klageVurderingOmgjoerType.DELVIS_MEDHOLD_I_KLAGE} label={{ id: 'Klage.Behandle.DelvisOmgjort' }} />
        </RadioGroupField>
      </ArrowBox>
    )
    }
      {(klageVurdering === klageVurderingType.OPPHEVE_YTELSESVEDTAK)
      && (
        <ArrowBox marginLeft={380}>
          <SelectField
            readOnly={readOnly}
            name="klageMedholdArsak"
            className={readOnly ? styles.selectReadOnly : null}
            selectValues={medholdOptions}
            label={intl.formatMessage({ id: 'Klage.ResolveKlage.Cause' })}
            validate={[required]}
            bredde="xl"
          />
        </ArrowBox>
      )
      }
    </div>
  );
};
KlageVurderingRadioOptionsKaImpl.propTypes = {
  readOnly: PropTypes.bool,
  medholdReasons: PropTypes.arrayOf(PropTypes.shape({
    kode: PropTypes.string,
    navn: PropTypes.string,
  })).isRequired,
  klageVurdering: PropTypes.string,
  intl: intlShape.isRequired,
};

export const mapStateToProps = state => ({
  medholdReasons: getKodeverk(kodeverkTyper.KLAGE_MEDHOLD_ARSAK)(state),
});


KlageVurderingRadioOptionsKaImpl.defaultProps = {
  readOnly: true,
  klageVurdering: null,
};


export default connect(mapStateToProps)(injectIntl(KlageVurderingRadioOptionsKaImpl));
