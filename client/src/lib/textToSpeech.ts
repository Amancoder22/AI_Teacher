// Text-to-speech functionality using the Web Speech API

let speechSynthesis: SpeechSynthesis;
let speechUtterance: SpeechSynthesisUtterance | null = null;

// Initialize speech synthesis
const initSpeechSynthesis = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  if (!('speechSynthesis' in window)) {
    console.error('Text-to-speech is not supported in this browser.');
    return false;
  }
  
  speechSynthesis = window.speechSynthesis;
  return true;
};

// Strip HTML tags from content
const stripHtml = (html: string): string => {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return doc.body.textContent || '';
};

// Initialize text-to-speech with the given content
export const initTextToSpeech = (content: string): void => {
  if (!initSpeechSynthesis()) return;
  
  // Cancel any ongoing speech
  stopSpeech();
  
  // Create a new utterance
  speechUtterance = new SpeechSynthesisUtterance();
  
  // Strip HTML tags
  const plainText = stripHtml(content);
  
  // Set utterance properties
  speechUtterance.text = plainText;
  speechUtterance.rate = 0.9; // Slightly slower for educational content
  speechUtterance.pitch = 1.0;
  speechUtterance.volume = 1.0;
  
  // Use a kid-friendly voice if available
  const voices = speechSynthesis.getVoices();
  const preferredVoice = voices.find(voice => 
    voice.name.includes('female') || voice.name.includes('girl') || voice.name.includes('child')
  );
  
  if (preferredVoice) {
    speechUtterance.voice = preferredVoice;
  }
  
  // Handle errors
  speechUtterance.onerror = (event) => {
    console.error('Speech synthesis error:', event.error);
  };
  
  // Start speaking
  speechSynthesis.speak(speechUtterance);
};

// Stop speaking
export const stopSpeech = (): void => {
  if (!speechSynthesis) return;
  
  speechSynthesis.cancel();
  speechUtterance = null;
};

// Pause speaking
export const pauseSpeech = (): void => {
  if (!speechSynthesis) return;
  
  speechSynthesis.pause();
};

// Resume speaking
export const resumeSpeech = (): void => {
  if (!speechSynthesis) return;
  
  speechSynthesis.resume();
};

// Check if speech is currently speaking
export const isSpeaking = (): boolean => {
  if (!speechSynthesis) return false;
  
  return speechSynthesis.speaking;
};
