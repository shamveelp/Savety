import './Pricing.css';

const Pricing = () => {
    return (
        <div className="pricing-page">
            <div className="pricing-container">
                <div className="pricing-header">
                    <h1 className="title">Pricing</h1>
                    <p className="subtitle">Simple, transparent, and built for your privacy.</p>
                </div>
                
                <div className="coming-soon-card">
                    <div className="badge">Coming Soon</div>
                    <h2>Something big is brewing.</h2>
                    <p>We are perfecting our premium plans to give you more control, space, and security for your memories. Stay tuned as we build the future of image management.</p>
                    
                    <div className="features-preview">
                        <div className="feature-item">
                            <span className="dot"></span>
                            <span>Unlimited end-to-end encrypted storage</span>
                        </div>
                        <div className="feature-item">
                            <span className="dot"></span>
                            <span>Priority support and early access features</span>
                        </div>
                        <div className="feature-item">
                            <span className="dot"></span>
                            <span>Advanced sharing and collaboration tools</span>
                        </div>
                    </div>
                    
                    <button className="notify-btn" onClick={() => alert('Thanks for your interest! We\'ll keep you updated.')}>
                        Notify Me
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Pricing;
