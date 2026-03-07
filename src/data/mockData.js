// ==================== TAGS ====================
export const tags = [
  { id: 'tag_1', name: 'Восстановление', color: '#E53E3E', status: 'created', ticketCount: 23, roles: ['Поддержка', 'Администратор'] },
  { id: 'tag_2', name: 'Важно', color: '#C53030', status: 'processed', ticketCount: 15, roles: ['Поддержка', 'Администратор'] },
  { id: 'tag_3', name: 'Разработка', color: '#48BB78', status: 'custom', ticketCount: 8, roles: ['Разработчик', 'Администратор'] },
  { id: 'tag_4', name: 'Отдел безопасности', color: '#ECC94B', status: 'created', ticketCount: 11, roles: ['Администратор'] },
  { id: 'tag_5', name: 'Вопрос', color: '#A0AEC0', status: 'processed', ticketCount: 34, roles: ['Поддержка', 'Сотрудник'] },
  { id: 'tag_6', name: 'Баг', color: '#FC8181', status: 'custom', ticketCount: 19, roles: ['Разработчик', 'Администратор'] },
]

// ==================== ROLES ====================
export const roles = [
  {
    id: 'role_1', name: 'Сотрудник', icon: 'User',
    permissions: { readTickets: true, replyTickets: false, assignTickets: false, blockPlayers: false, manageUsers: false, manageRoles: false, manageTags: false, viewStats: false },
  },
  {
    id: 'role_2', name: 'Поддержка', icon: 'Headset',
    permissions: { readTickets: true, replyTickets: true, assignTickets: true, blockPlayers: true, manageUsers: false, manageRoles: false, manageTags: false, viewStats: true },
  },
  {
    id: 'role_3', name: 'Разработчик', icon: 'Code',
    permissions: { readTickets: true, replyTickets: true, assignTickets: false, blockPlayers: false, manageUsers: false, manageRoles: false, manageTags: true, viewStats: true },
  },
  {
    id: 'role_4', name: 'Администратор', icon: 'Shield',
    permissions: { readTickets: true, replyTickets: true, assignTickets: true, blockPlayers: true, manageUsers: true, manageRoles: true, manageTags: true, viewStats: true },
  },
]

// ==================== STAFF ====================
export const staff = [
  {
    id: 'staff_1', login: 'alex_sup', firstName: 'Александр', lastName: 'Петров',
    avatar: null, roles: ['Поддержка'], status: 'online', isTrainee: false, mentorId: null, blockedPlayers: ['player_bad1'],
    stats: { totalTickets: 142, avgResponseTime: 180, todayTickets: 12 },
  },
  {
    id: 'staff_2', login: 'maria_dev', firstName: 'Мария', lastName: 'Иванова',
    avatar: null, roles: ['Разработчик'], status: 'on_shift', isTrainee: false, mentorId: null, blockedPlayers: [],
    stats: { totalTickets: 89, avgResponseTime: 240, todayTickets: 5 },
  },
  {
    id: 'staff_3', login: 'ivan_admin', firstName: 'Иван', lastName: 'Козлов',
    avatar: null, roles: ['Администратор'], status: 'online', isTrainee: false, mentorId: null, blockedPlayers: ['player_bad2', 'player_bad3'],
    stats: { totalTickets: 256, avgResponseTime: 120, todayTickets: 18 },
  },
  {
    id: 'staff_4', login: 'olga_sup', firstName: 'Ольга', lastName: 'Смирнова',
    avatar: null, roles: ['Поддержка'], status: 'offline', isTrainee: false, mentorId: null, blockedPlayers: [],
    stats: { totalTickets: 198, avgResponseTime: 150, todayTickets: 0 },
  },
  {
    id: 'staff_5', login: 'dima_trainee', firstName: 'Дмитрий', lastName: 'Волков',
    avatar: null, roles: ['Сотрудник'], status: 'on_shift', isTrainee: true, mentorId: 'staff_1', blockedPlayers: [],
    stats: { totalTickets: 23, avgResponseTime: 360, todayTickets: 3 },
  },
  {
    id: 'staff_6', login: 'anna_sup', firstName: 'Анна', lastName: 'Морозова',
    avatar: null, roles: ['Поддержка'], status: 'break', isTrainee: false, mentorId: null, blockedPlayers: [],
    stats: { totalTickets: 167, avgResponseTime: 200, todayTickets: 8 },
  },
  {
    id: 'staff_7', login: 'nikita_dev', firstName: 'Никита', lastName: 'Лебедев',
    avatar: null, roles: ['Разработчик', 'Поддержка'], status: 'online', isTrainee: false, mentorId: null, blockedPlayers: [],
    stats: { totalTickets: 74, avgResponseTime: 300, todayTickets: 2 },
  },
]

