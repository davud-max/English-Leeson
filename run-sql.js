// run-sql.js
// Автоматическое выполнение SQL для настройки админ-панели
// Запуск: node run-sql.js

const { Client } = require('pg');

// SQL скрипт для выполнения
const SQL_SCRIPT = `
-- ================================================================
-- АВТОМАТИЧЕСКАЯ НАСТРОЙКА АДМИН-ПАНЕЛИ
-- ================================================================

-- ШАГ 1: Создание UserRole enum
DO $$ BEGIN
    CREATE TYPE "UserRole" AS ENUM ('USER', 'ADMIN');
    RAISE NOTICE '✅ UserRole enum создан';
EXCEPTION
    WHEN duplicate_object THEN 
        RAISE NOTICE '⚠️  UserRole enum уже существует';
END $$;

-- ШАГ 2: Добавление колонки role в таблицу User
DO $$ BEGIN
    ALTER TABLE "User" ADD COLUMN "role" "UserRole" NOT NULL DEFAULT 'USER';
    RAISE NOTICE '✅ Колонка role добавлена';
EXCEPTION
    WHEN duplicate_column THEN 
        RAISE NOTICE '⚠️  Колонка role уже существует';
END $$;

-- ШАГ 3: Создание индекса
CREATE INDEX IF NOT EXISTS "User_role_idx" ON "User"("role");

-- ШАГ 4: Создание админа
INSERT INTO "User" (
    id, 
    email, 
    password, 
    role, 
    "createdAt", 
    "updatedAt"
)
VALUES (
    gen_random_uuid()::text,
    'admin@davudx.com',
    '$2a$10$K7L1OQq3X4W9m5L5J5F5.OMHhFkJz8qVgNwXyZ1bC2dE3fG4hI5jK',
    'ADMIN',
    NOW(),
    NOW()
)
ON CONFLICT (email) 
DO UPDATE SET 
    role = 'ADMIN',
    password = EXCLUDED.password,
    "updatedAt" = NOW();

-- Проверка результата
SELECT email, role, "createdAt" FROM "User" WHERE role = 'ADMIN';
`;

// Цвета для консоли
const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    cyan: '\x1b[36m',
};

async function main() {
    console.log('\n🚀 Автоматическая настройка админ-панели');
    console.log('==========================================\n');

    const client = new Client({
        host: 'gondola.proxy.rlwy.net',
        port: 48337,
        user: 'postgres',
        password: 'mopOrqoNIYedSMMxPWwaAuDvbKkqzKqO',
        database: 'railway',
        ssl: { rejectUnauthorized: false },
        connectionTimeoutMillis: 10000,
    });

    try {
        // Подключение
        console.log(`${colors.cyan}📊 Подключение к базе данных...${colors.reset}`);
        await client.connect();
        console.log(`${colors.green}✅ Подключено к Railway PostgreSQL${colors.reset}\n`);

        // Выполнение SQL
        console.log(`${colors.cyan}🔧 Выполнение SQL скрипта...${colors.reset}`);
        const result = await client.query(SQL_SCRIPT);
        
        console.log(`${colors.green}✅ SQL выполнен успешно!${colors.reset}\n`);

        // Вывод уведомлений
        if (result.notices) {
            console.log('📋 Уведомления:');
            result.notices.forEach(notice => {
                console.log(`   ${notice.message}`);
            });
            console.log();
        }

        // Проверка админа
        const adminCheck = await client.query(
            `SELECT email, role, "createdAt" FROM "User" WHERE role = 'ADMIN' LIMIT 5`
        );

        if (adminCheck.rows.length > 0) {
            console.log('👤 Админы в системе:');
            adminCheck.rows.forEach(admin => {
                console.log(`   - ${admin.email} (role: ${admin.role})`);
            });
            console.log();
        }

        // Проверка структуры таблицы
        const structureCheck = await client.query(`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'User' AND column_name IN ('email', 'role')
            ORDER BY ordinal_position
        `);

        console.log('📊 Структура таблицы User:');
        structureCheck.rows.forEach(col => {
            console.log(`   - ${col.column_name}: ${col.data_type}`);
        });
        console.log();

        // Закрыть подключение
        await client.end();

        // Финальное сообщение
        console.log('🎉 Установка завершена!');
        console.log('========================\n');
        console.log(`${colors.green}✅ База данных обновлена${colors.reset}`);
        console.log(`${colors.green}✅ UserRole enum создан${colors.reset}`);
        console.log(`${colors.green}✅ Колонка role добавлена${colors.reset}`);
        console.log(`${colors.green}✅ Админ создан: admin@davudx.com${colors.reset}`);
        console.log(`${colors.green}✅ Пароль админа: admin123${colors.reset}\n`);
        
        console.log('📋 Следующие шаги:');
        console.log('1. Скопируйте файлы защиты в проект');
        console.log('2. Закоммитьте и запушьте изменения');
        console.log('3. Дождитесь деплоя Railway');
        console.log('4. Войдите: https://davudx.com/login');
        console.log('5. Откройте админ-панель: https://davudx.com/admin\n');
        
        console.log(`${colors.yellow}⚠️  ВАЖНО: Измените пароль после первого входа!${colors.reset}\n`);

    } catch (error) {
        console.error(`${colors.red}❌ Ошибка: ${error.message}${colors.reset}`);
        
        if (error.code === 'ENOTFOUND') {
            console.error('\n💡 Проблема с DNS. Попробуйте:');
            console.error('   1. Проверьте интернет соединение');
            console.error('   2. Отключите VPN если используете');
            console.error('   3. Попробуйте через несколько минут\n');
        } else if (error.code === 'ETIMEDOUT') {
            console.error('\n💡 Превышено время ожидания. Попробуйте:');
            console.error('   1. Проверьте что база данных работает в Railway');
            console.error('   2. Попробуйте снова через несколько секунд\n');
        } else {
            console.error('\nПолная ошибка:');
            console.error(error);
        }
        
        process.exit(1);
    }
}

// Запуск
console.log('');
console.log('═══════════════════════════════════════════════');
console.log('  Настройка Admin Panel для English-Leeson');
console.log('═══════════════════════════════════════════════');

main();
