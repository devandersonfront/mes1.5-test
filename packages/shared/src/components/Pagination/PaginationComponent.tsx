import React, {useEffect, useState} from 'react'
import Pagination from '@material-ui/lab/Pagination'
import { createStyles, createTheme, makeStyles, MuiThemeProvider } from '@material-ui/core/styles'

const darkTheme = createTheme({
  palette: {
    type: 'dark'
  }
})

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      '& > *': {
        marginTop: theme.spacing(2),
      },
    },
  }),
);

interface IProps {
  totalPage: number
  currentPage: number
  setPage: (page: number) => void
  themeType?: 'modal'
}

const PaginationComponent = ({totalPage, currentPage, setPage, themeType}: IProps) => {
  const classes = useStyles()
  const [pageInfo, setPageInfo] = useState<{total: number, page: number}>({
    total: totalPage,
    page: 1
  })

  useEffect(() => {
    setPageInfo({
      ...pageInfo,
      total: totalPage, page: currentPage
    })

  }, [totalPage, currentPage])

  return (
    <MuiThemeProvider theme={themeType === 'modal' ? null : darkTheme}>
      <div className={classes.root} style={{marginTop: 16, width: '100%', display: 'flex', justifyContent: 'center'}}>
        <Pagination
          count={pageInfo.total}
          page={pageInfo.page}
          defaultPage={1}
          variant="outlined"
          shape="rounded"
          onChange={(e, page) => {
            setPage(page)
          }}
        />
      </div>
    </MuiThemeProvider>
  )
}

export {PaginationComponent}