// ==================== TICKETS ====================
export const tickets = [
  {
    id: 'TKT-001', userId: 'player_123', playerNick: 'Murka', platform: 'telegram',
    status: 'open', priority: 5, tags: ['Восстановление', 'Важно'], assignedTo: 'staff_1',
    createdAt: '2025-01-15T10:30:00', lastMessage: 'Помогите, меня взломали и украли все вещи!',
    unread: true,
    messages: [
      { id: 'msg_001', ticketId: 'TKT-001', from: 'player', text: 'Привет! Помогите пожалуйста, меня взломали!', attachments: [], timestamp: '2025-01-15T10:30:00', isInternal: false },
      { id: 'msg_002', ticketId: 'TKT-001', from: 'staff', text: 'Здравствуйте! Опишите подробнее, что произошло.', attachments: [], timestamp: '2025-01-15T10:32:00', isInternal: false },
      { id: 'msg_003', ticketId: 'TKT-001', from: 'player', text: 'Я зашёл на сервер, а у меня все вещи пропали. Думаю это сделал DragonSlayer, он крутился рядом с моей базой.', attachments: [], timestamp: '2025-01-15T10:33:00', isInternal: false },
      { id: 'msg_004', ticketId: 'TKT-001', from: 'staff', text: 'Проверил логи — последний вход был с другого IP. Возможно, это связано с ShadowNinja, он тоже заходил в этот район.', attachments: [], timestamp: '2025-01-15T10:35:00', isInternal: true },
      { id: 'msg_005', ticketId: 'TKT-001', from: 'staff', text: 'Мы проверим активность DragonSlayer и ShadowNinja в районе вашей базы. Ожидайте.', attachments: [], timestamp: '2025-01-15T10:38:00', isInternal: false },
      { id: 'msg_006', ticketId: 'TKT-001', from: 'player', text: 'Спасибо! Ещё CreeperHunter видел кого-то подозрительного, можете у него спросить.', attachments: [], timestamp: '2025-01-15T10:40:00', isInternal: false },
    ],
  },
  {
    id: 'TKT-002', userId: 'player_456', playerNick: 'DragonSlayer', platform: 'discord',
    status: 'in_progress', priority: 3, tags: ['Вопрос'], assignedTo: 'staff_3',
    createdAt: '2025-01-15T09:15:00', lastMessage: 'Когда будет обновление 2.0?',
    unread: false,
    messages: [
      { id: 'msg_010', ticketId: 'TKT-002', from: 'player', text: 'Привет! Когда будет обновление 2.0?', attachments: [], timestamp: '2025-01-15T09:15:00', isInternal: false },
      { id: 'msg_011', ticketId: 'TKT-002', from: 'staff', text: 'Обновление запланировано на конец месяца. Следите за новостями!', attachments: [], timestamp: '2025-01-15T09:20:00', isInternal: false },
      { id: 'msg_012', ticketId: 'TKT-002', from: 'player', text: 'Когда будет обновление 2.0?', attachments: [], timestamp: '2025-01-15T09:25:00', isInternal: false },
    ],
  },
  {
    id: 'TKT-003', userId: 'player_789', playerNick: 'CreeperHunter', platform: 'vk',
    status: 'open', priority: 4, tags: ['Баг', 'Важно'], assignedTo: 'staff_2',
    createdAt: '2025-01-15T08:00:00', lastMessage: 'Не работает команда /home',
    unread: true,
    messages: [
      { id: 'msg_020', ticketId: 'TKT-003', from: 'player', text: 'Команда /home не телепортирует домой, выдаёт ошибку', attachments: [], timestamp: '2025-01-15T08:00:00', isInternal: false },
      { id: 'msg_021', ticketId: 'TKT-003', from: 'bot', text: 'Ваше обращение принято. Ожидайте ответа сотрудника.', attachments: [], timestamp: '2025-01-15T08:00:01', isInternal: false },
      { id: 'msg_022', ticketId: 'TKT-003', from: 'staff', text: 'Проверю баг с /home, спасибо за репорт.', attachments: [], timestamp: '2025-01-15T08:15:00', isInternal: false },
      { id: 'msg_023', ticketId: 'TKT-003', from: 'player', text: 'Не работает команда /home', attachments: [], timestamp: '2025-01-15T08:20:00', isInternal: false },
    ],
  },
  {
    id: 'TKT-004', userId: 'player_101', playerNick: 'PixelMaster', platform: 'email',
    status: 'closed', priority: 1, tags: ['Вопрос'], assignedTo: 'staff_4',
    createdAt: '2025-01-14T14:00:00', lastMessage: 'Спасибо за помощь!',
    unread: false,
    messages: [
      { id: 'msg_030', ticketId: 'TKT-004', from: 'player', text: 'Как купить VIP статус?', attachments: [], timestamp: '2025-01-14T14:00:00', isInternal: false },
      { id: 'msg_031', ticketId: 'TKT-004', from: 'staff', text: 'Здравствуйте! VIP можно приобрести на сайте в разделе "Донат".', attachments: [], timestamp: '2025-01-14T14:10:00', isInternal: false },
      { id: 'msg_032', ticketId: 'TKT-004', from: 'player', text: 'Спасибо за помощь!', attachments: [], timestamp: '2025-01-14T14:15:00', isInternal: false },
    ],
  },
  {
    id: 'TKT-005', userId: 'player_202', playerNick: 'ShadowNinja', platform: 'telegram',
    status: 'open', priority: 4, tags: ['Отдел безопасности'], assignedTo: null,
    createdAt: '2025-01-15T11:00:00', lastMessage: 'Игрок XxDestroyerxX использует читы',
    unread: true,
    messages: [
      { id: 'msg_040', ticketId: 'TKT-005', from: 'player', text: 'Игрок XxDestroyerxX использует читы! Он летает и бьёт через стены! Я был вместе с Murka и DragonSlayer, они тоже это видели.', attachments: [], timestamp: '2025-01-15T11:00:00', isInternal: false },
      { id: 'msg_041', ticketId: 'TKT-005', from: 'bot', text: 'Ваше обращение принято. Ожидайте ответа сотрудника.', attachments: [], timestamp: '2025-01-15T11:00:01', isInternal: false },
      { id: 'msg_042', ticketId: 'TKT-005', from: 'staff', text: 'Спасибо за репорт! Свяжемся с Murka и DragonSlayer для подтверждения. PixelMaster тоже недавно жаловался на этого игрока.', attachments: [], timestamp: '2025-01-15T11:10:00', isInternal: false },
      { id: 'msg_043', ticketId: 'TKT-005', from: 'staff', text: 'По логам CreeperHunter тоже пересекался с этим читером вчера. Нужно собрать показания.', attachments: [], timestamp: '2025-01-15T11:12:00', isInternal: true },
    ],
  },
  {
    id: 'TKT-006', userId: 'player_303', playerNick: 'BuilderPro', platform: 'discord',
    status: 'in_progress', priority: 2, tags: ['Вопрос'], assignedTo: 'staff_5',
    createdAt: '2025-01-15T07:30:00', lastMessage: 'Можно ли получить роль строителя?',
    unread: false,
    messages: [
      { id: 'msg_050', ticketId: 'TKT-006', from: 'player', text: 'Хочу стать строителем на сервере. Что нужно?', attachments: [], timestamp: '2025-01-15T07:30:00', isInternal: false },
      { id: 'msg_051', ticketId: 'TKT-006', from: 'staff', text: 'Покажите портфолио своих построек, и мы рассмотрим вашу заявку.', attachments: [], timestamp: '2025-01-15T07:45:00', isInternal: false },
      { id: 'msg_052', ticketId: 'TKT-006', from: 'player', text: 'Можно ли получить роль строителя?', attachments: [], timestamp: '2025-01-15T08:00:00', isInternal: false },
    ],
  },
  {
    id: 'TKT-007', userId: 'player_404', playerNick: 'EnderKnight', platform: 'vk',
    status: 'archived', priority: 0, tags: ['Вопрос'], assignedTo: 'staff_1',
    createdAt: '2025-01-10T12:00:00', lastMessage: 'Понял, спасибо',
    unread: false,
    messages: [
      { id: 'msg_060', ticketId: 'TKT-007', from: 'player', text: 'Как скачать моды для сервера?', attachments: [], timestamp: '2025-01-10T12:00:00', isInternal: false },
      { id: 'msg_061', ticketId: 'TKT-007', from: 'staff', text: 'Моды доступны в нашем лаунчере автоматически.', attachments: [], timestamp: '2025-01-10T12:15:00', isInternal: false },
      { id: 'msg_062', ticketId: 'TKT-007', from: 'player', text: 'Понял, спасибо', attachments: [], timestamp: '2025-01-10T12:20:00', isInternal: false },
    ],
  },
  {
    id: 'TKT-008', userId: 'player_505', playerNick: 'RedstoneGuru', platform: 'telegram',
    status: 'open', priority: 3, tags: ['Баг', 'Разработка'], assignedTo: 'staff_7',
    createdAt: '2025-01-15T06:45:00', lastMessage: 'Редстоун не работает в некоторых чанках',
    unread: true,
    messages: [
      { id: 'msg_070', ticketId: 'TKT-008', from: 'player', text: 'Редстоун механизмы ломаются при переходе между чанками', attachments: [], timestamp: '2025-01-15T06:45:00', isInternal: false },
      { id: 'msg_071', ticketId: 'TKT-008', from: 'staff', text: 'Можете указать координаты проблемных чанков?', attachments: [], timestamp: '2025-01-15T07:00:00', isInternal: false },
      { id: 'msg_072', ticketId: 'TKT-008', from: 'player', text: 'Редстоун не работает в некоторых чанках', attachments: [], timestamp: '2025-01-15T07:10:00', isInternal: false },
      { id: 'msg_073', ticketId: 'TKT-008', from: 'staff', text: 'Похоже на баг с границами чанков, передаю разработчикам', attachments: [], timestamp: '2025-01-15T07:15:00', isInternal: true },
    ],
  },
  {
    id: 'TKT-009', userId: 'player_606', playerNick: 'DiamondQueen', platform: 'discord',
    status: 'closed', priority: 2, tags: ['Восстановление'], assignedTo: 'staff_6',
    createdAt: '2025-01-14T16:00:00', lastMessage: 'Всё восстановлено, спасибо!',
    unread: false,
    messages: [
      { id: 'msg_080', ticketId: 'TKT-009', from: 'player', text: 'Потеряла предметы из-за лага сервера', attachments: [], timestamp: '2025-01-14T16:00:00', isInternal: false },
      { id: 'msg_081', ticketId: 'TKT-009', from: 'staff', text: 'Проверю логи и восстановлю инвентарь.', attachments: [], timestamp: '2025-01-14T16:30:00', isInternal: false },
      { id: 'msg_082', ticketId: 'TKT-009', from: 'system', text: 'Инвентарь восстановлен из бэкапа', attachments: [], timestamp: '2025-01-14T17:00:00', isInternal: false },
      { id: 'msg_083', ticketId: 'TKT-009', from: 'player', text: 'Всё восстановлено, спасибо!', attachments: [], timestamp: '2025-01-14T17:05:00', isInternal: false },
    ],
  },
  {
    id: 'TKT-010', userId: 'player_707', playerNick: 'TNT_Lover', platform: 'email',
    status: 'in_progress', priority: 5, tags: ['Отдел безопасности', 'Важно'], assignedTo: 'staff_3',
    createdAt: '2025-01-15T05:00:00', lastMessage: 'Массовый гриф на спавне!',
    unread: true,
    messages: [
      { id: 'msg_090', ticketId: 'TKT-010', from: 'player', text: 'Кто-то разрушил весь спавн! Массовый гриф!', attachments: [], timestamp: '2025-01-15T05:00:00', isInternal: false },
      { id: 'msg_091', ticketId: 'TKT-010', from: 'staff', text: 'Спасибо за сигнал! Начинаем расследование.', attachments: [], timestamp: '2025-01-15T05:10:00', isInternal: false },
      { id: 'msg_092', ticketId: 'TKT-010', from: 'staff', text: 'По логам нашёл 3 аккаунта, готовлю баны', attachments: [], timestamp: '2025-01-15T05:15:00', isInternal: true },
      { id: 'msg_093', ticketId: 'TKT-010', from: 'player', text: 'Массовый гриф на спавне!', attachments: [], timestamp: '2025-01-15T05:20:00', isInternal: false },
    ],
  },
  {
    id: 'TKT-011', userId: 'player_808', playerNick: 'FarmKing', platform: 'telegram',
    status: 'open', priority: 1, tags: ['Вопрос'], assignedTo: 'staff_6',
    createdAt: '2025-01-15T12:00:00', lastMessage: 'Как создать свой клан?',
    unread: false,
    messages: [
      { id: 'msg_100', ticketId: 'TKT-011', from: 'player', text: 'Как создать свой клан на сервере?', attachments: [], timestamp: '2025-01-15T12:00:00', isInternal: false },
      { id: 'msg_101', ticketId: 'TKT-011', from: 'bot', text: 'Используйте команду /clan create <название>. Стоимость: 1000 монет.', attachments: [], timestamp: '2025-01-15T12:00:01', isInternal: false },
    ],
  },
  {
    id: 'TKT-012', userId: 'player_909', playerNick: 'NetherWalker', platform: 'vk',
    status: 'in_progress', priority: 3, tags: ['Баг'], assignedTo: 'staff_2',
    createdAt: '2025-01-15T04:30:00', lastMessage: 'Портал в ад не работает',
    unread: false,
    messages: [
      { id: 'msg_110', ticketId: 'TKT-012', from: 'player', text: 'Портал в ад не работает, стою в нём и ничего не происходит', attachments: [], timestamp: '2025-01-15T04:30:00', isInternal: false },
      { id: 'msg_111', ticketId: 'TKT-012', from: 'staff', text: 'Проблема известна, сейчас чиним.', attachments: [], timestamp: '2025-01-15T04:45:00', isInternal: false },
    ],
  },
  {
    id: 'TKT-013', userId: 'player_111', playerNick: 'WoolCrafter', platform: 'discord',
    status: 'closed', priority: 0, tags: ['Вопрос'], assignedTo: 'staff_5',
    createdAt: '2025-01-13T10:00:00', lastMessage: 'Понятно, благодарю!',
    unread: false,
    messages: [
      { id: 'msg_120', ticketId: 'TKT-013', from: 'player', text: 'Где находится рынок?', attachments: [], timestamp: '2025-01-13T10:00:00', isInternal: false },
      { id: 'msg_121', ticketId: 'TKT-013', from: 'staff', text: 'Рынок находится на координатах 100, 64, -200. Или введите /warp market', attachments: [], timestamp: '2025-01-13T10:05:00', isInternal: false },
      { id: 'msg_122', ticketId: 'TKT-013', from: 'player', text: 'Понятно, благодарю!', attachments: [], timestamp: '2025-01-13T10:10:00', isInternal: false },
    ],
  },
]

