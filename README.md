# Bike Night Amazonas: Jornadas Visuais

Bem-vindo ao repositório oficial do projeto **Bike Night Amazonas**. Esta é uma plataforma digital dedicada a celebrar e organizar a comunidade de ciclismo noturno em Manaus, compartilhando histórias, momentos e incentivando a participação em eventos.

## 🚀 Sobre o Projeto

O Bike Night Amazonas é mais do que um grupo de ciclismo; é uma comunidade com mais de 10 anos de história. Este projeto foi criado para:

*   **Contar a História:** Registrar e compartilhar a jornada do grupo, desde seu início humilde em 2013.
*   **Exibir uma Galeria de Momentos:** Uma galeria de fotos dinâmica que captura a energia e a emoção dos passeios.
*   **Engajar a Comunidade:** Permitir que os participantes deixem comentários, compartilhem suas experiências e se conectem.
*   **Facilitar a Gestão:** Oferecer um painel administrativo robusto para gerenciar todo o conteúdo do site, desde as fotos da galeria até os comentários dos usuários.

## ✨ Funcionalidades Principais

*   **Galeria de Fotos Dinâmica:** As imagens e vídeos são carregados diretamente do Supabase, permitindo atualizações em tempo real sem a necessidade de alterar o código.
*   **Sistema de Comentários com Moderação:** Os usuários podem comentar nas fotos, e os administradores podem aprovar ou rejeitar os comentários através do painel.
*   **Conteúdo do Site Editável:** Seções como "Nossa História" podem ser editadas diretamente pelo painel de administração.
*   **Painel Administrativo Seguro:**
    *   Acesso através de uma rota segura e não divulgada (`/recebavasoadmin`).
    *   Autenticação robusta de usuários com Supabase.
    *   Níveis de permissão (Admin e Super Admin).
*   **Gestão Completa:**
    *   **Usuários:** Super administradores podem visualizar e gerenciar os usuários do sistema.
    *   **Estatísticas:** Visualização de dados e métricas de engajamento.
    *   **Auditoria:** Rastreamento de ações importantes realizadas no painel.

## 🛠️ Tecnologias Utilizadas

*   **Frontend:** React, Vite, TypeScript
*   **Backend & Banco de Dados:** Supabase
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
    *   Para garantir que seu banco de dados tenha a estrutura correta, aplique as migrações localizadas na pasta `supabase/migrations` através do Editor SQL no seu painel do Supabase.

5.  **Execute o Servidor de Desenvolvimento:**
    ```bash
    npm run dev
    ```
    O projeto estará disponível em `http://localhost:8080`.

## 🌐 Deployment

O projeto está configurado para ser implantado na [Vercel](https://vercel.com/). Qualquer `push` para a branch `main` irá acionar um deploy de produção automaticamente.

**Importante:** O arquivo `vercel.json` na raiz do projeto garante que o roteamento de um aplicativo de página única (SPA) funcione corretamente, redirecionando todas as solicitações para o `index.html`.

## 📂 Estrutura do Projeto

*   `src/pages`: Componentes que representam as páginas principais da aplicação (ex: `Index.tsx`, `Admin.tsx`).
*   `src/components`: Componentes reutilizáveis (ex: `Button.tsx`, `AdminHeader.tsx`).
*   `src/integrations`: Lógica de integração com serviços de terceiros, como o Supabase.
*   `supabase/migrations`: Scripts SQL para gerenciar a estrutura do banco de dados.

## 🤝 Como Contribuir

Contribuições são sempre bem-vindas! Se você deseja melhorar o projeto, sinta-se à vontade para abrir uma *Issue* ou enviar um *Pull Request*.

## 📜 Histórico de Soluções Notáveis

Esta seção documenta investigações e correções importantes que servem como aprendizado para a equipe.

### Correção: Erro Crítico na Renderização da Galeria (Julho/2024)

*   **Problema:** A aplicação estava falhando em produção com um erro `Minified React error #130`, o que impedia a renderização de qualquer componente que dependesse de dados do Supabase, mais notavelmente a galeria de fotos.

*   **Investigação:**
    1.  A análise inicial apontou que o erro do React era um sintoma, não a causa. Ele ocorria porque o componente da galeria tentava renderizar `undefined`.
    2.  A investigação no código levou ao hook `useGalleryItems`, que por sua vez utilizava um cliente Supabase (`supabaseCustom`) com a verificação de tipos desabilitada (`as any`). Isso mascarava o erro real.
    3.  A causa raiz foi encontrada no arquivo `src/integrations/supabase/client.ts`. O cliente Supabase estava sendo inicializado com chaves de acesso (URL e Anon Key) fixas no código (`hardcoded`). Essas chaves não correspondiam às credenciais corretas configuradas no ambiente de produção da Vercel.

*   **Solução:**
    1.  O arquivo `src/integrations/supabase/client.ts` foi modificado para ler as credenciais do Supabase a partir das variáveis de ambiente (`process.env.VITE_SUPABASE_URL` e `process.env.VITE_SUPABASE_ANON_KEY`), garantindo que a aplicação utilize as chaves corretas para cada ambiente (desenvolvimento e produção).
    2.  Com a inicialização do cliente corrigida, a comunicação com o Supabase foi restabelecida, e o erro de renderização foi resolvido.

*   **Lição Aprendida:** Credenciais e configurações de ambiente **nunca** devem ser fixadas no código-fonte. Devem sempre ser gerenciadas através de variáveis de ambiente para garantir segurança e portabilidade entre diferentes estágios de deploy.
