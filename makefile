# Переменные
PORT := $(shell grep -oP '^APP_PORT=\K.*' .env 2>/dev/null || echo "8080")
URL := http://127.0.0.1:$(PORT)

# Цветной вывод
GREEN := \033[0;32m
YELLOW := \033[1;33m
RED := \033[0;31m
NC := \033[0m # No Color

.PHONY: help up down restart logs status clean open

help: ## Показать справку по командам
	@echo "$(GREEN)Доступные команды:$(NC)"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "$(YELLOW)%-15s$(NC) %s\n", $$1, $$2}'

up: ## Запустить контейнеры и открыть браузер
	@echo "$(GREEN)Запуск Docker контейнеров...$(NC)"
	@docker compose up -d
	@if [ $$? -eq 0 ]; then \
		echo "$(GREEN)✓ Контейнер успешно запущен!$(NC)"; \
		echo "$(YELLOW)Ожидание запуска сервера...$(NC)"; \
		sleep 2; \
		echo "$(YELLOW)Открываю страницу: $(URL)$(NC)"; \
		$(MAKE) open; \
	else \
		echo "$(RED)✗ Ошибка при запуске контейнера$(NC)"; \
		exit 1; \
	fi

down: ## Остановить и удалить контейнеры
	@echo "$(YELLOW)Остановка контейнеров...$(NC)"
	@docker compose down
	@echo "$(GREEN)✓ Контейнеры остановлены$(NC)"

restart: down up ## Перезапустить контейнеры

logs: ## Показать логи контейнеров
	@docker compose logs -f

status: ## Показать статус контейнеров
	@docker compose ps

open: ## Открыть веб-страницу в браузере
	@echo "$(YELLOW)Открываю браузер: $(URL)$(NC)"
	@if command -v xdg-open >/dev/null 2>&1; then \
		nohup xdg-open "$(URL)" > /dev/null 2>&1 & \
	elif command -v open >/dev/null 2>&1; then \
		nohup open "$(URL)" > /dev/null 2>&1 & \
	elif command -v start >/dev/null 2>&1; then \
		start "$(URL)" > /dev/null 2>&1 & \
	else \
		echo "$(RED)Не удалось открыть браузер автоматически$(NC)"; \
		echo "Пожалуйста, откройте вручную: $(URL)"; \
	fi

shell: ## Открыть shell в запущенном контейнере
	@docker compose exec $(or $(CONTAINER),app) /bin/sh || \
	docker compose exec $(or $(CONTAINER),app) /bin/bash

exec: ## Выполнить команду в контейнере (используйте: make exec CMD="ls -la")
	@docker compose exec $(or $(CONTAINER),app) $(CMD)

build: ## Пересобрать образы
	@echo "$(GREEN)Пересборка Docker образов...$(NC)"
	@docker compose build --no-cache

rebuild: build up ## Пересобрать и запустить

ps: ## Показать процессы
	@docker compose ps

# Windows поддержка
up-win: ## Запуск на Windows
	@powershell -Command "$$env:PORT=$(PORT); docker compose up -d; Start-Sleep -Seconds 2; Start-Process '$(URL)'"

# Проверка наличия .env файла
check-env:
	@if [ ! -f .env ]; then \
		echo "$(RED)Предупреждение: .env файл не найден$(NC)"; \
		echo "$(YELLOW}Создаю пример .env файла...$(NC)"; \
		echo "PORT=8080" > .env; \
		echo "$(GREEN)✓ Создан .env файл с портом 8080$(NC)"; \
	fi

# Основная команда по умолчанию
default: up
