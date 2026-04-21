
import React from 'react';

const FAQSection = () => {
  const faqs = [
    {
      question: "What graphic design services do you offer?",
      answer: "I specialize in a wide range of creative services including Logo & Brand Identity Design, Photo Editing, Video Editing (Reels, YouTube, Ads), Social Media Design, UI/UX Design, and Motion Graphics."
    },
    {
      question: "What tools and software do you use?",
      answer: "My toolkit includes professional industry standards: Adobe Illustrator for vector work, Photoshop for retouching, Premiere Pro and After Effects for video and motion, Figma for UI/UX, and DaVinci Resolve for color grading."
    },
    {
      question: "Do you work with small businesses and startups?",
      answer: "Yes, I am passionate about helping startups and small businesses build strong, professional visual identities that stand out in competitive markets."
    },
    {
      question: "How long does a logo design project take?",
      answer: "A standard logo design project typically takes 1-2 weeks, including research, conceptualization, and refinement phases to ensure the best result for your brand."
    }
  ];

  return (
    <section className="faq-area py-100">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-xl-8">
            <h2 className="mb-50 text-center">Frequently Asked Questions</h2>
            <div className="faq-wrapper">
              {faqs.map((faq, index) => (
                <div key={index} className="faq-item mb-30 p-4" style={{border: '1px solid #222', borderRadius: '10px'}}>
                  <h3 className="h5 mb-3">{faq.question}</h3>
                  <p className="mb-0 text-muted">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
