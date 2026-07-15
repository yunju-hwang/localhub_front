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

export function deletePost(id, password) {
  return http.delete(`/posts/${id}`, { params: { password } }).then((res) => res.data)
}

export function likePost(id) {
  return http.post(`/posts/${id}/like`).then((res) => res.data)
}

export function verifyPassword(id, password) {
  return http.post(`/posts/${id}/verify-password`, { password }).then((res) => res.data.valid)
}

export function getComments(postId) {
  return http.get(`/posts/${postId}/comments`).then((res) => res.data)
}

export function createComment(postId, payload) {
  return http.post(`/posts/${postId}/comments`, payload).then((res) => res.data)
}

export function deleteComment(postId, commentId, password) {
  return http
    .delete(`/posts/${postId}/comments/${commentId}`, { params: { password } })
    .then((res) => res.data)
}
