import http from './http'

// LLM API 키는 절대 프론트에 두지 않는다. 이 함수는 자체 백엔드의 /chat 엔드포인트만 호출한다.
export function sendChatMessage(message, history = []) {
  return http.post('/chat', { message, history }).then((res) => res.data)
}
