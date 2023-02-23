import { CSSObjectWithLabel, ControlProps, StylesConfig, ContainerProps, MenuProps, SingleValueProps, OptionProps } from "react-select";

export const selectStyle: StylesConfig = {
  container: (baseStyles: CSSObjectWithLabel, props: ContainerProps) => ({
    ...baseStyles,
    border: 'none'
  }),
  control: (baseStyles: CSSObjectWithLabel, state: ControlProps) => ({
    ...baseStyles,
    outline: 'none',
    borderRadius: '0.5rem',
    backgroundColor: state.isFocused ? 'var(--input-focus-background-color)' : 'var(--input-background-color)',
    border: state.isFocused ? '1px solid var(--primary-color)' : 'none'
  }),
  singleValue: (baseStyles: CSSObjectWithLabel, state: SingleValueProps) => ({
    ...baseStyles,
    color: 'var(--on-surface-color)'
  }),
  menu: (baseStyles: CSSObjectWithLabel, state: MenuProps) => ({
    ...baseStyles,
    backgroundColor: 'var(--surface-color)',
    borderRadius: '0.5rem'
  }),
  option: (baseStyles: CSSObjectWithLabel, state: OptionProps) => ({
  ...baseStyles,
    transition: 'all 150ms ease',
    margin: '0.25rem 0.5rem 0.25rem 0.5rem',
    width: 'auto',
    cursor: 'pointer',
    borderRadius: '0.5rem',
    backgroundColor: state.isSelected ? 'var(--primary-color)' : state.isFocused ? 'var(--input-background-color)' : 'transparent',
    color: state.isSelected ? 'var(--on-primary-color)' : 'var(--on-surface-color)',
    '&:hover': {
      backgroundColor: state.isSelected ? 'var(--primary-color)' : 'var(--tertiary-surface-color)'
    },
  })
};
