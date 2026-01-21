import AudioPlayer from "../../components/AudioPlayer";

export default function AudioPage() {
  return (
    <main className="min-h-screen p-12 max-w-4xl mx-auto">
      <h1 className="text-3xl mb-4">Audio</h1>
      <p className="mb-4">Ambient tracks for reading sessions. Use the player in the bottom-left to preview.</p>
      <ul className="space-y-3">
        <li>Monastery Rain — <button className="underline">Play</button></li>
        <li>Deep Forest Silence — <button className="underline">Play</button></li>
        <li>Tibetan Singing Bowls — <button className="underline">Play</button></li>
      </ul>
      <AudioPlayer src="/audio/placeholder.mp3" />
    </main>
  );
}