// ==================== TASKS ====================
export const tasks = [
  { id: 'task_1', title: 'Обновить плагин WorldEdit', status: 'new', priority: 3, assignedTo: 'staff_2', deadline: '2025-01-20', tags: ['Разработка'], description: 'Обновить до версии 7.3.0' },
  { id: 'task_2', title: 'Написать правила для нового сезона', status: 'in_progress', priority: 4, assignedTo: 'staff_3', deadline: '2025-01-18', tags: ['Важно'], description: 'Правила PvP арены и новых механик' },
  { id: 'task_3', title: 'Проверить жалобы за неделю', status: 'in_progress', priority: 2, assignedTo: 'staff_1', deadline: '2025-01-16', tags: ['Вопрос'], description: 'Пройтись по всем открытым жалобам' },
  { id: 'task_4', title: 'Настроить автоответы для FAQ', status: 'review', priority: 1, assignedTo: 'staff_6', deadline: '2025-01-22', tags: ['Вопрос'], description: 'Добавить автоответы на частые вопросы' },
  { id: 'task_5', title: 'Расследовать дюп баг', status: 'new', priority: 5, assignedTo: 'staff_7', deadline: '2025-01-16', tags: ['Баг', 'Важно'], description: 'Игроки дюпают алмазы через крафт' },
  { id: 'task_6', title: 'Обучить нового стажёра', status: 'in_progress', priority: 2, assignedTo: 'staff_1', deadline: '2025-01-25', tags: [], description: 'Провести обучение Дмитрия' },
  { id: 'task_7', title: 'Бэкап сервера', status: 'completed', priority: 3, assignedTo: 'staff_3', deadline: '2025-01-14', tags: ['Разработка'], description: 'Полный бэкап всех миров' },
  { id: 'task_8', title: 'Создать карту спавна', status: 'new', priority: 1, assignedTo: 'staff_5', deadline: '2025-01-28', tags: [], description: 'Нарисовать карту для новых игроков' },
  { id: 'task_9', title: 'Обновить MOTD сервера', status: 'review', priority: 1, assignedTo: 'staff_2', deadline: '2025-01-17', tags: ['Разработка'], description: 'Новое приветственное сообщение' },
  { id: 'task_10', title: 'Забанить читеров по отчётам', status: 'completed', priority: 4, assignedTo: 'staff_3', deadline: '2025-01-15', tags: ['Отдел безопасности'], description: 'Обработать 5 репортов' },
]

