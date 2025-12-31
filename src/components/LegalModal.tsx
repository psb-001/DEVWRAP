

interface LegalModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    content: string;
}

export default function LegalModal({ isOpen, onClose, title, content }: LegalModalProps) {
    if (!isOpen) return null;

    return (
        <div className="legal-modal-overlay" onClick={onClose}>
            <div className="legal-modal-content" onClick={e => e.stopPropagation()}>
                <div className="legal-modal-header">
                    <h2 className="legal-modal-title">{title}</h2>
                    <button className="legal-modal-close" onClick={onClose}>
                        <i className="fa-solid fa-xmark"></i>
                    </button>
                </div>
                <div className="legal-modal-body custom-scrollbar">
                    <div className="legal-text whitespace-pre-wrap">
                        {content}
                    </div>
                </div>
            </div>
        </div>
    );
}
