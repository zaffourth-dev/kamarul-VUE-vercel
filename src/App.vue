<script setup>
import { onMounted, ref } from 'vue'
import api, { apiBaseUrl } from './services/api'

const users = ref([])
const isLoading = ref(true)
const errorMessage = ref('')

async function loadUsers() {
  isLoading.value = true
  errorMessage.value = ''

  try {
    const response = await api.get('/api/api/users')
    users.value = Array.isArray(response?.data?.data) ? response.data.data : []

    if (users.value.length === 0 && response?.data?.message) {
      errorMessage.value = response.data.message
    }
  } catch (error) {
    const status = error?.response?.status
    const dataMessage = error?.response?.data?.message

    if (status === 404) {
      errorMessage.value = `Endpoint API tidak ditemukan. Cek URL backend di Vercel: ${apiBaseUrl}`
    } else if (status === 500) {
      errorMessage.value = 'Server API mengalami kesalahan.'
    } else if (dataMessage) {
      errorMessage.value = dataMessage
    } else if (error instanceof Error) {
      errorMessage.value = error.message
    } else {
      errorMessage.value = 'Terjadi kesalahan saat mengambil data.'
    }
  } finally {
    isLoading.value = false
  }
}

onMounted(loadUsers)
</script>

<template>
  <main class="container">
    <h1>Daftar Pengguna</h1>

    <p v-if="isLoading">Memuat data...</p>
    <p v-else-if="errorMessage" class="error">
      Gagal mengambil data: {{ errorMessage }}
    </p>
    <p v-else-if="users.length === 0">Data pengguna tidak ditemukan.</p>

    <ul v-else class="user-list">
      <li v-for="user in users" :key="user.id" class="user-card">
        <h2>{{ user.name }}</h2>
        <p>{{ user.email }}</p>
      </li>
    </ul>
  </main>
</template>

<style>
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  background: #f3f4f6;
  color: #1f2937;
  font-family: Arial, sans-serif;
}

.container {
  width: min(800px, calc(100% - 32px));
  margin: 40px auto;
}

.user-list {
  display: grid;
  gap: 16px;
  padding: 0;
  list-style: none;
}

.user-card {
  padding: 16px;
  border-radius: 8px;
  background: white;
  box-shadow: 0 2px 8px rgb(0 0 0 / 8%);
}

.user-card h2 {
  margin-top: 0;
  text-transform: capitalize;
}

.error {
  color: #b91c1c;
}
</style>