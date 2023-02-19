const SpeechText = (text: string, language: string = "ja-JP", volume: number = 1, rate: number = 1, pitch: number = 1.2): void => {
    const utterance: SpeechSynthesisUtterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language;
    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.volume = volume;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
};

export default SpeechText;
