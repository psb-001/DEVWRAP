

interface FooterProps {
    onOpenLegal: (type: 'terms' | 'privacy') => void;
}

export default function Footer({ onOpenLegal }: FooterProps) {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer-container">
            <div className="footer-content">
                <div className="footer-copyright">
                    &copy; {currentYear} DevWrap. All rights reserved.
                </div>
                <div className="footer-links">
                    <button
                        className="footer-link"
                        onClick={() => onOpenLegal('terms')}
                    >
                        Terms & Conditions
                    </button>
                    <span className="footer-separator">•</span>
                    <button
                        className="footer-link"
                        onClick={() => onOpenLegal('privacy')}
                    >
                        Privacy Policy
                    </button>
                </div>
            </div>
        </footer>
    );
}
