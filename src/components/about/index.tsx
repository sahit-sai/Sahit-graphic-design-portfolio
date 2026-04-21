
import React from 'react'
import SkillArea from './SkillArea'
import ResumeArea from './ResumeArea'
import Breadcrumb from '../common/Breadcrumb'
import FooterOne from '@/layouts/footers/FooterOne'
import HeaderOne from '@/layouts/headers/HeaderOne'

import DirectAnswer from '../common/DirectAnswer'
import FAQSection from '../common/FAQSection'

export default function About() {
  return (
    <>
      <HeaderOne />
      <div id="smooth-wrapper">
        <div id="smooth-content">
          <main>
            <Breadcrumb title="About Sahit Sai – Graphic Designer & Creative Director" />
            <div className="container py-100">
               <div className="row justify-content-center">
                  <div className="col-xl-10">
                     <DirectAnswer />
                     <ResumeArea />
                     <SkillArea />
                     <FAQSection />
                  </div>
               </div>
            </div>
          </main>
          <FooterOne />
        </div>
      </div>
    </>
  )
}
