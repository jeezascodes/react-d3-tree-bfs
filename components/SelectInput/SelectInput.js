import React from 'react';
import Select from 'react-select';
import styles from './selectInput.module.css';

export default function SelectInput({
  name,
  value,
  onChange,
  options,
  isMulti = true,
  isDisabled = false,
}) {
  return (
    <div>
      <span className={styles.labelText}>{name && `${name}:`}</span>
      <Select
        className={styles.select}
        value={value}
        onChange={onChange}
        options={options}
        isMulti={isMulti}
        isDisabled={isDisabled}
      />
    </div>
  );
}
