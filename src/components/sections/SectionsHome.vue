<script setup>
import { onMounted, ref } from 'vue'

const API_URL = import.meta.env.VITE_API_URL
const props = defineProps(['token', 'user'])
const text = ref('')
const histori = ref([])

onMounted(async () => {
  histori.value = await GetChatHistori()
})

async function Postmessage() {
  const message = text.value.trim()
  text.value = ''
  return await fetch(`${API_URL}api/message`, {
    method: 'POST',
    headers: {
      'Content-Type': 'Application/json'
    },
    body: JSON.stringify({
      instances: [
        {
          contexts: [[message]]
        }
      ]
    })
  })
    .then((response) => response.json())
    .then((json) => {
      histori.value.push({
        contexts: [message],
        request: []
      })
      return json.responses
    })
    .catch((e) => {
      console.log(e)
    })
}

async function saveChatHistori() {
  console.log(histori.value[histori.value.length - 1].contexts[0])
  console.log(histori.value[histori.value.length - 1].request[0])
  return await fetch(`${API_URL}api/chatSet`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${props.token}`,
      'Content-Type': 'Application/json'
    },
    body: JSON.stringify({
      contextsStr: histori.value[histori.value.length - 1].contexts[0],
      requestStr: histori.value[histori.value.length - 1].request[0]
    })
  })
    .then((response) => response.json())
    .then((json) => {
      console.log(json)
      return json
    })
    .catch((e) => {
      console.log(e)
    })
}

async function GetChatHistori() {
  return await fetch(`${API_URL}api/chatGet`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${props.token}`,
      'Content-Type': 'Application/json'
    },
    body: JSON.stringify({
      chatNum: 1
    })
  })
    .then((response) => response.json())
    .then((json) => {
      console.log(json)
      return json
    })
    .catch((e) => {
      console.log(e)
    })
}

async function messageSubmit() {
  const request = await Postmessage()
  histori.value[histori.value.length - 1].request.push(request.slice(2, request.length - 2))

  await saveChatHistori()
}
</script>

<template>
  <main class="boxY">
    <div class="">
      <ul v-for="(value, key) in histori" :key="key" class="">
        <li>
          <p>{{ value.contexts[0] }}</p>
          <p>{{ value.request[0] }}</p>
        </li>
      </ul>
    </div>
    <form @submit.prevent="messageSubmit" class="" action="">
      <input v-model="text" placeholder="Введите сообщение..." class="flex1" type="text" />
      <input class="button" type="submit" />
    </form>
  </main>
</template>

<style scoped></style>
