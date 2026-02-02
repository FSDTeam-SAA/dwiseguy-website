import Image from 'next/image'
import React from 'react'

const hero = () => {
  return (
    <div>
      <Image src="/images/hero.png" alt="hero" width={1920} height={1080} />
    </div>
  )
}

export default hero