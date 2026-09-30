# Calculadora de energia solar · orientação livre

Aplicativo local para estimar a produção de sistemas fotovoltaicos com múltiplos grupos de módulos, orientações independentes, visualização 3D e dados meteorológicos horários do PVGIS.

O projeto usa HTML, CSS e JavaScript puro no navegador e um servidor HTTP em Node.js, sem pacotes npm. O mapa utiliza Leaflet carregado por CDN e camadas do OpenStreetMap.

## Requisitos

- Node.js 22 ou superior;
- conexão com a internet para consultar o PVGIS e carregar o mapa;
- navegador moderno com JavaScript habilitado.

## Como executar localmente

1. Abra um terminal nesta pasta.
2. Execute um dos comandos:

   ```bash
   # Modo normal
   node server.mjs
   # ou
   npm start

   # Modo desenvolvimento com recarregamento automático ao salvar alterações
   npm run dev
   # ou
   make dev
   ```

3. Acesse [http://localhost:8080](http://localhost:8080).
4. Informe a localização e clique em **Buscar dados solares**.

Para usar outra porta:

```powershell
$env:PORT=3000
node server.mjs
```

O aplicativo precisa ser aberto pelo servidor Node. Abrir `index.html` diretamente não permite consultar o proxy local do PVGIS.

## Deploy no Google Cloud Run

O projeto está configurado para deploy serverless no Cloud Run:

```bash
make deploy
```
ou diretamente:
```bash
gcloud run deploy simulador-solar --source . --region us-central1 --project simulador-solar-app --allow-unauthenticated
```


## Principais recursos

- seleção da localização por coordenadas, colagem de latitude/longitude ou mapa;
- consulta do ano meteorológico típico (TMY) do PVGIS;
- catálogo de módulos mantido em `panels.json`;
- múltiplos grupos de módulos com quantidade, linhas e distância configuráveis;
- inclinação, azimute e rotação independentes por grupo;
- visualização 3D da matriz completa, cotas e trajetória solar;
- data e hora locais selecionáveis, com posição, nascer e pôr do sol;
- estimativa anual, mensal, média diária e potência na hora selecionada;
- curva diária de potência entre o nascer e o pôr do sol, com marcação da hora escolhida;
- operação com inversor AC ou em modo DC direto;
- exportação dos resultados em CSV;
- exportação e importação do projeto completo em JSON.

O resultado geral soma todos os grupos configurados. Quando o inversor está ligado, sua eficiência e seu limite AC são aplicados à potência combinada dos grupos.

Consulte o [Manual do usuário](MANUAL_DO_USUARIO.md) para instruções detalhadas.

## Dados solares e servidor

O navegador consulta:

```text
GET /api/tmy?lat=<latitude>&lon=<longitude>
```

O servidor valida as coordenadas e encaminha a solicitação para:

```text
https://re.jrc.ec.europa.eu/api/v5_3/tmy?lat=...&lon=...&outputformat=json
```

A resposta aceita deve conter:

- `inputs.location.latitude` e `inputs.location.longitude` compatíveis com a solicitação, com tolerância de 0,02°;
- `outputs.tmy_hourly` com 8.760 registros;
- `time(UTC)`, `G(h)`, `Gb(n)`, `Gd(h)` e `T2m` em cada registro.

O servidor possui timeout de 90 segundos e devolve erros reais do PVGIS; falhas externas não são substituídas por dados fictícios.

## Metodologia resumida

- posição solar aproximada pelas equações da NOAA;
- radiação direta projetada no plano do módulo;
- radiação difusa pelo modelo isotrópico;
- reflexão do solo determinada pelo albedo;
- temperatura da célula aproximada pelo NOCT;
- correção de potência pelo coeficiente térmico;
- aplicação de outras perdas configuradas;
- ganho traseiro conforme bifacialidade e exposição informadas;
- eficiência e clipping do inversor aplicados quando o modo AC está ativo.

A potência da hora selecionada utiliza a posição solar da data e hora informadas e o registro equivalente do TMY. Ela representa uma condição meteorológica típica, não medição ou previsão em tempo real. A hora civil usa o fuso local do navegador; latitude e longitude, isoladamente, não determinam o fuso político da localidade.

## Orientação

- inclinação: 0° para cima, 90° vertical e 180° para baixo;
- azimute: norte 0°, leste 90°, sul 180° e oeste 270°;
- rotação: gira o módulo no próprio plano e não altera a geração no modelo atual, que não calcula sombras geométricas.

## Catálogo de módulos

Os presets ficam em `panels.json`. Cada item deve possuir:

```json
{
  "id": "fabricante-modelo",
  "brand": "Fabricante",
  "model": "Modelo",
  "wp": 550,
  "width": 1.134,
  "height": 2.278,
  "gamma": -0.35,
  "noct": 45,
  "bifacial": 0,
  "source": "https://exemplo.com/ficha.pdf",
  "notes": "Observações opcionais"
}
```

Unidades: potência em Wp, dimensões em metros, `gamma` em %/°C, `noct` em °C e `bifacial` em porcentagem. `source` e `notes` são opcionais.

## Projetos exportados

O formato atual é a versão 2 e inclui configurações, grupos e, quando carregados, dados meteorológicos. Não existe migração automática de versões anteriores.

## Limitações

O modelo não representa sombras locais ou entre módulos, obstáculos, relevo, strings e MPPTs, mismatch elétrico, curva detalhada do inversor, sujeira variável, degradação, indisponibilidade, estrutura real da montagem bifacial ou perdas específicas de cabeamento.

Os resultados são estimativas teóricas e preliminares. Não constituem garantia de geração, proposta comercial, laudo ou projeto de engenharia.

## Referências

- [PVGIS — serviço de API não interativa](https://joint-research-centre.ec.europa.eu/photovoltaic-geographical-information-system-pvgis/using-pvgis-5/api-non-interactive-service_en)
- [NOAA — equações de posição solar](https://gml.noaa.gov/grad/solcalc/solareqns.PDF)
- [Leaflet](https://leafletjs.com/)
- [OpenStreetMap](https://www.openstreetmap.org/)
