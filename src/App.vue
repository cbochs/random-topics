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
            v-model="session_code_model"
            :maxlength="max_id_length"
            label="Session code"
            class="mr-2"
          ></v-text-field>
          <v-dialog
            v-model="close_dialog"
            max-width="290"
          >
            <template v-slot:activator="{ on, attrs }">
                <v-btn
                  color="error"
                  v-bind="attrs"
                  v-on="on"
                >Close Session</v-btn>
            </template>
            <v-card>
              <v-card-title>
                Close session {{ session_code }}?
              </v-card-title>
              <v-card-text>Are you sure you want to close this session? Closing will shuffle + assign topics to users who have submitted, preventing any further topic submissions.</v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  color="green darken-1"
                  text
                  @click="close_dialog = false"
                >Keep open</v-btn>
                <v-btn
                  color="red darken-1"
                  text
                  @click="closeSession"
                >Close session</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
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
            @click="submitOrUpdateTopic"
          >{{ submit_topic_btn }}</v-btn>
        </v-container>
        <v-container class="d-flex">
          <v-text-field
            dense
            v-model="topic_code_model"
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
  updateTopic,
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
    close_dialog: false,
  }),

  computed: {
    session_code_model: {
      get: function() { return this.session_code },
      set: function(code) { this.session_code = code.toUpperCase() }
    },
    topic_code_model: {
      get: function() { return this.topic_code },
      set: function(code) { this.topic_code = code.toUpperCase() }
    },
    submit_topic_btn: function() {
      if (this.topic_code.length > 0) {
        return 'Update Topic'
      } else {
        return 'Submit Topic'
      }
    }
  },

  methods: {
    openSession: async function() {
      await openSession()
        .then(resp => {
          this.topic_code = ''
          this.session_code = resp.data.data.code
          this.output = `Session Code: ${this.session_code}`
        })
        .catch(err => console.log(err))
    },
    closeSession: async function() {
      this.close_dialog = false

      if (this.session_code.length < 4) return

      await closeSession(this.session_code)
        .then(resp => {
          if (!resp.data.data.ok) {
            this.output = `Closed. ${resp.data.data.reason}`
          } else {
            this.output = `Closed Session: ${this.session_code}`
          }
          this.session_code = ''
        })
        .catch(err => console.log(err))
    },
    submitOrUpdateTopic: function() {
      if (this.topic_code.length > 0) {
        this.updateTopic()
      } else {
        this.submitTopic()
      }
    },
    submitTopic: async function() {
      if (this.session_code.length < 4) return
      if (this.topic.length == 0) return

      await submitTopic(this.session_code, this.topic)
        .then(resp => {
          if (!resp.data.data.ok) {
            this.output = `Could not submit topic. ${resp.data.data.reason}`
          } else {
            this.topic = ''
            this.topic_code = resp.data.data.code
            this.output = `Topic Code: ${this.topic_code}`
          }
        })
        .catch(err => console.log(err))
    },
    updateTopic: async function() {
      if (this.topic_code.length < 4) return
      if (this.topic.length == 0) return

      await updateTopic(this.topic_code, this.topic)
        .then(resp => {
          if (!resp.data.data.ok) {
            this.output = resp.data.data.reason
          } else {
            this.topic = ''
            this.topic_code = resp.data.data.code
            this.output = `Topic Updated: ${this.topic_code}`
          }
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
