import Projects from '@/components/projects' 
import Wrapper from '@/layouts/Wrapper'
import { Metadata } from 'next'
import React from 'react'

export const metadata: Metadata = {
  title: 'Portfolio | Sahit Sai – Logo Design, Video Editing & Branding',
  description: 'Explore the creative portfolio of Sahit Sai. Featuring recent works in logo design, professional video editing, and social media branding for startups and small businesses.',
}


export default function index() {
  return (
    <Wrapper>
      <Projects />
    </Wrapper>
  )
}