// ==================== SHIFTS ====================
// Helper: get dates for current week (Mon-Sun)
const _today = new Date()
const _dayOfWeek = _today.getDay() === 0 ? 6 : _today.getDay() - 1
const _monday = new Date(_today)
_monday.setDate(_today.getDate() - _dayOfWeek)
const _weekDates = Array.from({ length: 7 }, (_, i) => {
  const d = new Date(_monday)
  d.setDate(_monday.getDate() + i)
  return d.toISOString().split('T')[0]
})
const _todayStr = _today.toISOString().split('T')[0]

export const shifts = [
  // Today
  { id: 'shift_1', name: 'Утренняя смена', date: _todayStr, startTime: '08:00', endTime: '12:00', staff: ['staff_5', 'staff_7'], payTokens: 40, status: 'ended' },
  { id: 'shift_2', name: 'Дневная смена', date: _todayStr, startTime: '12:00', endTime: '18:00', staff: ['staff_1', 'staff_2', 'staff_6'], payTokens: 50, status: 'active' },
  { id: 'shift_3', name: 'Вечерняя смена', date: _todayStr, startTime: '18:00', endTime: '23:00', staff: ['staff_3', 'staff_4'], payTokens: 60, status: 'scheduled' },
  { id: 'shift_4', name: 'Ночная смена', date: _todayStr, startTime: '23:00', endTime: '08:00', staff: ['staff_7'], payTokens: 70, status: 'scheduled' },
  // Monday
  { id: 'shift_5', name: 'Утренняя смена', date: _weekDates[0], startTime: '09:00', endTime: '13:00', staff: ['staff_1', 'staff_5'], payTokens: 40, status: 'ended' },
  { id: 'shift_6', name: 'Дневная смена', date: _weekDates[0], startTime: '13:00', endTime: '19:00', staff: ['staff_2', 'staff_3', 'staff_6'], payTokens: 55, status: 'ended' },
  // Tuesday
  { id: 'shift_7', name: 'Утренняя смена', date: _weekDates[1], startTime: '08:00', endTime: '14:00', staff: ['staff_4', 'staff_7'], payTokens: 45, status: 'ended' },
  { id: 'shift_8', name: 'Вечерняя смена', date: _weekDates[1], startTime: '17:00', endTime: '23:00', staff: ['staff_1', 'staff_6'], payTokens: 60, status: 'ended' },
  // Wednesday
  { id: 'shift_9', name: 'Утренняя смена', date: _weekDates[2], startTime: '07:00', endTime: '12:00', staff: ['staff_3', 'staff_5'], payTokens: 40, status: 'ended' },
  { id: 'shift_10', name: 'Дневная смена', date: _weekDates[2], startTime: '12:00', endTime: '18:00', staff: ['staff_1', 'staff_2', 'staff_7'], payTokens: 50, status: 'ended' },
  { id: 'shift_11', name: 'Ночная смена', date: _weekDates[2], startTime: '22:00', endTime: '06:00', staff: ['staff_4'], payTokens: 75, status: 'ended' },
  // Thursday
  { id: 'shift_12', name: 'Утренняя смена', date: _weekDates[3], startTime: '08:00', endTime: '14:00', staff: ['staff_6', 'staff_7'], payTokens: 45, status: 'ended' },
  { id: 'shift_13', name: 'Вечерняя смена', date: _weekDates[3], startTime: '16:00', endTime: '22:00', staff: ['staff_1', 'staff_3', 'staff_5'], payTokens: 55, status: 'ended' },
  // Friday
  { id: 'shift_14', name: 'Дневная смена', date: _weekDates[4], startTime: '10:00', endTime: '16:00', staff: ['staff_2', 'staff_4', 'staff_6'], payTokens: 50, status: 'ended' },
  { id: 'shift_15', name: 'Вечерняя смена', date: _weekDates[4], startTime: '18:00', endTime: '00:00', staff: ['staff_1', 'staff_7'], payTokens: 65, status: 'ended' },
  // Saturday
  { id: 'shift_16', name: 'Дневная смена', date: _weekDates[5], startTime: '10:00', endTime: '18:00', staff: ['staff_1', 'staff_2', 'staff_3', 'staff_5', 'staff_6'], payTokens: 60, status: 'ended' },
  { id: 'shift_17', name: 'Ночная смена', date: _weekDates[5], startTime: '22:00', endTime: '06:00', staff: ['staff_7', 'staff_4'], payTokens: 80, status: 'ended' },
  // Sunday
  { id: 'shift_18', name: 'Утренняя смена', date: _weekDates[6], startTime: '09:00', endTime: '15:00', staff: ['staff_3', 'staff_5'], payTokens: 45, status: 'ended' },
  { id: 'shift_19', name: 'Вечерняя смена', date: _weekDates[6], startTime: '15:00', endTime: '21:00', staff: ['staff_1', 'staff_6', 'staff_7'], payTokens: 55, status: 'ended' },
]

