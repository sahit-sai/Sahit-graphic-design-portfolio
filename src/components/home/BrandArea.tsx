
"use client"
import React, { useEffect, useState } from 'react'

export default function BrandArea() {
  const [brands, setBrands] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data.brands) setBrands(data.brands);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (loading || brands.length === 0) return;

    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      addAnimation();
    }

    function addAnimation() {
      const scrollers = document.querySelectorAll(".scroller");
      scrollers.forEach((scroller) => {
        scroller.setAttribute("data-animated", "true");
        const scrollerInner = scroller.querySelector(".scroller__inner");
        if (!scrollerInner) return;
        const scrollerContent = Array.from(scrollerInner.children);
        // Clear previous clones to avoid accumulation
        const clones = scrollerInner.querySelectorAll('[aria-hidden="true"]');
        clones.forEach(c => c.remove());

        scrollerContent.forEach((item) => {
          const duplicatedItem = item.cloneNode(true) as HTMLElement;
          duplicatedItem.setAttribute("aria-hidden", "true");
          scrollerInner.appendChild(duplicatedItem);
        });
      });
    }
  }, [loading, brands]);

  if (loading) return null;

  return (
    <>
      <div className="company-design-area">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <h2>Company I Worked With</h2>
              <div className="company-list">
                <div className="scroller" data-direction="left" data-speed="slow">
                  <div className="scroller__inner">
                    {brands.length > 0 ? brands.map((logo, bIdx) => (
                      <img 
                        key={bIdx} 
                        src={logo} 
                        alt="Company" 
                        style={{ height: '50px', width: 'auto', objectFit: 'contain', margin: '0 30px' }}
                      />
                    )) : (
                      <>
                        <img src="assets/images/client-logos/partner1.png" alt="Company" style={{ height: '50px', width: 'auto', objectFit: 'contain', margin: '0 30px' }} />
                        <img src="assets/images/client-logos/partner2.png" alt="Company" style={{ height: '50px', width: 'auto', objectFit: 'contain', margin: '0 30px' }} />
                        <img src="assets/images/client-logos/partner3.png" alt="Company" style={{ height: '50px', width: 'auto', objectFit: 'contain', margin: '0 30px' }} />
                        <img src="assets/images/client-logos/partner4.png" alt="Company" style={{ height: '50px', width: 'auto', objectFit: 'contain', margin: '0 30px' }} />
                        <img src="assets/images/client-logos/partner5.png" alt="Company" style={{ height: '50px', width: 'auto', objectFit: 'contain', margin: '0 30px' }} />
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
