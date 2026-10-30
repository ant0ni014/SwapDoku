# Audio-Tracks (Google AI Studio & Web Audio)

In dieses Verzeichnis können MP3-Audiodateien für Hintergrundmusik abgelegt werden:

- `ai_zen_garden.mp3` (Track 1: Google AI Studio Ambient)
- `midnight_lofi.mp3` (Track 2: Google AI Studio Chill Beats)

## Wie erstellst du die Tracks in Google AI Studio?
1. Öffne Google AI Studio / Gemini Prompt mit Audio-Modellen (z.B. Lyria / MusicLM / Music Generation API).
2. Prompt-Beispiel:
   > *"Minimalist, warm Rhodes piano chords, gentle vinyl noise, 75 BPM, relaxing zen meditation background loop, no percussion, soft acoustic atmosphere"*
3. Exportiere die generierten Audio-Dateien als MP3 und speichere sie in diesem Ordner (`audio/ai_zen_garden.mp3` und `audio/midnight_lofi.mp3`).
4. **Fallback:** Falls keine MP3-Dateien vorhanden sind, greift SwapDoku automatisch und nahtlos auf den integrierten prozeduralen Web Audio API Synthesizer zurück.