// ==================== SHIFT LOGS ====================
export const shiftLogs = [
  { id: 'sl_1', shiftId: 'shift_1', staffId: 'staff_5', type: 'start', time: '08:02', text: 'Дмитрий начал утреннюю смену' },
  { id: 'sl_2', shiftId: 'shift_1', staffId: 'staff_7', type: 'start', time: '08:05', text: 'Никита начал утреннюю смену' },
  { id: 'sl_3', shiftId: 'shift_1', staffId: 'staff_5', type: 'ticket', time: '08:30', text: 'Дмитрий ответил на TKT-006' },
  { id: 'sl_4', shiftId: 'shift_1', staffId: 'staff_7', type: 'ticket', time: '09:15', text: 'Никита принял TKT-008' },
  { id: 'sl_5', shiftId: 'shift_1', staffId: 'staff_5', type: 'break_start', time: '10:00', text: 'Дмитрий ушёл на перерыв' },
  { id: 'sl_6', shiftId: 'shift_1', staffId: 'staff_5', type: 'break_end', time: '10:15', text: 'Дмитрий вернулся с перерыва' },
  { id: 'sl_7', shiftId: 'shift_1', staffId: 'staff_7', type: 'ticket', time: '10:45', text: 'Никита закрыл TKT-013' },
  { id: 'sl_8', shiftId: 'shift_1', staffId: 'staff_5', type: 'end', time: '11:58', text: 'Дмитрий завершил утреннюю смену' },
  { id: 'sl_9', shiftId: 'shift_1', staffId: 'staff_7', type: 'end', time: '12:00', text: 'Никита завершил утреннюю смену' },
  { id: 'sl_10', shiftId: 'shift_2', staffId: 'staff_1', type: 'start', time: '12:03', text: 'Александр начал дневную смену' },
  { id: 'sl_11', shiftId: 'shift_2', staffId: 'staff_2', type: 'start', time: '12:05', text: 'Мария начала дневную смену' },
  { id: 'sl_12', shiftId: 'shift_2', staffId: 'staff_6', type: 'start', time: '12:07', text: 'Анна начала дневную смену' },
  { id: 'sl_13', shiftId: 'shift_2', staffId: 'staff_1', type: 'ticket', time: '12:20', text: 'Александр принял TKT-001' },
  { id: 'sl_14', shiftId: 'shift_2', staffId: 'staff_6', type: 'ticket', time: '12:35', text: 'Анна ответила на TKT-011' },
  { id: 'sl_15', shiftId: 'shift_2', staffId: 'staff_2', type: 'ticket', time: '12:50', text: 'Мария работает над TKT-003' },
  { id: 'sl_16', shiftId: 'shift_2', staffId: 'staff_6', type: 'break_start', time: '13:30', text: 'Анна ушла на перерыв' },
  { id: 'sl_17', shiftId: 'shift_2', staffId: 'staff_6', type: 'break_end', time: '13:45', text: 'Анна вернулась с перерыва' },
  { id: 'sl_18', shiftId: 'shift_2', staffId: 'staff_1', type: 'ticket', time: '14:10', text: 'Александр закрыл TKT-004' },
]

