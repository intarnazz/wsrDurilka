<script setup>
import { onMounted, ref } from 'vue'

const API_URL = import.meta.env.VITE_API_URL
const text = ref('')
const histori = ref([])

onMounted(() => {})

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
  return await fetch(`${API_URL}api/chat`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token.value}`,
      'Content-Type': 'Application/json'
    },
    body: JSON.stringify({
      chat: histori
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
