import express, { type Request, type Response } from 'express';
import cors from 'cors';
import { nanoid } from 'nanoid';
import fs from 'fs/promises';
import path from 'path';

/* -------------------------------------------------------------------------- */
/*                                    Types                                   */
/* -------------------------------------------------------------------------- */

type User = {
  id: string;
  name: string;
  avatarId: string;
};

type Session = {
  sessionId: string;
  userId: string;
};

type Task = {
  id: string;
  authorId: string;
  title: string;
  description: string;
  completed: boolean;
};

type BoardColumn = {
  id: string;
  title: string;
  tasksIds: string[];
};

type Board = {
  id: string;
  authorId: string;
  title: string;
  columns: BoardColumn[];
};

/* ---------- Request body types ---------- */

type CreateUserBody = {
  name: string;
  avatarId: string;
};

type CreateTaskBody = {
  title?: string;
  description?: string;
  completed?: boolean;
};

type CreateBoardBody = {
  title?: string;
};

type CreateBoardColumnBody = {
  title?: string;
};

type DeleteTasksBody = {
  tasksIds: string[];
};

const insType = {
  swap: 'swap',
  before: 'before',
  append: 'append',
};

type MoveTaskBody = {
  insertionType: string;
  srcColumnId: string;
  targetColumnId: string;
  srcTaskId: string;
  targetTaskId?: string;
};

type MoveColumnBody = {
  insertionType: string;
  srcColumnId: string;
  targetColumnId: string;
};

const PARAM_BOARD_ID = 'boardId';
const PARAM_COLUMN_ID = 'columnId';
const PARAM_TASK_ID = 'taskId';
const PARAM_USER_ID = 'userId';
const PARAM_SESSION_ID = 'sessionId';
const PARAM_DELETE_TASKS = 'deleteTasks';

const UNASSIGNED_TASKS_COLUMN_ID = '0_0';
const UNASSIGNED_TASKS_COLUMN_TITLE = 'Unassigned tasks';

const ERROR_PERMISSION_DENIED = 'Permission denied';
const ERROR_AUTHORIZATION_REQUIRED = 'Authorization required';
const ERROR_USER_NOT_FOUND = 'User not found';
const ERROR_TASK_NOT_FOUND = 'Task not found';
const ERROR_BOARD_NOT_FOUND = 'Board not found';
const ERROR_COLUMN_NOT_FOUND = 'Column not found';
const ERROR_MISSING_NAME_OR_AVATAR = 'Missing name or avatarId';
const ERROR_SESSION_NOT_FOUND = 'Session not found';

/* -------------------------------------------------------------------------- */
/*                                   Setup                                    */
/* -------------------------------------------------------------------------- */

const corsOptions = {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
  optionsSuccessStatus: 204,
};

const app = express();
app.use(cors(corsOptions));
app.use(express.json());

const DATA_DIR = './server/data';
const FILES = {
  users: path.join(DATA_DIR, 'users.json'),
  sessions: path.join(DATA_DIR, 'sessions.json'),
  tasks: path.join(DATA_DIR, 'tasks.json'),
  boards: path.join(DATA_DIR, 'boards.json'),
};

const delay = (ms = 300): Promise<void> => new Promise((r) => setTimeout(r, ms));

/* -------------------------------------------------------------------------- */
/*                               File Helpers                                 */
/* -------------------------------------------------------------------------- */

async function readJSON<T>(file: string, fallback: T): Promise<T> {
  try {
    const data = await fs.readFile(file, 'utf-8');
    return JSON.parse(data) as T;
  } catch {
    return fallback;
  }
}

async function writeJSON(file: string, data: unknown): Promise<void> {
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, JSON.stringify(data, null, 2), 'utf-8');
}

const db = {
  users: (): Promise<User[]> => readJSON(FILES.users, []),
  sessions: (): Promise<Record<string, Session>> => readJSON(FILES.sessions, {}),
  tasks: (): Promise<Task[]> => readJSON(FILES.tasks, []),
  boards: (): Promise<Board[]> => readJSON(FILES.boards, []),

  saveUsers: (d: User[]): Promise<void> => writeJSON(FILES.users, d),
  saveSessions: (d: Record<string, Session>): Promise<void> => writeJSON(FILES.sessions, d),
  saveTasks: (d: Task[]): Promise<void> => writeJSON(FILES.tasks, d),
  saveBoards: (d: Board[]): Promise<void> => writeJSON(FILES.boards, d),
};

/* -------------------------------------------------------------------------- */
/*                              Helpers                                       */
/* -------------------------------------------------------------------------- */

