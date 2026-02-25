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
      <div v-if="loading" class="card">
        <p>Carregando...</p>
      </div>

      <div v-else-if="error" class="card">
        <div class="alert alert-error">{{ error }}</div>
      </div>

      <div v-else-if="student" class="card">
        <h2>Detalhes do Aluno</h2>

        <div class="student-info">
          <div class="info-row">
            <strong>Nome:</strong>
            <span>{{ student.nome }}</span>
          </div>
          <div class="info-row">
            <strong>CPF:</strong>
            <span>{{ formatCPF(student.cpf) }}</span>
          </div>
          <div class="info-row" v-if="student.dt_nascimento">
            <strong>Data de Nascimento:</strong>
            <span>{{ formatDate(student.dt_nascimento) }}</span>
          </div>
          <div class="info-row">
            <strong>Curso:</strong>
            <span>{{ student.curso.nome || "-" }}</span>
          </div>
          <div class="info-row">
            <strong>Código do curso:</strong>
            <span>{{ student.curso.codigo || "-" }}</span>
          </div>
          <div class="info-row" v-if="student.dt_conclusao">
            <strong>Data de Conclusão:</strong>
            <span>{{ formatDate(student.dt_conclusao) }}</span>
          </div>
          <div class="info-row">
            <strong>Status:</strong>
            <span :class="getStatusBadgeClass(student.status)">
              {{ getStatusLabel(student.status) }}
            </span>
          </div>
          <div class="info-row" v-if="student.hash">
            <strong>Hash:</strong>
            <span style="font-family: monospace; font-size: 12px">{{
              student.hash
            }}</span>
          </div>
        </div>

        <div class="actions">
          <button
            @click="showEditForm = true"
            class="btn btn-secondary"
            v-if="!showEditForm"
          >
            Editar
          </button>
          <button
            @click="handleGenerateCertificate(student.hash)"
            class="btn btn-success"
            :disabled="generating"
          >
            {{ generating ? "Gerando..." : "Gerar Certificado" }}
          </button>
          <button @click="handleCancel" class="btn btn-danger">
            Cancelar
          </button>
        </div>

        <div v-if="showEditForm" class="edit-form">
          <h3>Editar Aluno</h3>
          <div class="form-group">
            <label>Nome</label>
            <input v-model="editForm.nome" type="text" />
          </div>
          <div class="form-group">
            <label>Data de Nascimento</label>
            <input v-model="editForm.dt_nascimento" type="date" />
          </div>
          <div class="form-group">
            <label>Webhook URL (opcional)</label>
            <input v-model="editForm.webhook_url" type="url" />
          </div>
          <div class="form-actions">
            <button @click="handleSave" class="btn btn-primary" :disabled="saving">
              {{ saving ? "Salvando..." : "Salvar" }}
            </button>
            <button @click="showEditForm = false" class="btn btn-secondary">
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";
import api, { sendWebhook } from "../services/api";

export default {
  name: "DetalhesAluno",
  setup() {
    const route = useRoute();
    const router = useRouter();
    const authStore = useAuthStore();
    const student = ref(null);
    const loading = ref(true);
    const error = ref("");
    const showEditForm = ref(false);
    const saving = ref(false);
    const generating = ref(false);
    const editForm = ref({});

    const institutionName = authStore.institutionName;

    const loadStudent = async () => {
      try {
        const response = await api.get(`/api/alunos/listar/${route.params.id}`);
        student.value = response.data;
        editForm.value = {
          nome: response.data.nome,
          dt_nascimento: response.data.dt_nascimento || "",
          webhook_url: response.data.webhook_url || "",
        };
      } catch (err) {
        error.value =
          err.response?.data?.message || "Erro ao carregar aluno";
      } finally {
        loading.value = false;
      }
    };

    const handleSave = async () => {
      saving.value = true;
      try {
        await api.put(`/api/alunos/${route.params.id}`, editForm.value);
        await loadStudent();
        
        // Enviar webhook se URL estiver configurada
        if (editForm.value.webhook_url && student.value) {
          await sendWebhook(editForm.value.webhook_url, {
            nome: student.value.nome,
            cpf: student.value.cpf,
            hash: student.value.hash,
          });
        }
        
        showEditForm.value = false;
      } catch (err) {
        error.value =
          err.response?.data?.message || "Erro ao salvar alterações";
      } finally {
        saving.value = false;
      }
    };

    const handleGenerateCertificate = async (hash) => {
      if (
        !confirm(
          "Tem certeza que deseja gerar o certificado? Esta ação não pode ser desfeita."
        )
      ) {
        return;
      }

      generating.value = true;
      try {
        const response = await api.get(
          `/validar/${hash}/download`,
          { responseType: 'blob' }
        );
        
        // Criar um blob URL e disparar o download do arquivo XML
        const blob = response.data;
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `certificado_${hash}.xml`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        
        alert('Certificado XML baixado com sucesso!');
        await loadStudent();
      } catch (err) {
        error.value =
          err.response?.data?.message || "Erro ao gerar certificado";
      } finally {
        generating.value = false;
      }
    };

    const handleCancel = async () => {
      if (
        !confirm(
          "Tem certeza que deseja cancelar este aluno? Esta ação não pode ser desfeita."
        )
      ) {
        return;
      }

      try {
        await api.delete(`/api/alunos/${route.params.id}`);
        alert("Aluno cancelado com sucesso");
        router.push("/");
      } catch (err) {
        error.value =
          err.response?.data?.message || "Erro ao cancelar aluno";
      }
    };

    const formatCPF = (cpf) => {
      if (!cpf) return "";
      return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
    };

    const formatDate = (date) => {
      if (!date) return "";
      return new Date(date).toLocaleDateString("pt-BR");
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
      loadStudent();
    });

    return {
      institutionName,
      student,
      loading,
      error,
      showEditForm,
      editForm,
      saving,
      generating,
      handleSave,
      handleGenerateCertificate,
      handleCancel,
      formatCPF,
      formatDate,
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

.student-info {
  margin-bottom: 30px;
}

.info-row {
  display: flex;
  padding: 10px 0;
  border-bottom: 1px solid #eee;
}

.info-row strong {
  width: 200px;
  color: #666;
}

.actions {
  margin-top: 30px;
  display: flex;
  gap: 10px;
}

.edit-form {
  margin-top: 30px;
  padding-top: 30px;
  border-top: 2px solid #eee;
}

.form-actions {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}

.certificate-info {
  margin-top: 30px;
  padding-top: 30px;
  border-top: 2px solid #eee;
}
</style>
