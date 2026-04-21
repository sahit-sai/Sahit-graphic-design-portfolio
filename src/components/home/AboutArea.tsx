
"use client"
import React, { useState, useEffect } from 'react'
import Count from '../common/Count'

export default function AboutArea() {
  const [settings, setSettings] = useState({ 
    name: 'Sahit Sai', 
    bio: '',
    experienceYears: 8,
    completedProjects: 1,
    satisfactionRate: 90
  });

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => setSettings(data));
  }, []);

  const counter_data = [
    {
      id: 1,
      title: 'Years Of Experience',
      count: settings.experienceYears,
      cls: "plus",
    },
    {
      id: 2,
      title: 'Completed Projects',
      count: settings.completedProjects,
      cls: "k-plus",
    },
    {
      id: 3,
      title: 'Client Satisfactions',
      count: settings.satisfactionRate,
      cls: "percent",
    },
  ];

  return (
    <>
      <section id="about" className="about-area">
        <div className="container">
          <div className="row">

            <div className="col-lg-3 col-sm-3">
              <h2 className="about-pre-title">About Me</h2>
            </div>
            <div className="col-lg-9 col-sm-9">
              <div className="about-content-part wow fadeInUp delay-0-2s">
                <p>{settings.bio || `I am ${settings.name}, a seasoned designer with a passion for crafting intuitive digital experiences.`}</p>
              </div>
              <div className="hero-counter-area d-flex justify-content-between wow fadeInUp delay-0-4s">
                {counter_data.map((item, i) => (
                  <div key={i} className="counter-item counter-text-wrap">
                    <span className={`count-text ${item.cls}`}>
                      <Count number={item.count} />
                    </span>
                    <span className="counter-title">{item.title}</span>
                  </div>
                ))} 
              </div>
            </div>
          </div>
        </div>
      </section>

    </>
  )
}


