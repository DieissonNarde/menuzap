# Análise: Melhor Forma de Atualizar o Menu Zap

> Análise das opções de modernização do projeto React (5 anos sem manutenção) para uma base tecnológica atual, preservando o código que já funciona.

---

## 1. Bloqueador Crítico Detectado

Ambiente atual vs. requisitos do projeto:

| Item | Atual | Necessário |
|---|---|---|
| Node instalado | **v24** | Node 14-16 (CRA 4) |
| Build tool | CRA 4 (webpack 4) | descontinuado em 2023 |
| Última movimentação | 2021-06-07 | — |

**O projeto não roda nem instala no ambiente atual.** O webpack 4 do CRA 4 quebra no Node 17+ por causa do OpenSSL 3.0 e mudanças no V8. Isso precisa ser resolvido antes de qualquer outra coisa.

Há também `package-lock.json` **e** `yarn.lock` juntos (conflito de lockfiles).

---

## 2. As 3 Rotas Possíveis

|  | A. Mínima | B. Incremental (Vite) ← recomendada | C. Reescrita total |
|---|---|---|---|
| Esforço | Baixo | Médio | Alto |
| Risco | Alto (base EOL) | Médio | Baixo (a longo prazo) |
| Resultado | ainda legado | moderno, preserva código | moderno, código novo |
| Onboarding de novos devs | Difícil | Fácil | Fácil |

### Recomendação: rota B
Migra para Vite + React 18 + MUI v5 + react-router 6 preservando a lógica de negócio que já funciona (CRUD, carrinho, fluxo Parse). Custa menos que reescrever e deixa a base moderna.

- A rota **A** só adia o problema (base descontinuada).
- A rota **C** descarta ~1500 linhas de código funcionando.
- A rota **B** entrega uma base que qualquer dev contratado hoje reconhece.

---

## 3. Dificuldade Real das Migrações

| Pacote | De → Para | Dificuldade | Por quê |
|---|---|---|---|
| **CRA 4** | Vite | Média | Sem config oculta; ajustar `public/index.html`, imports relativos, `process.env`→`import.meta.env` |
| **React 17** | React 18 | Baixa | `ReactDOM.render`→`createRoot`; o `PrivateRoute` e os `useEffect` não quebram |
| **@material-ui/core v4** | **@mui/material v5** | **Alta** | Mudou nome do pacote, usa `emotion` (não styled-components), `makeStyles`→`sx`/`styled`, `ThemeProvider` novo. É a maior frente de trabalho — afeta **todos** os componentes |
| **react-router-dom v5** | **v6** | **Alta** | `<Switch>`→`<Routes>`, `component`→`element`, `useParams` muda, `PrivateRoute` precisa reescrever |
| **parse v3** | v5/v6 | Baixa | API estável, só bump |
| **recharts 2** | 2.x | Baixa | Compatível com React 18 |
| **styled-components 5** | v6 (ou remover) | Média | Decide se mantém (só `Cart/styles.js` usa) ou se converte pra `sx` do MUI e remove a dup |
| **rebass** | remover | Baixa | Não é usado em lugar nenhum — só apagar do `package.json` |
| **next** | remover | Baixa | Resquício sem uso |
| **react-input-mask** | manter ou `mui-tel-input` | Média | Ainda funciona com MUI v5 porém é considerado legado; como há poucos inputs máscara, dá pra manter |
| **polished** | remover | Baixa | Só é usado em `styles.js` do Cart — trocar por cor fixa se remover |

---

## 4. Roadmap Recomendado (faseado, rota B)

### Fase 0 — Preparar (1 dia)
1. Deletar `yarn.lock`, padronizar em `package-lock.json` (ou o contrário, mas só um)
2. Remover `next`, `rebass` do `package.json`
3. Remover pasta morta `src/context/cart/`
4. Mover chaves do Parse para `.env` (`REACT_APP_*` → depois `VITE_*`)

### Fase 1 — Trocar CRA por Vite + subir versões do core (1-2 dias)
5. Instalar Vite: `npm i -D vite @vitejs/plugin-react`
6. Criar `vite.config.js`, mover `public/index.html` para raiz, trocar `%PUBLIC_URL%` por `/`
7. Subir React 17→18 + `createRoot`
8. Mover env vars para `VITE_PARSE_*` e ajustar `environments.js`
9. **Validar: app sobe e CRUD funciona** — checkpoint seguro

### Fase 2 — react-router-dom v5 → v6 (1 dia)
10. Reescrever `routes.js` com `<Routes>`/`<Route element={...}>`
11. Reescrever `PrivateRoute` (v6 não suporta wrapper de `<Route>` como antes — usar `<Outlet>` ou wrapper element)
12. Ajustar `useParams` e `<Link>` onde necessário
13. **Validar: navegação funciona**

### Fase 3 — MUI v4 → v5 (3-5 dias, a maior frente)
14. Instalar `@mui/material @emotion/react @emotion/styled @mui/icons-material`
15. Configurar `ThemeProvider` novo com `createTheme`
16. Migrar componente por componente: `makeStyles` → `sx` prop ou `styled()`. São ~30 arquivos — vale fazer de forma mecânica
17. Trocar imports `@material-ui/*` → `@mui/*`
18. Manter `styled-components` só no `Cart/styles.js` ou converter e remover a dep
19. **Validar: cada tela renderiza igual**

### Fase 4 — Limpezas e polimento (1-2 dias)
20. Atualizar `parse@3 → 5` e `cep-promise`
21. Corrigir os bugs já mapeados no `ANALISE.md` (`toLocateString`, `{relatorio}`, etc.)
22. Atualizar `index.html` (remover `</script>` órfão)
23. Considerar TypeScript — opcional, pode ser fase posterior arquivo por arquivo

### Total estimado
**7-11 dias de trabalho focado** para um dev que conhece o código.

---

## 5. Alternativa Viável Se o Tempo For Curto

Se o objetivo é só **mostrar o projeto rodando** para outras pessoas (não retomar desenvolvimento):

- Use `nvm` e instale **Node 16** localmente:
  ```bash
  nvm install 16 && nvm use 16
  npm install && npm start
  ```
- Em minutos o projeto sobe sem tocar no código.

**Mas não é base para desenvolver em cima** — CRA 4 foi descontinuado pela equipe do React em 2023.

---

## 6. Recomendação Final

Para o objetivo declarado ("outras pessoas entenderem e trabalharem nele"), faça a **rota B**. Ela entrega uma base moderna (Vite + React 18 + MUI v5 + RR6) que qualquer dev contratado hoje reconhece, preserva o código que já funciona e resolve o bloqueador do Node 24.

A fase **MUI v4→v5** é a mais trabalhosa mas é mecânica — não envolve redesenho, só troca de API de estilização. As demais fases são diretas.

A rota A serve só como demo rápida; a rota C desperdiça o investimento já feito.
