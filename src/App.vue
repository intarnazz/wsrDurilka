<script setup>
import { onMounted, ref } from 'vue'

const API_URL = import.meta.env.VITE_API_URL
const popapIsOpen = ref(false)
const flash = ref('')
const login = ref('')
const password = ref('')
const token = ref('')
const user = ref('')

onMounted(async () => {
  token.value = JSON.parse(localStorage.getItem('token')).token
  user.value = await loginbyToken()
})

function PopapDisplay() {
  popapIsOpen.value ? (popapIsOpen.value = false) : (popapIsOpen.value = true)
}

function setToken(res) {
  if (res.token) {
    localStorage.setItem(
      'token',
      JSON.stringify({
        token: res.token
      })
    )
  } else {
    flash.value = res.message
  }
}

async function logining() {
  return await fetch(`${API_URL}api/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'Application/json'
    },
    body: JSON.stringify({
      login: login.value,
      password: password.value
    })
  })
    .then((response) => response.json())
    .then((json) => {
      return json
    })
    .catch((e) => {
      console.log(e)
    })
}

async function loginbyToken() {
  return await fetch(`${API_URL}api/loginToken`, {
    method: 'POST',
    headers: {
      // 'Content-Type': 'Application/json',
      Authorization: `Bearer ${token.value}`
    }
  })
    .then((response) => response.json())
    .then((json) => {
      console.log(json);
      if (json.message) {
        return null
      }
      return json
    })
    .catch((e) => {
      console.log(e)
    })
}

async function Registation() {
  return await fetch(`${API_URL}api/reg`, {
    method: 'POST',
    headers: {
      'Content-Type': 'Application/json'
    },
    body: JSON.stringify({
      login: login.value,
      password: password.value
    })
  })
    .then((response) => response.json())
    .then((json) => {
      console.log('login: ', json);
      return json
    })
    .catch((e) => {
      console.log(e)
    })
}

async function registarionEvent() {
  const res = await Registation()
  setToken(res)
}

async function loginSubmit() {
  const res = await logining()
  setToken(res)
}
</script>

<template>
  <div class="popap" :class="{ displayNone: !popapIsOpen }">
    <button @click="PopapDisplay" class="popap__exit button">X</button>
    <form class="popap__form" @submit.prevent="loginSubmit">
      <div class="boxX">
        <label for="login">Логин: </label
        ><input v-model="login" name="login" id="login" type="text" autocomplete="username" />
      </div>
      <div class="boxX">
        <label for="password">Пароль: </label
        ><input
          v-model="password"
          name="password"
          id="password"
          type="password"
          autocomplete="current-password"
        />
      </div>
      <div class="box err">
        {{ flash }}
      </div>
      <div class="boxX">
        <input class="button" value="Войти" type="submit" />
        <button @click="registarionEvent" class="button flex1">Зарегистрироваться</button>
      </div>
    </form>
  </div>
  <header class="boxY">
    <div class="boxY">
      <h2>Дурилка</h2>
      <button v-if="!user" @click="PopapDisplay" class="button">войти</button>
      <div v-else class="">
        <p>Пользователь: {{ user.login }}</p>
      </div>
    </div>
    <ul v-if="user" class="flex1 boxY">
      <li class="boxX">
        <button class="flex1 borderGray">создать новый чат</button>
      </li>
    </ul>
  </header>
  <RouterView :token="token" :user="user"/>
</template>

<style scoped></style>
