import React from 'react'

const Logo = ({width}: {width?: number}) => {
  return (
    <img
    src='/logo-2.png'
    style={{ width: `${width || 75}px` }}
    className="transform scale-[3.9] object-center"
    />
  )
}

export default Logo