const getUserId = (req: Request) => req.params[PARAM_USER_ID];
const getBoardId = (req: Request) => req.params[PARAM_BOARD_ID];
const getColumnId = (req: Request) => req.params[PARAM_COLUMN_ID];
const getTaskId = (req: Request) => req.params[PARAM_TASK_ID];
const getSessionId = (req: Request) => req.query[PARAM_SESSION_ID];

async function requireSession(req: Request, res: Response) {
  const sessionId = getSessionId(req) as string;

  if (!sessionId) {
    res.status(401).json({ error: ERROR_AUTHORIZATION_REQUIRED });
    return {};
  }

  const sessions = await db.sessions();
  const session = sessions[sessionId];

  if (!session) {
    res.status(404).json({ error: ERROR_SESSION_NOT_FOUND });
    return {};
  }

  return { session, sessions };
}

async function requireUserBoards(req: Request, res: Response) {
  const { session } = await requireSession(req, res);
  if (!session) return {};

  const boards = await db.boards();

  return {
    userBoards: boards.filter((b) => b.authorId === session.userId),
    boards,
    session,
  };
}

async function requireBoard(req: Request, res: Response) {
  const { session } = await requireSession(req, res);
  if (!session) return {};

  const boardId = getBoardId(req);
  const boards = await db.boards();
  const board = boards.find((b) => b.id === boardId);

  if (!board) {
    res.status(404).json({ error: ERROR_BOARD_NOT_FOUND });
    return {};
  }

  if (board.authorId !== session.userId) {
    res.status(403).json({ error: ERROR_PERMISSION_DENIED });
    return {};
  }

  return { board, boards, session };
}

async function requireBoardColumn(req: Request, res: Response) {
  const { boards, board, session } = await requireBoard(req, res);
  if (!board) return {};

  const columnId = getColumnId(req);
  const column = board.columns.find((c) => c.id === columnId);

  if (!column) {
    res.status(404).json({ error: ERROR_COLUMN_NOT_FOUND });
    return {};
  }

  return { boards, board, column, session };
}

async function requireUser(req: Request, res: Response) {
  const { session } = await requireSession(req, res);
  if (!session) return {};

  const userId = getUserId(req);
  const users = await db.users();
  const user = users.find((b) => b.id === userId);

  if (!user) {
    res.status(404).json({ error: ERROR_USER_NOT_FOUND });
    return {};
  }

  if (user.id !== session.userId) {
    res.status(403).json({ error: ERROR_PERMISSION_DENIED });
    return {};
  }

  return { user, users, session };
}

async function requireUserTasks(req: Request, res: Response) {
  const { session } = await requireSession(req, res);
  if (!session) return {};

  const tasks = await db.tasks();

  return { userTasks: tasks.filter((t) => t.authorId === session.userId), tasks, session };
}

async function requireTask(req: Request, res: Response) {
  const { session } = await requireSession(req, res);
  if (!session) return {};

  const taskId = getTaskId(req);
  const tasks = await db.tasks();
  const task = tasks.find((t) => t.id === taskId);

  if (!task) {
    res.status(404).json({ error: ERROR_TASK_NOT_FOUND });
    return {};
  }

  if (task.authorId !== session.userId) {
    res.status(403).json({ error: ERROR_PERMISSION_DENIED });
    return {};
  }

  return { task, tasks, session };
}

async function requireTasksArray(req: Request, res: Response) {
  const { session } = await requireSession(req, res);
  if (!session) return {};

  const { tasksIds } = req.body as DeleteTasksBody;
  const tasks = await db.tasks();

  let notExists = false;
  let notBelongsToUser = false;
  const requiredTasks = [];

  for (const taskId of tasksIds) {
    const task = tasks.find((t) => t.id === taskId);

    if (!task) {
      notExists = true;
      break;
    }

    if (task.authorId !== session.userId) {
      notBelongsToUser = true;
      break;
    }

    requiredTasks.push(task);
  }

  if (notExists) {
    res.status(404).json({ error: ERROR_TASK_NOT_FOUND });
    return {};
  }

  if (notBelongsToUser) {
    res.status(403).json({ error: ERROR_PERMISSION_DENIED });
    return {};
  }

  return { tasks, requiredTasks, requiredTasksIds: tasksIds, session };
}

const createBoardColumn = (title: string) => ({
  title,
  tasksIds: [],
  id: nanoid(),
});

/* -------------------------------------------------------------------------- */
/*                                   Users                                    */
/* -------------------------------------------------------------------------- */

