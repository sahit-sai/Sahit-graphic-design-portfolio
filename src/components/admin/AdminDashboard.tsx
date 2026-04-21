
"use client"
import React, { useEffect, useState, useCallback } from 'react';

interface Message { id: number; name: string; email: string; subject: string; message: string; createdAt: string; }
interface Project { id: number; title: string; category: string; images: string[]; videos: string[]; col: string; specType: 'default' | 'physical' | 'digital'; length?: string; breadth?: string; pixels?: string; }
interface Blog { id: number; title: string; category: string; image: string; date: string; videoUrl?: string; isYoutube?: boolean; }

interface Stats { views: number; clicks: number; time: string; }

type Tab = 'analytics' | 'projects' | 'blogs' | 'appearance' | 'partners';
interface Testimonial { id: number; name: string; role: string; text: string; authorImg: string; }
interface SiteSettings { 
  name: string; 
  bio: string; 
  profilePic: string;
  reviewCount: string;
  reviewRating: string;
  reviewText: string;
  reviewAvatars: string[];
  experienceYears: number;
  completedProjects: number;
  satisfactionRate: number;
  brands: string[];
  testimonials: Testimonial[];
}




function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('projects');
  
  const handleTabChange = (tab: Tab) => {
    cancelEdit();
    cancelEditBlog();
    setActiveTab(tab);
  };

  const [messages, setMessages] = useState<Message[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [stats, setStats] = useState<Stats>({ views: 0, clicks: 0, time: "0s" });
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [settings, setSettings] = useState<SiteSettings>({ 
    name: '', bio: '', profilePic: '', 
    reviewCount: '0', reviewRating: '0', reviewText: '', reviewAvatars: [],
    experienceYears: 0, completedProjects: 0, satisfactionRate: 0,
    brands: [], testimonials: []
  });


  // Form states
  const [newProject, setNewProject] = useState<Project>({ 
    id: 0, title: '', category: '', images: [], videos: [], col: '6', 
    specType: 'default', length: '', breadth: '', pixels: '' 
  });
  const [editingProject, setEditingProject] = useState<Project | null>(null);


  const [newBlog, setNewBlog] = useState({ 
    id: 0, 
    title: '', 
    category: '', 
    image: 'assets/images/blog/blog1.jpg', 
    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    videoUrl: '',
    isYoutube: false
  });
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);


  // Notification State
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState({ title: '', message: '', onConfirm: () => {}, confirmText: 'Confirm', confirmColor: '#000' });

  const fetchData = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const [msgRes, statsRes, projRes, blogRes, settingsRes] = await Promise.all([
        fetch('/api/messages'),
        fetch('/api/stats'),
        fetch('/api/projects'),
        fetch('/api/blogs'),
        fetch('/api/settings')
      ]);
      if (msgRes.ok) setMessages(await msgRes.json());
      if (statsRes.ok) setStats(await statsRes.json());
      if (projRes.ok) setProjects(await projRes.json());
      if (blogRes.ok) setBlogs(await blogRes.json());
      if (settingsRes.ok) setSettings(await settingsRes.json());

    } catch (error) {
      console.error('Failed to sync workspace:', error);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const openModal = (config: any) => { setModalConfig(config); setModalOpen(true); };
  const closeModal = () => setModalOpen(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, target: string = 'project') => {
    if (!e.target.files) return;
    setIsSubmitting(true);
    const formData = new FormData();
    Array.from(e.target.files).forEach(file => formData.append('files', file));

    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (data.paths) {
        if (target === 'profile') {
          setSettings(prev => ({ ...prev, profilePic: data.paths[0] }));
        } else if (target === 'project') {
          const uploadedImages = data.paths.filter((p: string) => /\.(jpg|jpeg|png|gif|webp)$/i.test(p));
          const uploadedVideos = data.paths.filter((p: string) => /\.(mp4|webm|ogg)$/i.test(p));
          setNewProject(prev => ({
            ...prev,
            images: [...prev.images, ...uploadedImages],
            videos: [...prev.videos, ...uploadedVideos]
          }));
        } else if (target === 'brand') {
          setSettings(prev => ({ ...prev, brands: [...prev.brands, ...data.paths] }));
        } else if (target.startsWith('brand-')) {
          const idx = parseInt(target.split('-')[1]);
          const nextBrands = [...settings.brands];
          nextBrands[idx] = data.paths[0];
          setSettings(prev => ({ ...prev, brands: nextBrands }));
        } else if (target.startsWith('reviewAvatar-')) {
          const idx = parseInt(target.split('-')[1]);
          const nextAvatars = [...settings.reviewAvatars];
          nextAvatars[idx] = data.paths[0];
          setSettings(prev => ({ ...prev, reviewAvatars: nextAvatars }));
        } else if (target.startsWith('testimonial-')) {


          const idx = parseInt(target.split('-')[1]);
          const nextTestimonials = [...settings.testimonials];
          nextTestimonials[idx].authorImg = data.paths[0];
          setSettings(prev => ({ ...prev, testimonials: nextTestimonials }));
        } else if (target === 'blog-video') {
          setNewBlog(prev => ({ ...prev, videoUrl: data.paths[0], isYoutube: false }));
        }
        showNotification(`${data.paths.length} assets integrated.`);
      }

    } catch (error) {

      showNotification('Asset upload failed.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      if (res.ok) {
        showNotification('Appearance profile synchronized.');
      } else throw new Error('Fail');
    } catch (error) {
      showNotification('Update failed.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };


  const removeAsset = (path: string, type: 'images' | 'videos') => {
    setNewProject(prev => ({
      ...prev,
      [type]: prev[type].filter(p => p !== path)
    }));
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newProject.images.length === 0 && newProject.videos.length === 0) {
      showNotification('At least one asset is required.', 'error');
      return;
    }
    setIsSubmitting(true);
    try {
      const method = editingProject ? 'PUT' : 'POST';
      const body = { ...newProject };
      if (!editingProject) delete (body as any).id;

      const res = await fetch('/api/projects', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      if (res.ok) {
        await fetchData();
        setNewProject({ id: 0, title: '', category: '', images: [], videos: [], col: '6' });
        setEditingProject(null);
        showNotification(editingProject ? 'Structural data updated.' : 'New project captured.');
      } else {
        throw new Error('Failed');
      }
    } catch (error) {
      showNotification('Operation failed. Check logs.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const editProject = (p: Project) => {
    setEditingProject(p);
    setNewProject({ 
      ...p,
      images: p.images || (p as any).image ? [(p as any).image] : [], 
      videos: p.videos || (p as any).video ? [(p as any).video] : [], 
      specType: p.specType || 'default',
      length: p.length || '',
      breadth: p.breadth || '',
      pixels: p.pixels || ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingProject(null);
    setNewProject({ id: 0, title: '', category: '', images: [], videos: [], col: '6', specType: 'default', length: '', breadth: '', pixels: '' });
  };



  const handleCreateBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const method = editingBlog ? 'PUT' : 'POST';
      const body = { ...newBlog };
      if (!editingBlog) delete (body as any).id;

      const res = await fetch('/api/blogs', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      if (res.ok) {
        await fetchData();
        setNewBlog({ 
          id: 0, title: '', category: '', image: 'assets/images/blog/blog1.jpg', 
          date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          videoUrl: '', isYoutube: false
        });
        setEditingBlog(null);

        showNotification(editingBlog ? 'Narrative refined.' : 'Story published.');
      } else {
        throw new Error('Failed');
      }
    } catch (error) {
      showNotification('Transmission error.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const editBlog = (b: Blog) => {
    setEditingBlog(b);
    setNewBlog({ 
      id: b.id, title: b.title, category: b.category, image: b.image, date: b.date,
      videoUrl: b.videoUrl || '', isYoutube: b.isYoutube || false
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };


  const cancelEditBlog = () => {
    setEditingBlog(null);
    setNewBlog({ 
      id: 0, title: '', category: '', image: 'assets/images/blog/blog1.jpg', 
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      videoUrl: '', isYoutube: false
    });
  };


  const deleteItem = async (type: 'projects' | 'blogs' | 'messages', id?: number) => {
    openModal({
      title: id ? 'Confirm Deletion' : 'Clear Communication Logs',
      message: id ? 'This record will be permanently removed.' : 'All inbound records will be wiped from the architecture.',
      confirmText: id ? 'Remove' : 'Wipe All',
      confirmColor: '#ff4d4d',
      onConfirm: async () => {
        try {
          const url = id !== undefined ? `/api/${type}?id=${id}` : `/api/${type}`;
          const res = await fetch(url, { method: 'DELETE' });
          if (res.ok) {
            await fetchData();
            closeModal();
            showNotification('Record purged.');
          }
        } catch (error) { showNotification('Deletion failed.', 'error'); }
      }
    });
  };

  return (
    <section className="legend-studio">
      <div className="studio-grid-bg"></div>
      
      {/* HUD SIDEBAR SYSTEM */}
      <aside className="studio-hud">
        <div className="hud-logo mb-60">
          <div className="hud-mark">S</div>
          <span className="hud-label">SAHIT.LOG</span>
        </div>
        
        <nav className="hud-nav">
          <button className={`hud-item ${activeTab === 'analytics' ? 'active' : ''}`} onClick={() => handleTabChange('analytics')}>
             <span className="hud-num">01</span>
             <span className="hud-text">INSIGHTS</span>
          </button>
          <button className={`hud-item ${activeTab === 'projects' ? 'active' : ''}`} onClick={() => handleTabChange('projects')}>
             <span className="hud-num">02</span>
             <span className="hud-text">ARCHIVE</span>
          </button>
          <button className={`hud-item ${activeTab === 'blogs' ? 'active' : ''}`} onClick={() => handleTabChange('blogs')}>
             <span className="hud-num">03</span>
             <span className="hud-text">NARRATIVE</span>
          </button>
          <button className={`hud-item ${activeTab === 'partners' ? 'active' : ''}`} onClick={() => handleTabChange('partners')}>
             <span className="hud-num">04</span>
             <span className="hud-text">PARTNERS</span>
          </button>
          <button className={`hud-item ${activeTab === 'appearance' ? 'active' : ''}`} onClick={() => handleTabChange('appearance')}>
             <span className="hud-num">05</span>
             <span className="hud-text">IDENTITY</span>
          </button>
        </nav>

        <div className="hud-footer mt-auto">
          <div className="system-ping">
             <div className="ping-dot"></div>
             SYSTEM.READY / 200.OK
          </div>
        </div>
      </aside>

      {/* CORE VIEWPORT */}
      <main className="studio-content">
        <header className="studio-header d-flex justify-content-between align-items-end mb-80 pb-40">
          <div className="title-stack">
            <h1 className="studio-title">CREATIVE.COMMAND</h1>
            <div className="tech-meta">
               <span className="meta-tag">LOC/HYD.IND</span>
               <span className="meta-tag">LAT.17.3850 N</span>
               <span className="meta-tag">LNG.78.4867 E</span>
               <span className="meta-tag">VER.2.0.9</span>
            </div>
          </div>

          <div className="studio-actions">
            <button onClick={handleUpdateSettings} className="push-btn" disabled={isSubmitting}>
              {isSubmitting ? 'UPLOADING...' : 'PUSH TO CLOUD'}
            </button>
          </div>
        </header>

        {notification && (
          <div className="legend-toast">
             <span className="toast-tag">SYS.LOG//</span> {notification.message}
          </div>
        )}


        <div className="viewport-inner">
          {/* ANALYTICS */}
          {activeTab === 'analytics' && (
            <div className="fadeIn">
               <div className="metrics-grid mb-80">
                  <div className="metric-box">
                    <span className="metric-id">01</span>
                    <span className="metric-label">VISIBILITY</span>
                    <h2 className="metric-val">{stats.views}</h2>
                  </div>
                  <div className="metric-box">
                    <span className="metric-id">02</span>
                    <span className="metric-label">INTERACTION</span>
                    <h2 className="metric-val">{stats.clicks}</h2>
                  </div>
                  <div className="metric-box">
                    <span className="metric-id">03</span>
                    <span className="metric-label">INBOX</span>
                    <h2 className="metric-val">{messages.length}</h2>
                  </div>
                  <div className="metric-box">
                    <span className="metric-id">04</span>
                    <span className="metric-label">RETENTION</span>
                    <h2 className="metric-val">{stats.time}</h2>
                  </div>
               </div>

               <div className="log-panel">
                  <div className="panel-header d-flex justify-content-between align-items-center mb-40">
                     <h3 className="section-title">COMMUNICATION_MATRIX</h3>
                     {messages.length > 0 && <button onClick={() => deleteItem('messages')} className="ghost-btn">WIPE ALL</button>}
                  </div>
                  <div className="log-table">
                    {messages.map(m => (
                      <div key={m.id} className="log-row">
                        <div className="log-sender">
                           <strong>{m.name}</strong>
                           <small>{m.email}</small>
                        </div>
                        <div className="log-concept">{m.subject}</div>
                        <div className="log-body">{m.message}</div>
                        <div className="log-actions">
                           <button onClick={() => deleteItem('messages', m.id)} className="purge-btn">PURGE</button>
                        </div>
                      </div>
                    ))}
                  </div>
               </div>
            </div>
          )}

          {/* PROJECTS */}
          {activeTab === 'projects' && (
            <div className="fadeIn">
               <div className="legend-panel mb-80">
                  <h3 className="section-title mb-40">{editingProject ? 'ARCHIVE.MODIFICATION' : 'CAPTURE.NEW_WORK'}</h3>
                  <form onSubmit={handleCreateProject} className="studio-form">
                     <div className="form-grid">
                        <div className="input-field">
                           <label>IDENTITY.TITLE</label>
                           <input placeholder="Enter Project Name..." value={newProject.title} onChange={e => setNewProject({...newProject, title: e.target.value})} required/>
                        </div>
                        <div className="input-field">
                           <label>DISCIPLINE.CAT</label>
                           <input placeholder="e.g. Branding / UI" value={newProject.category} onChange={e => setNewProject({...newProject, category: e.target.value})} required/>
                        </div>
                        <div className="input-field">
                           <label>TEMPLATE.SPEC</label>
                           <select value={newProject.specType} onChange={e => setNewProject({...newProject, specType: e.target.value as any})}>
                              <option value="default">Standard Layout</option>
                              <option value="physical">Physical Media (LxB)</option>
                              <option value="digital">Digital Assets (Pixels)</option>
                           </select>
                        </div>
                        <div className="input-field">
                           <label>RECORDS.INTEGRATE</label>
                           <div className="file-upload-box px-4 py-3" style={{border: '1px dashed rgba(255,255,255,0.1)', cursor: 'pointer'}}>
                             <input type="file" multiple onChange={handleFileUpload} accept="image/*,video/*" style={{position: 'absolute', opacity: 0, cursor: 'pointer'}}/>
                             <span>+ SELECT_ASSETS</span>
                           </div>
                        </div>

                        {newProject.specType === 'physical' && (
                          <>
                            <div className="input-field">
                               <label>LENGTH (cm)</label>
                               <input value={newProject.length} onChange={e => setNewProject({...newProject, length: e.target.value})}/>
                            </div>
                            <div className="input-field">
                               <label>BREADTH (cm)</label>
                               <input value={newProject.breadth} onChange={e => setNewProject({...newProject, breadth: e.target.value})}/>
                            </div>
                          </>
                        )}

                        {newProject.specType === 'digital' && (
                          <div className="input-field">
                             <label>RESOLUTION.PX</label>
                             <input placeholder="1920x1080" value={newProject.pixels} onChange={e => setNewProject({...newProject, pixels: e.target.value})}/>
                          </div>
                        )}
                     </div>

                     {/* Media Library Preview */}
                     {(newProject.images.length > 0 || newProject.videos.length > 0) && (
                        <div className="mt-50">
                           <label className="mb-20">LOADED_RECORDS // {newProject.images.length + newProject.videos.length} ASSETS</label>
                           <div className="media-preview-grid d-flex flex-wrap gap-3">
                              {newProject.images.map(img => (
                                 <div key={img} className="preview-thumb" style={{width: 80, height: 80, border: '1px solid rgba(255,255,255,0.1)', position: 'relative'}}>
                                    <img src={img} alt="" style={{width: '100%', height: '100%', objectFit: 'cover'}}/>
                                    <button type="button" onClick={() => removeAsset(img, 'images')} style={{position: 'absolute', top: -5, right: -5, background: '#ff4d00', border: 'none', color: '#fff', borderRadius: '50%', width: 20, height: 20, fontSize: 10}}>×</button>
                                 </div>
                              ))}
                           </div>
                        </div>
                     )}

                     <div className="mt-60 d-flex gap-4">
                        <button type="submit" className="push-btn px-5" disabled={isSubmitting}>
                           {isSubmitting ? 'UPLOADING...' : (editingProject ? 'SYNC_CHANGES' : 'COMMIT_ARCHIVE')}
                        </button>
                        {editingProject && <button onClick={cancelEdit} className="ghost-btn">ABORT_REVISION</button>}
                     </div>
                  </form>
               </div>

               <div className="work-grid">
                  {projects.map(p => (
                    <div key={p.id} className="work-card">
                       <div className="work-thumb">
                          <img src={p.images[0] || (p as any).image} alt=""/>
                          <div className="work-overlay">
                             <button onClick={() => editProject(p)} className="action-tag">REFINE</button>
                             <button onClick={() => deleteItem('projects', p.id)} className="action-tag purge">PURGE</button>
                          </div>
                       </div>
                       <div className="work-info mt-30">
                          <span className="work-ref">PID.{p.id.toString().padStart(3, '0')}</span>
                          <h4 className="work-title text-truncate">{p.title}</h4>
                          <span className="work-cat uppercase-track">{p.category}</span>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
          )}

          {/* NARRATIVE */}
          {activeTab === 'blogs' && (
             <div className="fadeIn">
                <div className="legend-panel mb-80">
                   <h3 className="section-title mb-40">{editingBlog ? 'NARRATIVE.REFINEMENT' : 'PUBLISH.TRANSMISSION'}</h3>
                   <form onSubmit={handleCreateBlog} className="studio-form">
                      <div className="form-grid">
                         <div className="input-field">
                            <label>HEADLINE</label>
                            <input placeholder="Story Title..." value={newBlog.title} onChange={e => setNewBlog({...newBlog, title: e.target.value})} required/>
                         </div>
                         <div className="input-field">
                            <label>DISCIPLINE.TAG</label>
                            <input placeholder="e.g. Design / Tech" value={newBlog.category} onChange={e => setNewBlog({...newBlog, category: e.target.value})} required/>
                         </div>
                         <div className="input-field">
                            <label>CONTEXT.DATE</label>
                            <input placeholder="21 APRIL 2024" value={newBlog.date} onChange={e => setNewBlog({...newBlog, date: e.target.value})} required/>
                         </div>
                         <div className="input-field">
                            <label>VIDEO.VINE</label>
                            <input placeholder="YouTube URL..." value={newBlog.isYoutube ? newBlog.videoUrl : ''} onChange={e => setNewBlog({...newBlog, videoUrl: e.target.value, isYoutube: true})}/>
                         </div>
                      </div>
                      <div className="mt-50 d-flex gap-4">
                        <button type="submit" className="push-btn" disabled={isSubmitting}>
                           {isSubmitting ? 'PUBLISHING...' : (editingBlog ? 'UPDATE STORY' : 'TRANSMIT NARRATIVE')}
                        </button>
                        {editingBlog && <button onClick={cancelEditBlog} className="ghost-btn">ABORT_TRANSMISSION</button>}
                      </div>
                   </form>
                </div>

                <div className="log-table">
                   {blogs.map(b => (
                     <div key={b.id} className="log-row">
                        <div className="log-sender">
                           <strong>{b.title}</strong>
                           <small>{b.category}</small>
                        </div>
                        <div className="log-concept">{b.date}</div>
                        <div className="log-actions d-flex gap-3">
                           <button onClick={() => editBlog(b)} className="ghost-btn-sm" style={{fontSize: '9px'}}>EDIT</button>
                           <button onClick={() => deleteItem('blogs', b.id)} className="purge-btn">PURGE</button>
                        </div>
                     </div>
                   ))}
                </div>
             </div>
          )}

          {/* IDENTITY */}
          {activeTab === 'appearance' && (
            <div className="fadeIn">
               <div className="legend-panel">
                  <h3 className="panel-title mb-60">IDENTITY.CONFIGURATION</h3>
                  <form onSubmit={handleUpdateSettings}>
                     <div className="form-grid">
                        <div className="input-field">
                           <label>BRAND_ENTITY</label>
                           <input value={settings.name} onChange={e => setSettings({...settings, name: e.target.value})} placeholder="Sahit Sai" required/>
                        </div>
                        <div className="input-field">
                           <label>MANIFESTO</label>
                           <textarea value={settings.bio} onChange={e => setSettings({...settings, bio: e.target.value})} rows={6} placeholder="Describe your creative philosophy..." required/>
                        </div>
                        <div className="col-span-2 mt-40">
                           <label>VISUAL_ID</label>
                           <div className="portrait-manager" style={{maxWidth: '300px', aspectRatio: '1', position: 'relative', background: '#111', overflow: 'hidden'}}>
                              <img src={settings.profilePic} alt="" style={{width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(1)'}}/>
                              <div className="portrait-overlay" style={{position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: '0.3s'}}>
                                 <input type="file" onChange={e => handleFileUpload(e, 'profile')} accept="image/*" style={{position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer'}}/>
                                 <span style={{fontSize: '10px', fontWeight: 800}}>REPLACE_VECT</span>
                              </div>
                           </div>
                        </div>
                     </div>
                     <button type="submit" className="push-btn mt-60" disabled={isSubmitting}>PUSH IDENTITY</button>
                  </form>
               </div>
            </div>
          )}

          {/* PARTNERS / PROOF */}
          {activeTab === 'partners' && (
            <div className="fadeIn">
               <div className="legend-panel mb-80">
                  <h3 className="panel-title mb-60">PARTNER.VALIDATION_SYSTEM</h3>
                  <form onSubmit={handleUpdateSettings}>
                     <div className="form-grid mb-60">
                        <div className="input-field">
                           <label>VOLUME.COUNT</label>
                           <input value={settings.reviewCount} onChange={e => setSettings({...settings, reviewCount: e.target.value})} placeholder="e.g. 100+ reviews"/>
                        </div>
                        <div className="input-field">
                           <label>QUALITY.INDEX</label>
                           <input value={settings.reviewRating} onChange={e => setSettings({...settings, reviewRating: e.target.value})} placeholder="e.g. (4.96 of 5)"/>
                        </div>
                        <div className="input-field">
                           <label>SENTIMENT.TAG</label>
                           <input value={settings.reviewText} onChange={e => setSettings({...settings, reviewText: e.target.value})} placeholder="e.g. Five-star reviews..."/>
                        </div>
                     </div>
                     
                     <label className="mb-30">CORE_METRICS</label>
                     <div className="form-grid mb-60">
                        <div className="input-field">
                           <label>EXPERIENCE.YRS</label>
                           <input type="number" value={settings.experienceYears} onChange={e => setSettings({...settings, experienceYears: parseInt(e.target.value) || 0})}/>
                        </div>
                        <div className="input-field">
                           <label>PROJECTS.COMPLETED</label>
                           <input type="number" value={settings.completedProjects} onChange={e => setSettings({...settings, completedProjects: parseInt(e.target.value) || 0})}/>
                        </div>
                        <div className="input-field">
                           <label>SATISFACTION.RATE</label>
                           <input type="number" value={settings.satisfactionRate} onChange={e => setSettings({...settings, satisfactionRate: parseInt(e.target.value) || 0})}/>
                        </div>
                     </div>

                     <label className="mb-30">BRAND.MATRIX // LOGO_REGISTRY</label>
                     <div className="log-table mb-60">
                        <div className="d-flex flex-wrap gap-4 p-4" style={{background: '#050505', border: '1px solid var(--border)'}}>
                           {settings.brands && settings.brands.map((logo, idx) => (
                             <div key={idx} className="portrait-manager" style={{width: 80, height: 80}}>
                                <img src={logo} alt="" style={{width: '100%', height: '100%', objectFit: 'contain', padding: '10px'}}/>
                                <div className="portrait-overlay" style={{opacity: 1}}>
                                   <button type="button" onClick={() => setSettings({...settings, brands: settings.brands.filter((_, i) => i !== idx)})} style={{background: 'none', border: 'none', color: '#ff4d00', fontSize: '10px', fontWeight: 800}}>REMOVE</button>
                                </div>
                             </div>
                           ))}
                           <div className="portrait-manager" style={{width: 80, height: 80, border: '1px dashed #333'}}>
                              <input type="file" multiple onChange={e => handleFileUpload(e, 'brand')} accept="image/*" style={{position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer'}}/>
                              <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: '20px'}}>+</div>
                           </div>
                        </div>
                     </div>

                     <label className="mb-30">CLIENT.NARRATIVES // TESTIMONIALS</label>
                     <div className="log-table mb-60">
                        {settings.testimonials && settings.testimonials.map((t, idx) => (
                          <div key={idx} className="log-row" style={{gridTemplateColumns: '1fr 1fr 2fr auto'}}>
                             <div className="log-sender"><input value={t.name} onChange={e => {
                                const next = [...settings.testimonials];
                                next[idx].name = e.target.value;
                                setSettings({...settings, testimonials: next});
                             }} placeholder="Name" style={{fontSize: '14px'}}/></div>
                             <div className="log-concept"><input value={t.role} onChange={e => {
                                const next = [...settings.testimonials];
                                next[idx].role = e.target.value;
                                setSettings({...settings, testimonials: next});
                             }} placeholder="Role" style={{fontSize: '14px'}}/></div>
                             <div className="log-body"><input value={t.text} onChange={e => {
                                const next = [...settings.testimonials];
                                next[idx].text = e.target.value;
                                setSettings({...settings, testimonials: next});
                             }} placeholder="Testimonial Text" style={{fontSize: '14px'}}/></div>
                             <button type="button" onClick={() => {
                                const next = settings.testimonials.filter((_, i) => i !== idx);
                                setSettings({...settings, testimonials: next});
                             }} className="purge-btn">PURGE</button>
                          </div>
                        ))}
                        <button type="button" onClick={() => setSettings({...settings, testimonials: [...(settings.testimonials || []), {id: Date.now(), name: '', role: '', text: '', authorImg: 'assets/images/avatar/01.jpg'}]})} className="ghost-btn mt-30">+ ADD NARRATIVE</button>
                     </div>

                     <button type="submit" className="push-btn" disabled={isSubmitting}>PUSH PARTNER_DATA</button>
                  </form>
               </div>
            </div>
          )}
        </div>
      </main>

      {/* Designer Modal */}
      {modalOpen && (
        <div className="designer-modal-overlay">
           <div className="designer-modal bounceIn animated">
              <h3 className="mb-20">{modalConfig.title}</h3>
              <p className="mb-40">{modalConfig.message}</p>
              <div className="d-flex justify-content-center gap-4">
                 <button onClick={closeModal} className="btn-design-cancel">Abort</button>
                 <button onClick={modalConfig.onConfirm} className="btn-design-confirm" style={{background: modalConfig.confirmColor}}>Execute</button>
              </div>
           </div>
        </div>
      )}


      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;700&family=Syne:wght@800&display=swap');

        :root {
          --neon: #ff4d00;
          --bg: #000;
          --panel: #0c0c0c;
          --border: rgba(255,255,255,0.08);
          --text: #fff;
          --text-muted: #444;
          --hud-width: 280px;
        }

        .legend-studio {
          background: var(--bg);
          min-height: 100vh;
          font-family: 'Space Grotesk', sans-serif;
          color: var(--text);
          display: flex;
          position: relative;
          overflow-x: hidden;
        }

        .studio-grid-bg {
          position: fixed; inset: 0;
          background-image: 
            radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px);
          background-size: 40px 40px, 120px 120px, 120px 120px;
          pointer-events: none; z-index: 0;
        }
        /* HUD SIDEBAR */
        .studio-hud {
          width: 280px; height: 100vh;
          border-right: 1px solid var(--border);
          padding: 60px 40px;
          display: flex; flex-direction: column;
          position: fixed; top: 0; left: 0;
          background: #000; z-index: 1000;
        }
        .hud-mark { width: 40px; height: 40px; background: var(--neon); color: #000; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 20px; }
        .hud-label { font-size: 10px; font-weight: 800; letter-spacing: 4px; margin-top: 10px; display: block; }
        .hud-nav { display: flex; flex-direction: column; gap: 35px; margin-top: 60px; }
        .hud-item { background: none; border: none; padding: 0; text-align: left; cursor: pointer; transition: 0.3s; opacity: 0.4; }
        .hud-num { font-size: 10px; color: var(--neon); font-family: 'Syne'; margin-bottom: 5px; display: block; }
        .hud-text { font-size: 14px; font-weight: 800; color: #fff; letter-spacing: 2px; text-transform: uppercase; }
        .hud-item:hover, .hud-item.active { opacity: 1; }
        .hud-item.active .hud-text { border-left: 3px solid var(--neon); padding-left: 15px; }

        /* CONTENT ENGINE */
        .studio-content {
          margin-left: 280px;
          padding: 60px 80px;
          min-height: 100vh;
          background: #000;
          position: relative;
          z-index: 1;
          width: auto; 
          overflow-x: hidden; /* ELIMINATE ALL HORIZONTAL SCROLL */
        }

        .studio-header { 
          margin-bottom: 60px;
          padding-bottom: 30px;
          border-bottom: 1px solid var(--border);
          width: auto;
        }
        .studio-title { 
          font-family: 'Syne', sans-serif; 
          font-size: 64px; 
          line-height: 1; 
          letter-spacing: -3px; 
          margin: 0; 
          text-transform: uppercase;
          white-space: normal; /* ALLOW WRAPPING TO ELIMINATE SCROLL */
          color: #fff;
          word-break: break-all;
        }
        .tech-meta { display: flex; flex-wrap: wrap; gap: 15px; margin-top: 25px; }
        .meta-tag { font-size: 9px; font-weight: 800; color: #444; letter-spacing: 2px; border: 1px solid var(--border); padding: 4px 10px; }

        .viewport-inner { width: auto; }

        /* PANELS */
        .legend-panel { background: #080808; border: 1px solid var(--border); padding: 60px; margin-bottom: 60px; width: auto; overflow: hidden; }
        .section-title { font-family: 'Syne'; font-size: 32px; letter-spacing: -1px; margin-bottom: 40px; text-transform: uppercase; color: #fff; word-break: break-all; }
        
        label { font-size: 10px; font-weight: 800; color: #444; letter-spacing: 3px; display: block; margin-bottom: 20px; text-transform: uppercase; }
        input, textarea, select {
          background: transparent !important; border: none !important; border-bottom: 1px solid #1a1a1a !important;
          width: 100%; color: #fff !important; font-size: 20px !important; font-family: 'Space Grotesk' !important; 
          padding: 15px 0 !important; outline: none !important;
        }
        input:focus { border-color: var(--neon) !important; }

        .form-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 40px; }

        /* GRIDS */
        .metrics-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1px; background: var(--border); margin-bottom: 80px; width: auto; }
        .metric-box { background: #000; padding: 40px; border: 1px solid var(--border); }
        .metric-val { font-family: 'Syne'; font-size: clamp(32px, 5vw, 64px); margin-top: 15px; color: #fff; }
        .metric-label { font-size: 10px; font-weight: 800; color: #444; letter-spacing: 2px; }

        .work-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1px; background: var(--border); border: 1px solid var(--border); width: auto; }
        .work-card { background: #000; padding: 40px; border: 1px solid var(--border); }
        .work-thumb { aspect-ratio: 16/10; overflow: hidden; background: #0a0a0a; border: 1px solid var(--border); }
        .work-thumb img { width: 100%; height: 100%; object-fit: cover; filter: grayscale(1); transition: 0.8s; }
        .work-card:hover .work-thumb img { filter: grayscale(0); }
        
        .work-title { font-size: 24px; font-family: 'Syne'; margin: 20px 0 10px 0; color: #fff; word-break: break-all; }
        .work-ref { font-size: 10px; color: #333; font-weight: 800; letter-spacing: 2px; }

        .push-btn { background: #fff; color: #000; border: none; padding: 18px 40px; font-weight: 800; font-size: 11px; letter-spacing: 2px; cursor: pointer; transition: 0.3s; margin-top: 30px; }
        .push-btn:hover { background: var(--neon); color: #fff; }

        .action-tag { background: #111; color: #fff; border: 1px solid #222; font-weight: 800; font-size: 10px; padding: 12px 22px; cursor: pointer; transition: 0.3s; }
        .action-tag:hover { background: #fff; color: #000; }

        .log-table { width: auto; border: 1px solid var(--border); background: #000; overflow: hidden; }
        .log-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 20px; padding: 25px; border-bottom: 1px solid var(--border); align-items: center; }

        .legend-toast { position: fixed; bottom: 50px; right: 50px; background: var(--neon); color: #fff; padding: 30px 60px; font-weight: 800; z-index: 10000; box-shadow: 0 30px 60px rgba(0,0,0,0.5); }

        @media (max-width: 1200px) {
           .studio-content { padding: 40px; }
        }

        @media (max-width: 1024px) {
           .studio-hud { 
              width: 100%; height: auto; position: sticky; border-right: none; border-bottom: 1px solid var(--border); 
              padding: 20px; flex-direction: row; align-items: center; justify-content: space-between; top: 0;
           }
           .hud-logo { margin-bottom: 0 !important; }
           .hud-nav { margin-top: 0; flex-direction: row; gap: 15px; overflow-x: auto; padding-bottom: 0; }
           .hud-item.active .hud-text { border-left: none; border-bottom: 2px solid var(--neon); padding-left: 0; padding-bottom: 5px; }
           .studio-content { margin-left: 0; padding: 40px 20px; width: 100%; }
           .studio-title { font-size: 42px; word-break: normal; }
           .metrics-grid { grid-template-columns: repeat(2, 1fr); }
           .form-grid { grid-template-columns: 1fr; }
        }

        @media (max-width: 640px) {
           .hud-text { font-size: 10px; }
           .studio-title { font-size: 32px; }
           .metrics-grid { grid-template-columns: 1fr; }
           .metric-box { padding: 25px; }
           .metric-val { font-size: 36px; }
           .legend-panel { padding: 25px; }
           .section-title { font-size: 20px; }
           .work-grid { grid-template-columns: 1fr; }
           .log-row { grid-template-columns: 1fr; padding: 15px; }
           .studio-hud { padding: 15px; }
           .hud-mark { width: 25px; height: 25px; font-size: 12px; }
        }
      `}</style>
    </section>
  );
};

export default AdminDashboard;
