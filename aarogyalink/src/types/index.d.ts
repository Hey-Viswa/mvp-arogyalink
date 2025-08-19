import { RecaptchaVerifier } from "firebase/auth";

export {};

declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
    recaptchaVerifier: RecaptchaVerifier;
  }
}
