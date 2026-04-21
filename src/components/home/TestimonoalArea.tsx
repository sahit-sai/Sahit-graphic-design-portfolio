"use client"
import React, { useState, useEffect } from 'react'

interface Testimonial { id: number; name: string; role: string; text: string; authorImg: string; }

export default function TestimonoalArea() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data.testimonials) setTestimonials(data.testimonials);
        setLoading(false);
      });
  }, []);

  if (loading) return null;

  return (
    <>
      <section className="testimonials-area">
        <div className="container">
          <div className="row">
            <div className="col-xl-12 col-lg-12">
              <div className="section-title section-black-title wow fadeInUp delay-0-2s">
                <h2>Testimonials</h2>
              </div>
            </div>
          </div>
          <div className="row">
            {testimonials.map((t, idx) => (
              <div key={t.id} className={idx < 2 ? "col-lg-6 col-md-6" : "col-lg-4 col-md-6"}>
                <div className={`testimonial-item wow fadeInUp delay-0-${(idx % 5 + 2) * 2}s`}>
                  <div className="author">
                    <img src={t.authorImg || "assets/images/testimonials/author1.jpg"} alt="Author" />
                  </div>
                  <div className="text">
                    {t.text}
                  </div>
                  <div className="testi-des">
                    <h5>{t.name}</h5>
                    <span>{t.role}</span>
                  </div>
                </div>
              </div>
            ))}
            {(!testimonials || testimonials.length === 0) && (
               <div className="col-12 text-center py-5">
                  <p className="text-muted">No testimonials configured yet.</p>
               </div>
            )}
          </div>
        </div>
      </section>
    </>
  )
}
