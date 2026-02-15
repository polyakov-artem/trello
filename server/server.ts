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

const BOARD_ID = 'boardId';
const COLUMN_ID = 'columnId';
const TASK_ID = 'taskId';
const USER_ID = 'userId';
const SESSION_ID = 'sessionId';

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

const getUserId = (req: Request) => req.params[USER_ID];
const getBoardId = (req: Request) => req.params[BOARD_ID];
const getColumnId = (req: Request) => req.params[COLUMN_ID];
const getTaskId = (req: Request) => req.params[TASK_ID];
const getSessionId = (req: Request) => (req.query as { [SESSION_ID]: string })[SESSION_ID];

async function requireSession(req: Request, res: Response) {
  const sessionId = getSessionId(req);

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

app.get(`/users/:${USER_ID}`, async (req, res) => {
  await delay();

  const { user } = await requireUser(req, res);
  if (!user) return;

  res.json({ data: user });
});

app.delete(`/users/:${USER_ID}`, async (req, res) => {
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

app.post(`/sessions/login/:${USER_ID}`, async (req, res) => {
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

app.post('/tasks', async (req, res) => {
  await delay();
  const { session } = await requireSession(req, res);
  if (!session) return;

  const { title = '', description = '', completed = false } = req.body as CreateTaskBody;

  const task: Task = {
    id: nanoid(),
    authorId: session.userId,
    title,
    description,
    completed,
  };

  await db.saveTasks([...(await db.tasks()), task]);
  res.json({ data: task });
});

app.put(`/tasks/:${TASK_ID}`, async (req, res) => {
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
    columns: [],
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

app.put(`/boards/:${BOARD_ID}`, async (req, res) => {
  await delay();

  const { board, boards } = await requireBoard(req, res);
  if (!board) return;

  const { title = '' } = req.body as CreateBoardBody;
  const updatedBoard: Board = { ...board, title };

  await db.saveBoards(boards.map((b) => (b.id === board.id ? updatedBoard : b)));
  res.json({ data: updatedBoard });
});

app.delete(`/boards/:${BOARD_ID}`, async (req, res) => {
  await delay();

  const { board, boards } = await requireBoard(req, res);
  if (!board) return;

  await db.saveBoards(boards.filter((b) => b.id !== board.id));
  res.json({ data: { success: true } });
});

app.post(`/boards/:${BOARD_ID}/columns`, async (req, res) => {
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

app.delete(`/boards/:${BOARD_ID}/columns/:${COLUMN_ID}`, async (req, res) => {
  await delay();

  const { board, boards, column } = await requireBoardColumn(req, res);
  if (!column) return;

  const updatedBoard: Board = {
    ...board,
    columns: board.columns.filter((c) => c.id !== column.id),
  };

  await db.saveBoards(boards.map((b) => (b.id === board.id ? updatedBoard : b)));
  res.json({ data: updatedBoard });
});

app.put(`/boards/:${BOARD_ID}/columns/:${COLUMN_ID}`, async (req, res) => {
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

app.post(`/boards/:${BOARD_ID}/columns/:${COLUMN_ID}/tasks`, async (req, res) => {
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

app.listen(3000, () => console.log('🚀 Trello-like API running on http://localhost:3000'));
