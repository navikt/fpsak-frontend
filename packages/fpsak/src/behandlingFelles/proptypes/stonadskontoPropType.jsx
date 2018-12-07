import PropTypes from 'prop-types';
import stonadskontoType from 'kodeverk/stonadskontoType';

export const stonadskontoPropType = PropTypes.shape({
  maxDager: PropTypes.number.isRequired,
  aktivitetFordeligDtoList: PropTypes.arrayOf.isRequired,
  aktivitetFordelingAnnenPart: PropTypes.arrayOf.isRequired,
});

export const stonadskontoerPropType = PropTypes.shape((
  Object.values(stonadskontoType)
    .filter(typeKode => typeKode !== stonadskontoType.UDEFINERT)
    .map(typeKode => ({ [typeKode]: stonadskontoPropType }))
    .reduce((type1, type2) => ({ ...type1, ...type2 }))
));
