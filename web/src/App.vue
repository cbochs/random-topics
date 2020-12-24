<template>
  <v-app>
    <v-container>
      <v-card>
        <v-card-title>
          <h1 class="display-1">Random Topics</h1>
          <v-spacer></v-spacer>
        </v-card-title>
        <v-container class="d-flex">
          <v-btn
            color="primary"
            class="mr-2"
            @click="openSession"
          >Create Session</v-btn>
        </v-container>
        <v-container class="d-flex">
          <v-text-field
            dense
            v-model="session_code_input"
            :maxlength="max_id_length"
            label="Session code"
            class="mr-2"
          ></v-text-field>
          <v-btn
            color="error"
            @click="closeSession"
          >Close Session</v-btn>
        </v-container>
        <v-container class="d-flex">
          <v-text-field
            dense
            v-model="topic"
            :maxlength="max_topic_length"
            label="Topic"
            class="mr-2"
          ></v-text-field>
          <v-btn
            color="primary"
            @click="submitTopic"
          >Submit Topic</v-btn>
        </v-container>
        <v-container class="d-flex">
          <v-text-field
            dense
            v-model="topic_code"
            :maxlength="max_id_length"
            label="Topic code"
            class="mr-2"
          ></v-text-field>
          <v-btn
            color="primary"
            @click="getAssignedTopic"
          >My Topic</v-btn>
        </v-container>
      </v-card>
      <v-card class="mt-4">
        <v-card-text>
          <b>{{ output }}</b>
        </v-card-text>
      </v-card>
    </v-container>
  </v-app>
</template>

<script>

import {
  openSession,
  closeSession,
  // getSession,
  submitTopic,
  getAssignedTopic,
} from './api'

export default {
  name: 'App',

  components: {},

  data: () => ({
    max_id_length: 4,
    max_topic_length: 80,
    session_code: '',
    topic_code: '',
    topic: '',
    output: '',
    timeout: null,
  }),

  computed: {
    session_code_input: {
      get() { return this.session_code },
      set(id) {
        this.session_code = id.toUpperCase()

        if (this.timeout) clearTimeout(this.timeout)
        this.timeout = setTimeout(() => {
          console.log('stopped typing')
        }, 500)
      }
    }
  },

  methods: {
    openSession: async function() {
      await openSession()
        .then(resp => {
          this.session_code = resp.data.data.code
          this.output = `Session Code: ${this.session_code}`
        })
        .catch(err => console.log(err))
    },
    closeSession: async function() {
      if (this.session_code.length < 4) return

      await closeSession(this.session_code)
        .then(resp => {
          this.session_code = ''
          if (!resp.data.data.ok) {
            this.output = `Closed. ${resp.data.data.reason}`
          } else {
            this.output = `Closed Session: ${this.session_code}`
          }
        })
        .catch(err => console.log(err))
    },
    submitTopic: async function() {
      if (this.session_code.length < 4) return
      if (this.topic.length == 0) return

      await submitTopic(this.session_code, this.topic)
        .then(resp => {
          this.topic = ''
          this.topic_code = resp.data.data.code
          this.output = `Topic Code: ${this.topic_code}`
        })
        .catch(err => console.log(err))
    },
    getAssignedTopic: async function() {
      if (this.topic_code < 4) return

      await getAssignedTopic(this.topic_code)
        .then(resp => {
          if (!resp.data.data.ok) {
            this.output = resp.data.data.reason
          } else {
            this.output = `Topic: ${resp.data.data.topic}`
          }
        })
        .catch(err => console.log(err))
    },
  },

  watch: {}
};
</script>

<style>
html {
  overflow-y: hidden !important;
}
</style>
