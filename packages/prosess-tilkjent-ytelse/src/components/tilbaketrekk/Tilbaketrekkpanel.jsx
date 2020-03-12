import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Element } from 'nav-frontend-typografi';
import { Column, Row } from 'nav-frontend-grid';

import behandleImageURL from '@fpsak-frontend/assets/images/advarsel.svg';
import {
  FlexColumn, FlexContainer, FlexRow, Image, VerticalSpacer,
} from '@fpsak-frontend/shared-components';
import {
  hasValidText, maxLength, minLength, required,
} from '@fpsak-frontend/utils';
import { isAksjonspunktOpen } from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import {
  RadioGroupField, RadioOption, TextAreaField, behandlingForm, hasBehandlingFormErrorsOfType, isBehandlingFormDirty,
  isBehandlingFormSubmitting,
} from '@fpsak-frontend/form';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { ProsessStegSubmitButton } from '@fpsak-frontend/prosess-felles';

import styles from './tilbaketrekkpanel.less';

const radioFieldName = 'radioVurderTilbaketrekk';
const begrunnelseFieldName = 'begrunnelseVurderTilbaketrekk';
const formName = 'vurderTilbaketrekkForm';

const maxLength1500 = maxLength(1500);
const minLength3 = minLength(3);

export const Tilbaketrekkpanel = ({
  intl,
  readOnly,
  vurderTilbaketrekkAP,
  readOnlySubmitButton,
  behandlingId,
  behandlingVersjon,
  ...formProps
}) => (
  <div>
    <div className={styles.container}>
      <FlexContainer>
        <FlexRow>
          <FlexColumn>
            <Image
              className={styles.image}
              alt={intl.formatMessage({ id: 'HelpText.Aksjonspunkt' })}
              src={behandleImageURL}
            />
          </FlexColumn>
          <FlexColumn>
            <div className={styles.divider} />
          </FlexColumn>
          <FlexColumn className={styles.aksjonspunktText}>
            <div className={styles.oneElement}>
              <Element className={styles.wordwrap}>
                <FormattedMessage id="TilkjentYtelse.VurderTilbaketrekk.Aksjonspunkttekst" />
              </Element>
            </div>
          </FlexColumn>
        </FlexRow>
      </FlexContainer>
    </div>
    <VerticalSpacer twentyPx />
    <form onSubmit={formProps.handleSubmit}>
      <Row>
        <Column xs="9">
          <RadioGroupField
            name={radioFieldName}
            validate={[required]}
            direction="horizontal"
            readOnly={readOnly}
            isEdited={!isAksjonspunktOpen(vurderTilbaketrekkAP.status.kode)}
          >
            <RadioOption
              label={<FormattedMessage id="TilkjentYtelse.VurderTilbaketrekk.Utfør" />}
              value={false}
            />
            <RadioOption
              label={<FormattedMessage id="TilkjentYtelse.VurderTilbaketrekk.Hindre" />}
              value
            />
          </RadioGroupField>
        </Column>
      </Row>
      <Row>
        <Column xs="6">
          <TextAreaField
            name={begrunnelseFieldName}
            label={<FormattedMessage id="Beregningsgrunnlag.Forms.Vurdering" />}
            validate={[required, maxLength1500, minLength3, hasValidText]}
            maxLength={1500}
            readOnly={readOnly}
          />
        </Column>
      </Row>
      <Row>
        <Column xs="1">
          <VerticalSpacer eightPx />
          <ProsessStegSubmitButton
            formName={formProps.form}
            behandlingId={behandlingId}
            behandlingVersjon={behandlingVersjon}
            isReadOnly={readOnly}
            isSubmittable={!readOnlySubmitButton}
            isBehandlingFormSubmitting={isBehandlingFormSubmitting}
            isBehandlingFormDirty={isBehandlingFormDirty}
            hasBehandlingFormErrorsOfType={hasBehandlingFormErrorsOfType}
          />
        </Column>
      </Row>
    </form>
  </div>

);

Tilbaketrekkpanel.propTypes = {
  intl: PropTypes.shape().isRequired,
  readOnly: PropTypes.bool.isRequired,
  readOnlySubmitButton: PropTypes.bool.isRequired,
  vurderTilbaketrekkAP: PropTypes.shape().isRequired,
  behandlingId: PropTypes.number.isRequired,
  behandlingVersjon: PropTypes.number.isRequired,
};

export const transformValues = (values) => {
  const hindreTilbaketrekk = values[radioFieldName];
  const begrunnelse = values[begrunnelseFieldName];
  return {
    kode: aksjonspunktCodes.VURDER_TILBAKETREKK,
    begrunnelse,
    hindreTilbaketrekk,
  };
};

export const buildInitialValues = createSelector([
  (state, ownProps) => ownProps.vurderTilbaketrekkAP,
  (state, ownProps) => ownProps.beregningsresultat], (ap, tilkjentYtelse) => {
  const tidligereValgt = tilkjentYtelse.skalHindreTilbaketrekk;
  if (tidligereValgt === undefined || tidligereValgt === null || !ap || !ap.begrunnelse) {
    return undefined;
  }
  return {
    radioVurderTilbaketrekk: tidligereValgt,
    begrunnelseVurderTilbaketrekk: ap.begrunnelse,
  };
});

const mapStateToPropsFactory = (initialState, ownProps) => {
  const onSubmit = (values) => ownProps.submitCallback([transformValues(values)]);
  return (state) => ({
    onSubmit,
    initialValues: buildInitialValues(state, ownProps),
  });
};

export default connect(mapStateToPropsFactory)(behandlingForm({ form: formName })(injectIntl(Tilbaketrekkpanel)));