app.post('/users', async (req, res) => {
  await delay();
  const { name, avatarId } = req.body as CreateUserBody;

  if (!name || !avatarId) {
    return res.status(400).json({ error: ERROR_MISSING_NAME_OR_AVATAR });
  }

  const users = await db.users();
  const user: User = { id: nanoid(), name, avatarId };
  await db.saveUsers([...users, user]);

  res.status(201).json({ data: user });
});

app.get('/users', async (_req, res) => {
  await delay();
  res.json({ data: await db.users() });
});

app.get(`/users/:${PARAM_USER_ID}`, async (req, res) => {
  await delay();

  const { user } = await requireUser(req, res);
  if (!user) return;

  res.json({ data: user });
});

app.delete(`/users/:${PARAM_USER_ID}`, async (req, res) => {
  await delay();

  const { user, users } = await requireUser(req, res);
  if (!user) return;

  await db.saveUsers(users.filter((u) => u.id !== user.id));
  await db.saveTasks((await db.tasks()).filter((t) => t.authorId !== user.id));
  await db.saveBoards((await db.boards()).filter((b) => b.authorId !== user.id));

  const sessions = await db.sessions();
  Object.keys(sessions).forEach((k) => sessions[k].userId === user.id && delete sessions[k]);
  await db.saveSessions(sessions);

  res.json({ data: { success: true } });
});

/* -------------------------------------------------------------------------- */
/*                                  Sessions                                  */
/* -------------------------------------------------------------------------- */

app.post(`/sessions/login/:${PARAM_USER_ID}`, async (req, res) => {
  await delay();
  const userId = getUserId(req);
  const user = (await db.users()).find((u) => u.id === userId);

  if (!user) return res.status(404).json({ error: ERROR_USER_NOT_FOUND });

  const sessions = await db.sessions();
  const existingSession = Object.values(sessions).find((s) => s.userId === userId);

  if (existingSession) {
    delete sessions[existingSession.sessionId];
  }

  const newSession: Session = { sessionId: nanoid(), userId };
  await db.saveSessions({ ...sessions, [newSession.sessionId]: newSession });

  res.json({ data: newSession });
});

app.post('/sessions/login', async (req, res) => {
  await delay();

  const { session } = await requireSession(req, res);
  if (!session) return;

  res.json({ data: session });
});

app.post('/sessions/logout', async (req, res) => {
  await delay();
  const { session, sessions } = await requireSession(req, res);
  if (!session) return;

  delete sessions[session.sessionId];
  await db.saveSessions(sessions);

  res.json({ data: { success: true } });
});

/* -------------------------------------------------------------------------- */
/*                                   Tasks                                    */
/* -------------------------------------------------------------------------- */

app.get('/tasks', async (req, res) => {
  await delay();
  const { userTasks } = await requireUserTasks(req, res);
  if (!userTasks) return;

  res.json({ data: userTasks });
});

app.put(`/tasks/:${PARAM_TASK_ID}`, async (req, res) => {
  await delay();
  const { task, tasks } = await requireTask(req, res);
  if (!task) return;

  const { title = '', description = '', completed = false } = req.body as CreateTaskBody;

  const updatedTask = { ...task, title, description, completed };
  await db.saveTasks(tasks.map((t) => (t.id === task.id ? updatedTask : t)));

  res.json({ data: updatedTask });
});

app.post(`/tasks/delete`, async (req, res) => {
  await delay();

  const { requiredTasksIds, tasks } = await requireTasksArray(req, res);
  if (!requiredTasksIds) return;

  const boards = await db.boards();

  boards.forEach((b) => {
    b.columns.forEach((c) => {
      c.tasksIds = c.tasksIds.filter((t) => !requiredTasksIds.includes(t));
    });
  });

  const updatedTasks = tasks.filter((t) => !requiredTasksIds.includes(t.id));
  await db.saveBoards(boards);
  await db.saveTasks(updatedTasks);
  res.json({ data: { success: true } });
});

/* -------------------------------------------------------------------------- */
/*                                   Boards                                   */
/* -------------------------------------------------------------------------- */

app.post('/boards', async (req, res) => {
  await delay();
  const { session } = await requireSession(req, res);
  if (!session) return;

  const { title = '' } = req.body as CreateBoardBody;

  const board: Board = {
    id: nanoid(),
    authorId: session.userId,
    title,
    columns: [
      {
        id: UNASSIGNED_TASKS_COLUMN_ID,
        title: UNASSIGNED_TASKS_COLUMN_TITLE,
        tasksIds: [],
      },
    ],
  };

  await db.saveBoards([...(await db.boards()), board]);
  res.json({ data: board });
});

