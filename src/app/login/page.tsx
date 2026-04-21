
"use client"
import React from 'react'
import { createClient } from '@/utils/supabase/client'

export default function LoginPage() {
  const supabase = createClient()

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/sahitadmin`,
      },
    })
    if (error) console.error('Login error:', error)
  }

  return (
    <div className="legend-auth-container">
      <div className="auth-grid-bg"></div>
      
      <div className="auth-monolith">
        <div className="auth-header text-start">
          <div className="auth-tag">SYSTEM / V2.0</div>
          <h1 className="auth-title">LEGEND.AUTH</h1>
          <div className="auth-divider"></div>
          <p className="auth-desc">ESTABLISHED 1989 / CREATIVE CONTROL PORTAL</p>
        </div>

        <div className="auth-body">
          <button onClick={handleLogin} className="google-monolith-btn">
             <span className="btn-prefix">GO/</span>
             <span className="btn-main">AUTHORIZE.GOOGLE</span>
             <span className="btn-arrow">→</span>
          </button>
        </div>

        <footer className="auth-footer text-start">
           <div className="tech-coord">
              <span>LAT 17.3850 N</span>
              <span>LNG 78.4867 E</span>
           </div>
           <p className="footer-label">AUTHENTICATION.REQUIRED_FOR_ENTRY</p>
        </footer>
      </div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;700;800&family=Syne:wght@800&display=swap');

        .legend-auth-container {
          height: 100vh;
          width: 100%;
          background: #000;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Space Grotesk', sans-serif;
          color: #fff;
          position: relative;
          overflow: hidden;
        }

        .auth-grid-bg {
          position: absolute;
          inset: 0;
          background-image: 
            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
          background-size: 80px 80px;
          pointer-events: none;
        }

        .auth-monolith {
          width: 100%;
          max-width: 500px;
          background: #000;
          border: 1px solid rgba(255,255,255,0.1);
          padding: 80px 60px;
          position: relative;
          z-index: 10;
        }

        .auth-monolith::after {
          content: '';
          position: absolute; top: -1px; left: -1px;
          width: 20px; height: 20px;
          border-top: 1px solid #ff4d00;
          border-left: 1px solid #ff4d00;
        }

        .auth-tag {
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 3px;
          color: #ff4d00;
          margin-bottom: 10px;
        }

        .auth-title {
          font-family: 'Syne', sans-serif;
          font-size: 64px;
          font-weight: 800;
          letter-spacing: -3px;
          line-height: 1;
          margin: 0;
        }

        .auth-divider {
          width: 100%;
          height: 1px;
          background: rgba(255,255,255,0.1);
          margin: 30px 0;
        }

        .auth-desc {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 2px;
          color: #444;
          margin-bottom: 50px;
        }

        .google-monolith-btn {
          width: 100%;
          background: #fff;
          border: none;
          color: #000;
          padding: 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-weight: 800;
          font-size: 14px;
          letter-spacing: 1px;
          cursor: pointer;
          transition: 0.4s cubic-bezier(0.19, 1, 0.22, 1);
        }

        .google-monolith-btn:hover {
          background: #ff4d00;
          color: #fff;
          transform: translateX(10px);
        }

        .btn-prefix { opacity: 0.3; }

        .auth-footer {
          margin-top: 60px;
        }

        .tech-coord {
          display: flex; gap: 20px;
          font-size: 9px; font-weight: 700; color: #333;
          margin-bottom: 10px;
        }

        .footer-label {
          font-size: 9px; font-weight: 700; color: #222; margin: 0; letter-spacing: 2px;
        }

        @media (max-width: 600px) {
           .auth-monolith { padding: 40px 30px; margin: 20px; }
           .auth-title { font-size: 42px; }
        }
      `}</style>
    </div>
  )
}

