
import React from 'react'
import HeaderOne from '@/layouts/headers/HeaderOne'
import Breadcrumb from '../common/Breadcrumb'
import ContactArea from '../home/ContactArea'
import FooterOne from '@/layouts/footers/FooterOne'

export default function Contact() {
  return (
    <>

      <HeaderOne />
      <div id="smooth-wrapper">
        <div id="smooth-content">
          <main>
            <Breadcrumb title="Say Hello" style_3={true} />
            <ContactArea />
          </main>
          <FooterOne />
        </div>
      </div>

    </>
  )
}
