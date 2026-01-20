
# Начало работы

Проект работает в Docker и состоит из двух частей:
- **Frontend**: React-приложение
- **Backend Mock**: json-server для эмуляции API (реальный бэкенд не требуется)

## 🚀 Быстрый старт
### 1. Запуск проекта
Перейти в корневую папку проекта и выполнить:

```bash
docker-compose up
```

### 2. Frontend (React)

**URL**: [http://localhost:3000/](http://localhost:3000/)

### 3. Mock API Server

**URL**: [http://localhost:4040/](http://localhost:4040/)

## 🔄 Переключение режимов работы
По умолчанию приложение работает с реальным бэкендом. Для разработки используйте **mock-режим**:
1. Откройте файл: `src/index.js`
2. Найдите переменную:
```
export const GRAPH_MODE_TEST = false;
```
3. Измените на:
```
export const GRAPH_MODE_TEST = true;  // Включаем mock-режим
```

## Mock API (json-server)

Для разработки используем **mock API сервер** с предопределенными ответами:
- **Конфигурация**: `json-server/` 
- **Mock-данные**: `json-server/data/AVR-1000/db.json`

**Особенности:**
- Все эндпоинты `.cgi` замоканы
- Ответы соответствуют реальному API
- Данные можно редактировать без риска для production

# 🐳 Docker-команды
```bash
# Запуск всего стека
docker-compose up
# Запуск в фоновом режиме
docker-compose up -d
# Создание релизного билда
docker-compose run --rm react-app npm run build
# Создание образа json-server
docker build -t m65535/web-json-server:1.0.0-beta.3 -f build\json-server\Dockerfile .
# Создание образа приложения
# Используеться когда:
# - Появились новые зависимости в проекте (react)
# - Для создания контейнера на другой версии node
docker build -t m65535/web-node:16-alpine -f build/app/Dockerfile .
```


# Команды на сборку 
[Команды npm React](Команды_React.md)

