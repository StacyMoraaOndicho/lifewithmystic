// Script to generate simple ambient audio files
// Run this with: node scripts/generate-audio.js

const fs = require('fs');
const path = require('path');

// Create audio directory if it doesn't exist
const audioDir = path.join(__dirname, '../public/audio');
if (!fs.existsSync(audioDir)) {
  fs.mkdirSync(audioDir, { recursive: true });
}

// Helper function to create a simple audio file (WAV format)
function createWavFile(filename, durationSeconds = 10, frequencies = [440]) {
  const sampleRate = 44100;
  const numSamples = sampleRate * durationSeconds;
  const audioData = new Float32Array(numSamples);

  // Generate simple tone
  for (let i = 0; i < numSamples; i++) {
    let sample = 0;
    for (const freq of frequencies) {
      sample += Math.sin(2 * Math.PI * freq * i / sampleRate) * 0.1;
    }
    audioData[i] = sample / frequencies.length;
  }

  // Convert to WAV
  const wav = audioToWav(audioData, sampleRate);
  fs.writeFileSync(path.join(audioDir, filename), Buffer.from(wav));
  console.log(`Created ${filename}`);
}

function audioToWav(audioData, sampleRate) {
  const channelData = [audioData];
  const numberOfChannels = channelData.length;
  const sampleCount = audioData.length;
  const bytesPerSample = 2;
  const blockAlign = numberOfChannels * bytesPerSample;

  const arrayBuffer = new ArrayBuffer(44 + sampleCount * blockAlign);
  const view = new DataView(arrayBuffer);

  function writeString(offset, string) {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  }

  writeString(0, 'RIFF');
  view.setUint32(4, 36 + sampleCount * blockAlign, true);
  writeString(8, 'WAVE');
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, numberOfChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * blockAlign, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, 16, true);
  writeString(36, 'data');
  view.setUint32(40, sampleCount * blockAlign, true);

  let index = 44;
  const volume = 0.8;
  for (let i = 0; i < sampleCount; i++) {
    view.setInt16(index, audioData[i] * volume * 0x7fff, true);
    index += 2;
  }

  return arrayBuffer;
}

// Generate audio files
createWavFile('monastery-rain.wav', 15, [100, 150, 200, 250]);
createWavFile('forest-silence.wav', 15, [300, 350, 400, 450]);
createWavFile('singing-bowls.wav', 15, [220, 330, 440, 660]);

console.log('Audio files generated!');
