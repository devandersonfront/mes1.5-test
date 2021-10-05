import React, {useEffect, useState} from 'react'
import {useRouter} from 'next/router'

interface Props {
  row:any
  column:any
}

const RecordDetailFormatter = ({row,column}:Props) => {
  const router = useRouter()
  const [showTitle, setShowTitle] = useState<string>('Jackson외 2명')

  useEffect(() => {
    setShowTitle(row[column.key])
  }, [row[column.key]])

  return (
    <div style={{ width:"100%", height:"100%"}} onClick={() => {
      router.push({
        pathname: '/mes/record/sum/detail',
        query: {
          sum_data: encodeURI(JSON.stringify(row))
        }
      }).then(r => {})
    }}>
      <p style={{margin: 0, padding: 0, textDecoration: 'underline', cursor: 'pointer'}}>
        {showTitle}
      </p>
    </div>
  );
}

export {RecordDetailFormatter};
