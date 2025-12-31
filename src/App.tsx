import { useState, useRef, useEffect } from 'react';
import html2canvas from 'html2canvas';
import { WrapData, ThemeName } from './types';
import WrapPreview from './components/WrapPreview';
import EditorPanel from './components/EditorPanel';
import Footer from './components/Footer';
import LegalModal from './components/LegalModal';
import { LEGAL_CONTENT } from './constants';
import { calculatePersonality } from './utils/personality';

const defaultData: WrapData = {
  categoryHeader: 'Engineering Student',
  tagline: 'Eat. Sleep. Code. Repeat.',
  name: 'Alex Dev',
  role: 'Software Engineer',
  trait: 'GHOST CODER',
  stats: [
    { label: 'Lines of Code', value: '25,000+' },
    { label: 'Commits', value: '450+' },
    { label: 'Coffees', value: '∞' },
    { label: 'Bugs Fixed', value: '102' },
    { label: 'Shipped', value: '5 Apps' },
    { label: 'Buddy', value: 'Co-pilot' },
  ],
  tools: ['vscode', 'github', 'slack', 'chrome', 'figma'],
  languages: ['ts', 'js', 'python', 'go', 'rust'],
  imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=300&auto=format&fit=crop',
  beverage: 'coffee',
  brandColor: '#FFFFFF',
  leetcodeCount: '150+',
  heatmap: Array(105).fill(0).map(() => Math.floor(Math.random() * 5)),
};

