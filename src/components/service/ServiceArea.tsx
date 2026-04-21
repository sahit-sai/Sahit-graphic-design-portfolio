
import React from 'react'

export default function ServiceArea() {
  return (
    <>
      <section id="services" className="services-area py-100">
        <div className="container">
          <div className="row mb-60">
             <div className="col-12">
                <h2 className="display-5 fw-bold mb-4">What design services do I offer?</h2>
                <p className="lead text-muted">A comprehensive suite of creative solutions tailored for small businesses and startups.</p>
             </div>
          </div>
          <div className="row">
            <div className="col-lg-6 col-md-6 mb-4">
              <div className="service-item p-5 wow fadeInUp delay-0-2s" style={{border: '1px solid #1a1a1a', height: '100%'}}>
                <i className="ri-quill-pen-line display-4 mb-3 text-primary"></i>
                <h3 className="h4 mb-3">Logo & Brand Identity Design</h3>
                <p>Creating memorable logos and cohesive brand identities using Adobe Illustrator and Figma to help your business stand out and build trust.</p>
              </div>
            </div>

            <div className="col-lg-6 col-md-6 mb-4">
              <div className="service-item p-5 wow fadeInUp delay-0-4s" style={{border: '1px solid #1a1a1a', height: '100%'}}>
                <i className="ri-video-line display-4 mb-3 text-primary"></i>
                <h3 className="h4 mb-3">Video Editing (Reels, YouTube, Ads)</h3>
                <p>Professional video editing for social media platforms using Premiere Pro and DaVinci Resolve. Specializing in Reels, YouTube content, and high-impact ads.</p>
              </div>
            </div>

            <div className="col-lg-6 col-md-6 mb-4">
              <div className="service-item p-5 wow fadeInUp delay-0-6s" style={{border: '1px solid #1a1a1a', height: '100%'}}>
                <i className="ri-smartphone-line display-4 mb-3 text-primary"></i>
                <h3 className="h4 mb-3">Social Media Design</h3>
                <p>Strategic designs for Instagram, Facebook, and LinkedIn. Creating engaging posts, stories, and banners that drive interaction and brand awareness.</p>
              </div>
            </div>

            <div className="col-lg-6 col-md-6 mb-4">
              <div className="service-item p-5 wow fadeInUp delay-0-8s" style={{border: '1px solid #1a1a1a', height: '100%'}}>
                <i className="ri-image-edit-line display-4 mb-3 text-primary"></i>
                <h3 className="h4 mb-3">Photo Editing & Retouching</h3>
                <p>High-end photo retouching and color correction using Adobe Photoshop and Lightroom to ensure your brand imagery is flawless and professional.</p>
              </div>
            </div>

            <div className="col-lg-6 col-md-6 mb-4">
              <div className="service-item p-5 wow fadeInUp delay-1-0s" style={{border: '1px solid #1a1a1a', height: '100%'}}>
                <i className="ri-layout-masonry-line display-4 mb-3 text-primary"></i>
                <h3 className="h4 mb-3">UI/UX Design</h3>
                <p>Crafting intuitive and user-centered digital experiences in Figma. Focusing on usability and aesthetics to increase user satisfaction and conversion.</p>
              </div>
            </div>

            <div className="col-lg-6 col-md-6 mb-4">
              <div className="service-item p-5 wow fadeInUp delay-1-2s" style={{border: '1px solid #1a1a1a', height: '100%'}}>
                <i className="ri-motion-line display-4 mb-3 text-primary"></i>
                <h3 className="h4 mb-3">Motion Graphics & Animation</h3>
                <p>Bringing designs to life with smooth animations and professional motion graphics using Adobe After Effects to captivate your audience.</p>
              </div>
            </div>
          </div>

          <div className="row mt-80">
             <div className="col-12">
                <h2 className="display-6 fw-bold mb-4">Which tools do I use to bring your vision to life?</h2>
                <p className="lead">I master the industry's most powerful creative suites: Adobe Creative Cloud (Illustrator, Photoshop, Premiere Pro, After Effects, Lightroom), Figma, DaVinci Resolve, and Canva.</p>
             </div>
          </div>
        </div>
      </section>
    </>
  )
}
