import React from 'react'
import styles from '../../styles/Home.module.css'
import WelcomePage from '../../container/welcomePage'
import {ExcelTable} from 'shared'

export default function Home() {
  return (
    <div className={styles.container}>
      <ExcelTable
        headerList={[
          {
            key: 'id',
            name: 'test'
          }
        ]} setHeaderList={() => {}} row={[]} setRow={() => {}}/>
    </div>
  )
}
