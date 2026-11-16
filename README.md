# Phoenix Propostas 360 — Piloto premium v0.3

**Ambiente independente:** https://phoenix-propostas-360.vercel.app

Estúdio de propostas comerciais para Phoenix Insurance, com edição no navegador, comparativo financeiro por ramo e prévia/exportação em PDF (impressão A4).

## Ordem da apresentação (obrigatória)

1. Capa personalizada
2. Sobre a Phoenix Insurance
3. Comparativo financeiro adaptado ao produto e, quando preenchido, quadro técnico de condições por seguradora
4. Descrição dos produtos e condições relevantes
5. Diferenciais das seguradoras (somente informações verificadas)
6. Documentação necessária e condições
7. Contracapa, contatos e agradecimento

Se houver muitos beneficiários, opções ou documentos, uma seção poderá ocupar mais de uma página.

## Ramos e organização financeira

- **Saúde / Odontológico:** nome, idade e mensalidade individual por plano, com totais.
- **Vida:** segurado/grupo, idade e prêmio por segurado; capital segurado e garantias no quadro técnico.
- **Auto / Frota:** veículo, ano e prêmio por veículo; franquia e assistência no quadro técnico.
- **Empresarial / Residencial:** item ou risco coberto, quantidade informativa e prêmio por item ou total da proposta quando apenas esse valor estiver disponível; limites, franquias e coberturas no quadro técnico.
- **Outros:** campos genéricos editáveis sem inferir valores.

A periodicidade é editável (mensal, anual, prêmio único); o cálculo anual multiplica por 12 **somente** na modalidade mensal. IOF inicia em 0% para não ser aplicado em duplicidade.

## Fluxo de teste

1. Clique em **Carregar exemplo fictício** ou preencha uma proposta com dados fictícios.
2. Escolha o produto e ajuste periodicidade.
3. Preencha a tabela de itens/vidas e os valores de cada opção.
4. Em **Personalização da apresentação**, revise Sobre a Phoenix, produto, condições técnicas por opção, diferenciais, documentação e contatos.
5. Confira a prévia das sete seções.
6. Exporte em PDF pelo diálogo de impressão do navegador.

## Segurança e limitações atuais

**Não inserir documentos reais ou dados pessoais de clientes neste piloto público.**

- O aplicativo não tem autenticação, backend, banco de dados ou persistência de propostas.
- O leitor de PDF/Excel/CSV usa **extração local por regras**, ainda não há agente de IA generativa ligado.
- A leitura é experimental, principalmente para listas de vidas de saúde e odonto; outros ramos exigem conferência e preenchimento manual.
- A proposta não substitui a apólice, nem confirma aceitação ou coberturas.
- Condições comerciais, documentação e diferenciais devem ser conferidos nas fontes da seguradora.
- Integração ao sistema do Junior somente após homologação e implantação de autenticação/controle de acesso.

## Referência de design

Identidade Phoenix em azul profundo, azul institucional e dourado discreto; capa, páginas editoriais, cards e contracapa em estilo corporativo premium. Linguagem artística inspirada nos princípios gerais de apresentações profissionais, sem reutilizar páginas ou fotografias proprietárias das seguradoras.

**Referência do comparativo financeiro:** layout lógico recuperado do editor Phoenix Propostas v8, agora adaptado por produto.