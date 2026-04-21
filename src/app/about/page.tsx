
import About from '@/components/about'
import Wrapper from '@/layouts/Wrapper'
import { Metadata } from 'next'
import React from 'react'

export const metadata: Metadata = {
  title: 'About Sahit Sai - Modern Portfolio Next JS Template',
  description: 'Sahit Sai - Personal Portfolio Next JS Template fresh and clean Design. You can use this portfolio template for: agency, personal portfolio, architect agency, photography studios, sound and music, musician, painter portfolio, artworks, art, artist portfolio, web design works, illustrators, trainer, projects, freelance designer. Just take the best Template of your choice, change the text, add your images and done! we have a strong support team which 24/7 days available to support you.',
}


export default function index() {
  return (
    <Wrapper>
      <About />
    </Wrapper>
  )
}