// ==================== WEEKLY STATS ====================
export const weeklyStats = [
  { day: 'Пн', tickets: 18, resolved: 15, avgTime: 200 },
  { day: 'Вт', tickets: 24, resolved: 20, avgTime: 180 },
  { day: 'Ср', tickets: 31, resolved: 28, avgTime: 150 },
  { day: 'Чт', tickets: 22, resolved: 19, avgTime: 210 },
  { day: 'Пт', tickets: 35, resolved: 30, avgTime: 170 },
  { day: 'Сб', tickets: 42, resolved: 38, avgTime: 140 },
  { day: 'Вс', tickets: 28, resolved: 25, avgTime: 190 },
]

// ==================== QUICK REPLIES ====================
export const quickReplies = [
  { id: 'qr_1', title: 'Приветствие', text: 'Здравствуйте! Чем могу помочь?', category: 'Общие' },
  { id: 'qr_2', title: 'Ожидание', text: 'Спасибо за обращение! Мы рассмотрим вашу заявку в ближайшее время.', category: 'Общие' },
  { id: 'qr_3', title: 'Восстановление', text: 'Мы проверим логи и восстановим ваш инвентарь в течение 24 часов.', category: 'Восстановление' },
  { id: 'qr_4', title: 'Бан', text: 'Ваша жалоба принята. Мы проведём расследование и примем меры.', category: 'Безопасность' },
  { id: 'qr_5', title: 'Закрытие', text: 'Рад, что смогли помочь! Если возникнут вопросы — обращайтесь.', category: 'Общие' },
  { id: 'qr_6', title: 'VIP', text: 'VIP статус можно приобрести на нашем сайте в разделе "Донат".', category: 'FAQ' },
  { id: 'qr_7', title: 'Правила', text: 'Ознакомьтесь с правилами на нашем сайте или введите /rules в игре.', category: 'FAQ' },
]

