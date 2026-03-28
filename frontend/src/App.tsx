import './App.css'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import FAQ from './components/FAQ'

// Hero Showcase Assets
import photo1 from './assets/showcase/photo1.png'
import photo2 from './assets/showcase/photo2.png'
import photo3 from './assets/showcase/photo3.png'
import photo4 from './assets/showcase/photo4.png'

// Feature Assets
import faceImg from './assets/features/face.png'
import sunset1 from './assets/features/sunset1.png'
import sunset2 from './assets/features/sunset2.png'
import sunset3 from './assets/features/sunset3.png'
import pizzaImg from './assets/features/pizza.png'
import mountainImg from './assets/features/mountain.png'
import babyImg from './assets/features/baby.png'
import familyImg from './assets/features/family.png'

// Review Assets
import avatar1 from './assets/reviews/avatar1.png'
import avatar2 from './assets/reviews/avatar2.png'
import avatar3 from './assets/reviews/avatar3.png'

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

        <div className="brand-ticker">
          <div className="ticker-track">
            <a href="https://shamveelp.xyz" target="_blank" rel="noopener noreferrer"><span>Shamveel P</span></a>
            <a href="https://www.youtube.com/@CodingAashan" target="_blank" rel="noopener noreferrer"><span>Coding Aashan</span></a>
            <a href="https://www.instagram.com/mangadome/" target="_blank" rel="noopener noreferrer"><span>MangaDome</span></a>
            <a href="https://chainverse.shamveelp.xyz/" target="_blank" rel="noopener noreferrer"><span>ChainVerse</span></a>
            <a href="https://getter.shamveelp.xyz/" target="_blank" rel="noopener noreferrer"><span>Getter</span></a>
            <a href="https://pc-monarch.shamveelp.xyz/" target="_blank" rel="noopener noreferrer"><span>PC Monarch</span></a>
            {/* Duplicate for seamless loop */}
            <a href="https://shamveelp.xyz" target="_blank" rel="noopener noreferrer"><span>Shamveel P</span></a>
            <a href="https://www.youtube.com/@CodingAashan" target="_blank" rel="noopener noreferrer"><span>Coding Aashan</span></a>
            <a href="https://www.instagram.com/mangadome/" target="_blank" rel="noopener noreferrer"><span>MangaDome</span></a>
            <a href="https://chainverse.shamveelp.xyz/" target="_blank" rel="noopener noreferrer"><span>ChainVerse</span></a>
            <a href="https://getter.shamveelp.xyz/" target="_blank" rel="noopener noreferrer"><span>Getter</span></a>
            <a href="https://pc-monarch.shamveelp.xyz/" target="_blank" rel="noopener noreferrer"><span>PC Monarch</span></a>
          </div>
        </div>

        <div className="features-grid">
          <div className="feature-card face-recognition">
            <div className="card-header">
              <h2>Face recognition</h2>
              <p>On-device face detection and grouping</p>
            </div>
            <div className="card-content">
              <div className="face-demo">
                <img src={faceImg} alt="Face detection" />
                <div className="face-label james">James</div>
                <div className="face-label jane">Jane</div>
              </div>
            </div>
          </div>

          <div className="feature-card zero-knowledge">
            <div className="card-header">
              <h2>Zero knowledge AI</h2>
              <p>Search for anything in natural language</p>
            </div>
            <div className="card-content">
              <div className="search-demo">
                <div className="search-results">
                  <img src={sunset1} alt="Sunset 1" className="s1" />
                  <img src={sunset2} alt="Sunset 2" className="s2" />
                  <img src={sunset3} alt="Sunset 3" className="s3" />
                </div>
                <div className="search-bar">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                  <span>Sunset in the beach</span>
                </div>
              </div>
            </div>
          </div>

          <div className="feature-card curated-memories">
            <div className="card-header">
              <h2>Curated memories</h2>
              <p>Relive best moments from past trips, celebrations and everyday life</p>
            </div>
            <div className="card-content">
              <div className="memory-stack">
                <div className="memory-item">
                  <img src={pizzaImg} alt="Pizza" />
                  <span>Culinary delight</span>
                </div>
                <div className="memory-item">
                  <img src={mountainImg} alt="Mountain" />
                  <span>Trip to Interlaken</span>
                </div>
                <div className="memory-item">
                  <img src={babyImg} alt="Baby" />
                  <span>This day 4 years ago</span>
                </div>
              </div>
            </div>
          </div>

          <div className="feature-card family-plans">
            <div className="card-header">
              <h2>Family plans</h2>
              <p>Share your subscription with your family, at no extra cost</p>
            </div>
            <div className="card-content">
              <img src={familyImg} alt="Family illustration" className="family-illustration" />
            </div>
          </div>
        </div>

        <div className="reviews-section">
          <h1 className="reviews-title">reviews.</h1>
          <div className="reviews-container">
            <div className="cards-scroll">
              <div className="review-card card-small">
                <div className="review-header">
                  <div className="avatar-box"><img src={avatar1} alt="Rume" /></div>
                  <div className="reviewer-info">
                    <h3>Rume</h3>
                    <div className="stars">★★★★★</div>
                  </div>
                </div>
                <p className="review-text">I really love your product</p>
                <div className="quote-icon">“</div>
              </div>

              <div className="review-card card-large">
                <div className="review-header">
                  <div className="avatar-box"><img src={avatar2} alt="Pietro Smusi" /></div>
                  <div className="reviewer-info">
                    <h3>Pietro Smusi</h3>
                    <div className="stars">★★★★★</div>
                  </div>
                </div>
                <p className="review-text">
                  I like ente, I have been using it instead of google photos for almost a year and I have never regret it. A few euros yearly for a privacy-respecting alternative that does what it is supposed to do smoothly and simply is a big yes from me.
                </p>
                <div className="quote-icon">“</div>
              </div>

              <div className="review-card card-medium">
                <div className="review-header">
                  <div className="avatar-box"><img src={avatar3} alt="p0x" /></div>
                  <div className="reviewer-info">
                    <h3>p0x</h3>
                    <div className="stars">★★★★★</div>
                  </div>
                </div>
                <p className="review-text">
                  they don't market as much as they should but it's a great google photos alternative. it's open source too.
                </p>
                <div className="quote-icon">“</div>
              </div>
            </div>
            <div className="yellow-curve"></div>
          </div>
        </div>
        <div className="memories-counter-section">
          <div className="memories-heading">
            <span className="heart-icon">💚</span>
            <h2>memories <br /> <span>preserved</span></h2>
          </div>
          <div className="counter-display">
            <div className="chick-mascot">
              <img src="/assets/memories.png" alt="Mascot" />
            </div>
            <div className="number-box-container">
               <div className="number-box">
                <span>549,277,360</span>
              </div>
            </div>
          </div>
        </div>
      </main>
      <FAQ />
      <Footer />
    </div>
  )
}

export default App
