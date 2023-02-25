// import "../@types/gtts";
// import gTTS from "gtts";
import Audic from "audic";
const gTTS = require("gtts");

const SpeechUsingBrowserEngine = async (text: string, language: string = "ja-JP", volume: number = 1, rate: number = 1, pitch: number = 1.2): Promise<void> => {
    const utterance: SpeechSynthesisUtterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language;
    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.volume = volume;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
};

const SpeechUsingGTTS = async (text: string, language: string = "ja-JP"): Promise<void> => {
    const mp3FileName: string = "tmp.mp3";
    let lang: string = "";
    switch (language) {
        case "ja-JP":
            lang = "ja"
            break;
        default:
            break;
    }
    const tts = new gTTS(text, lang);
    const onSaveMp3File = async (err: any, result: any) => {
        if (err) throw new Error(err);
        const audic = new Audic(mp3FileName);
        await audic.play();
        audic.addEventListener('ended', () => {
            audic.destroy();
        })
    };

    tts.save(mp3FileName, onSaveMp3File);
}

const SpeechText = async (engine: TTSEngine, text: string, language: string = "ja-JP", volume: number = 1, rate: number = 1, pitch: number = 1.2): Promise<void> => {
    switch (engine) {
        case TTSEngine.Browser:
            await SpeechUsingBrowserEngine(text, language, volume, rate, pitch);
            break;
        case TTSEngine.gTTS:
            await SpeechUsingGTTS(text, language);
            break;
        default:
            break;
    }
};

export enum TTSEngine {
    Browser = 0,
    gTTS
}

export default SpeechText;
