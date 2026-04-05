'use client';

import { useState } from 'react';
import AudioPlayer from '../../components/AudioPlayer';

const TRACKS = [
  {
    id: 'monastery-rain',
    title: 'Monastery Rain',
    description: 'Gentle rain sounds within ancient monastery walls',
    url: '/audio/monastery-rain.wav',
  },
  {
    id: 'forest-silence',
    title: 'Deep Forest Silence',
    description: 'Subtle forest ambience with distant bird calls',
    url: '/audio/forest-silence.wav',
  },
  {
    id: 'singing-bowls',
    title: 'Tibetan Singing Bowls',
    description: 'Resonant tones for meditation and deep focus',
    url: '/audio/singing-bowls.wav',
  },
];

export default function AudioPage() {
  const [currentTrack, setCurrentTrack] = useState(TRACKS[0]);

  return (
    <main className="min-h-screen p-12 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-2">🎵 Audio</h1>
      <p className="text-opacity-60 mb-12">
        Ambient tracks for reading sessions. Click any track to play.
      </p>

      {/* Track List */}
      <div className="space-y-4 mb-12">
        {TRACKS.map((track) => (
          <div
            key={track.id}
            className={`p-4 rounded-lg border transition-all cursor-pointer ${
              currentTrack.id === track.id
                ? 'bg-blue-500/20 border-blue-500/50'
                : 'bg-opacity-5 bg-white border-opacity-10 border-white hover:bg-opacity-10'
            }`}
            onClick={() => setCurrentTrack(track)}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold">{track.title}</h3>
                <p className="text-sm text-opacity-60">{track.description}</p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentTrack(track);
                  // Trigger play in AudioPlayer via ref
                  const audioEl = document.querySelector('audio') as HTMLAudioElement;
                  if (audioEl) {
                    audioEl.play().catch(() => {
                      // Autoplay may be blocked, user needs to click Play button
                    });
                  }
                }}
                className="px-4 py-2 rounded bg-blue-500/30 text-blue-300 hover:bg-blue-500/50 transition-colors whitespace-nowrap ml-4"
              >
                ▶ Play
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Now Playing Info */}
      <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/30 mb-12">
        <p className="text-sm text-green-400">Now Playing</p>
        <h2 className="text-2xl font-bold">{currentTrack.title}</h2>
        <p className="text-opacity-60 text-sm mt-1">{currentTrack.description}</p>
      </div>

      {/* Audio Player */}
      <AudioPlayer src={currentTrack.url} />
    </main>
  );
}
