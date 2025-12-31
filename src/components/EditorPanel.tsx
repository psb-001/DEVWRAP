import { ThemeName, WrapData } from '../types';
import { APP_OPTIONS, LANG_OPTIONS } from '../constants';
import React, { useState, memo } from 'react';
import { fetchGitHubStats } from '../services/github';

interface EditorPanelProps {
  data: WrapData;
  theme: ThemeName;
  onDataChange: (data: WrapData) => void;
  onThemeChange: (theme: ThemeName) => void;
}

const EditorPanel = memo(({
  data,
  theme,
  onDataChange,
  onThemeChange,
}: EditorPanelProps) => {
  const [ghUsername, setGhUsername] = useState('');
  const [isFetching, setIsFetching] = useState(false);
  const [fetchSuccess, setFetchSuccess] = useState(false);

  const handleGitHubFetch = async () => {
    if (!ghUsername) return;
    setIsFetching(true);
    try {
      const stats = await fetchGitHubStats(ghUsername);

      // Reset stats to defaults first to ensure labels are correct
      const baseStats = [
        { label: 'Lines of Code', value: '0' },
        { label: 'Commits', value: '0' },
        { label: 'Coffee Cups', value: '∞' },
        { label: 'Bugs Fixed', value: '0' },
        { label: 'Shipped', value: '0' },
        { label: 'Buddy', value: 'Gemini' },
      ];

      const newStats = [...baseStats];

      // Map Lines of Code (Index 0)
      newStats[0] = { ...newStats[0], value: `${stats.linesOfCode.toLocaleString()}+` };
      // Map Commits (Index 1)
      newStats[1] = { ...newStats[1], value: `${stats.commits}+` };
      // Map PRs as Bugs Fixed (Index 3)
      newStats[3] = { ...newStats[3], value: stats.prs > 0 ? `${stats.prs}` : '0' };
      // Map Repos as Shipped (Index 4)
      newStats[4] = { ...newStats[4], value: `${stats.repos} Apps` };

      // Process languages: replace entirely and pad to 5 elements
      const ghLangs = stats.languages || [];
      const newLanguages = Array(5).fill('');
      ghLangs.forEach((lang, i) => {
        if (i < 5) newLanguages[i] = lang;
      });

      onDataChange({
        ...data,
        name: ghUsername,
        stats: newStats,
        languages: newLanguages,
        imageUrl: stats.avatarUrl || data.imageUrl,
        heatmap: stats.heatmap
      });
      setFetchSuccess(true);
      setTimeout(() => setFetchSuccess(false), 3000);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Error fetching GitHub data. Please check the username.');
    } finally {
      setIsFetching(false);
    }
  };
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        onDataChange({ ...data, imageUrl: event.target?.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const updateStat = (index: number, field: 'label' | 'value', value: string) => {
    const newStats = [...data.stats];
    newStats[index] = { ...newStats[index], [field]: value };
    onDataChange({ ...data, stats: newStats });
  };

  const updateTool = (index: number, value: string) => {
    const newTools = [...data.tools];
    newTools[index] = value;
    onDataChange({ ...data, tools: newTools });
  };

  const updateLanguage = (index: number, value: string) => {
    const newLanguages = [...data.languages];
    newLanguages[index] = value;
    onDataChange({ ...data, languages: newLanguages });
  };

  return (
    <div className="p-6 flex-1">
      <div className="section-card border-purple-500/30 bg-purple-500/5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-400">
            <i className="fa-brands fa-github text-sm"></i>
          </div>
          <div>
            <h2 className="text-base font-bold text-white">GitHub Magic</h2>
            <p className="text-[10px] text-purple-300 opacity-70">Auto-fill your 2025 stats neatly!</p>
          </div>
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Enter Username"
            value={ghUsername}
            onChange={(e) => setGhUsername(e.target.value)}
            className="input-field flex-1 text-sm h-10"
          />
          <button
            onClick={handleGitHubFetch}
            disabled={isFetching || !ghUsername}
            className={`${fetchSuccess ? 'bg-green-600' : 'bg-purple-600 hover:bg-purple-500'
              } disabled:opacity-50 text-white px-4 rounded-lg font-bold text-xs transition-all flex items-center gap-2 h-10`}
          >
            {isFetching ? (
              <i className="fa-solid fa-spinner fa-spin"></i>
            ) : fetchSuccess ? (
              <i className="fa-solid fa-check animate-bounce"></i>
            ) : (
              <i className="fa-solid fa-wand-magic-sparkles"></i>
            )}
            {isFetching ? 'Fetching...' : fetchSuccess ? 'Magic active!' : 'Go'}
          </button>
        </div>
      </div>
      <div className="section-card">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center text-orange-500">
            <i className="fa-solid fa-palette text-sm"></i>
          </div>
          <h2 className="text-base font-bold text-white">Choose Theme</h2>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => onThemeChange('minimal')}
            className={`bg-dark-input rounded-xl p-3 flex flex-col items-center cursor-pointer hover:bg-dark-card transition-colors relative overflow-hidden group ${theme === 'minimal' ? 'border-2 border-purple-500' : 'border border-[#27272A]'
              }`}
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <span className="text-sm font-bold text-white relative z-10">Modern Gradient</span>
            <div className="flex gap-1 mt-2">
              <div className="w-3 h-3 rounded-full bg-purple-500"></div>
              <div className="w-3 h-3 rounded-full bg-pink-500"></div>
            </div>
          </button>
          <button
            onClick={() => onThemeChange('neon-green')}
            className={`bg-dark-input rounded-xl p-3 flex flex-col items-center cursor-pointer hover:bg-dark-card transition-colors relative overflow-hidden group ${theme === 'neon-green' ? 'border-2 border-green-500' : 'border border-[#27272A]'
              }`}
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-green-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <span className="text-sm font-bold text-green-400 relative z-10">Neon Green</span>
            <div className="flex gap-1 mt-2">
              <div className="w-3 h-3 rounded-full bg-green-400"></div>
              <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
            </div>
          </button>
          <button
            onClick={() => onThemeChange('neon-blue')}
            className={`bg-dark-input rounded-xl p-3 flex flex-col items-center cursor-pointer hover:bg-dark-card transition-colors relative overflow-hidden group ${theme === 'neon-blue' ? 'border-2 border-cyan-500' : 'border border-[#27272A]'
              }`}
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <span className="text-sm font-bold text-cyan-400 relative z-10">Neon Blue</span>
            <div className="flex gap-1 mt-2">
              <div className="w-3 h-3 rounded-full bg-cyan-400"></div>
              <div className="w-3 h-3 rounded-full bg-blue-400"></div>
            </div>
          </button>
          <button
            onClick={() => onThemeChange('hologram')}
            className={`bg-dark-input rounded-xl p-3 flex flex-col items-center cursor-pointer hover:bg-dark-card transition-colors relative overflow-hidden group ${theme === 'hologram' ? 'border-2 border-pink-500' : 'border border-[#27272A]'
              }`}
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-pink-500/10 via-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <span className="text-sm font-bold text-pink-300 relative z-10">Hologram</span>
            <div className="flex gap-1 mt-2">
              <div className="w-3 h-3 rounded-full bg-pink-400"></div>
              <div className="w-3 h-3 rounded-full bg-cyan-300"></div>
            </div>
          </button>
          <button
            onClick={() => onThemeChange('midnight-tokyo')}
            className={`bg-dark-input rounded-xl p-3 flex flex-col items-center cursor-pointer hover:bg-dark-card transition-colors relative overflow-hidden group ${theme === 'midnight-tokyo' ? 'border-2 border-fuchsia-600' : 'border border-[#27272A]'
              }`}
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-fuchsia-600/10 via-purple-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <span className="text-sm font-bold text-fuchsia-400 relative z-10">Cyber Tokyo</span>
            <div className="flex gap-1 mt-2">
              <div className="w-3 h-3 rounded-full bg-fuchsia-600"></div>
              <div className="w-3 h-3 rounded-full bg-indigo-600"></div>
            </div>
          </button>
          <button
            onClick={() => onThemeChange('industrial')}
            className={`bg-dark-input rounded-xl p-3 flex flex-col items-center cursor-pointer hover:bg-dark-card transition-colors relative overflow-hidden group ${theme === 'industrial' ? 'border-2 border-orange-500' : 'border border-[#27272A]'
              }`}
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/10 via-gray-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <span className="text-sm font-bold text-orange-400 relative z-10">Industrial</span>
            <div className="flex gap-1 mt-2">
              <div className="w-3 h-3 rounded-none bg-orange-500"></div>
              <div className="w-3 h-3 rounded-none bg-gray-600"></div>
            </div>
          </button>
        </div>
      </div>

      <div className="section-card">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-lg bg-pink-500/20 flex items-center justify-center text-pink-400">
            <i className="fa-solid fa-droplet text-sm"></i>
          </div>
          <h2 className="text-base font-bold text-white">Font Accent Color</h2>
        </div>

        <div className="flex flex-wrap gap-4 px-2">
          {[
            { label: 'White', value: '#FFFFFF' },
            { label: 'Green', value: '#22C55E' },
            { label: 'Blue', value: '#22D3EE' },
            { label: 'Purple', value: '#8B5CF6' },
            { label: 'Pink', value: '#F472B6' },
            { label: 'Amber', value: '#F59E0B' },
          ].map((color) => (
            <button
              key={color.value}
              onClick={() => onDataChange({ ...data, brandColor: color.value })}
              className="group flex flex-col items-center gap-2 outline-none"
            >
              <div
                className={`w-10 h-10 rounded-full border-2 transition-all flex items-center justify-center ${data.brandColor === color.value
                  ? 'border-white scale-110 shadow-[0_0_15px_rgba(255,255,255,0.3)]'
                  : 'border-[#27272A] hover:border-gray-500 scale-100'
                  }`}
                style={{ backgroundColor: color.value }}
              >
                {data.brandColor === color.value && (
                  <i className={`fa-solid fa-check ${color.value === '#FFFFFF' ? 'text-black' : 'text-white'}`}></i>
                )}
              </div>
              <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">{color.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="section-card">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-400">
            <i className="fa-solid fa-user text-sm"></i>
          </div>
          <h2 className="text-base font-bold text-white">Identity</h2>
        </div>

        <div className="space-y-3">
          <div className="input-group">
            <label className="input-label">
              <i className="fa-solid fa-tag input-icon"></i>Header Title
            </label>
            <input
              type="text"
              value={data.categoryHeader}
              onChange={(e) => onDataChange({ ...data, categoryHeader: e.target.value })}
              className="input-field tracking-widest"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="input-label">
                <i className="fa-solid fa-id-card input-icon"></i>Name
              </label>
              <input
                type="text"
                value={data.name}
                onChange={(e) => onDataChange({ ...data, name: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="input-label">
                <i className="fa-solid fa-briefcase input-icon"></i>Role
              </label>
              <input
                type="text"
                value={data.role}
                onChange={(e) => onDataChange({ ...data, role: e.target.value })}
                className="input-field"
              />
            </div>
          </div>

          <div>
            <label className="input-label">
              <i className="fa-solid fa-mask input-icon"></i>Personality Rank
            </label>
            <div
              className="w-full bg-purple-500/10 border border-purple-500/20 rounded-lg p-3 text-center text-sm font-bold text-purple-400 font-mono tracking-widest"
            >
              {data.trait}
            </div>
            <p className="text-[9px] text-gray-500 mt-2 uppercase tracking-tight">Auto-calculated based on lines written</p>
          </div>

          <div>
            <label className="input-label">
              <i className="fa-solid fa-code input-icon"></i>LeetCode Solved
            </label>
            <input
              type="text"
              value={data.leetcodeCount || ''}
              onChange={(e) => onDataChange({ ...data, leetcodeCount: e.target.value })}
              placeholder="e.g. 150+"
              className="input-field font-mono"
            />
          </div>

          <div>
            <label className="input-label">
              <i className="fa-solid fa-mug-hot input-icon"></i>Beverage Preference
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => {
                  const newStats = [...data.stats];
                  newStats[2] = { ...newStats[2], label: 'Coffee Cups' };
                  onDataChange({ ...data, beverage: 'coffee', stats: newStats });
                }}
                className={`p-3 rounded-lg border transition-all flex items-center justify-center gap-2 ${data.beverage === 'coffee'
                  ? 'border-orange-500 bg-orange-500/10 text-orange-400'
                  : 'border-[#27272A] bg-[#181A20] text-gray-400 hover:border-orange-500/50'
                  }`}
              >
                <i className="fa-solid fa-mug-hot"></i>
                <span className="text-sm font-bold">Coffee</span>
              </button>
              <button
                onClick={() => {
                  const newStats = [...data.stats];
                  newStats[2] = { ...newStats[2], label: 'Chai Cups' };
                  onDataChange({ ...data, beverage: 'chai', stats: newStats });
                }}
                className={`p-3 rounded-lg border transition-all flex items-center justify-center gap-2 ${data.beverage === 'chai'
                  ? 'border-amber-500 bg-amber-500/10 text-amber-400'
                  : 'border-[#27272A] bg-[#181A20] text-gray-400 hover:border-amber-500/50'
                  }`}
              >
                <i className="fa-solid fa-mug-saucer"></i>
                <span className="text-sm font-bold">Chai</span>
              </button>
            </div>
          </div>

          <div>
            <label className="input-label">
              <i className="fa-solid fa-camera input-icon"></i>Photo
            </label>
            <div className="relative">
              <input
                type="file"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                onChange={handleImageUpload}
                accept="image/*"
              />
              <div className="w-full bg-[#181A20] border border-[#27272A] border-dashed rounded-lg p-3 text-center transition-colors hover:bg-[#0F1115] hover:border-gray-500">
                <span className="text-xs text-gray-500 font-medium">Click to upload image</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="section-card">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400">
            <i className="fa-solid fa-chart-simple text-sm"></i>
          </div>
          <h2 className="text-base font-bold text-white">Year Stats</h2>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {data.stats.map((stat, idx) => (
            <div key={idx}>
              <input
                type="text"
                value={stat.label}
                onChange={(e) => updateStat(idx, 'label', e.target.value)}
                className="bg-transparent text-[10px] text-gray-500 font-bold uppercase mb-1 w-full border-b border-transparent focus:border-purple-500 focus:outline-none"
              />
              <input
                type="text"
                value={stat.value}
                onChange={(e) => updateStat(idx, 'value', e.target.value)}
                className="input-field text-sm font-mono"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="section-card">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center text-red-500">
            <i className="fa-solid fa-shapes text-sm"></i>
          </div>
          <h2 className="text-base font-bold text-white">Stack</h2>
        </div>

        <div className="mb-4">
          <label className="input-label mb-2 text-[10px]">Top Apps (Select 5)</label>
          <div className="space-y-2">
            {data.tools.map((tool, idx) => (
              <select
                key={idx}
                value={tool}
                onChange={(e) => updateTool(idx, e.target.value)}
                className="input-field text-xs"
              >
                {APP_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            ))}
          </div>
        </div>

        <div>
          <label className="input-label mb-2 text-[10px]">Top Languages (Select 5)</label>
          <div className="space-y-2">
            {data.languages.map((lang, idx) => (
              <select
                key={idx}
                value={lang}
                onChange={(e) => updateLanguage(idx, e.target.value)}
                className="input-field text-xs"
              >
                {LANG_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            ))}
          </div>
        </div>
      </div>
    </div >
  );
});

export default EditorPanel;
