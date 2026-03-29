import './Loading.css';

const Loading = () => {
    return (
        <div className="loading-fallback">
            <div className="loading-content">
                <div className="loading-logo">
                    savety<span className="dot">.</span>
                </div>
                <div className="loading-bar-container">
                    <div className="loading-bar"></div>
                </div>
                <p className="loading-text">Securely preserving your story...</p>
            </div>
        </div>
    );
};

export default Loading;
