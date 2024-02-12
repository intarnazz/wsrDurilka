<script setup>
import SectionsHome from "@/components/sections/SectionsHome.vue";
const props = defineProps(['token', 'user'])

</script>

<template>
  <SectionsHome :token="props.token" :user="props.user"/>
</template>

<style scoped></style>
