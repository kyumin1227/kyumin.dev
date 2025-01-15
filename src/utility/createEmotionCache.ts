import createCache from "@emotion/cache";

// Emotion 캐시를 생성하는 함수
export default function createEmotionCache() {
  return createCache({ key: "css", prepend: true }); // key는 캐시의 고유 접두사입니다.
}
