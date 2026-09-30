# Manual do usuário

## 1. Iniciando o aplicativo

No terminal, dentro da pasta do aplicativo, execute:

```text
node server.mjs
```

Quando aparecer `Abra http://localhost:8080`, acesse esse endereço no navegador. Mantenha o terminal aberto enquanto estiver usando o simulador.

## 2. Fluxo recomendado

1. Defina a localização.
2. Busque os dados solares.
3. Configure o sistema e o inversor.
4. Crie e configure os grupos de módulos.
5. Ajuste orientação, data e hora.
6. Analise os resultados.
7. Exporte o projeto ou o CSV, se desejar.

## 3. Localização

Há três formas de informar a posição:

- preencher **Latitude** e **Longitude**;
- colar os dois valores no campo `latitude, longitude`;
- clicar em **Selecionar no mapa**, escolher um ponto e confirmar.

As coordenadas usam graus decimais. Valores ao sul e a oeste são negativos. Exemplo:

```text
-21.186561, -48.786481
```

Depois de definir a posição, clique em **Buscar dados solares**. Durante a consulta, o botão fica desabilitado. Ao terminar, a caixa de status informa sucesso ou apresenta a mensagem real da falha.

Uma nova consulta somente é necessária quando a localização muda. Alterações nos módulos, orientação, perdas ou inversor recalculam os resultados usando os dados já mantidos em memória.

## 4. Sistema e ambiente

### Inversor

O switch define o tipo de resultado:

- **Ligado:** calcula energia AC, aplica eficiência e limita a potência ao valor nominal do inversor;
- **Desligado:** calcula a saída DC estimada dos módulos, sem eficiência nem limite AC.

O limite do inversor é compartilhado por todos os grupos.

### Outras perdas

Percentual agregado para perdas adicionais não calculadas separadamente. Temperatura e eficiência do inversor já possuem tratamento próprio e não devem ser duplicadas nesse campo.

### Albedo do solo

Fração da irradiância refletida pelo solo, de 0 a 1. Um valor de `0,2` representa 20% de reflexão. O albedo influencia principalmente planos inclinados e a estimativa da face traseira de módulos bifaciais.

## 5. Grupos de módulos

Cada grupo representa módulos com o mesmo modelo, organização e orientação.

### Preset do painel

Escolha um modelo do catálogo para preencher potência, dimensões e parâmetros técnicos. Depois do preenchimento, qualquer campo pode ser alterado manualmente; nesse caso, o grupo passa a ser tratado como personalizado.

### Adicionar e remover

- **Adicionar grupo:** cria um novo grupo independente;
- **Remover grupo:** exclui o grupo selecionado; sempre deve existir pelo menos um grupo;
- **Grupo selecionado:** escolhe qual grupo será editado e mostrado no canvas.

Os indicadores e o gráfico somam todos os grupos, não apenas o grupo visível no canvas.

### Organização física

- **Quantidade:** total de módulos no grupo;
- **Número de linhas:** distribui os módulos na matriz;
- **Distância entre módulos:** intervalo em metros entre módulos adjacentes;
- **Largura e comprimento:** dimensões físicas de cada módulo.

O botão **Inverter largura ↔ comprimento** troca as dimensões do módulo. As cotas brancas mostram a ocupação total estimada da matriz. Essa área é um retângulo envolvente e não representa necessariamente a área útil exigida no telhado.

### Parâmetros elétricos e térmicos

- **Potência módulo:** potência nominal em Wp;
- **Coeficiente térmico:** variação percentual da potência por °C;
- **NOCT:** parâmetro usado para aproximar a temperatura da célula;
- **Bifacialidade:** capacidade relativa da face traseira;
- **Exposição traseira:** fator de 0 a 1 que reduz o ganho traseiro ideal.
- **Cor do grupo:** cor exclusiva usada nos módulos do canvas 3D, nas barras mensais e na curva diária do grupo.

## 6. Orientação e visualização 3D

O canvas exibe todos os módulos do grupo selecionado, sua face frontal, cotas, referências cardeais e trajetória solar.

- **Inclinação:** 0° para cima, 90° vertical e 180° para baixo;
- **Azimute:** norte 0°, leste 90°, sul 180° e oeste 270°;
- **Rotação no plano:** muda a disposição visual entre retrato, paisagem e ângulos intermediários.

Use os controles deslizantes ou digite valores nos campos numéricos. Os ícones `?` exibem uma explicação de cada orientação.

A rotação no plano muda a ocupação e a visualização, mas não a geração no modelo atual, pois a normal da face permanece igual e sombras geométricas não são calculadas.

## 7. Data, hora e trajetória solar

Por padrão, o seletor usa a data e hora locais atuais do navegador. O HUD mostra:

