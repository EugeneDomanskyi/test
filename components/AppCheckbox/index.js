import { FormControlLabel, Checkbox } from '@mui/material'
import { styled } from '@mui/material/styles'

const StyledFormControlLabel = styled(FormControlLabel)(({ theme }) => ({
  '&' : {
    marginRight: '0',
    marginLeft: '0',
  },

  '& .MuiFormControlLabel-label': {
    color: '#AAA3CF',
    fontSize: '16px',
    fontWeight: '500',
    fontFamily: 'Gilroy',
    lineHeight: '19px',

    [theme.breakpoints.down('sm')]: {
      fontSize: '14px',
    },
  },

  '&.small .MuiFormControlLabel-label': {
    fontSize: '12px',
  },
}))

const StyledCheckbox = styled(Checkbox)({
  '&': {
    color: '#AAA3CF',
    padding: '0 9px 0 0',
  },

  '&.Mui-checked': {
    color: '#AAA3CF',
  },
})

const AppCheckbox = ({ label, checked, small, onChange, ...props }) => {
  const styles = () => {
    const result = {}

    if (typeof label != 'string') {
      result.padding = '0'
    }

    return result
  }

  const handleChange = ({ target }) => {
    onChange(target.checked)
  }

  return (
    <StyledFormControlLabel className={small ? 'small' : null} control={<StyledCheckbox checked={checked} onChange={handleChange} style={styles()} {...props} />} label={label} />
  )
}

export default AppCheckbox