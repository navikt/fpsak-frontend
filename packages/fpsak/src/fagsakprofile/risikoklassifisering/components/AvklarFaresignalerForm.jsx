import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';

import { Normaltekst } from 'nav-frontend-typografi';
import { behandlingForm } from 'behandling/behandlingForm';
import {
  FlexContainer, FlexRow, FlexColumn, VerticalSpacer,
} from '@fpsak-frontend/shared-components';
import {
  required, minLength, maxLength, hasValidText, ariaCheck,
} from '@fpsak-frontend/utils';
import { RadioGroupField, RadioOption, TextAreaField } from '@fpsak-frontend/form';
import { isAksjonspunktOpen } from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import { Hovedknapp } from 'nav-frontend-knapper';
import { aksjonspunktPropType } from '@fpsak-frontend/prop-types';

import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import faresignalVurdering from '@fpsak-frontend/kodeverk/src/faresignalVurdering';
import styles from './avklarFaresignalerForm.less';

const maxLength1500 = maxLength(1500);
const minLength3 = minLength(3);

const formName = 'avklarFaresignalerForm';
const begrunnelseFieldName = 'begrunnelse';
const radioFieldName = 'avklarFaresignalerRadio';

/**
 * IngenRisikoPanel
 *
 * Presentasjonskomponent. Statisk visning av panel som tilsier ingen faresignaler funnet i behandlingen.
 */
const AvklarFaresignalerForm = ({
  readOnly,
  aksjonspunkt,
  ...formProps
}) => (
  <FlexContainer>
    <form onSubmit={formProps.handleSubmit}>
      <FlexRow>
        <FlexColumn className={styles.fullWidth}>
          <TextAreaField
            name={begrunnelseFieldName}
            label={<FormattedMessage id="Beregningsgrunnlag.Forms.Vurdering" />}
            validate={[required, maxLength1500, minLength3, hasValidText]}
            maxLength={1500}
            readOnly={readOnly}
          />
        </FlexColumn>
      </FlexRow>
      <FlexRow>
        <FlexColumn>
          <Normaltekst><FormattedMessage id="Risikopanel.Form.Resultat" /></Normaltekst>
        </FlexColumn>
      </FlexRow>
      <VerticalSpacer eightPx />
      <FlexRow>
        <FlexColumn>
          <RadioGroupField
            name={radioFieldName}
            validate={[required]}
            direction="vertical"
            readOnly={readOnly}
            isEdited={!isAksjonspunktOpen(aksjonspunkt.status.kode)}
          >
            <RadioOption
              label={<FormattedMessage id="Risikopanel.Form.Innvirkning" />}
              value={faresignalVurdering.INNVIRKNING}
            />
            <RadioOption
              label={<FormattedMessage id="Risikopanel.Form.IngenInnvirkning" />}
              value={faresignalVurdering.INGEN_INNVIRKNING}
            />
          </RadioGroupField>
        </FlexColumn>
      </FlexRow>
      <FlexRow>
        <FlexColumn>
          <Hovedknapp
            mini
            spinner={formProps.submitting}
            disabled={!formProps.dirty || readOnly || formProps.submitting}
            onClick={ariaCheck}
          >
            <FormattedMessage id="Risikopanel.Form.Bekreft" />
          </Hovedknapp>
        </FlexColumn>
      </FlexRow>
    </form>
  </FlexContainer>
);
AvklarFaresignalerForm.propTypes = {
  aksjonspunkt: aksjonspunktPropType,
  risikoklassifisering: PropTypes.shape().isRequired,
  readOnly: PropTypes.bool.isRequired,
  submitCallback: PropTypes.func.isRequired,
};

const buildInitialValues = (ownProps) => {
  const { aksjonspunkt, risikoklassifisering } = ownProps;
  if (aksjonspunkt && aksjonspunkt.begrunnelse && risikoklassifisering && risikoklassifisering.faresignalVurdering) {
    return {
      begrunnelse: aksjonspunkt.begrunnelse,
      avklarFaresignalerRadio: risikoklassifisering.faresignalVurdering.kode,
    };
  }
  return undefined;
};

const transformValues = values => ({
  kode: aksjonspunktCodes.VURDER_FARESIGNALER,
  harInnvirketBehandlingen: values[radioFieldName] === faresignalVurdering.INNVIRKNING,
  begrunnelse: values[begrunnelseFieldName],
});

const mapStateToProps = (state, ownProps) => ({
  initialValues: buildInitialValues(ownProps),
  onSubmit: values => ownProps.submitCallback([transformValues(values)]),
});

export default connect(mapStateToProps)(behandlingForm({ form: formName })(AvklarFaresignalerForm));
