SHELL = cmd.exe
PROJECT_ID ?= simulador-solar-app
REGION ?= us-central1

help:
	@echo Comandos disponiveis:
	@echo   make dev               - Inicia o servidor local com hot reload (--watch)
	@echo   make start             - Inicia o servidor local normal
	@echo   make deploy            - Realiza deploy no Cloud Run
	@echo   make logs              - Streaming em tempo real dos logs (tail ao vivo)
	@echo   make logs-history      - Exibe os ultimos 50 logs recentes
	@echo   make set-proj-id       - Define o projeto ativo no gcloud
	@echo   make login             - Realiza login no Firebase e no Google Cloud

dev:
	node --watch server.mjs

start:
	node server.mjs

deploy:
	gcloud run deploy simulador-solar --source . --region $(REGION) --project $(PROJECT_ID) --allow-unauthenticated

logs:
	gcloud alpha run services logs tail simulador-solar --region $(REGION) --project $(PROJECT_ID)

logs-history:
	gcloud run services logs read simulador-solar --region $(REGION) --project $(PROJECT_ID) --limit 50

set-proj-id:
	@echo Setting Cotas Project ID to $(PROJECT_ID)...
	gcloud auth application-default set-quota-project $(PROJECT_ID)
	@echo Setting Project ID to $(PROJECT_ID)...
	gcloud config set project $(PROJECT_ID)

login:
	@echo Logging into Firebase...
	firebase login --reauth
	@echo Logging into Google Cloud...
	gcloud auth login
	@echo Logging into Google Cloud Application Default Credentials (ADC)...
	gcloud auth application-default login