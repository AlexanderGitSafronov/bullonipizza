import type { Locale } from "@/i18n/config";

type Section = { title: string; body: string[] };
type Doc = { updated: string; intro: string; sections: Section[] };

export const privacyContent: Record<Locale, Doc> = {
  uk: {
    updated: "2026-05-18",
    intro:
      "BulloniPizza поважає вашу приватність. Цей документ пояснює, які персональні дані ми збираємо, навіщо, як зберігаємо та які у вас права згідно із Законом України «Про захист персональних даних» і Регламентом (ЄС) 2016/679 (GDPR).",
    sections: [
      {
        title: "1. Хто розпорядник даних",
        body: [
          "BulloniPizza (далі — «ми»), м. Київ, вул. Хрещатик 1.",
          "Контакт з питань даних: privacy@bullonipizza.com",
        ],
      },
      {
        title: "2. Які дані ми обробляємо",
        body: [
          "Контактні: ім'я, телефон, адреса доставки, коментар до замовлення.",
          "Акаунт (за реєстрації): email, хеш пароля (bcrypt), ім'я. Сам пароль ми не зберігаємо.",
          "Технічні: IP-адреса, тип пристрою, мова — лише для роботи сервісу й безпеки.",
          "Замовлення: склад кошика, історія замовлень, статус доставки.",
          "Cookie: див. Політику cookie. Cookie сесії (bp_session) — HttpOnly, Secure, SameSite=Lax.",
        ],
      },
      {
        title: "3. Мета та правова підстава",
        body: [
          "Виконання договору доставки (ст. 6(1)(b) GDPR).",
          "Дотримання вимог податкового та бухгалтерського законодавства (ст. 6(1)(c) GDPR).",
          "Аналітика й маркетинг — лише за вашою згодою (ст. 6(1)(a) GDPR).",
        ],
      },
      {
        title: "4. Скільки зберігаємо",
        body: [
          "Дані замовлень — 3 роки з моменту останньої взаємодії або довше, якщо цього вимагає закон.",
          "Аналітичні дані — до 14 місяців у знеособленому вигляді.",
        ],
      },
      {
        title: "5. Кому передаємо",
        body: [
          "Кур'єрській службі — мінімум, потрібний для доставки.",
          "Платіжному провайдеру — у разі онлайн-оплати.",
          "Хостинг-провайдеру (Vercel/Neon) — як обробникам за нашим дорученням.",
          "Ми не продаємо та не передаємо ваші дані третім особам у комерційних цілях.",
        ],
      },
      {
        title: "6. Ваші права",
        body: [
          "Доступ, виправлення, видалення (право бути забутим), обмеження обробки, перенесення даних, заперечення.",
          "Відкликання згоди в будь-який момент.",
          "Подача скарги до Уповноваженого Верховної Ради України з прав людини.",
          "Запити надсилайте на privacy@bullonipizza.com — відповідь протягом 30 днів.",
        ],
      },
      {
        title: "7. Безпека",
        body: [
          "TLS-шифрування трафіку, обмеження доступу до даних за принципом найменших привілеїв, шифрування паролів, регулярні оновлення.",
        ],
      },
      {
        title: "8. Зміни до політики",
        body: [
          "Ми можемо оновлювати цей документ. Поточна версія завжди доступна на цій сторінці із зазначенням дати оновлення.",
        ],
      },
    ],
  },
  en: {
    updated: "2026-05-18",
    intro:
      "BulloniPizza respects your privacy. This document explains what personal data we collect, why, how we store it and what rights you have under Regulation (EU) 2016/679 (GDPR) and the Ukrainian Personal Data Protection Act.",
    sections: [
      {
        title: "1. Data controller",
        body: [
          "BulloniPizza (hereinafter “we”), 1 Khreshchatyk St., Kyiv, Ukraine.",
          "Data contact: privacy@bullonipizza.com",
        ],
      },
      {
        title: "2. What we process",
        body: [
          "Contact: name, phone, delivery address, order comment.",
          "Account (on sign-up): email, bcrypt password hash, name. We do not store the password itself.",
          "Technical: IP address, device type, language — solely to operate the service and for security.",
          "Orders: cart contents, order history, delivery status.",
          "Cookies: see Cookie Policy. Session cookie (bp_session) is HttpOnly, Secure, SameSite=Lax.",
        ],
      },
      {
        title: "3. Purposes and legal basis",
        body: [
          "Performance of the delivery contract (Art. 6(1)(b) GDPR).",
          "Compliance with tax and accounting law (Art. 6(1)(c) GDPR).",
          "Analytics and marketing — only with your consent (Art. 6(1)(a) GDPR).",
        ],
      },
      {
        title: "4. Retention",
        body: [
          "Order data — 3 years from last interaction, or longer if law requires.",
          "Analytics — up to 14 months in anonymised form.",
        ],
      },
      {
        title: "5. Recipients",
        body: [
          "Courier service — the minimum needed for delivery.",
          "Payment provider — for online payments.",
          "Hosting provider (Vercel/Neon) — as processors on our behalf.",
          "We do not sell or share your data with third parties for commercial gain.",
        ],
      },
      {
        title: "6. Your rights",
        body: [
          "Access, rectification, erasure (right to be forgotten), restriction, portability, objection.",
          "Withdraw consent at any time.",
          "Lodge a complaint with the supervisory authority.",
          "Send requests to privacy@bullonipizza.com — reply within 30 days.",
        ],
      },
      {
        title: "7. Security",
        body: [
          "TLS encryption in transit, least-privilege access, password hashing, regular updates.",
        ],
      },
      {
        title: "8. Changes",
        body: [
          "We may update this policy. The current version is always available on this page with the update date.",
        ],
      },
    ],
  },
  ru: {
    updated: "2026-05-18",
    intro:
      "BulloniPizza уважает вашу приватность. Этот документ объясняет, какие персональные данные мы собираем, зачем, как храним и какие у вас права согласно Закону Украины «О защите персональных данных» и Регламенту (ЕС) 2016/679 (GDPR).",
    sections: [
      {
        title: "1. Кто распорядитель данных",
        body: [
          "BulloniPizza (далее — «мы»), г. Киев, ул. Крещатик 1.",
          "Контакт по данным: privacy@bullonipizza.com",
        ],
      },
      {
        title: "2. Какие данные мы обрабатываем",
        body: [
          "Контактные: имя, телефон, адрес доставки, комментарий к заказу.",
          "Аккаунт (при регистрации): email, хэш пароля (bcrypt), имя. Сам пароль мы не храним.",
          "Технические: IP-адрес, тип устройства, язык — только для работы сервиса и безопасности.",
          "Заказы: состав корзины, история заказов, статус доставки.",
          "Cookie: см. Политику cookie. Cookie сессии (bp_session) — HttpOnly, Secure, SameSite=Lax.",
        ],
      },
      {
        title: "3. Цели и правовое основание",
        body: [
          "Выполнение договора доставки (ст. 6(1)(b) GDPR).",
          "Соблюдение налогового и бухгалтерского законодательства (ст. 6(1)(c) GDPR).",
          "Аналитика и маркетинг — только с вашего согласия (ст. 6(1)(a) GDPR).",
        ],
      },
      {
        title: "4. Сколько храним",
        body: [
          "Данные заказов — 3 года с момента последнего взаимодействия или дольше, если этого требует закон.",
          "Аналитические данные — до 14 месяцев в обезличенном виде.",
        ],
      },
      {
        title: "5. Кому передаём",
        body: [
          "Курьерской службе — минимум, необходимый для доставки.",
          "Платёжному провайдеру — при онлайн-оплате.",
          "Хостинг-провайдеру (Vercel/Neon) — как обработчикам по нашему поручению.",
          "Мы не продаём и не передаём ваши данные третьим лицам в коммерческих целях.",
        ],
      },
      {
        title: "6. Ваши права",
        body: [
          "Доступ, исправление, удаление (право быть забытым), ограничение обработки, перенос данных, возражение.",
          "Отзыв согласия в любой момент.",
          "Жалоба надзорному органу.",
          "Запросы направляйте на privacy@bullonipizza.com — ответ в течение 30 дней.",
        ],
      },
      {
        title: "7. Безопасность",
        body: [
          "TLS-шифрование, доступ по принципу наименьших привилегий, хэширование паролей, регулярные обновления.",
        ],
      },
      {
        title: "8. Изменения",
        body: [
          "Мы можем обновлять этот документ. Текущая версия всегда доступна на этой странице с датой обновления.",
        ],
      },
    ],
  },
};

