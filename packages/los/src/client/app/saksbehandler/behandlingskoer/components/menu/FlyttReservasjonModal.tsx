import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl, intlShape, FormattedMessage } from 'react-intl';

import { Form } from 'react-final-form';
import { Hovedknapp, Knapp } from 'nav-frontend-knapper';
import { Normaltekst, Element } from 'nav-frontend-typografi';

import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import { FlexContainer, FlexRow, FlexColumn } from 'sharedComponents/flexGrid';
import oppgavePropType from 'saksbehandler/oppgavePropType';
import { Oppgave } from 'saksbehandler/oppgaveTsType';
import {
  hasValidText, maxLength, minLength, required,
} from 'utils/validation/validators';
import { TextAreaField, InputField } from '@fpsak-frontend/form-final';
import Modal from 'sharedComponents/Modal';
import { getSaksbehandler, isSaksbehandlerSokStartet, isSaksbehandlerSokFerdig } from '../../duck';
import { Saksbehandler } from '../../saksbehandlerTsType';
import saksbehandlerPropType from '../../saksbehandlerPropType';

import styles from './flyttReservasjonModal.less';

const minLength3 = minLength(3);
const maxLength1500 = maxLength(1500);
const minLength7 = minLength(7);
const maxLength7 = maxLength(7);

type TsProps = Readonly<{
  intl: any;
  showModal: boolean;
  oppgave: Oppgave;
  closeModal: () => void;
  submit: (oppgaveId: number, brukerident: string, begrunnelse: string) => void;
  finnSaksbehandler: (brukerident: string) => void;
  resetSaksbehandler: () => Promise<string>;
  saksbehandler?: Saksbehandler;
  erSaksbehandlerSokStartet: boolean;
  erSaksbehandlerSokFerdig: boolean;
}>;

/**
 * FlyttReservasjonModal
 *
 * Presentasjonskomponent. Modal som lar en søke opp en saksbehandler som saken skal flyttes til. En kan også begrunne hvorfor saken skal flyttes.
 */
export class FlyttReservasjonModal extends Component<TsProps> {
   static propTypes = {
     intl: intlShape.isRequired,
     showModal: PropTypes.bool.isRequired,
     oppgave: oppgavePropType.isRequired,
     closeModal: PropTypes.func.isRequired,
     submit: PropTypes.func.isRequired,
     finnSaksbehandler: PropTypes.func.isRequired,
     resetSaksbehandler: PropTypes.func.isRequired,
     saksbehandler: saksbehandlerPropType,
     erSaksbehandlerSokStartet: PropTypes.bool.isRequired,
     erSaksbehandlerSokFerdig: PropTypes.bool.isRequired,
   };

   componentWillUnmount = () => {
     const {
       resetSaksbehandler,
     } = this.props;
     resetSaksbehandler();
   }

   formatText = () => {
     const {
       intl, saksbehandler, erSaksbehandlerSokFerdig,
     } = this.props;

     if (erSaksbehandlerSokFerdig && !saksbehandler) {
       return intl.formatMessage({ id: 'LeggTilSaksbehandlerForm.FinnesIkke' });
     }

     return saksbehandler
       ? `${saksbehandler.navn}, ${saksbehandler.avdelingsnavn.join(', ')}`
       : '';
   }

   render = () => {
     const {
       intl, showModal, closeModal, submit, oppgave, finnSaksbehandler, erSaksbehandlerSokStartet, erSaksbehandlerSokFerdig, saksbehandler,
     } = this.props;

     return (
       <Modal
         className={styles.modal}
         isOpen={showModal}
         closeButton={false}
         contentLabel={intl.formatMessage({ id: 'FlyttReservasjonModal.FlyttReservasjon' })}
         onRequestClose={closeModal}
       >
         <Form
           onSubmit={values => finnSaksbehandler(values.brukerIdent)}
           render={({
             handleSubmit, values,
           }) => (
             <form onSubmit={handleSubmit}>
               <Element>
                 <FormattedMessage id="FlyttReservasjonModal.FlyttReservasjon" />
               </Element>
               <VerticalSpacer eightPx />
               <FlexContainer fluid>
                 <FlexRow>
                   <FlexColumn>
                     <InputField
                       name="brukerIdent"
                       label={intl.formatMessage({ id: 'FlyttReservasjonModal.Brukerident' })}
                       bredde="S"
                       validate={[required, minLength7, maxLength7]}
                       autoFocus
                     />
                   </FlexColumn>
                   <FlexColumn>
                     <Hovedknapp
                       mini
                       htmlType="submit"
                       className={styles.button}
                       spinner={erSaksbehandlerSokStartet}
                       disabled={!values.brukerIdent || erSaksbehandlerSokStartet}
                       tabIndex="0"
                     >
                       <FormattedMessage id="FlyttReservasjonModal.Sok" />
                     </Hovedknapp>
                   </FlexColumn>
                 </FlexRow>
               </FlexContainer>
               {erSaksbehandlerSokFerdig && (
               <>
                 <Normaltekst>{this.formatText()}</Normaltekst>
                 <VerticalSpacer sixteenPx />
               </>
               )
             }
             </form>
           )}
         />
         <Form
           onSubmit={values => submit(oppgave.id, saksbehandler ? saksbehandler.brukerIdent : '', values.begrunnelse)}
           render={({
             handleSubmit, values,
           }) => (
             <form onSubmit={handleSubmit}>
               <TextAreaField
                 name="begrunnelse"
                 label={intl.formatMessage({ id: 'FlyttReservasjonModal.Begrunn' })}
                 validate={[required, maxLength1500, minLength3, hasValidText]}
                 maxLength={1500}
               />
               <Hovedknapp
                 className={styles.submitButton}
                 mini
                 htmlType="submit"
                 disabled={!saksbehandler || (!values.begrunnelse || values.begrunnelse.length < 3)}
               >
                 {intl.formatMessage({ id: 'FlyttReservasjonModal.Ok' })}
               </Hovedknapp>
               <Knapp
                 className={styles.cancelButton}
                 mini
                 htmlType="reset"
                 onClick={closeModal}
               >
                 {intl.formatMessage({ id: 'FlyttReservasjonModal.Avbryt' })}
               </Knapp>
             </form>
           )}
         />
       </Modal>
     );
   }
}


const mapStateToProps = state => ({
  erSaksbehandlerSokStartet: isSaksbehandlerSokStartet(state),
  erSaksbehandlerSokFerdig: isSaksbehandlerSokFerdig(state),
  saksbehandler: getSaksbehandler(state),
});

export default connect(mapStateToProps)(injectIntl(FlyttReservasjonModal));
