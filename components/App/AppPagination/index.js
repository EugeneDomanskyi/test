import { Pagination, PaginationItem } from '@mui/material'

import styles from './styles.module.scss'

const AppPagination = ({ page, count, onChange }) => {
  const handleChange = (event, value) => {
    if (onChange) {
      onChange(value)
    }
  }

  return (
    <Pagination
      count={count}
      page={page}
      onChange={handleChange}
      renderItem={(item) => <PaginationItem classes={{ root: styles.item, selected: styles.selected, ellipsis: styles.ellipsis }} {...item} />}
      classes={{ root: styles.pagination, text: styles.text }} />
  )
}

export default AppPagination