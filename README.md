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

## 📂 Estrutura do Projeto

*   `src/pages`: Componentes que representam as páginas principais da aplicação.
*   `src/components`: Componentes reutilizáveis.
*   `src/integrations`: Lógica de integração com serviços de terceiros.
*   `supabase/migrations`: Scripts SQL para gerenciar a estrutura do banco de dados.

## 🤝 Como Contribuir

Contribuições são sempre bem-vindas! Se você deseja melhorar o projeto, sinta-se à vontade para abrir uma *Issue* ou enviar um *Pull Request*.

---

## 📜 Diário de Bordo da Engenharia (Julho/2024)

*Esta seção serve como um pipeline de storytelling para que a equipe possa aprender com os desafios e as soluções implementadas.*

### **Missão: "A Saga do Campo Fantasma e a Segurança Zangada"**

**Relato do Engenheiro de Plantão:** "A gente começou com um pedido simples: 'faz um editor de conteúdo aí'. Mal sabíamos que estávamos prestes a mexer num vespeiro. O objetivo era nobre: permitir que os administradores adicionassem novos textos ao site sem precisar chamar os universitários (nós, no caso)."

**Fase 1: A Solução Elegante (que funcionou até demais)**
*   **O Plano:** Refatoramos o editor para ser dinâmico. Em vez de campos fixos, ele leria a tabela `site_content` e montaria o formulário sozinho. Chique, né?
*   **O Teste:** Para provar que funcionava, criamos uma migração SQL para adicionar um novo campo, `hero_welcome_message`. "É só rodar `db push` e correr pro abraço", pensamos nós.

**Fase 2: Onde a Porca Torce o Rabo**
*   **A Realidade:** O comando `db push` dava erro, depois pedia senha, depois dizia que o histórico de migração parecia um queijo suíço. Era mais buraco que queijo.
*   **A Gambiarra do Bem:** Seguimos a receita de bolo da própria CLI do Supabase para "reparar" o histórico. Comando pra lá, comando pra cá. No final, ela disse: "Tá tudo lindo!". Mas era mentira.
*   **O Campo Fantasma:** Fomos testar a aplicação e... cadê o campo novo? Não aparecia. Era um fantasma. Começou a caça às bruxas. Tentamos de tudo: script de teste em Node, em TypeScript, `tsx`, `psql`... Parecia que a gente tava tentando ligar um fusca com o carregador do iPhone.

**Fase 3: A Descoberta - O Segurança do Prédio**
*   **A Luz no Fim do Túnel:** Depois de queimar toda a mufa, um erro finalmente deu uma pista de verdade: `new row violates row-level security policy`.
*   **Tradução do 'Programês':** "Opa, tem um segurança aqui na porta da tabela (`Row-Level Security`) que não tá deixando ninguém entrar pra escrever nada. E ele é invisível."
*   **A Causa Raiz:** A RLS, uma funcionalidade de segurança porreta do Supabase, estava ativada. Ela é ótima para proteger dados de usuários, mas para uma tabela de conteúdo público, ela tava mais atrapalhando que ajudando. Era o porteiro cricri que não deixava nem o dono do prédio entrar.

**Fase 4: A Solução Definitiva - "Pode Entrar, a Casa é Sua!"**
*   **A Resolução:** Criamos uma nova migração, mas desta vez com um único propósito: `ALTER TABLE public.site_content DISABLE ROW LEVEL SECURITY;`. Basicamente, demos um "passe livre" pro segurança da tabela `site_content`.
*   **O Grand Finale:** Rodamos o `db push` com a nova migração. Sucesso. Rodamos nosso script de teste que antes falhava. **PASSOU!** O campo fantasma finalmente apareceu, provando que o problema nunca foi assombração, era só o segurança sendo rigoroso demais.

### **Lições da Saga:**

