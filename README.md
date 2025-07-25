# Bike Night Amazonas: Jornadas Visuais

Bem-vindo ao repositório oficial do projeto **Bike Night Amazonas**. Esta é uma plataforma digital dedicada a celebrar e organizar a comunidade de ciclismo noturno em Manaus, compartilhando histórias, momentos e incentivando a participação em eventos.

## 🚀 Sobre o Projeto

O Bike Night Amazonas é mais do que um grupo de ciclismo; é uma comunidade com mais de 10 anos de história. Este projeto foi criado para:

*   **Contar a História:** Registrar e compartilhar a jornada do grupo de forma rápida e resiliente.
*   **Exibir uma Galeria de Momentos:** Uma galeria de fotos dinâmica que captura a energia e a emoção dos passeios.
*   **Engajar a Comunidade:** Permitir que os participantes deixem comentários e compartilhem suas experiências.
*   **Facilitar a Gestão:** Oferecer um painel administrativo para gerenciar a galeria e os comentários, enquanto o conteúdo principal do site é gerenciado diretamente via Git para maior performance e controle.

## ✨ Funcionalidades Principais

*   **Galeria de Fotos Dinâmica:** As imagens e vídeos são carregados diretamente do Supabase, permitindo atualizações em tempo real sem a necessidade de alterar o código.
*   **Sistema de Comentários com Moderação:** Os usuários podem comentar nas fotos, e os administradores podem aprovar ou rejeitar os comentários através do painel.
*   **Conteúdo do Site Gerenciado via Git:** Para máxima performance e controle, seções de conteúdo como "Nossa História" são gerenciadas por um arquivo JSON dedicado (`src/data/conteudo-historia.json`). As atualizações são feitas diretamente no código e publicadas via `git push`.
*   **Painel Administrativo Seguro:**
    *   Acesso através de uma rota segura e não divulgada (`/recebavasoadmin`).
    *   Autenticação robusta de usuários com Supabase.
    *   Gestão de galeria e comentários.

## 🔄 Como Atualizar o Conteúdo da História

Para garantir velocidade e resiliência, o conteúdo da seção "Nossa História" é gerenciado estaticamente. Para atualizá-lo, siga estes passos:

1.  **Edite o Texto:** Abra o arquivo `src/data/conteudo-historia.json` e modifique os textos conforme necessário.
2.  **Altere a Imagem:** Substitua a imagem em `public/images/74931d0c-9d05-4201-b56c-d99add7af63b.png` pela nova imagem, mantendo o mesmo nome de arquivo.
3.  **Publique:** Faça o commit e o push das suas alterações para o repositório no GitHub. A Vercel fará o deploy automaticamente.

## 🛠️ Tecnologias Utilizadas

*   **Frontend:** React, Vite, TypeScript
*   **Backend & Banco de Dados (Galeria/Comentários):** Supabase
*   **Estilização:** Tailwind CSS & shadcn/ui
*   **Deployment:** Vercel

## ⚙️ Como Começar (Ambiente de Desenvolvimento)

Para executar este projeto localmente, siga os passos abaixo.

### Pré-requisitos

*   Node.js (versão 18 ou superior)
*   npm (ou pnpm/yarn)
*   Uma conta no [Supabase](https://supabase.com/) para criar seu próprio banco de dados.

### Passos

1.  **Clone o Repositório:**
    ```bash
    git clone https://github.com/myselfsldelat/inspire-visual-journeys-70.git
    cd inspire-visual-journeys-70
    ```

2.  **Instale as Dependências:**
    ```bash
    npm install
    ```

3.  **Configure o Supabase:**
    *   Crie um arquivo `.env` na raiz do projeto.
    *   Adicione as chaves da sua instância do Supabase ao arquivo `.env`:
        ```env
        VITE_SUPABASE_URL=URL_DO_SEU_PROJETO_SUPABASE
        VITE_SUPABASE_ANON_KEY=SUA_CHAVE_ANON_SUPABASE
        ```

4.  **Execute as Migrações do Banco de Dados:**
    *   Para garantir que seu banco de dados tenha a estrutura correta para a galeria e comentários, aplique as migrações localizadas na pasta `supabase/migrations` através do Editor SQL no seu painel do Supabase.

5.  **Execute o Servidor de Desenvolvimento:**
    ```bash
    npm run dev
    ```
    O projeto estará disponível em `http://localhost:8080`.

## 📦 Backup do Banco de Dados

Os dados dinâmicos (galeria, comentários, usuários) são um ativo crítico. Para garantir a segurança, realize backups periódicos usando o comando `pg_dump`.

### Comando de Backup

Execute o seguinte comando no seu terminal, substituindo a senha pelo valor correto:

```bash
PGPASSWORD="'SUA_SENHA_AQUI'" pg_dump -h aws-0-us-east-2.pooler.supabase.com -p 6543 -d postgres -U postgres.hfjkmuonmttsjogmsxak > backup_supabase_$(date +%Y%m%d_%H%M%S).sql
```

**Análise do Comando:**
*   `PGPASSWORD="'...'" pg_dump`: Define a senha para a conexão e executa o comando `pg_dump`.
*   `-h aws-0-us-east-2.pooler.supabase.com`: O host do banco de dados.
*   `-p 6543`: A porta de conexão.
*   `-d postgres`: O nome do banco de dados.
*   `-U postgres.hfjkmuonmttsjogmsxak`: O nome de usuário completo para a conexão.
*   `> backup_supabase_... .sql`: Redireciona a saída para um arquivo SQL com um nome único baseado na data e hora atuais.

**Importante:** Após gerar o arquivo de backup, armazene-o em um local seguro e criptografado (ex: um cofre de senhas ou armazenamento em nuvem privado).

## 🌐 Deployment

O projeto está configurado para ser implantado na [Vercel](https://vercel.com/). Qualquer `push` para a branch `main` irá acionar um deploy de produção automaticamente.