app.get('/boards', async (req, res) => {
  await delay();
  const { userBoards } = await requireUserBoards(req, res);
  if (!userBoards) return;

  res.json({
    data: userBoards,
  });
});

app.put(`/boards/:${PARAM_BOARD_ID}`, async (req, res) => {
  await delay();

  const { board, boards } = await requireBoard(req, res);
  if (!board) return;

  const { title = '' } = req.body as CreateBoardBody;
  const updatedBoard: Board = { ...board, title };

  await db.saveBoards(boards.map((b) => (b.id === board.id ? updatedBoard : b)));
  res.json({ data: updatedBoard });
});

app.delete(`/boards/:${PARAM_BOARD_ID}`, async (req, res) => {
  await delay();

  const { board, boards } = await requireBoard(req, res);
  if (!board) return;

  const tasksByTaskIdMap = (await db.tasks()).reduce(
    (acc, task) => ({ ...acc, [task.id]: task }),
    {} as Record<string, Task>
  );

  board.columns.forEach((c) => {
    c.tasksIds.forEach((taskId) => {
      delete tasksByTaskIdMap[taskId];
    });
  });

  await db.saveBoards(boards.filter((b) => b.id !== board.id));
  await db.saveTasks(Object.values(tasksByTaskIdMap));
  res.json({ data: { success: true } });
});

app.post(`/boards/:${PARAM_BOARD_ID}/columns`, async (req, res) => {
  await delay();

  const { board, boards } = await requireBoard(req, res);
  if (!board) return;

  const { title = '' } = req.body as CreateBoardColumnBody;

  const updatedBoard: Board = {
    ...board,
    columns: [...board.columns, createBoardColumn(title)],
  };

  await db.saveBoards(boards.map((b) => (b.id === board.id ? updatedBoard : b)));
  res.json({ data: updatedBoard });
});

app.delete(`/boards/:${PARAM_BOARD_ID}/columns/:${PARAM_COLUMN_ID}`, async (req, res) => {
  await delay();

  const { board, boards, column } = await requireBoardColumn(req, res);
  if (!column) return;

  if (column.id === UNASSIGNED_TASKS_COLUMN_ID) {
    return res.status(403).json({ error: ERROR_PERMISSION_DENIED });
  }

  const { tasksIds } = column;
  const shouldDeleteTasks = req.query[PARAM_DELETE_TASKS];
  let tasks = await db.tasks();

  if (shouldDeleteTasks && tasksIds.length > 0) {
    tasks = tasks.filter((t) => !tasksIds.includes(t.id));
    await db.saveTasks(tasks);
  }

  board.columns = board.columns.filter((c) => c.id !== column.id);

  if (!shouldDeleteTasks) {
    const unassignedTasksColumn = board.columns.find((c) => c.id === UNASSIGNED_TASKS_COLUMN_ID);

    if (unassignedTasksColumn) {
      unassignedTasksColumn.tasksIds = [...unassignedTasksColumn.tasksIds, ...tasksIds];
    }
  }

  await db.saveBoards(boards.map((b) => (b.id === board.id ? board : b)));
  const userTasks = tasks.filter((t) => t.authorId === board.authorId);

  res.json({ data: { board, tasks: userTasks } });
});

app.put(`/boards/:${PARAM_BOARD_ID}/columns/:${PARAM_COLUMN_ID}`, async (req, res) => {
  await delay();

  const { board, boards, column } = await requireBoardColumn(req, res);
  if (!column) return;

  const { title = '' } = req.body as CreateBoardColumnBody;
  const updatedColumn = { ...column, title };

  const updatedBoard: Board = {
    ...board,
    columns: board.columns.map((c) => (c.id === column.id ? updatedColumn : c)),
  };

  await db.saveBoards(boards.map((b) => (b.id === board.id ? updatedBoard : b)));
  res.json({ data: updatedBoard });
});

app.post(`/boards/:${PARAM_BOARD_ID}/columns/:${PARAM_COLUMN_ID}/tasks`, async (req, res) => {
  await delay();

  const { board, boards, column, session } = await requireBoardColumn(req, res);
  if (!column) return;

  const { title = '', description = '', completed = false } = req.body as CreateTaskBody;

  const task: Task = {
    id: nanoid(),
    authorId: session.userId,
    title,
    description,
    completed,
  };

  await db.saveTasks([...(await db.tasks()), task]);
  column.tasksIds.push(task.id);

  await db.saveBoards(boards);
  res.json({ data: { board, task } });
});

