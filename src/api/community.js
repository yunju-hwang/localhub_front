import http from './http'

export function getPosts(params) {
  return http.get('/posts', { params }).then((res) => res.data)
}

export function getPost(id) {
  return http.get(`/posts/${id}`).then((res) => res.data)
}

export function createPost(payload) {
  return http.post('/posts', payload).then((res) => res.data)
}

export function updatePost(id, payload) {
  return http.put(`/posts/${id}`, payload).then((res) => res.data)
}

export function deletePost(id) {
  return http.delete(`/posts/${id}`).then((res) => res.data)
}
