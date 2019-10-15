import PropTypes from 'prop-types';

import vedtaksbrevAvsnittPropType from './vedtaksbrevAvsnittPropType';

const vedtaksbrevPropType = PropTypes.shape({
  avsnittsliste: PropTypes.arrayOf(vedtaksbrevAvsnittPropType).isRequired,
});

export default vedtaksbrevPropType;