app.put(`/boards/:${PARAM_BOARD_ID}/move/tasks`, async (req, res) => {
  await delay();

  const { board, boards } = await requireBoard(req, res);
  if (!board) return;

  const { columns } = board;
  const { srcColumnId, targetColumnId, srcTaskId, targetTaskId, insertionType } =
    req.body as MoveTaskBody;

  const allTasks = await db.tasks();

  const srcColumn = columns.find((c) => c.id === srcColumnId);
  const targetColumn = columns.find((c) => c.id === targetColumnId);

  if (!srcColumn || !targetColumn) {
    return res.status(400).json({ error: ERROR_COLUMN_NOT_FOUND });
  }

  const srcExists = allTasks.some((t) => t.id === srcTaskId);
  const targetExists =
    insertionType === insType.append ||
    (targetTaskId && allTasks.some((t) => t.id === targetTaskId));

  if (!srcExists || !targetExists) {
    return res.status(400).json({ error: ERROR_TASK_NOT_FOUND });
  }

  const isSameColumn = srcColumnId === targetColumnId;
  const isSameId = srcTaskId === targetTaskId;

  if (isSameColumn && isSameId) {
    return res.json({ data: board });
  }

  const srcIndex = srcColumn.tasksIds.indexOf(srcTaskId);

  if (srcIndex === -1) {
    return res.status(400).json({ error: ERROR_TASK_NOT_FOUND });
  }

  if (insertionType === insType.swap) {
    if (!targetTaskId) {
      return res.status(400).json({ error: ERROR_TASK_NOT_FOUND });
    }

    const targetIndex = targetColumn.tasksIds.indexOf(targetTaskId);

    if (targetIndex === -1) {
      return res.status(400).json({ error: ERROR_TASK_NOT_FOUND });
    }

    [targetColumn.tasksIds[targetIndex], srcColumn.tasksIds[srcIndex]] = [
      srcColumn.tasksIds[srcIndex],
      targetColumn.tasksIds[targetIndex],
    ];
  } else {
    srcColumn.tasksIds.splice(srcIndex, 1);

    if (insertionType === insType.append) {
      targetColumn.tasksIds.push(srcTaskId);
    } else if (insertionType === insType.before) {
      if (!targetTaskId) {
        return res.status(400).json({ error: ERROR_TASK_NOT_FOUND });
      }

      const targetIndex = targetColumn.tasksIds.indexOf(targetTaskId);
      if (targetIndex === -1) {
        return res.status(400).json({ error: ERROR_TASK_NOT_FOUND });
      }

      const insertIndex = isSameColumn && srcIndex < targetIndex ? targetIndex - 1 : targetIndex;

      targetColumn.tasksIds.splice(insertIndex, 0, srcTaskId);
    }
  }

  await db.saveBoards(boards.map((b) => (b.id === board.id ? board : b)));

  res.json({ data: board });
});

app.put(`/boards/:${PARAM_BOARD_ID}/move/columns`, async (req, res) => {
  await delay();

  const { board, boards } = await requireBoard(req, res);
  if (!board) return;

  const { columns } = board;
  const { srcColumnId, targetColumnId, insertionType } = req.body as MoveColumnBody;

  const srcColumnIndex = columns.findIndex((c) => c.id === srcColumnId);
  const targetColumnIndex = columns.findIndex((c) => c.id === targetColumnId);

  if (srcColumnIndex === -1 || targetColumnIndex === -1) {
    return res.status(400).json({ error: ERROR_COLUMN_NOT_FOUND });
  }

  if (insertionType === insType.swap) {
    if (srcColumnId === targetColumnId) {
      return res.json({ data: board });
    }

    [columns[targetColumnIndex], columns[srcColumnIndex]] = [
      columns[srcColumnIndex],
      columns[targetColumnIndex],
    ];
  } else {
    const [srcColumn] = columns.splice(srcColumnIndex, 1);

    if (insertionType === insType.append) {
      columns.push(srcColumn);
    } else if (insertionType === insType.before) {
      const insertIndex =
        srcColumnIndex < targetColumnIndex ? targetColumnIndex - 1 : targetColumnIndex;

      columns.splice(insertIndex, 0, srcColumn);
    }
  }

  await db.saveBoards(boards.map((b) => (b.id === board.id ? board : b)));
  res.json({ data: board });
});

app.listen(3000, () => console.log('🚀 Trello-like API running on http://localhost:3000'));
