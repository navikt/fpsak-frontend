import PropTypes from 'prop-types';

const medlemskapSoknadPropType = PropTypes.shape({
  oppgittFordeling: PropTypes.shape({
    startDatoForPermisjon: PropTypes.string,
  }),
});

export default medlemskapSoknadPropType;
