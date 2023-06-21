import { useState } from 'react'
import { IconButton, InputAdornment } from '@mui/material'
import TextField from '@mui/material/TextField'
import cn from 'classnames'

import AppIcon from '@/components/AppIcon'

import styles from './styles.module.scss'

const AppTextField = ({value, label, type, int, onChange, onSubmit, error, variant, variantNotEmpty, autocompleteOff = false, strictNumber, labelFixed, start, end, withClear, ...props}) => {
  const [showPassword, setShowPassword] = useState(false)

  const handleChange = ({target: {value}}) => {
    if (onChange) {
      onChange(value)
    }
  }

  const handleKeyDown = (event) => {
    if (strictNumber && (event.key === '-' || event.key === '+' || event.key === 'e')) {
      event.preventDefault()
    }

    if (int && ((event.key === '0' && event.target.value.length == 0) || event.key === '-' || event.key === '+' || event.key === 'e' || event.key === '.' || event.key === ',')) {
      event.preventDefault()
    }

    if (type == 'number' && (event.key === 'ArrowUp' || event.key === 'ArrowDown')) {
      event.preventDefault()
    }

    if (event.key == 'Enter' && onSubmit) {
      onSubmit()
    }
  }

  const handleWheel = (event) => {
    if (type == 'number') {
      event.target.blur()
    }
  }

  const startAdornment = () => {
    if (start) {
      return <InputAdornment position="start">{start}</InputAdornment>
    }

    return null
  }

  const endAdornment = () => {
    if (end) {
      return (<InputAdornment position="end">{end}</InputAdornment>)
    }

    if (type == 'password') {
      return (
        <InputAdornment position="end">
          <IconButton
            onClick={handlePasswordToggle}
            onMouseDown={handleMouseDown}
            edge="end"
          >
            <AppIcon icon={showPassword ? 'eye-show' : 'eye-hide'} />
          </IconButton>
        </InputAdornment>
      )
    }

    if (withClear && value.trim() != '') {
      return (
        <InputAdornment position="end">
          <IconButton
            onClick={handleClearValue}
            onMouseDown={handleMouseDown}
            edge="end"
          >
            <AppIcon icon="cross" color="#fff" width={12} height={12} />
          </IconButton>
        </InputAdornment>
      )
    }

    return null
  }

  const handlePasswordToggle = () => {
    setShowPassword((showPassword) => !showPassword)
  }

  const handleMouseDown = (event) => {
    event.preventDefault()
  }

  const handleClearValue = () => {
    if (onChange) {
      onChange('')
    }
  }

  return (
    <TextField
      fullWidth
      type={showPassword ? 'text' : type}
      error={!!error}
      helperText={error}
      label={label}
      value={value}
      variant="outlined"
      classes={{
        root: cn(styles.textField, {[styles[variant]]: variant}, {[styles.notEmpty]: variantNotEmpty && value.trim() != ''}),
      }}
      InputLabelProps={{
        shrink: labelFixed,
        classes: {
          root: styles.label,
          focused: styles.label_focused,
          disabled: styles.label_disabled,
          error: styles.label_error,
        },
      }}
      FormHelperTextProps={{
        classes: {
          root: styles.helper,
          error: styles.helper_error,
        },
      }}
      InputProps={{
        startAdornment: startAdornment(),
        endAdornment: endAdornment(),
        classes: {
          root: styles.input,
          focused: styles.input_focused,
          disabled: styles.input_disabled,
          error: styles.input_error,
          input: styles.input_input,
          notchedOutline: styles.input_fieldset,
        },
      }}
      inputProps={{
        step: int ? 1 : null,
      }}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      onWheel={handleWheel}
      {...props}
    />
  )
}

export default AppTextField