// ==================== PLAYER PROFILES ====================
export const playerProfiles = [
  {
    nick: 'Murka', platforms: ['telegram', 'discord'], labels: ['VIP'],
    totalTickets: 3, serverStats: { playTime: '342h', lastSeen: '2 часа назад', joinDate: '12.03.2024' },
    recentTickets: [
      { id: 'TKT-001', subject: 'Взлом аккаунта', status: 'open' },
      { id: 'TKT-044', subject: 'Вопрос по донату', status: 'closed' },
    ],
  },
  {
    nick: 'DragonSlayer', platforms: ['discord'], labels: ['Trusted'],
    totalTickets: 7, serverStats: { playTime: '1204h', lastSeen: '5 мин назад', joinDate: '01.01.2023' },
    recentTickets: [
      { id: 'TKT-002', subject: 'Обновление 2.0', status: 'in_progress' },
      { id: 'TKT-038', subject: 'Лаги на PvP', status: 'closed' },
      { id: 'TKT-029', subject: 'Баг с мечом', status: 'closed' },
    ],
  },
  {
    nick: 'CreeperHunter', platforms: ['vk'], labels: [],
    totalTickets: 2, serverStats: { playTime: '89h', lastSeen: '1 день назад', joinDate: '15.09.2024' },
    recentTickets: [
      { id: 'TKT-003', subject: 'Баг /home', status: 'open' },
    ],
  },
  {
    nick: 'PixelMaster', platforms: ['email'], labels: [],
    totalTickets: 1, serverStats: { playTime: '15h', lastSeen: '3 дня назад', joinDate: '10.01.2025' },
    recentTickets: [
      { id: 'TKT-004', subject: 'Покупка VIP', status: 'closed' },
    ],
  },
  {
    nick: 'ShadowNinja', platforms: ['telegram', 'vk'], labels: ['Trusted'],
    totalTickets: 5, serverStats: { playTime: '567h', lastSeen: '20 мин назад', joinDate: '05.06.2023' },
    recentTickets: [
      { id: 'TKT-005', subject: 'Читер XxDestroyerxX', status: 'open' },
      { id: 'TKT-033', subject: 'Гриф базы', status: 'closed' },
    ],
  },
  {
    nick: 'BuilderPro', platforms: ['discord'], labels: ['VIP'],
    totalTickets: 4, serverStats: { playTime: '890h', lastSeen: '1 час назад', joinDate: '20.03.2023' },
    recentTickets: [
      { id: 'TKT-006', subject: 'Роль строителя', status: 'in_progress' },
    ],
  },
  {
    nick: 'RedstoneGuru', platforms: ['telegram'], labels: ['VIP', 'Trusted'],
    totalTickets: 6, serverStats: { playTime: '2100h', lastSeen: '10 мин назад', joinDate: '15.02.2022' },
    recentTickets: [
      { id: 'TKT-008', subject: 'Баг редстоуна', status: 'open' },
      { id: 'TKT-025', subject: 'Пропали механизмы', status: 'closed' },
    ],
  },
  {
    nick: 'TNT_Lover', platforms: ['email', 'discord'], labels: [],
    totalTickets: 2, serverStats: { playTime: '45h', lastSeen: '6 часов назад', joinDate: '01.12.2024' },
    recentTickets: [
      { id: 'TKT-010', subject: 'Гриф спавна', status: 'in_progress' },
    ],
  },
  {
    nick: 'FarmKing', platforms: ['telegram'], labels: [],
    totalTickets: 1, serverStats: { playTime: '230h', lastSeen: '3 часа назад', joinDate: '08.08.2024' },
    recentTickets: [
      { id: 'TKT-011', subject: 'Создание клана', status: 'open' },
    ],
  },
  {
    nick: 'NetherWalker', platforms: ['vk'], labels: ['Trusted'],
    totalTickets: 3, serverStats: { playTime: '678h', lastSeen: '45 мин назад', joinDate: '22.04.2023' },
    recentTickets: [
      { id: 'TKT-012', subject: 'Портал не работает', status: 'in_progress' },
    ],
  },
  {
    nick: 'EnderKnight', platforms: ['vk'], labels: [],
    totalTickets: 1, serverStats: { playTime: '120h', lastSeen: '5 дней назад', joinDate: '30.11.2024' },
    recentTickets: [
      { id: 'TKT-007', subject: 'Моды для сервера', status: 'archived' },
    ],
  },
  {
    nick: 'DiamondQueen', platforms: ['discord'], labels: ['VIP'],
    totalTickets: 4, serverStats: { playTime: '450h', lastSeen: '2 часа назад', joinDate: '14.07.2023' },
    recentTickets: [
      { id: 'TKT-009', subject: 'Потеря предметов', status: 'closed' },
    ],
  },
  {
    nick: 'WoolCrafter', platforms: ['discord'], labels: [],
    totalTickets: 1, serverStats: { playTime: '34h', lastSeen: '2 дня назад', joinDate: '25.12.2024' },
    recentTickets: [
      { id: 'TKT-013', subject: 'Где рынок', status: 'closed' },
    ],
  },
]

