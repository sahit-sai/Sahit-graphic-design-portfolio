import React from 'react'
import Breadcrumb from '../common/Breadcrumb'
import PortfolioArea from '../home/PortfolioArea'
import HeaderOne from '@/layouts/headers/HeaderOne'
import FooterOne from '@/layouts/footers/FooterOne'

export default function Projects() {
  return (
    <>


      <HeaderOne />
      <div id="smooth-wrapper">
        <div id="smooth-content">
          <main>
            <Breadcrumb title="Projects" style_2={true} />
            <PortfolioArea />
          </main>
          <FooterOne />
        </div>
      </div>

    </>
  )
}
