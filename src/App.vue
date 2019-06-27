<template>
  <div id="app">
    <div class="logo col jc ac">
      <img
        class="logo__image"
        alt="Logo"
        width="200px"
        src="./assets/logo.png"
      />
      <h1>Mande sua pergunta!</h1>
    </div>
    <div class="comments col">
      <div class="comments__area" ref="comments">
        <transition-group name="list">
          <div
            class="comments__box row ac"
            v-for="{ message, date } in getComments"
            :key="date"
          >
            <i
              class="fas fa-lg fa-user"
              :class="['red', 'blue', 'yellow', 'green'][date % 4]"
              style="margin-right: 10px;"
            ></i>
            <p>{{ message }}</p>
          </div>
        </transition-group>
      </div>
      <div class="spacer"></div>
      <form class="col" ref="form" @submit.prevent="sendComment">
        <input
          v-model="message"
          :disabled="loading"
          placeholder="Envie uma mensagem!"
        />
      </form>
    </div>
  </div>
</template>

<script>
import gql from 'graphql-tag'

export default {
  name: 'app',
  data() {
    return {
      loading: false,
      getComments: [],
      message: ''
    }
  },
  methods: {
    scrollBottom() {
      this.$refs.comments.scrollTop = this.$refs.comments.scrollHeight
    },
    sendComment() {
      if (this.message) {
        this.loading = true
        this.$apollo
          .mutate({
            mutation: gql`
              mutation addComment($message: String!) {
                addComment(message: $message)
              }
            `,
            variables: {
              message: this.message
            }
          })
          .finally(() => {
            this.message = ''
            this.loading = false
          })
      }
    }
  },
  apollo: {
    getComments: {
      query: gql`
        {
          getComments {
            message
            date
          }
        }
      `,
      fetchPolicy: 'no-cache',
      result(val) {
        this.$nextTick(this.scrollBottom)
      },
      subscribeToMore: {
        document: gql`
          subscription commentAdded {
            commentAdded {
              message
              date
            }
          }
        `,
        updateQuery(
          previousResult,
          {
            subscriptionData: {
              data: { commentAdded }
            }
          }
        ) {
          this.getComments.push(commentAdded)
          if (this.getComments.length >= 10) this.getComments.splice(0, 1)
          this.$nextTick(this.scrollBottom)
        }
      }
    }
  }
}
</script>

<style lang="stylus">
@import url('https://fonts.googleapis.com/css?family=Ubuntu')

#app
  font-family 'Ubuntu', sans-serif
  -webkit-font-smoothing antialiased
  -moz-osx-font-smoothing grayscale
  height 96vh
  display grid
  grid-gap 5px
  text-align center
  grid-template-areas 'logo comments' 'logo comments'
  grid-template-columns 3fr 3fr
  grid-template-rows 50% 50%

  @media (max-width: 800px)
    grid-template-areas 'logo logo' 'comments comments'

input
  font-family 'Ubuntu', sans-serif
  font-size 15px
  border-radius 10px
  outline none
  border 2px solid rgba(#e45c98, 0.4)
  margin 5px
  background rgba(238, 238, 238, 0.4)
  transition all 0.5s
  padding 15px

input:focus
  background rgb(238, 238, 238)
input:hover
  background rgba(238, 238, 238, 0.8)

.spacer
  flex-grow 1

.red
  color #363b74

.yellow
  color #673888

.blue
  color #ef4f91

.green
  color #c79dd7

.logo
  grid-area logo
  color #e45c98
  border-radius 10px

  &__image
    border-radius 10px

.comments
  grid-area comments

  &__area
    overflow-y auto
    overflow-x hidden

  &__box
    text-align left
    max-width 400px
    word-wrap break-word
    text-align justify
    padding 10px
    border-bottom 2px solid #FFFFFF

.list-enter-active
  transition all 0.8s

.list-leave-active
  transition all ease 0.5s

.list-enter, .list-leave-to /* .list-leave-active em versões anteriores a 2.1.8 */
  opacity 0
  transform translateX(300px)

.row
  display -webkit-flex
  display flex
  flex-direction row

.col
  display -webkit-flex
  display flex
  flex-direction column

.jc
  justify-content center

.js
  justify-content flex-start

.je
  justify-content flex-end

.ac
  align-items center

.as
  align-items flex-start

.ae
  align-items flex-end
</style>
