
"use client"
import React, { useState, useEffect } from 'react'
import ImagePopup from '@/modals/ImagePopup';

interface Project {
  id: number;
  col: string;
  images?: string[];
  videos?: string[];
  image: string;
  video?: string;
  title: string;
  category: string;
  specType?: 'default' | 'physical' | 'digital';
  length?: string;
  breadth?: string;
  pixels?: string;
}


export default function PortfolioArea() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [photoIndex, setPhotoIndex] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    fetch('/api/projects')
      .then(res => res.json())
      .then(data => setProjects(data));
  }, []);

  const handleImagePopup = (i: any) => {
    setPhotoIndex(i);
    setIsOpen(true);
  };

  const images = projects.map((item) => (item.images && item.images.length > 0) ? item.images[0] : item.image);

  return (
    <>
      <div className="projects-area" id="portfolio">
        <div className="custom-icon">
          <img src="assets/images/custom/work-scribble.svg" alt="custom" />
        </div>
        <div className="container-fluid">
          <div className="row g-4 portfolio-grid">
            {projects.map((item, i) => (
              <div key={item.id} className={`col-md-6 col-xl-${item.col} portfolio-item category-1`}>
                <a
                  style={{ cursor: "pointer" }}
                  onClick={() => handleImagePopup(i)} className="work-popup">
                  <div className="portfolio-box">
                    { (item.videos && item.videos.length > 0) ? (
                      <video 
                        src={item.videos[0]} 
                        poster={item.images?.[0] || item.image}
                        autoPlay 
                        muted 
                        loop 
                        playsInline
                        style={{ height: "auto", width: "100%", objectFit: "cover" }} 
                      />
                    ) : item.video ? (
                      <video 
                        src={item.video} 
                        poster={item.image}
                        autoPlay 
                        muted 
                        loop 
                        playsInline
                        style={{ height: "auto", width: "100%", objectFit: "cover" }} 
                      />
                    ) : (
                      <img src={(item.images && item.images.length > 0) ? item.images[0] : item.image} alt="" style={{ height: "auto", width: "100%" }} />
                    )}
                    <span className="portfolio-category">{item.category}</span>
                    <div className="portfolio-caption">
                      <h1>{item.title}</h1>
                      <div className="portfolio-specs mt-2" style={{ fontSize: '13px', opacity: 0.7, letterSpacing: '1px', textTransform: 'uppercase' }}>
                         {item.specType === 'physical' && item.length && (
                           <span>{item.length}L x {item.breadth}B</span>
                         )}
                         {item.specType === 'digital' && item.pixels && (
                           <span>{item.pixels} PIXELS</span>
                         )}
                      </div>
                    </div>
                  </div>

                </a>
              </div>
            ))} 
          </div>
        </div>
      </div>

      {isOpen && (
        <ImagePopup
          images={images}
          setIsOpen={setIsOpen}
          photoIndex={photoIndex}
          setPhotoIndex={setPhotoIndex}
        />
      )}
    </>
  )
}

