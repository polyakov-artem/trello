export const getKeyWithPrefix = (value: string, prefix: string) =>
  `${prefix}${prefix ? '_' : ''}${value}`;

export const getKeyObj = (value: string[] | string, prefix = '') => {
  const keys = Array.isArray(value) ? value : [value];
  return keys.reduce(
    (acc, key) => ({ ...acc, [getKeyWithPrefix(key, prefix)]: true }),
    {} as Record<string, boolean>
  );
};

export const qKeysMap = {
  getTasks: 'getTasks',
  getBoards: 'getBoards',
  getUsers: 'getUsers',
  getSession: 'getSession',
  getSessionUser: 'getSessionUser',
  getAutoLogin: 'getAutoLogin',
} as const;

export const queryKeys = {
  users: [qKeysMap.getUsers],
  autoLogin: [qKeysMap.getAutoLogin],
  sessionUser: ({ sessionId }: { sessionId: string }) => [
    { sessionId, ...getKeyObj(qKeysMap.getSessionUser) },
  ],
  tasks: ({ sessionId }: { sessionId: string }) => [{ sessionId, ...getKeyObj(qKeysMap.getTasks) }],
  boards: ({ sessionId }: { sessionId: string }) => [
    { sessionId, ...getKeyObj(qKeysMap.getBoards) },
  ],
};

export const mKeysMap = {
  autoLogin: 'autoLogin',
  login: 'login',
  logout: 'logout',
  createUser: 'createUser',
  deleteUser: 'deleteUser',
  updateTask: 'updateTask',
  deleteTask: 'deleteTask',
  createBoard: 'createBoard',
  editBoard: 'editBoard',
  deleteBoard: 'deleteBoard',
  addBoardColumn: 'addBoardColumn',
  deleteBoardColumn: 'deleteBoardColumn',
  createColumnTask: 'createColumnTask',
  moveTask: 'moveTask',
  moveColumn: 'moveColumn',
  task: 'task',
  board: 'board',
  user: 'user',
  sessionId: 'sessionId',
} as const;

export const getBoardKeyObj = ({
  sessionId,
  idOrIds,
}: {
  sessionId: string;
  idOrIds: string[] | string;
}) => {
  return {
    sessionId,
    ...getKeyObj(mKeysMap.board),
    ...getKeyObj(idOrIds, mKeysMap.board),
  };
};

export const getTaskKeyObj = ({
  sessionId,
  idOrIds,
}: {
  sessionId: string;
  idOrIds: string[] | string;
}) => {
  return {
    sessionId,
    ...getKeyObj(mKeysMap.task),
    ...getKeyObj(idOrIds, mKeysMap.task),
  };
};

export const getUserKeyObj = ({
  sessionId,
  idOrIds,
}: {
  sessionId: string;
  idOrIds: string[] | string;
}) => {
  return {
    sessionId,
    ...getKeyObj(mKeysMap.user),
    ...getKeyObj(idOrIds, mKeysMap.user),
  };
};

export const mutationKeys = {
  autoLogin: getKeyObj(mKeysMap.autoLogin),
  login: () => [getKeyObj(mKeysMap.login)],
  logout: ({ sessionId }: { sessionId: string }) => [{ sessionId, ...getKeyObj(mKeysMap.logout) }],
  createUser: [getKeyObj(mKeysMap.createUser)],

  deleteUser: ({ sessionId, userId }: { userId: string; sessionId: string }) => [
    {
      ...getUserKeyObj({ sessionId, idOrIds: userId }),
      ...getKeyObj(mKeysMap.deleteUser),
    },
  ],

  updateTask: ({ sessionId, taskId }: { sessionId: string; taskId: string }) => [
    {
      ...getTaskKeyObj({ sessionId, idOrIds: taskId }),
      ...getKeyObj(mKeysMap.updateTask),
    },
  ],

  deleteTasks: ({
    sessionId,
    tasksIds,
    boardsIds,
  }: {
    sessionId: string;
    tasksIds: string[];
    boardsIds: string[];
  }) => [
    {
      ...getBoardKeyObj({ sessionId, idOrIds: boardsIds }),
      ...getTaskKeyObj({ sessionId, idOrIds: tasksIds }),
      ...getKeyObj(mKeysMap.deleteTask),
    },
  ],

  createBoard: ({ sessionId }: { sessionId: string }) => [
    {
      sessionId,
      ...getKeyObj(mKeysMap.createBoard),
    },
  ],

  editBoard: ({ sessionId, boardId }: { sessionId: string; boardId: string }) => [
    {
      ...getBoardKeyObj({ sessionId, idOrIds: boardId }),
      ...getKeyObj(mKeysMap.editBoard),
    },
  ],
  moveTask: ({ sessionId, boardId }: { sessionId: string; boardId: string }) => [
    {
      ...getBoardKeyObj({ sessionId, idOrIds: boardId }),
      ...getKeyObj(mKeysMap.moveTask),
    },
  ],
  moveColumn: ({ sessionId, boardId }: { sessionId: string; boardId: string }) => [
    {
      ...getBoardKeyObj({ sessionId, idOrIds: boardId }),
      ...getKeyObj(mKeysMap.moveColumn),
    },
  ],

  deleteBoard: ({ sessionId, boardId }: { sessionId: string; boardId: string }) => [
    {
      ...getBoardKeyObj({ sessionId, idOrIds: boardId }),
      ...getKeyObj(mKeysMap.deleteBoard),
    },
  ],

  addBoardColumn: ({ sessionId, boardId }: { sessionId: string; boardId: string }) => [
    {
      ...getBoardKeyObj({ sessionId, idOrIds: boardId }),
      ...getKeyObj(mKeysMap.addBoardColumn),
    },
  ],
  deleteBoardColumn: ({ sessionId, boardId }: { sessionId: string; boardId: string }) => [
    {
      ...getBoardKeyObj({ sessionId, idOrIds: boardId }),
      ...getKeyObj(mKeysMap.deleteBoardColumn),
    },
  ],

  createColumnTask: ({ sessionId, boardId }: { sessionId: string; boardId: string }) => [
    {
      ...getBoardKeyObj({ sessionId, idOrIds: boardId }),
      ...getKeyObj(mKeysMap.createColumnTask),
    },
  ],
};
