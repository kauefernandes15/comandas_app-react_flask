import React, { forwardRef } from "react";
import { IMaskInput } from "react-imask";

const IMaskInputWrapper = forwardRef(function IMaskInputWrapper(props, ref) {
  const { onChange, ...other } = props;
  return (
    <IMaskInput
      {...other}
      inputRef={ref}
      onAccept={(value) => typeof onChange === 'function' && onChange({ target: { value } })}
    />
  );
});

export default IMaskInputWrapper;