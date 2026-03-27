import './App.css'
import Navbar from './components/Navbar'
import photo1 from './assets/showcase/photo1.png'
import photo2 from './assets/showcase/photo2.png'
import photo3 from './assets/showcase/photo3.png'
import photo4 from './assets/showcase/photo4.png'

function App() {
  return (
    <div className="landing-page">
      <Navbar />

      <main className="hero-section">
        <h1 className="hero-title">
          <span className="text-green">Safe home</span> <br />
          <span className="text-dark">for your photos</span>
        </h1>
        <p className="hero-subtitle">
          End-to-end encrypted. Cross-platform. Open-source.
        </p>
        <div className="hero-buttons">
          <button className="btn btn-primary">Sign up</button>
          <button className="btn btn-secondary">Login</button>
        </div>

        <div className="photo-showcase">
          <div className="photo-container p1">
            <img src={photo1} alt="Memories 1" />
          </div>
          <div className="photo-container p2">
            <img src={photo2} alt="Memories 2" />
          </div>
          <div className="photo-container p3">
            <img src={photo3} alt="Memories 3" />
          </div>
          <div className="photo-container p4">
            <img src={photo4} alt="Memories 4" />
          </div>
        </div>

        <div className="brand-logos">
          <div className="brand-logo android">ANDROID AUTHORITY</div>
          <div className="brand-logo caschys">CASCHYS BLOG</div>
          <div className="brand-logo clubic">clubic</div>
          <div className="brand-logo degoogle">r/degoogle</div>
          <div className="brand-logo privacy">Privacy Guides</div>
        </div>
      </main>
    </div>
  )
}

export default App

