import React from 'react';
import Select from 'react-select';
import styles from './selectInput.module.css';

export default function SelectInput({
  name,
  value,
  onChange,
  options,
  isMulti = true,
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
      />
    </div>
  );
}
