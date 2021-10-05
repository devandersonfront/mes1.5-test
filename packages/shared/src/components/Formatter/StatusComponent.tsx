import React, {useEffect, useState} from 'react'

interface Props {
  row:any
  column:any
}

const StatusComponent = ({row,column}:Props) => {
  const [statusColor, setStatusColor] = useState<string>('')
  useEffect(() => {
    if (row.status) {
      switch (row.status) {
        case '작업중':
          setStatusColor('rgba(8, 167, 3, 1), rgba(8, 78, 5, 1)')
          break
        case '일시정지':
          setStatusColor('#A3B9E3, #5C7495')
          break
        case '작업종료':
          setStatusColor('#F41300, #7A0A00')
          break
        case '미완료':
          setStatusColor('#FE9C00, #28487C')
          break
        default:
          setStatusColor('')
          break
      }
    }
  }, [row])

  return (
    <div style={{
      background: statusColor ? `linear-gradient(to bottom right,${statusColor})` : undefined,
      width: "100%",
      height: "100%"
    }}>
      {row[column.key]}
    </div>
  )
}

export {StatusComponent};
