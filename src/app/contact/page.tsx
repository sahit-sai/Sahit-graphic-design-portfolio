 
import Contact from '@/components/contact'
import Wrapper from '@/layouts/Wrapper'
import { Metadata } from 'next'
import React from 'react'

export const metadata: Metadata = {
  title: 'Hire Sahit Sai | Contact for Logo Design & Video Editing',
  description: 'Get a quote for your next creative project. Contact Sahit Sai for logo design, brand identity, and professional video editing services for startups and small businesses.',
}


export default function index() {
  return (
    <Wrapper>
      <Contact />
    </Wrapper>
  )
}
