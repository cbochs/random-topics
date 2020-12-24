import axios from 'axios'
import config from '../config'

axios.defaults.baseURL = config.apiURL
axios.defaults.withCredentials = false

export const openSession = async () => {
  return axios.post('/sessions/open')
}

export const getSession = async (sessionCode) => {
  return axios.get(`/sessions/${sessionCode}`)
}

export const closeSession = async (sessionCode) => {
  return axios.put('/sessions/close', { code: sessionCode })
}

export const submitTopic = async (sessionCode, topic) => {
  return axios.post('/topics', { code: sessionCode, topic })
}

export const updateTopic = async (topicCode, topic) => {
  return axios.put(`/topics/${topicCode}`, { topic })
}

export const getAssignedTopic = async (topicCode) => {
  return axios.get(`/topics/${topicCode}/assigned`)
}
