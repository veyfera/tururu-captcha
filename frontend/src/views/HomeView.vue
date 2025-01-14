<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const msg = ref('')

onMounted(async () => {
  const res = await fetch('/auth/hello', {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('auth')}`,
    },
  })
  if (res.ok) {
    msg.value = await res.text()
  } else {
    router.push('/login')
  }
})
</script>

<template>
  <div class="home">
    <h1>{{ msg }}</h1>
  </div>
</template>

<style>
@media (min-width: 1024px) {
  .home {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
