import './About.css';

const About = () => {
    return (
        <div className="about-page">
            <div className="about-container">
                <section className="about-hero">
                    <h1 className="title">Savety</h1>
                    <p className="subtitle">Secure, private, and stunning. The new standard for your memories.</p>
                </section>
                
                <section className="about-mission">
                    <div className="card">
                        <h2>Our Mission</h2>
                        <p>We believe that your personal memories should stay just that—personal. Savety was built from the ground up to provide a beautiful, high-performance platform for managing your photos without compromising on security or privacy.</p>
                        <p>With end-to-end encryption and a focus on minimalist design, Savety is more than just a gallery—it's a digital sanctuary for your life's most precious moments.</p>
                    </div>
                </section>

                <section className="about-creator">
                    <div className="creator-card">
                        <div className="creator-image">
                            <img src="https://github.com/shamveelp.png" alt="Shamveel P" />
                        </div>
                        <div className="creator-info">
                            <span className="badge">The Creator</span>
                            <h2>Shamveel P</h2>
                            <p>Shamveel is a passionate developer dedicated to building tools that empower users. With a focus on security, privacy, and exceptional user experiences, he created Savety to solve the problem of fragmented and insecure cloud photo storage.</p>
                            <div className="creator-links">
                                <a href="https://github.com/shamveelp" target="_blank" rel="noopener noreferrer" className="link github">GitHub</a>
                                <a href="https://shamveelp.xyz" target="_blank" rel="noopener noreferrer" className="link website">Website</a>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="about-stack">
                    <h2>Built with modern tech</h2>
                    <div className="stack-grid">
                        <div className="stack-item"><span>React 19</span></div>
                        <div className="stack-item"><span>TypeScript</span></div>
                        <div className="stack-item"><span>Node.js</span></div>
                        <div className="stack-item"><span>MongoDB</span></div>
                        <div className="stack-item"><span>Cloudinary</span></div>
                        <div className="stack-item"><span>Express 5</span></div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default About;
