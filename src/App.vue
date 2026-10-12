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
    const response = await api.get('/api/api/users', { timeout: 10000 })
    if (!Array.isArray(response?.data?.data)) {
      throw new Error('Format data dari API tidak sesuai.')
    }

    users.value = response.data.data
  } catch (error) {
    const status = error?.response?.status
    const dataMessage = error?.response?.data?.message

    if (status === 404) {
      errorMessage.value = `Endpoint API tidak ditemukan. Cek URL backend di Vercel: ${apiBaseUrl}`
    } else if (status === 500) {
      errorMessage.value = 'Server API mengalami kesalahan.'
    } else if (dataMessage) {
      errorMessage.value = dataMessage
    } else if (error?.code === 'ECONNABORTED' || error?.code === 'ETIMEDOUT') {
      errorMessage.value = 'Koneksi ke server terlalu lama. Periksa server API lalu coba lagi.'
    } else if (error?.request) {
      errorMessage.value = `Tidak dapat terhubung ke API (${apiBaseUrl}). Periksa koneksi atau konfigurasi CORS server.`
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

    <p v-if="isLoading" role="status" aria-live="polite">Memuat data...</p>
    <div v-else-if="errorMessage" class="error" role="alert">
      <p>Gagal mengambil data: {{ errorMessage }}</p>
      <button type="button" @click="loadUsers">Coba lagi</button>
    </div>
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