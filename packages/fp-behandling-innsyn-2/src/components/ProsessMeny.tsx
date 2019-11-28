import React from 'react';
import PropTypes from 'prop-types';
import { Knapp } from 'nav-frontend-knapper';

const ProsessMeny = ({
  steps,
  onClick,
}) => (
  <>
    {steps.map((step, index) => (
      <Knapp key={step.label} mini htmlType="button" onClick={() => onClick(index)}>
        {step.label}
      </Knapp>
    )) }
  </>
);

ProsessMeny.propTypes = {
  steps: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  onClick: PropTypes.func.isRequired,
};

export default ProsessMeny;