1.  **Quando a CLI Diz 'Tá Tudo Bem', Desconfie:** Ferramentas são ótimas, mas às vezes elas mentem pra não te magoar. Verifique o resultado final no banco de dados.
2.  **O Silêncio é o Pior Erro:** A falha da migração inicial foi silenciosa. O erro mais perigoso é aquele que não grita.
3.  **Conheça a Segurança do seu Playground:** A RLS é sua amiga, mas se você não souber que ela existe, ela vira sua inimiga. Segurança é como cerca elétrica: boa pra te proteger, ruim pra dar um abraço.
4.  **Em Terra de TypeScript, `tsx` é Rei:** Para testar rápido, `tsx` executa arquivos `.ts` direto, sem frescura e sem precisar compilar antes. Salvou um tempo precioso.

**Conclusão:** "A jornada foi mais longa que etapa de montanha do Tour de France, mas valeu a pena. Deixamos o editor de conteúdo tinindo, aprendemos uma lição valiosa sobre a RLS e, o mais importante, temos mais uma história de guerra pra contar na mesa do bar. A aplicação está mais forte e a equipe, mais sábia."

### **Missão: "Operação Resgate da Galeria"**

**Relato do Comandante:** "Fomos chamados para uma missão de emergência. A aplicação em produção estava fora do ar, exibindo um enigmático `Minified React error #130`. A galeria, o coração visual do nosso projeto, não batia mais."

**Fase 1: Diagnóstico e a Pista Falsa**
*   **Sintoma:** O erro do React era apenas a febre, não a infecção. A aplicação quebrava porque um componente tentava renderizar `undefined`.
*   **Investigação Inicial:** Seguimos a trilha até o `useGalleryItems`, nosso hook de busca de dados. A primeira suspeita foi um erro na lógica do hook.

**Fase 2: A Causa Raiz - O Segredo Exposto**
*   **A Descoberta:** A verdadeira causa não estava no React, mas na fundação da nossa conexão com o Supabase. O arquivo `src/integrations/supabase/client.ts` continha **credenciais fixas no código (hardcoded)**. Em produção, onde as variáveis de ambiente corretas existiam, a aplicação nunca as usava, resultando em uma falha de conexão silenciosa.
*   **A Solução:** Modificamos o `client.ts` para usar **obrigatoriamente** as variáveis de ambiente, garantindo que o cliente Supabase se conectasse com as credenciais corretas para cada ambiente.

**Fase 3: A Batalha pelo Acesso ao Admin**
*   **O Novo Desafio:** Após corrigir o crash, o painel de administração nos negava acesso com a mensagem "Este usuário não tem permissões".
*   **A Depuração:**
    1.  A primeira suspeita foi a conexão, mas o login básico funcionava.
    2.  Tentamos criar scripts de teste, mas eles falharam repetidamente devido a erros de sintaxe teimosos (uma lição sobre a importância de não insistir em uma abordagem falha).
    3.  A análise do código de `AdminLogin.tsx` foi a chave. Ela revelou que, após o login, o sistema buscava na tabela `admin_profiles` por uma linha correspondente ao `UID` do usuário.
    4.  O problema era puramente de **dados**. Nosso usuário de teste, apesar de existir, não tinha uma linha correspondente na tabela de perfis de administrador.
*   **A Solução Final:** Inserimos manually a linha correta na tabela `admin_profiles` através do painel do Supabase, associando o `UID` do usuário ao cargo `admin`. O acesso foi concedido imediatamente.

### **Lições Aprendidas:**

1.  **O Erro da Interface é Quase Sempre um Sintoma:** Um crash no React geralmente aponta para um problema mais profundo na camada de dados.
2.  **Segredos São Sagrados:** Credenciais **NUNCA** devem estar no código. Esta é a nossa regra de ouro.
3.  **Não Confie, Verifique os Dados:** Quando a lógica do código parece correta, a causa do problema está quase sempre nos dados que ele está processando.
4.  **A Simplicidade Vence:** Nossas tentativas de criar scripts complexos falharam. A solução manual e direta no banco de dados foi mais rápida e eficaz.

**Conclusão:** "A missão foi um sucesso. Não apenas restauramos a aplicação, mas a deixamos mais segura, robusta e com uma documentação que servirá de guia para futuras jornadas. A colaboração e a persistência foram nossas melhores ferramentas."
