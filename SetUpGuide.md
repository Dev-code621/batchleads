## Install

1. Rename .env.example to .env

2. Update db connection info in .env

    DB_HOST=

    DB_PORT=

    DB_DATABASE=

    DB_USERNAME=

    DB_PASSWORD=

3. ./composer.phar install

4. Database migration

    php artisan migrate:refresh --seed

5. Setup

    php artisan key:generate

    php artisan passport:install

    php artisan jwt:secret

    php artisan config:cache

6. Set Crontab

    * * * * * cd /path-to-your-project && php artisan schedule:run >> /dev/null 2>&1

7. Database Update Charsetting to utf8mb4

    php artisan db:resetting

8. Front-End

    npm install
    npm run build