export const cookieContent: Record<Locale, Doc> = {
  uk: {
    updated: "2026-05-18",
    intro:
      "Ця Політика пояснює, які cookie ми використовуємо на bullonipizza.com та як ви можете керувати своїми налаштуваннями.",
    sections: [
      {
        title: "Що таке cookie",
        body: [
          "Cookie — це невеликі текстові файли, що зберігаються на вашому пристрої. Ми використовуємо також localStorage для збереження кошика та вподобань.",
        ],
      },
      {
        title: "Категорії, які ми використовуємо",
        body: [
          "Необхідні: bp_cart (кошик), bp_locale (мова), bp_consent (ваш вибір). Без них сайт не працює.",
          "Аналітика: лише за вашою згодою. Анонімні метрики продуктивності та поведінки.",
          "Маркетинг: лише за вашою згодою. Допомагає показувати релевантні пропозиції.",
        ],
      },
      {
        title: "Як керувати",
        body: [
          "На банері «Cookie» при першому відвідуванні. Пізніше — у футері «Налаштування cookie».",
          "Також можна видалити cookie у налаштуваннях браузера. Це може зламати деякі функції.",
        ],
      },
      {
        title: "Сторонні cookie",
        body: [
          "Ми не використовуємо рекламних мереж за замовчуванням. Якщо в майбутньому ми підключимо Google Analytics або Meta Pixel — лише після вашої згоди.",
        ],
      },
    ],
  },
  en: {
    updated: "2026-05-18",
    intro:
      "This Cookie Policy explains which cookies we use on bullonipizza.com and how you can control your preferences.",
    sections: [
      {
        title: "What are cookies",
        body: [
          "Cookies are small text files stored on your device. We also use localStorage to save the cart and preferences.",
        ],
      },
      {
        title: "Categories we use",
        body: [
          "Necessary: bp_cart (cart), bp_locale (language), bp_consent (your choice). Without these the site won’t work.",
          "Analytics: only with your consent. Anonymous performance and behaviour metrics.",
          "Marketing: only with your consent. Helps to show relevant offers.",
        ],
      },
      {
        title: "How to manage",
        body: [
          "On the cookie banner shown on your first visit. Later — via the “Cookie settings” link in the footer.",
          "You can also delete cookies in your browser. This may break some features.",
        ],
      },
      {
        title: "Third-party cookies",
        body: [
          "We don’t use ad networks by default. If we ever add Google Analytics or Meta Pixel — only after your consent.",
        ],
      },
    ],
  },
  ru: {
    updated: "2026-05-18",
    intro:
      "Эта Политика объясняет, какие cookie мы используем на bullonipizza.com и как вы можете управлять настройками.",
    sections: [
      {
        title: "Что такое cookie",
        body: [
          "Cookie — небольшие текстовые файлы, сохраняемые на вашем устройстве. Мы также используем localStorage для хранения корзины и предпочтений.",
        ],
      },
      {
        title: "Категории, которые мы используем",
        body: [
          "Необходимые: bp_cart (корзина), bp_locale (язык), bp_consent (ваш выбор). Без них сайт не работает.",
          "Аналитика: только с вашего согласия. Анонимные метрики производительности и поведения.",
          "Маркетинг: только с вашего согласия. Помогает показывать релевантные предложения.",
        ],
      },
      {
        title: "Как управлять",
        body: [
          "На баннере «Cookie» при первом визите. Позже — через «Настройки cookie» в футере.",
          "Также можно удалить cookie в браузере. Это может сломать некоторые функции.",
        ],
      },
      {
        title: "Сторонние cookie",
        body: [
          "Рекламные сети по умолчанию не используем. Если в будущем подключим Google Analytics или Meta Pixel — только после вашего согласия.",
        ],
      },
    ],
  },
};

