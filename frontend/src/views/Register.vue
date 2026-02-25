<template>
  <div class="register-container">
    <div class="register-card">
      <h1>Cadastro de Instituição</h1>
      <form @submit.prevent="handleRegister">
        <div class="form-group">
          <label>Nome da Instituição</label>
          <input
            v-model="name"
            type="text"
            required
            placeholder="Nome da sua instituição"
          />
        </div>
        <div class="form-group">
          <label>E-mail</label>
          <input
            v-model="email"
            type="email"
            required
            placeholder="seu@email.com"
          />
        </div>
        <div class="form-group">
          <label>Senha</label>
          <input
            v-model="password"
            type="password"
            required
            placeholder="Mínimo 6 caracteres"
            minlength="6"
          />
        </div>
        <div v-if="error" class="alert alert-error">{{ error }}</div>
        <button type="submit" class="btn btn-primary" :disabled="loading">
          {{ loading ? "Cadastrando..." : "Cadastrar" }}
        </button>
        <p class="login-link">
          Já tem conta?
          <router-link to="/login">Faça login</router-link>
        </p>
      </form>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";

export default {
  name: "Register",
  setup() {
    const router = useRouter();
    const authStore = useAuthStore();
    const name = ref("");
    const email = ref("");
    const password = ref("");
    const error = ref("");
    const loading = ref(false);

    const handleRegister = async () => {
      error.value = "";
      loading.value = true;

      const result = await authStore.register(
        name.value,
        email.value,
        password.value
      );

      if (result.success) {
        router.push("/");
      } else {
        error.value = result.message;
      }

      loading.value = false;
    };

    return {
      name,
      email,
      password,
      error,
      loading,
      handleRegister,
    };
  },
};
</script>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.register-card {
  background: white;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

.register-card h1 {
  margin-bottom: 30px;
  text-align: center;
  color: #333;
}

.login-link {
  text-align: center;
  margin-top: 20px;
  color: #666;
}

.login-link a {
  color: #007bff;
  text-decoration: none;
}

.login-link a:hover {
  text-decoration: underline;
}
</style>
