import React from 'react'

const MiniLogo = ({width}: {width?: number}) => {
  return (
    <img
    src='/favicon-1.ico'
    style={{ width: `${width || 30}px` }}
    className="transform scale-[3.9] object-center"
    />
  )
}

export default MiniLogo
