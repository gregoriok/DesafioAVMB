<template>
  <div>
    <header class="header">
      <div class="container">
        <div class="header-content">
          <h1>{{ institutionName }}</h1>
          <button @click="handleLogout" class="btn btn-secondary">
            Sair
          </button>
        </div>
      </div>
    </header>

    <div class="container">
      <div class="dashboard-header">
        <h2>Alunos</h2>
        <router-link to="/alunos/importar" class="btn btn-primary">
          Importar Alunos
        </router-link>
      </div>

      <div v-if="loading" class="card">
        <p>Carregando...</p>
      </div>

      <div v-else-if="students.length === 0" class="card">
        <p>Nenhum aluno cadastrado ainda.</p>
        <router-link to="/alunos/importar" class="btn btn-primary">
          Importar Alunos
        </router-link>
      </div>

      <div v-else class="card">
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>CPF</th>
              <th>Curso</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="student in students" :key="student.id">
              <td>{{ student.nome }}</td>
              <td>{{ formatCPF(student.cpf) }}</td>
              <td>{{ student.curso_nome || "-" }}</td>
              <td>
                <span :class="getStatusBadgeClass(student.status)">
                  {{ getStatusLabel(student.status) }}
                </span>
              </td>
              <td>
                <router-link
                  :to="`/alunos/${student.id}`"
                  class="btn btn-secondary"
                  style="margin-right: 5px; padding: 5px 10px; font-size: 12px"
                >
                  Ver
                </router-link>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";
import api from "../services/api";

export default {
  name: "Dashboard",
  setup() {
    const router = useRouter();
    const authStore = useAuthStore();
    const students = ref([]);
    const loading = ref(true);

    const institutionName = authStore.institutionName;

    const loadStudents = async () => {
      try {
        const response = await api.get("/api/alunos/listar");
        students.value = response.data;
      } catch (error) {
        console.error("Erro ao carregar alunos:", error);
      } finally {
        loading.value = false;
      }
    };

    const handleLogout = () => {
      authStore.logout();
      router.push("/login");
    };

    const formatCPF = (cpf) => {
      if (!cpf) return "";
      return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
    };

    const getStatusLabel = (status) => {
      const labels = {
        importado: "Importado",
        certificado_gerado: "Certificado Gerado",
        cancelado: "Cancelado",
      };
      return labels[status] || status;
    };

    const getStatusBadgeClass = (status) => {
      const classes = {
        importado: "badge badge-info",
        certificado_gerado: "badge badge-success",
        cancelado: "badge badge-danger",
      };
      return classes[status] || "badge";
    };

    onMounted(() => {
      loadStudents();
    });

    return {
      institutionName,
      students,
      loading,
      handleLogout,
      formatCPF,
      getStatusLabel,
      getStatusBadgeClass,
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

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.dashboard-header h2 {
  margin: 0;
}
</style>
