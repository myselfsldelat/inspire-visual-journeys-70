# Guia de Onboarding para Desenvolvedores - Bike Night Amazonas

Bem-vindo(a) à equipe! Este guia irá ajudá-lo(a) a configurar seu ambiente de desenvolvimento para contribuir com o projeto.

## 1. Visão Geral da Stack

- **Frontend:** React com Vite (TypeScript)
- **Backend & Banco de Dados:** Supabase
- **Hospedagem:** Vercel
- **Versionamento:** Git & GitHub

## 2. Configurando o Ambiente Local

### Passo 1: Clone o Repositório
Clone o projeto do GitHub para a sua máquina local.

```bash
git clone <URL_DO_REPOSITÓRIO>
cd <NOME_DO_REPOSITÓRIO>
```

### Passo 2: Instale as Dependências
Este projeto usa `npm`. Instale todas as dependências necessárias:

```bash
npm install
```

## 3. Conectando ao Supabase (CLI)

Para interagir com o banco de dados (criar migrações, etc.), usamos a CLI do Supabase. Você precisará de três credenciais principais. **NUNCA comite esses valores no Git.**

### Credenciais Necessárias:

1.  **Project ID:** O identificador único do nosso projeto no Supabase.
    -   `SUPABASE_PROJECT_ID`: `hfjkmuonmttsjogmsxak`

2.  **Senha do Banco de Dados:** A senha de acesso direto ao banco de dados.
    -   **Como obter:** Peça ao administrador do projeto (ou ao seu gerente) para compartilhar a senha através de um gerenciador de senhas seguro (como 1Password, Bitwarden, etc.).

3.  **Token de Acesso Pessoal:** Um token que permite que a CLI se autentique com sua conta Supabase.
    -   **Como obter:**
        1.  Acesse [app.supabase.com/account/tokens](https://app.supabase.com/account/tokens).
        2.  Clique em "Generate New Token".
        3.  Dê um nome descritivo (ex: `dev-seu-nome`).
        4.  Gere e copie o token.

### Passo 4: Testando a Conexão

Após obter as credenciais, você pode testar a conexão listando o status das migrações. Substitua `SUA_SENHA` e `SEU_TOKEN` pelos valores que você obteve.

```bash
# Vincule a CLI ao projeto (só precisa fazer uma vez)
SUPABASE_ACCESS_TOKEN=<SEU_TOKEN> npx supabase link --project-ref hfjkmuonmttsjogmsxak

# Verifique o status do banco de dados
DB_PASSWORD=<SUA_SENHA> npx supabase db push
```

## 4. Testando as Alterações

O teste das alterações foi realizado com sucesso. A refatoração do `AdminContentEditor` para carregar campos dinamicamente da tabela `site_content` está funcionando. A migração `20250725120000_add_hero_welcome_message.sql` foi aplicada, e o novo campo "Hero Welcome Message" agora aparece automaticamente no painel de administração, pronto para ser editado.

Qualquer nova migração que adicione uma linha à tabela `site_content` fará com que um novo campo editável apareça no painel.