export const termsContent: Record<Locale, Doc> = {
  uk: {
    updated: "2026-05-18",
    intro:
      "Розміщуючи замовлення на bullonipizza.com, ви приймаєте ці Умови сервісу.",
    sections: [
      {
        title: "1. Загальні положення",
        body: [
          "Сервіс доступний особам, яким виповнилось 16 років. Для замовлення з оплатою при отриманні достатньо коректних контактних даних.",
        ],
      },
      {
        title: "2. Замовлення та доставка",
        body: [
          "Після оформлення замовлення менеджер зв'язується для підтвердження.",
          "Орієнтовний час доставки — 30 хвилин. У години пік або у віддалені райони час може бути довшим.",
          "Якщо ми не доставили замовлення вчасно з нашої вини — компенсуємо доставку.",
        ],
      },
      {
        title: "3. Оплата",
        body: [
          "Готівка кур'єру, банківська картка кур'єру або онлайн-оплата.",
          "Ціни вказані з ПДВ.",
        ],
      },
      {
        title: "4. Повернення та якість",
        body: [
          "Якщо страва не відповідає замовленню — повідомте нам протягом 30 хвилин після доставки. Ми замінимо її або повернемо кошти.",
        ],
      },
      {
        title: "5. Відповідальність",
        body: [
          "Ми не несемо відповідальності за затримки, спричинені форс-мажором або хибно вказаною адресою.",
        ],
      },
      {
        title: "6. Контакти",
        body: ["hello@bullonipizza.com · +380 67 123 45 67"],
      },
    ],
  },
  en: {
    updated: "2026-05-18",
    intro:
      "By placing an order on bullonipizza.com you accept these Terms of Service.",
    sections: [
      {
        title: "1. General",
        body: [
          "The service is available to people aged 16+. Cash-on-delivery orders only require correct contact data.",
        ],
      },
      {
        title: "2. Orders & delivery",
        body: [
          "After placing an order a manager contacts you to confirm.",
          "Estimated delivery — 30 minutes. During peak hours or for remote addresses it may take longer.",
          "If delivery is late due to our fault — we refund the delivery fee.",
        ],
      },
      {
        title: "3. Payment",
        body: [
          "Cash to the courier, card to the courier, or online payment.",
          "Prices include VAT.",
        ],
      },
      {
        title: "4. Returns & quality",
        body: [
          "If a dish doesn’t match the order — tell us within 30 minutes after delivery. We will replace it or refund.",
        ],
      },
      {
        title: "5. Liability",
        body: [
          "We are not liable for delays caused by force majeure or an incorrect address.",
        ],
      },
      {
        title: "6. Contacts",
        body: ["hello@bullonipizza.com · +380 67 123 45 67"],
      },
    ],
  },
  ru: {
    updated: "2026-05-18",
    intro:
      "Размещая заказ на bullonipizza.com, вы принимаете эти Условия сервиса.",
    sections: [
      {
        title: "1. Общие положения",
        body: [
          "Сервис доступен лицам от 16 лет. Для заказа с оплатой при получении достаточно корректных контактных данных.",
        ],
      },
      {
        title: "2. Заказы и доставка",
        body: [
          "После оформления менеджер связывается для подтверждения.",
          "Ориентировочное время доставки — 30 минут. В часы пик или удалённые районы время может быть больше.",
          "Если мы не доставили вовремя по нашей вине — компенсируем доставку.",
        ],
      },
      {
        title: "3. Оплата",
        body: [
          "Наличные курьеру, карта курьеру или онлайн-оплата.",
          "Цены указаны с НДС.",
        ],
      },
      {
        title: "4. Возврат и качество",
        body: [
          "Если блюдо не соответствует заказу — сообщите нам в течение 30 минут после доставки. Мы заменим его или вернём деньги.",
        ],
      },
      {
        title: "5. Ответственность",
        body: [
          "Мы не отвечаем за задержки из-за форс-мажора или неверно указанного адреса.",
        ],
      },
      {
        title: "6. Контакты",
        body: ["hello@bullonipizza.com · +380 67 123 45 67"],
      },
    ],
  },
};
