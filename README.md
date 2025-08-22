# Мониторинг поступающих в аспирантуру ПензГТУ

Веб-приложение для отслеживания списков поступающих в аспирантуру Пензенского государственного технологического университета.

## Описание

Приложение автоматически собирает данные с официального сайта ПензГТУ и предоставляет удобный интерфейс для просмотра:
- Списков поступающих по направлениям
- Статистики по заявлениям
- Поиска абитуриентов по номеру заявления
- Сравнения данных между разными сессиями

## Скриншоты

<img width="350" src="https://github.com/user-attachments/assets/7927be24-b243-4cc1-955b-cce0567d27c6" />
<img width="350" src="https://github.com/user-attachments/assets/5d065832-6f38-4b7d-a959-701acc2c9e8b" />


## Технологии

**Frontend:**
- React + TypeScript
- Vite
- Tailwind CSS + DaisyUI
- Axios

**Backend:**
- Python
- FastAPI
- BeautifulSoup4 (web-scraping)

**Развертывание:**
- Docker + Docker Compose
- Nginx (reverse proxy)

## Установка и запуск

1. Клонируйте репозиторий:
```bash
git clone https://github.com/oplexz/penzgtu-abitur-scraping.git
cd penzgtu-abitur-scraping
```

2. Скопируйте и настройте переменные окружения:
```bash
cp .env.example .env
# Отредактируйте .env файл под ваши настройки
```

3. Запустите приложение:
```bash
docker-compose up -d
```

4. Приложение будет доступно по адресу:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
