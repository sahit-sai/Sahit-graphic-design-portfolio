
"use client"
import React, { useState, useEffect } from 'react'

interface Blog {
  id: number;
  image: string;
  category: string;
  date: string;
  title: string;
  videoUrl?: string;
  isYoutube?: boolean;
}

export default function BlogArea() {
  const [blogs, setBlogs] = useState<Blog[]>([]);

  useEffect(() => {
    fetch('/api/blogs')
      .then(res => res.json())
      .then(data => setBlogs(data));
  }, []);

  const getYoutubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  return (
    <>
      <section className="blog-area">
        <div className="container">
          <div className="row">
            <div className="col-xl-12 col-lg-12">
              <div className="section-title wow fadeInUp delay-0-2s">
                <h2>Stories</h2>
              </div>
            </div>
          </div>

          {blogs.map((blog) => (
            <div key={blog.id} className="row blog-post-box align-items-center">
              <div className="col-lg-6">
                <div className="blog-post-img">
                  {blog.videoUrl ? (
                    blog.isYoutube ? (
                      <div className="video-wrapper" style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden' }}>
                        <iframe 
                          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}
                          src={`https://www.youtube.com/embed/${getYoutubeId(blog.videoUrl)}`} 
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                          allowFullScreen
                        ></iframe>
                      </div>
                    ) : (
                      <video 
                        src={blog.videoUrl} 
                        controls 
                        style={{ width: '100%', display: 'block', borderRadius: '12px' }}
                      />
                    )
                  ) : (
                    <a href="#">
                      <img src={blog.image} alt="" />
                    </a>
                  )}
                  <div className="blog-post-category">
                    <a href="#">{blog.category}</a>
                  </div>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="blog-post-caption">
                  <h3>Posted on {blog.date}</h3>
                  <h2><a className="link-decoration" href="#">{blog.title}</a></h2>
                  <a className="theme-btn theme-btn-two" href="#">Read more <i className="ri-arrow-right-line"></i></a>
                </div>
              </div>
            </div>
          ))}

        </div>
      </section>
    </>
  )
}

