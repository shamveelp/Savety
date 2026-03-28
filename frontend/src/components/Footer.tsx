import './Footer.css'

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-mascot">
        <img src="/assets/footer.png" alt="Mascot with cart" />
      </div>
      <div className="footer-container">
        <div className="footer-grid">
          <div className="footer-column">
            <h4>Company</h4>
            <ul>
              <li><a href="/about">About</a></li>
              <li><a href="/news">News</a></li>
              <li><a href="/media">Media kit</a></li>
            </ul>
          </div>
          <div className="footer-column">
            <h4>Products</h4>
            <ul>
              <li><a href="/photos">Photos</a></li>
              <li><a href="/auth">Auth</a></li>
              <li><a href="/locker">Locker</a></li>
              <li><a href="/ensu">Ensu</a></li>
            </ul>
          </div>
          <div className="footer-column">
            <h4>Explore</h4>
            <ul>
              <li><a href="/friends">Friends</a></li>
              <li><a href="/toys">Toys</a></li>
              <li><a href="/shop">Shop</a></li>
              <li><a href="/talks">Talks</a></li>
            </ul>
          </div>
          <div className="footer-column">
            <h4>Open Source</h4>
            <ul>
              <li><a href="/mobile">Mobile</a></li>
              <li><a href="/web">Web</a></li>
              <li><a href="/desktop">Desktop</a></li>
              <li><a href="/cli">CLI</a></li>
            </ul>
          </div>
          <div className="footer-column">
            <h4>Technology</h4>
            <ul>
              <li><a href="/encryption">Encryption</a></li>
              <li><a href="/replication">Replication</a></li>
              <li><a href="/ml">Machine learning</a></li>
            </ul>
          </div>
          <div className="footer-column">
            <h4>Compare</h4>
            <ul>
              <li><a href="/google-photos">Google Photos vs Savety</a></li>
              <li><a href="/apple-photos">Apple Photos vs Savety</a></li>
              <li><a href="/dropbox">Dropbox vs Savety</a></li>
            </ul>
          </div>
        </div>
        
        <div className="footer-bottom">
          <div className="social-links">
            {/* Mocked social icons as text/simple shapes for now */}
            <a href="#" className="social-icon">Discord</a>
            <a href="#" className="social-icon">X</a>
            <a href="#" className="social-icon">GitHub</a>
            {/* ... etc */}
          </div>
          <div className="footer-legal">
            <span className="language-selector">English ▼</span>
            <a href="/contact">Contact</a>
            <a href="/help">Help</a>
            <a href="/articles">Articles</a>
            <a href="/privacy">Privacy</a>
            <a href="/terms">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