- estado acima ou abaixo do horizonte;
- coordenadas utilizadas;
- data, hora e deslocamento UTC;
- elevação e azimute solar;
- nascer do sol, pôr do sol e duração do dia.

Latitude e longitude são sempre lidas dos campos de localização. A hora usa o fuso configurado no dispositivo. Se você simular uma localidade em outro fuso, ajuste mentalmente a diferença ou altere o fuso do ambiente; o aplicativo não consulta automaticamente o fuso político da coordenada.

Os horários de nascer e pôr do sol utilizam o critério de elevação de −0,833°, que aproxima refração atmosférica e disco solar.

## 8. Resultados

O card **Resultados da simulação** agrega todos os grupos e apresenta:

- **kWh/ano estimados:** produção anual;
- **kWh/dia — média anual:** produção anual dividida por 365;
- **kWp instalados:** soma da potência nominal dos módulos;
- **kW médios na hora selecionada:** potência estimada para a hora típica equivalente.

O gráfico **Potência na data selecionada** mostra uma curva em kW para cada grupo, usando a cor escolhida, e uma curva branca mais espessa para a soma do sistema. A linha vertical azul marca a hora selecionada; os pontos coloridos mostram cada grupo e o ponto branco mostra o total. Ao mover o cursor pelo gráfico, o tooltip arredonda para a hora mais próxima e apresenta a potência de cada grupo e a soma. A curva combina a posição solar da data selecionada com os registros horários equivalentes do TMY.

O gráfico **Produção mensal por grupo** utiliza barras empilhadas. Cada cor representa um grupo e a altura completa da barra é a soma do projeto. Passe o mouse sobre um segmento para visualizar a produção do grupo, sua participação percentual e o total daquele mês. A linha tracejada representa a média mensal do total. Com apenas um grupo, cada barra possui uma única cor.

A tabela informa a produção mensal total e a média diária de cada mês.

A potência horária usa o registro do TMY mais próximo da hora escolhida, arredondado para a hora cheia. Ela não informa quanto o sistema está produzindo neste momento e não é previsão meteorológica.

## 9. Exportação e importação

### Exportar PDF

O botão **Exportar PDF** prepara uma reprodução visual da página em uma única folha A2 vertical e abre a janela de impressão do navegador. Escolha **Salvar como PDF** como destino. Para preservar o visual escuro, mantenha habilitada a opção de imprimir gráficos ou cores de fundo.

O aplicativo calcula automaticamente uma escala para acomodar o conteúdo atual em uma página. Projetos com muitos campos ou conteúdo excepcionalmente longo podem ficar com texto menor no PDF.

### Exportar projeto

Baixa `projeto-solar.json` com configurações, grupos e dados meteorológicos carregados. O arquivo pode ser grande porque contém as 8.760 horas do TMY.

### Importar projeto

Clique em **Importar projeto** e escolha um JSON exportado pelo aplicativo. Somente o formato atual, versão 3, é aceito.

### Exportar resultados CSV

Depois de calcular, clique em **Exportar resultados CSV** para baixar a produção mensal e as médias diárias. O arquivo usa ponto e vírgula como separador e vírgula decimal.

## 10. Mensagens e problemas comuns

### “Abra o aplicativo pelo servidor Node”

O arquivo foi aberto diretamente. Execute `node server.mjs` e use `http://localhost:8080`.

### Falha ou timeout do PVGIS

Verifique a internet, as coordenadas e tente novamente. O serviço externo pode estar temporariamente indisponível. O aplicativo não inventa dados para substituir a resposta.

### O mapa não aparece

Leaflet e as imagens do OpenStreetMap são carregados pela internet. Verifique conexão, bloqueadores de conteúdo e acesso aos domínios `unpkg.com` e `tile.openstreetmap.org`.

### Catálogo indisponível

Confirme que `panels.json` está na mesma pasta de `server.mjs` e que o aplicativo foi iniciado pelo servidor.

### A potência horária aparece como zero

Isso é esperado à noite ou quando a face dos módulos não recebe irradiância suficiente. Verifique data, hora, localização e orientação.

### Alterei a localização e os resultados ficaram indisponíveis

Os dados TMY carregados precisam corresponder às coordenadas atuais. Clique novamente em **Buscar dados solares**.

## 11. Limitações e responsabilidade

O simulador não modela sombras, obstáculos, relevo, distribuição elétrica por strings e MPPTs, mismatch, cabeamento detalhado, sujeira variável, degradação, disponibilidade operacional ou geometria real da instalação.

Os resultados são estimativas teóricas e preliminares e podem divergir da geração real. Não constituem garantia de desempenho, proposta comercial, laudo ou projeto de engenharia. Para dimensionamento, segurança e execução, procure um profissional habilitado.