// ==================== INCIDENTS ====================
export const incidents = [
  {
    id: 'INC-001',
    name: 'Массовый гриф 15.01',
    description: 'Группа игроков разрушила постройки в зоне спавна и на нескольких базах. Затронуто более 10 игроков.',
    severity: 'critical',
    status: 'active',
    createdAt: '2025-01-15T06:00:00',
    createdBy: 'staff_1',
    linkedTicketIds: ['TKT-001', 'TKT-003', 'TKT-005', 'TKT-010'],
    broadcastLog: [
      { id: 'bc_001', text: 'Мы в курсе проблемы с разрушением построек. Ведётся расследование.', sentAt: '2025-01-15T07:00:00', sentBy: 'staff_1', ticketCount: 4 },
    ],
  },
  {
    id: 'INC-002',
    name: 'Дюп алмазов',
    description: 'Обнаружен баг с дюпликацией алмазов через крафт-стол. Экономика сервера под угрозой.',
    severity: 'high',
    status: 'active',
    createdAt: '2025-01-14T18:00:00',
    createdBy: 'staff_3',
    linkedTicketIds: ['TKT-002', 'TKT-008'],
    broadcastLog: [
      { id: 'bc_010', text: 'Баг с дюпликацией найден и передан разработчикам. Алмазы будут откачены.', sentAt: '2025-01-14T19:30:00', sentBy: 'staff_3', ticketCount: 2 },
    ],
  },
  {
    id: 'INC-003',
    name: 'DDoS атака 12.01',
    description: 'Серия DDoS атак на игровые сервера, вызвавшая лаги и дисконнекты у всех игроков.',
    severity: 'critical',
    status: 'resolved',
    createdAt: '2025-01-12T03:00:00',
    createdBy: 'staff_1',
    linkedTicketIds: ['TKT-006', 'TKT-007', 'TKT-009', 'TKT-011', 'TKT-012'],
    broadcastLog: [
      { id: 'bc_020', text: 'Сервер подвергся DDoS-атаке. Мы работаем над восстановлением.', sentAt: '2025-01-12T03:30:00', sentBy: 'staff_1', ticketCount: 5 },
      { id: 'bc_021', text: 'Защита установлена, сервер стабилизирован. Приносим извинения за неудобства.', sentAt: '2025-01-12T08:00:00', sentBy: 'staff_1', ticketCount: 5 },
    ],
  },
]

// ==================== HELPERS ====================
export const getTicketById = (id) => tickets.find(t => t.id === id)
export const getStaffById = (id) => staff.find(s => s.id === id)
export const getStaffByRole = (role) => staff.filter(s => s.roles.includes(role))
export const getTagByName = (name) => tags.find(t => t.name === name)
