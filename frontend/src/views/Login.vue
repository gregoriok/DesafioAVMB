<template>
  <div class="login-container">
    <div class="login-card">
      <h1>Login</h1>
      <form @submit.prevent="handleLogin">
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
            placeholder="Sua senha"
          />
        </div>
        <div v-if="error" class="alert alert-error">{{ error }}</div>
        <button type="submit" class="btn btn-primary" :disabled="loading">
          {{ loading ? "Entrando..." : "Entrar" }}
        </button>
        <p class="register-link">
          Não tem conta?
          <router-link to="/register">Cadastre-se</router-link>
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
  name: "Login",
  setup() {
    const router = useRouter();
    const authStore = useAuthStore();
    const email = ref("");
    const password = ref("");
    const error = ref("");
    const loading = ref(false);

    const handleLogin = async () => {
      error.value = "";
      loading.value = true;

      const result = await authStore.login(email.value, password.value);

      if (result.success) {
        router.push("/");
      } else {
        error.value = result.message;
      }

      loading.value = false;
    };

    return {
      email,
      password,
      error,
      loading,
      handleLogin,
    };
  },
};
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.login-card {
  background: white;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

.login-card h1 {
  margin-bottom: 30px;
  text-align: center;
  color: #333;
}

.register-link {
  text-align: center;
  margin-top: 20px;
  color: #666;
}

.register-link a {
  color: #007bff;
  text-decoration: none;
}

.register-link a:hover {
  text-decoration: underline;
}
</style>
