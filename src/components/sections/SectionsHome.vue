<script setup>
import { onMounted, ref } from 'vue'

const text = ref('')

const histori = ref([])

onMounted(() => {})

async function Postmessage() {
  const message = text.value.trim()
  text.value = ''
  return await fetch('http://wsr/api/message', {
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
      console.log(json)
      console.log(json.responses)
      return json.responses
    })
    .catch((e) => {
      console.log(e)
    })
}

async function messageSubmit() {
  const request = await Postmessage()
  console.log(request)
  console.log(histori.value[histori.value.length - 1])
  histori.value[histori.value.length - 1].request.push(request)
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
