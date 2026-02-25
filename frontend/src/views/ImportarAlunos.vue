<template>
  <div>
    <header class="header">
      <div class="container">
        <div class="header-content">
          <h1>{{ institutionName }}</h1>
          <router-link to="/" class="btn btn-secondary">Voltar</router-link>
        </div>
      </div>
    </header>

    <div class="container">
      <div class="card">
        <h2>Importar Alunos</h2>
        <p style="margin-bottom: 20px; color: #666">
          Envie um arquivo JSON com os dados dos alunos. O formato deve seguir
          o exemplo abaixo:
        </p>

        <div class="form-group">
          <label>Arquivo JSON</label>
          <input
            type="file"
            accept=".json"
            @change="handleFileSelect"
            ref="fileInput"
          />
        </div>

        <div v-if="error" class="alert alert-error">
          <strong>Erro na importação:</strong>
          <ul style="margin-top: 10px; margin-left: 20px">
            <li v-for="(err, index) in errorList" :key="index">
              {{ err.campo }}: {{ err.motivo }}
            </li>
          </ul>
        </div>

        <div v-if="success" class="alert alert-success">
          {{ success }}
        </div>

        <button
          @click="handleImport"
          class="btn btn-primary"
          :disabled="!selectedFile || loading"
        >
          {{ loading ? "Importando..." : "Importar" }}
        </button>

        <div style="margin-top: 30px">
          <h3>Exemplo de formato JSON:</h3>
          <pre class="json-example">{{ jsonExample }}</pre>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";
import api from "../services/api";

export default {
  name: "ImportarAlunos",
  setup() {
    const router = useRouter();
    const authStore = useAuthStore();
    const selectedFile = ref(null);
    const fileInput = ref(null);
    const loading = ref(false);
    const error = ref("");
    const success = ref("");
    const errorList = ref([]);

    const institutionName = authStore.institutionName;

    const jsonExample = JSON.stringify(
      [
        {
          nome: "João Silva",
          cpf: "12345678901",
          dt_nascimento: "1990-01-15",
          curso: "Engenharia de Software",
          dt_conclusao: "2024-12-31",
          webhook_url: "https://exemplo.com/webhook",
        },
        {
          nome: "Maria Santos",
          cpf: "98765432100",
          dt_nascimento: "1992-05-20",
          curso: "Ciência da Computação",
          dt_conclusao: "2024-12-31",
        },
      ],
      null,
      2
    );

    const handleFileSelect = (event) => {
      const file = event.target.files[0];
      if (file) {
        selectedFile.value = file;
        error.value = "";
        success.value = "";
      }
    };

    const handleImport = async () => {
      if (!selectedFile.value) return;

      loading.value = true;
      error.value = "";
      success.value = "";
      errorList.value = [];

      try {
        const fileContent = await selectedFile.value.text();
        const jsonData = JSON.parse(fileContent);

        const response = await api.post("/api/alunos/import", jsonData
        );

        if (response.data.status === "success") {
          success.value = `Importação realizada com sucesso! ${response.data.inseridos} aluno(s) importado(s).`;
          if (response.data.erros && response.data.erros.length > 0) {
            errorList.value = response.data.erros;
            error.value = "Alguns alunos não puderam ser importados.";
          }
          selectedFile.value = null;
          if (fileInput.value) {
            fileInput.value.value = "";
          }
          setTimeout(() => {
            router.push("/");
          }, 2000);
        }
      } catch (err) {
        if (err.response?.data?.erros) {
          errorList.value = err.response.data.erros;
          error.value = "Erro na validação dos dados";
        } else if (err.response?.data?.message) {
          error.value = err.response.data.message;
        } else {
          error.value = "Erro ao importar arquivo. Verifique o formato JSON.";
        }
      } finally {
        loading.value = false;
      }
    };

    return {
      institutionName,
      selectedFile,
      fileInput,
      loading,
      error,
      success,
      errorList,
      jsonExample,
      handleFileSelect,
      handleImport,
    };
  },
};
</script>

<style scoped>
.header {
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 0;
}

.json-example {
  background: #f8f9fa;
  padding: 15px;
  border-radius: 4px;
  overflow-x: auto;
  font-size: 12px;
  border: 1px solid #ddd;
}
</style>
