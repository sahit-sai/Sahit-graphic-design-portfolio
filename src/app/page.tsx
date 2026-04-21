 
import React from 'react'

import type { Metadata } from 'next'  
import Home from '@/components/home'
import Wrapper from '@/layouts/Wrapper'
export const metadata: Metadata = {
  title: 'Sahit Sai | Graphic Designer & Video Editor',
  description: 'Sahit Sai is a freelance graphic designer and video editor specializing in logo design, branding, social media creatives, and motion graphics. Based in India.',
  openGraph: {
    title: 'Sahit Sai | Graphic Designer & Video Editor',
    description: 'Freelance graphic designer specializing in logo design, video editing, social media creatives, and motion graphics. Available for hire.',
    images: ['/assets/images/personal-branding.jpg'],
  },
}


export default function index() {
  return (
    <Wrapper>
     <Home /> 
    </Wrapper>
  )
}
