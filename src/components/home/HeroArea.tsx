
"use client"
import React, { useState, useEffect } from 'react'

export default function HeroArea() {
  const [settings, setSettings] = useState({ 
    name: 'Sahit Sai', 
    bio: '', 
    profilePic: 'assets/images/about/me.jpg',
    reviewCount: '100+ reviews',
    reviewRating: '(4.96 of 5)',
    reviewText: 'Five-star reviews from my esteemed clients.',
    reviewAvatars: [
      'assets/images/avatar/01.jpg',
      'assets/images/avatar/02.jpg',
      'assets/images/avatar/03.jpg'
    ]
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        setSettings(data);
        setLoading(false);
      });
  }, []);

  if (loading) return null;

  return (
    <>
      <section id="home" className="main-hero-area">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">

              <div className="hero-content wow fadeInUp text-center delay-0-2s">
                <h2>{settings.name}</h2>
              </div>

            </div>
          </div>
          <div className="row">
            <div className="col-lg-3 pt-30">

              <div className="hero-content wow fadeInUp delay-0-2s">
                <div className="clienti-reviews">
                  <ul className="clienti-profile">
                    {settings.reviewAvatars && settings.reviewAvatars.map((av, idx) => (
                      <li key={idx}>
                        <img 
                          className="img-fluid" 
                          src={av} 
                          alt="client" 
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </li>
                    ))}

                  </ul>
                  <div className="reviews">{settings.reviewCount} <span>{settings.reviewRating}</span>
                    <p>{settings.reviewText}</p>
                  </div>
                </div>

              </div>

            </div>
            <div className="col-lg-6">
              <div className="hero-image">
                <img src={settings.profilePic} alt={settings.name} />
              </div>

            </div>
            <div className="col-lg-3 pt-30">
              <div className="hero-content wow fadeInUp delay-0-4s">
                <p>{settings.bio}</p>
                <a className="theme-btn" href="#contact">Get In touch</a>
              </div>

            </div>
          </div>
        </div>
      </section>
    </>
  )
}


