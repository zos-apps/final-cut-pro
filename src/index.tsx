import { useState } from 'react';

interface FinalCutProProps {
  onClose: () => void;
}

interface Clip {
  id: string;
  name: string;
  duration: number;
  color: string;
  track: number;
  start: number;
}

const mockClips: Clip[] = [
  { id: '1', name: 'Opening Shot', duration: 5, color: '#3b82f6', track: 0, start: 0 },
  { id: '2', name: 'Interview A', duration: 8, color: '#22c55e', track: 0, start: 5 },
  { id: '3', name: 'B-Roll 1', duration: 3, color: '#f59e0b', track: 1, start: 5 },
  { id: '4', name: 'Interview B', duration: 6, color: '#22c55e', track: 0, start: 13 },
  { id: '5', name: 'B-Roll 2', duration: 4, color: '#f59e0b', track: 1, start: 13 },
  { id: '6', name: 'Music', duration: 20, color: '#a855f7', track: 2, start: 0 },
];

const FinalCutPro: React.FC<FinalCutProProps> = ({ onClose: _onClose }) => {
  const [clips] = useState(mockClips);
  const [selectedClip, setSelectedClip] = useState<string | null>(null);
  const [playhead, _setPlayhead] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const totalDuration = 20;
  const pixelsPerSecond = 40;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const frames = Math.floor((seconds % 1) * 24);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}:${frames.toString().padStart(2, '0')}`;
  };

  return (
    <div className="h-full flex flex-col bg-[#1a1a1a] text-white">
      {/* Header */}
      <div className="h-10 bg-[#2a2a2a] flex items-center justify-between px-4 border-b border-black">
        <div className="flex items-center gap-4">
          <span className="font-semibold">Final Cut Pro</span>
          <span className="text-sm text-white/60">Untitled Project</span>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1 bg-purple-600 hover:bg-purple-500 rounded text-sm">Export</button>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Browser Panel */}
        <div className="w-64 bg-[#252525] border-r border-black flex flex-col">
          <div className="p-2 border-b border-black">
            <input
              type="text"
              placeholder="Search media..."
              className="w-full px-2 py-1 bg-black/30 rounded text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
            />
          </div>
          <div className="flex-1 overflow-auto p-2">
            <div className="text-xs font-semibold text-white/50 uppercase mb-2">Media</div>
            {['Opening Shot.mov', 'Interview_A.mov', 'Interview_B.mov', 'B-Roll_1.mov', 'B-Roll_2.mov', 'Background_Music.mp3'].map(file => (
              <div key={file} className="flex items-center gap-2 p-2 hover:bg-white/10 rounded cursor-pointer">
                <span className="text-lg">{file.endsWith('.mp3') ? '🎵' : '🎬'}</span>
                <span className="text-sm truncate">{file}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Main Area */}
        <div className="flex-1 flex flex-col">
          {/* Viewer */}
          <div className="h-64 bg-black flex items-center justify-center relative">
            <div className="text-6xl">🎬</div>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-4">
              <button className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center">⏮</button>
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-xl"
              >
                {isPlaying ? '⏸' : '▶️'}
              </button>
              <button className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center">⏭</button>
            </div>
            <div className="absolute bottom-4 right-4 font-mono text-sm bg-black/50 px-2 py-1 rounded">
              {formatTime(playhead)} / {formatTime(totalDuration)}
            </div>
          </div>

          {/* Timeline */}
          <div className="flex-1 bg-[#1e1e1e] flex flex-col">
            {/* Timeline Header */}
            <div className="h-8 bg-[#2a2a2a] border-b border-black flex items-center px-4 gap-4">
              <button className="text-sm px-2 py-0.5 bg-purple-600 rounded">Blade</button>
              <button className="text-sm px-2 py-0.5 bg-white/10 hover:bg-white/20 rounded">Selection</button>
              <button className="text-sm px-2 py-0.5 bg-white/10 hover:bg-white/20 rounded">Trim</button>
              <div className="flex-1" />
              <span className="text-xs text-white/50">Zoom: 100%</span>
            </div>

            {/* Time Ruler */}
            <div className="h-6 bg-[#252525] border-b border-black relative">
              <div className="absolute inset-0 flex items-end">
                {Array.from({ length: totalDuration + 1 }, (_, i) => (
                  <div key={i} className="absolute text-xs text-white/40" style={{ left: i * pixelsPerSecond }}>
                    {i % 5 === 0 && <span>{i}s</span>}
                  </div>
                ))}
              </div>
              <div
                className="absolute top-0 w-0.5 h-full bg-red-500 cursor-ew-resize"
                style={{ left: playhead * pixelsPerSecond }}
              />
            </div>

            {/* Tracks */}
            <div className="flex-1 overflow-auto relative">
              {[0, 1, 2].map(track => (
                <div key={track} className="h-16 border-b border-black/50 relative">
                  <div className="absolute left-0 w-24 h-full bg-[#252525] border-r border-black flex items-center px-2 text-xs text-white/60">
                    {track === 2 ? '♪ Audio' : `V${track + 1}`}
                  </div>
                  <div className="absolute left-24 right-0 h-full">
                    {clips.filter(c => c.track === track).map(clip => (
                      <div
                        key={clip.id}
                        onClick={() => setSelectedClip(clip.id)}
                        className={`absolute top-1 bottom-1 rounded px-2 flex items-center cursor-pointer transition-all
                          ${selectedClip === clip.id ? 'ring-2 ring-yellow-400' : ''}
                        `}
                        style={{
                          left: clip.start * pixelsPerSecond,
                          width: clip.duration * pixelsPerSecond,
                          backgroundColor: clip.color,
                        }}
                      >
                        <span className="text-xs font-medium truncate">{clip.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              {/* Playhead line */}
              <div
                className="absolute top-0 w-0.5 bg-red-500 pointer-events-none"
                style={{ left: 96 + playhead * pixelsPerSecond, height: '100%' }}
              />
            </div>
          </div>
        </div>

        {/* Inspector */}
        <div className="w-64 bg-[#252525] border-l border-black p-4">
          <h3 className="text-xs font-semibold text-white/50 uppercase mb-4">Inspector</h3>
          {selectedClip ? (
            <div className="space-y-4">
              <div>
                <label className="text-xs text-white/50">Name</label>
                <div className="font-medium">{clips.find(c => c.id === selectedClip)?.name}</div>
              </div>
              <div>
                <label className="text-xs text-white/50">Duration</label>
                <div className="font-mono">{clips.find(c => c.id === selectedClip)?.duration}s</div>
              </div>
              <div>
                <label className="text-xs text-white/50">Opacity</label>
                <input type="range" className="w-full" defaultValue={100} />
              </div>
              <div>
                <label className="text-xs text-white/50">Speed</label>
                <input type="range" className="w-full" defaultValue={100} />
              </div>
            </div>
          ) : (
            <div className="text-center text-white/40 text-sm">Select a clip to edit</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FinalCutPro;
