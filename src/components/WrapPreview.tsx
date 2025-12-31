import { forwardRef, memo } from 'react';
import { WrapData, ThemeName } from '../types';
import {
  ICON_MAP,
  CUSTOM_SVG_ICONS,
  VSCodeIcon,
  TypeScriptIcon,
  CPlusPlusIcon,
  CSharpIcon,
  CIcon,
  RustIcon,
  CursorIcon,
  GoIcon,
  SwiftIcon,
  KotlinIcon,
  RubyIcon,
  NotionIcon,
  ChatGPTIcon,
  GeminiIcon,
  ClaudeIcon,
  SQLIcon,
  StatCodeIcon,
  StatCommitIcon,
  StatChaiIcon,
  StatCoffeeIcon,
  StatBugIcon,
  StatLeetCodeIcon,
  StatRocketIcon,
  StatUserIcon,
} from '../constants';

interface WrapPreviewProps {
  data: WrapData;
  theme: ThemeName;
}

const WrapPreview = forwardRef<HTMLDivElement, WrapPreviewProps>(({ data, theme }, ref) => {
  const renderIcon = (iconKey: string, size = "w-6 h-6") => {
    const key = iconKey.toLowerCase();
    const style = { color: '#C1C5D0' };

    if (CUSTOM_SVG_ICONS.includes(key)) {
      const iconProps = { className: size, style };
      switch (key) {
        case 'vscode': return <VSCodeIcon {...iconProps} />;
        case 'ts':
        case 'typescript': return <TypeScriptIcon {...iconProps} />;
        case 'cpp': return <CPlusPlusIcon {...iconProps} />;
        case 'c#': return <CSharpIcon {...iconProps} />;
        case 'c': return <CIcon {...iconProps} />;
        case 'rust': return <RustIcon {...iconProps} />;
        case 'cursor': return <CursorIcon {...iconProps} />;
        case 'go': return <GoIcon {...iconProps} />;
        case 'swift': return <SwiftIcon {...iconProps} />;
        case 'kotlin': return <KotlinIcon {...iconProps} />;
        case 'ruby': return <RubyIcon {...iconProps} />;
        case 'notion': return <NotionIcon {...iconProps} />;
        case 'chatgpt': return <ChatGPTIcon {...iconProps} />;
        case 'gemini': return <GeminiIcon {...iconProps} />;
        case 'claude': return <ClaudeIcon {...iconProps} />;
        case 'sql': return <SQLIcon {...iconProps} />;
        default: break;
      }
    }

    const iconClass = ICON_MAP[key] || 'fa-solid fa-code';
    return <i className={`${iconClass} block`} style={{ ...style, fontSize: '1.25rem' }} />;
  };

  const statIcons = [
    (props: any) => <StatCodeIcon {...props} />,
    (props: any) => <StatCommitIcon {...props} />,
    (props: any) => data.beverage === 'chai' ? <StatChaiIcon {...props} /> : <StatCoffeeIcon {...props} />,
    (props: any) => <StatBugIcon {...props} />,
    (props: any) => data.leetcodeCount ? <StatLeetCodeIcon {...props} /> : <StatRocketIcon {...props} />,
    (props: any) => <StatUserIcon {...props} />,
  ];

  // Prepare stats: if leetCode exists, swap it into the list
  const displayStats = [...data.stats.slice(0, 6)];
  if (data.leetcodeCount) {
    displayStats[4] = { label: 'LeetCode Solved', value: data.leetcodeCount };
  }

  const brandColor = data.brandColor || '#FFFFFF';

  const getThemeStyles = () => {
    const base = {
      width: '450px',
      minHeight: '800px',
      height: 'auto',
      backgroundColor: '#000000',
      border: '1px solid transparent'
    };
    switch (theme) {
      case 'neon-green':
        return { ...base, border: '1px solid rgba(34, 197, 94, 0.3)', boxShadow: 'inset 0 0 40px rgba(34, 197, 94, 0.05)' };
      case 'neon-blue':
        return { ...base, border: '1px solid rgba(34, 211, 238, 0.3)', boxShadow: 'inset 0 0 40px rgba(34, 211, 238, 0.05)' };
      case 'hologram':
        return {
          ...base,
          border: '1px solid rgba(244, 114, 182, 0.3)',
          backgroundImage: 'linear-gradient(to bottom right, #000, #050505)',
          boxShadow: 'inset 0 0 60px rgba(244, 114, 182, 0.05), inset 0 0 20px rgba(34, 211, 238, 0.05)'
        };
      case 'midnight-tokyo':
        return {
          ...base,
          backgroundColor: '#080110',
          border: '1px solid rgba(192, 38, 211, 0.3)',
          boxShadow: 'inset 0 0 50px rgba(112, 26, 117, 0.2)'
        };
      case 'industrial':
        return {
          ...base,
          backgroundColor: '#111111',
          border: '1px solid rgba(249, 115, 22, 0.3)',
          boxShadow: '0 0 20px rgba(0,0,0,0.5)'
        };
      default:
        return { ...base };
    }
  };

  // Determine atmosphere colors based on theme
  const getAtmosphereColors = () => {
    switch (theme) {
      case 'hologram': return { primary: '#F472B6', secondary: '#22D3EE' };
      case 'midnight-tokyo': return { primary: '#C026D3', secondary: '#4F46E5' };
      case 'industrial': return { primary: '#F97316', secondary: '#4B5563' };
      case 'neon-green': return { primary: '#22C55E', secondary: '#15803D' };
      case 'neon-blue': return { primary: '#22D3EE', secondary: '#1D4ED8' };
      default: return { primary: brandColor, secondary: brandColor };
    }
  };

  const colors = getAtmosphereColors();

  return (
    <div
      ref={ref}
      className="relative flex flex-col overflow-hidden shadow-2xl rounded-none select-none text-white font-primary"
      style={{
        ...getThemeStyles(),
        padding: '50px 33px'
      }}
    >
      {/* 🌌 Premium Atmosphere Layer */}
      <div className="absolute inset-0 z-0">
        {/* Hub Glow */}
        <div
          className="absolute top-[-10%] left-[-10%] w-[120%] h-[60%] blur-[120px] opacity-[0.15]"
          style={{
            background: `radial-gradient(circle at 50% 0%, ${colors.primary}, transparent 70%)`
          }}
        />
        {/* Subtle Accents */}
        <div
          className="absolute bottom-[-10%] right-[-10%] w-[80%] h-[40%] blur-[100px] opacity-[0.1]"
          style={{
            background: `radial-gradient(circle at 100% 100%, ${colors.secondary}, transparent 70%)`
          }}
        />
        {/* Noise Texture Overlay */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />

        {/* 📊 Heatmap Aura pattern */}
        {data.heatmap && (
          <div className="absolute bottom-[26%] right-[33px] z-0 opacity-[0.12] pointer-events-none transform rotate-[-4deg]">
            <div className="grid grid-cols-[repeat(15,7px)] gap-1">
              {data.heatmap.slice(0, 105).map((level, i) => (
                <div
                  key={i}
                  className="w-[7px] h-[7px] rounded-[1px] transition-all duration-700"
                  style={{
                    backgroundColor: level === 0 ? 'transparent' : colors.primary,
                    border: level === 0 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                    opacity: level === 0 ? 0.2 : 0.2 + (level * 0.2)
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Editorial Lines */}
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none">
          <div className="absolute top-[20%] inset-x-0 h-[1px] bg-white" />
          <div className="absolute bottom-[20%] inset-x-0 h-[1px] bg-white" />
          <div className="absolute inset-y-0 left-[33px] w-[1px] bg-white" />
          <div className="absolute inset-y-0 right-[33px] w-[1px] bg-white" />
        </div>
      </div>
      {/* 🏆 Section 1: Header */}
      <div className="relative z-20 flex flex-col mb-10">
        <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#9AA0B2] mb-5">
          {data.categoryHeader}
        </span>

        <div className="flex items-end gap-5 leading-none h-14">
          <h1
            className="text-7xl font-retro font-black tracking-tighter"
            style={{ color: brandColor, textShadow: brandColor !== '#FFFFFF' ? `0 0 20px ${brandColor}66` : 'none' }}
          >
            WRAP
          </h1>
          <span className="font-primary font-medium text-[#9AA0B2] text-4xl mb-1.5 opacity-40">
            2025
          </span>
        </div>

        <p className="text-[16px] italic text-[#C7CBD6] mt-6 tracking-[0.02em] font-serif leading-relaxed">
          “{data.tagline}”
        </p>
      </div>

      {/* 📊 Section 2: Metrics Grid */}
      <div className="relative z-20 grid grid-cols-2 gap-x-10 gap-y-10">
        {displayStats.map((stat, idx) => {
          const isBuddy = stat.label.toLowerCase().includes('buddy');
          const cleanValue = stat.value === 'Infinity' ? '∞' : stat.value.replace(/ Apps/g, '');

          return (
            <div key={idx} className="flex flex-col gap-2.5">
              <div className="flex flex-col gap-1.5">
                <div
                  className="w-6 h-6 flex items-center justify-start"
                  style={{ color: brandColor !== '#FFFFFF' ? brandColor : '#C1C5D0' }}
                >
                  {statIcons[idx]({ className: "w-full h-full" })}
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#C1C5D0]">
                  {stat.label}
                </span>
              </div>
              <div className="leading-none">
                {isBuddy ? (
                  <span className="text-[17px] font-bold text-white tracking-tight font-primary truncate block max-w-full">
                    {stat.value}
                  </span>
                ) : (
                  <span
                    className="font-retro text-[1.6rem] tracking-tighter"
                    style={{ color: brandColor }}
                  >
                    {cleanValue}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Space filler */}
      <div className="flex-grow" />

      {/* 📸 Section 3: Details (Polaroid + Tech) */}
      <div className="relative z-20 pt-8 mt-8 border-t border-white/[0.08] flex gap-8 items-end mb-6">
        {/* Polaroid Left */}
        <div className="relative shrink-0">
          <div className="bg-white p-3 w-[145px] h-[165px] shadow-2xl rounded-[1px] rotate-[-2deg]">
            <div className="w-full h-full overflow-hidden bg-gray-100 flex flex-col">
              <div className="flex-1 bg-white">
                <img src={data.imageUrl} className="w-full h-full object-cover grayscale-[0.01]" alt="" />
              </div>
              <div className="h-5 flex items-center justify-center">
                <span className="text-[5px] font-black text-black/20 tracking-[0.5em] uppercase font-primary">SNAPSHOT</span>
              </div>
            </div>
          </div>
          {/* Tag: TRAIT */}
          <div
            className={`absolute top-[-14px] right-[-10px] z-30 px-4 py-2 text-[9px] font-black uppercase rounded shadow-2xl border transition-all duration-500 ${data.trait === 'BATMAN'
              ? 'bg-[#0A0A0A] text-yellow-500 border-yellow-500/50 shadow-[0_0_20px_rgba(234,179,8,0.2)] scale-110'
              : 'text-white border-white/10'
              }`}
            style={{
              backgroundColor: data.trait === 'BATMAN' ? '#0A0A0A' : (brandColor !== '#FFFFFF' ? brandColor : '#000000')
            }}
          >
            {data.trait === 'BATMAN' && <i className="fa-solid fa-bat block mb-0.5 text-[8px]"></i>}
            {data.trait}
          </div>
        </div>

        {/* Info Right */}
        <div className="flex flex-col flex-1 gap-6 pb-2">
          <div className="flex flex-col gap-3">
            <span className="text-[9px] font-black tracking-[0.4em] uppercase text-[#9AA0B2]">Toolkit</span>
            <div className="flex flex-wrap gap-4">
              {data.tools.filter(t => t).slice(0, 5).map((t, i) => (
                <div key={i} className="opacity-100 transition-transform hover:scale-110">{renderIcon(t, "w-6 h-6")}</div>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <span className="text-[9px] font-black tracking-[0.4em] uppercase text-[#9AA0B2]">Languages</span>
            <div className="flex flex-wrap gap-4">
              {data.languages.filter(l => l).slice(0, 5).map((l, i) => (
                <div key={i} className="opacity-100 transition-transform hover:scale-110">{renderIcon(l, "w-6 h-6")}</div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 👤 Section 4: Identity */}
      <div className="relative z-20 pt-8 border-t border-white/[0.08] flex flex-col gap-3 items-start shrink-0">
        <h3
          className="text-4xl font-bold tracking-tighter leading-none font-primary"
          style={{ color: brandColor }}
        >
          {data.name}
        </h3>
        <span className="text-[12px] font-black uppercase tracking-[0.4em] text-[#9AA0B2] font-primary opacity-60">
          {data.role}
        </span>
      </div>
    </div>
  );
});

WrapPreview.displayName = 'WrapPreview';

export default memo(WrapPreview);