function App() {
  const [data, setData] = useState<WrapData>(defaultData);
  const [theme, setTheme] = useState<ThemeName>('minimal');
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
  const [isDownloading, setIsDownloading] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);
  const scaleWrapperRef = useRef<HTMLDivElement>(null);
  const [legalModal, setLegalModal] = useState<{ isOpen: boolean; type: 'terms' | 'privacy' }>({
    isOpen: false,
    type: 'terms'
  });

  useEffect(() => {
    const wrapper = scaleWrapperRef.current;
    if (!wrapper) return;

    const observer = new ResizeObserver(() => {
      if (previewRef.current) {
        const card = previewRef.current;
        const isMobile = window.innerWidth < 768;

        if (isMobile) {
          // On mobile, don't scale - let it be scrollable
          card.style.transform = 'none';
          card.style.transformOrigin = 'top center';
        } else {
          // On desktop, scale to fit
          const availableWidth = wrapper.clientWidth - 32;
          const availableHeight = wrapper.clientHeight - 32;

          const cardWidth = 450;
          const cardHeight = card.offsetHeight || 800;

          const scaleX = availableWidth / cardWidth;
          const scaleY = availableHeight / cardHeight;

          let scale = Math.min(scaleX, scaleY);
          if (scale > 1) scale = 1;
          if (scale < 0.1) scale = 0.1;

          card.style.transform = `scale(${scale})`;
          card.style.transformOrigin = 'center center';
        }
      }
    });

    observer.observe(wrapper);
    return () => observer.disconnect();
  }, [activeTab]);

  // Global personality sync: Watches data and updates trait automatically
  useEffect(() => {
    const newTrait = calculatePersonality(data);
    if (newTrait !== data.trait) {
      setData(prev => ({ ...prev, trait: newTrait }));
    }
  }, [data.stats, data.tools, data.languages, data.beverage]);

  const handleDownload = async () => {
    const workbench = document.getElementById('download-workbench');
    if (!workbench) return;

    setIsDownloading(true);

    try {
      // Ensure all fonts are ready
      await document.fonts.ready;
      // Buffer for React state updates
      await new Promise(resolve => setTimeout(resolve, 300));

      const cardElement = workbench.querySelector('.card-to-capture') as HTMLElement;
      if (!cardElement) throw new Error('Capture target not found');

      // Use the actual height of the element
      const cardHeight = cardElement.offsetHeight || 800;

      const canvas = await html2canvas(cardElement, {
        scale: 2, // 2 is significantly more stable for complex sub-pixel alignment
        useCORS: true,
        backgroundColor: null,
        width: 450,
        height: cardHeight,
        logging: false,
        scrollX: 0,
        scrollY: 0,
        windowWidth: 450,
        windowHeight: cardHeight,
        onclone: (clonedDoc) => {
          const images = clonedDoc.getElementsByTagName('img');
          return Promise.all(Array.from(images).map(img => {
            if (img.complete) return Promise.resolve();
            return new Promise(resolve => { img.onload = resolve; img.onerror = resolve; });
          }));
        }
      });

      const link = document.createElement('a');
      link.download = `devwrap-${data.name.toLowerCase().replace(/\s+/g, '-')}.png`;
      link.href = canvas.toDataURL('image/png', 1.0);
      link.click();
    } catch (error) {
      console.error('Error generating image:', error);
      alert('Error generating image. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="h-screen overflow-hidden flex flex-col bg-[#050507]">
      <header className="h-16 border-b border-[#27272A] flex items-center justify-between px-6 bg-[#050507] z-20 shrink-0">
        <div className="flex items-center">
          <img
            src="/logo.png"
            alt="DevWrap Logo"
            className="w-10 h-10 object-contain translate-y-[-2px]"
          />
        </div>

        <div className="flex md:hidden bg-[#181A20] rounded-lg p-1 border border-[#27272A]">
          <button
            onClick={() => setActiveTab('edit')}
            className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${activeTab === 'edit'
              ? 'bg-purple-600 text-white'
              : 'text-gray-400 hover:text-white'
              }`}
          >
            Edit
          </button>
          <button
            onClick={() => setActiveTab('preview')}
            className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${activeTab === 'preview'
              ? 'bg-purple-600 text-white'
              : 'text-gray-400 hover:text-white'
              }`}
          >
            Preview
          </button>
        </div>

        <div className="text-center hidden md:flex items-center gap-2">
          <img
            src="/logo.png"
            alt=""
            className="w-6 h-6 object-contain opacity-90"
          />
          <h1 className="font-bold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500">
            DEVWRAP 2025
          </h1>
        </div>

        <div className="w-auto md:w-auto flex justify-end items-center gap-4">
          <a
            href="https://www.instagram.com/pratham01012007"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white transition-colors"
          >
            <i className="fa-brands fa-instagram text-xl"></i>
          </a>
          <a
            href="https://www.linkedin.com/in/prathamesh-bhujbal-psb/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white transition-colors"
          >
            <i className="fa-brands fa-linkedin text-xl"></i>
          </a>
          <a
            href="https://github.com/psb-001"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white transition-colors"
          >
            <i className="fa-brands fa-github text-xl"></i>
          </a>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden relative h-[calc(100vh-80px)]">
        <aside
          className={`w-full md:w-[480px] absolute md:static z-10 inset-0 md:inset-auto bg-[#050507] overflow-y-auto custom-scrollbar flex flex-col transition-transform border-r border-[#27272A] ${activeTab === 'preview' ? 'hidden md:flex' : 'flex'
            }`}
        >
          <div className="flex-1">
            <EditorPanel
              data={data}
              theme={theme}
              onDataChange={setData}
              onThemeChange={setTheme}
            />
          </div>

          <div className="p-6 border-t border-[#27272A] bg-[#050507] sticky bottom-0 z-10">
            <button
              onClick={handleDownload}
              disabled={isDownloading}
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-500 hover:opacity-90 text-white rounded-xl font-bold text-lg shadow-lg shadow-purple-500/20 flex items-center justify-center gap-3 transform active:scale-95 transition-all disabled:opacity-50"
            >
              {isDownloading ? (
                <>
                  <i className="fa-solid fa-spinner fa-spin"></i> Generating...
                </>
              ) : (
                <>
                  <i className="fa-solid fa-download animate-bounce"></i> Download Wrapped
                </>
              )}
            </button>
            <Footer onOpenLegal={(type) => setLegalModal({ isOpen: true, type })} />
          </div>
        </aside>

        <div
          ref={scaleWrapperRef}
          className={`flex-1 bg-black relative flex items-start md:items-center justify-center p-4 md:p-12 overflow-auto md:overflow-hidden ${activeTab === 'edit' ? 'hidden md:flex' : 'flex'
            }`}
        >
          <WrapPreview
            ref={previewRef}
            data={data}
            theme={theme}
          />
        </div>
      </main>

      <LegalModal
        isOpen={legalModal.isOpen}
        onClose={() => setLegalModal({ ...legalModal, isOpen: false })}
        title={legalModal.type === 'terms' ? 'Terms & Conditions' : 'Privacy Policy'}
        content={legalModal.type === 'terms' ? LEGAL_CONTENT.terms : LEGAL_CONTENT.privacy}
      />

      {/* Hidden Workbench for high-quality image capture */}
      <div id="download-workbench" style={{ position: 'fixed', left: '-10000px', top: 0, pointerEvents: 'none' }}>
        <div className="card-to-capture" style={{ width: '450px' }}>
          <WrapPreview data={data} theme={theme} />
        </div>
      </div>
    </div>
  );
}

export default App;
