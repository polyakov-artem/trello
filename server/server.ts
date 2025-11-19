import express, { type Request, type Response } from 'express';
import cors from 'cors';
import { nanoid } from 'nanoid';
import fs from 'fs/promises';
import path from 'path';

export type User = {
  id: string;
  name: string;
  avatarId: string;
};

export type Session = {
  sessionId: string;
  userId: string;
};

export type Task = {
  id: string;
  authorId: string;
  title: string;
  description: string;
  completed: boolean;
};

export type TaskDraft = Partial<Omit<Task, 'id' | 'authorId'>>;

const app = express();
app.use(cors());
app.use(express.json());

const DATA_DIR = './server/data';
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const SESSIONS_FILE = path.join(DATA_DIR, 'sessions.json');
const TASKS_FILE = path.join(DATA_DIR, 'tasks.json');

const ERROR_UNAUTHORIZED = 'Unauthorized. Please log in again';
const ERROR_USER_NOT_FOUND = 'User not found';
const ERROR_SESSION_NOT_FOUND = 'Session not found. Please log in again';
const ERROR_PERMISSION_DENIED = 'You do not have permission to perform this action';
const ERROR_TASK_NOT_FOUND = 'Task not found';
const ERROR_MISSING_NAME = 'Name is required';
const ERROR_MISSING_AVATAR = 'Avatar is required';
const ERROR_VALIDATION_FAILED = 'Validation failed';

await fs.mkdir(DATA_DIR, { recursive: true });

const delay = (ms = 500) => new Promise((r) => setTimeout(r, ms));

async function readJSON<T>(file: string, fallback: T): Promise<T> {
  try {
    const data = await fs.readFile(file, 'utf-8');
    return JSON.parse(data) as T;
  } catch {
    return fallback;
  }
}

async function writeJSON(file: string, data: unknown): Promise<void> {
  await fs.writeFile(file, JSON.stringify(data, null, 2), 'utf-8');
}

async function loadUsers(): Promise<User[]> {
  return await readJSON<User[]>(USERS_FILE, []);
}

async function saveUsers(users: User[]): Promise<void> {
  await writeJSON(USERS_FILE, users);
}

async function loadSessions(): Promise<Record<string, Session>> {
  return await readJSON<Record<string, Session>>(SESSIONS_FILE, {});
}

async function saveSessions(sessions: Record<string, Session>): Promise<void> {
  await writeJSON(SESSIONS_FILE, sessions);
}

async function loadTasks(): Promise<Task[]> {
  return await readJSON<Task[]>(TASKS_FILE, []);
}

async function saveTasks(tasks: Task[]): Promise<void> {
  await writeJSON(TASKS_FILE, tasks);
}

/* -------------------------------------------------------------------------- */
/*                                  User APIs                                 */
/* -------------------------------------------------------------------------- */

// Register a user
app.post('/users', async (req: Request, res: Response) => {
  await delay();
  const { name, avatarId } = req.body as { name: string; avatarId: string };
  const errors = [];

  if (!avatarId) {
    errors.push({ field: 'avatarId', message: ERROR_MISSING_AVATAR });
  }

  if (!name) {
    errors.push({ field: 'name', message: ERROR_MISSING_NAME });
  }

  if (errors.length) {
    return res.status(400).json({ errors, error: ERROR_VALIDATION_FAILED });
  }

  const users = await loadUsers();
  const newUser: User = { id: nanoid(), name, avatarId };
  users.push(newUser);
  await saveUsers(users);

  res.status(201).json({ data: newUser });
});

// Get all users
app.get('/users', async (_req: Request, res: Response) => {
  await delay();
  const users = await loadUsers();
  res.json({ data: users });
});

// Get user by ID (requires valid session)
app.get('/users/:id', async (req: Request, res: Response) => {
  await delay();

  const { sessionId } = req.query as { sessionId: string };

  const sessions = await loadSessions();
  const session = sessions[sessionId];

  if (!session) {
    return res.status(401).json({ error: ERROR_UNAUTHORIZED });
  }

  const userId = session.userId;

  if (userId !== req.params.id) {
    return res.status(403).json({ error: ERROR_PERMISSION_DENIED });
  }

  const users = await loadUsers();
  const user = users.find((u) => u.id === userId);

  if (!user) {
    return res.status(404).json({ error: ERROR_USER_NOT_FOUND });
  }

  res.json({ data: user });
});

// Remove user
app.delete('/users/:id', async (req: Request, res: Response) => {
  await delay();
  const { sessionId } = req.query as { sessionId: string };

  const sessions = await loadSessions();
  const session = sessions[sessionId];

  if (!session) {
    return res.status(401).json({ error: ERROR_UNAUTHORIZED });
  }

  const userId = session.userId;

  if (userId !== req.params.id) {
    return res.status(403).json({ error: ERROR_PERMISSION_DENIED });
  }

  const users = await loadUsers();
  const updatedUsers = users.filter((u) => u.id !== userId);

  await saveUsers(updatedUsers);

  // Clean up orphaned sessions
  const updatedSessions = Object.fromEntries(
    Object.entries(sessions).filter(([, s]) => s.userId !== userId)
  );
  await saveSessions(updatedSessions);

  res.json({ data: { success: true } });
});

/* -------------------------------------------------------------------------- */
/*                                Session APIs                                */
/* -------------------------------------------------------------------------- */

// Login using userId
app.post('/sessions/login/user', async (req: Request, res: Response) => {
  await delay();
  const { userId } = req.body as { userId: string };

  const users = await loadUsers();
  const user = users.find((u) => u.id === userId);

  if (!user) {
    return res.status(404).json({ error: ERROR_USER_NOT_FOUND });
  }

  const sessions = await loadSessions();

  const existingSession = Object.values(sessions).find((s) => s.userId === userId);

  if (existingSession) {
    delete sessions[existingSession.sessionId];
    await saveSessions(sessions);
  }

  const sessionId = nanoid();
  const newSession: Session = { sessionId, userId };
  await saveSessions({ ...sessions, [sessionId]: newSession });

  res.json({ data: newSession });
});

// Login using sessionId
app.post('/sessions/login/session', async (req: Request, res: Response) => {
  await delay();
  const { sessionId } = req.query as { sessionId: string };

  const sessions = await loadSessions();
  const session = sessions[sessionId];

  if (!session) {
    return res.status(404).json({ error: ERROR_SESSION_NOT_FOUND });
  }

  const users = await loadUsers();
  const user = users.find((u) => u.id === session.userId);

  if (!user) {
    return res.status(404).json({ error: ERROR_USER_NOT_FOUND });
  }

  res.json({ data: { sessionId, userId: user.id } });
});

app.post('/sessions/logout', async (req: Request, res: Response) => {
  await delay();
  const { sessionId } = req.query as { sessionId: string };

  const sessions = await loadSessions();

  const session = sessions[sessionId];

  if (session) {
    delete sessions[sessionId];
    await saveSessions(sessions);
  }

  res.json({ data: { success: true } });
});

/* -------------------------------------------------------------------------- */
/*                                  Tasks APIs                                 */
/* -------------------------------------------------------------------------- */

app.get('/tasks', async (req: Request, res: Response) => {
  await delay();
  const { sessionId } = req.query as { sessionId: string };

  const sessions = await loadSessions();
  const session = sessions[sessionId];

  if (!session) {
    return res.status(401).json({ error: ERROR_UNAUTHORIZED });
  }

  const userId = session.userId;

  const tasks = (await loadTasks()).filter((t) => t.authorId === userId);
  res.json({ data: tasks });
});

app.post('/tasks', async (req: Request, res: Response) => {
  await delay();
  const { sessionId } = req.query as { sessionId: string };

  const { title = '', description = '', completed = false } = req.body as TaskDraft;

  const sessions = await loadSessions();
  const session = sessions[sessionId];

  if (!session) {
    return res.status(401).json({ error: ERROR_UNAUTHORIZED });
  }

  const userId = session.userId;
  const tasks = await loadTasks();

  const newTask: Task = {
    id: nanoid(),
    authorId: userId,
    title,
    description,
    completed,
  };

  await saveTasks([...tasks, newTask]);
  res.json({ data: newTask });
});

app.put('/tasks/:id', async (req: Request, res: Response) => {
  await delay();
  const { sessionId } = req.query as { sessionId: string };

  const { title, description, completed } = req.body as TaskDraft;

  const taskId = req.params.id;
  const sessions = await loadSessions();
  const session = sessions[sessionId];

  if (!session) {
    return res.status(401).json({ error: ERROR_UNAUTHORIZED });
  }

  const tasks = await loadTasks();

  const task = tasks.find((t) => t.id === taskId);

  if (!task) {
    return res.status(404).json({ error: ERROR_TASK_NOT_FOUND });
  }

  if (task.authorId !== session.userId) {
    return res.status(403).json({ error: ERROR_PERMISSION_DENIED });
  }

  const updatedTask: Task = {
    ...task,
  };

  if (title !== undefined) {
    updatedTask.title = title;
  }
  if (description !== undefined) {
    updatedTask.description = description;
  }
  if (completed !== undefined) {
    updatedTask.completed = completed;
  }

  await saveTasks(tasks.map((t) => (t.id === taskId ? updatedTask : t)));
  res.json({ data: updatedTask });
});

app.delete('/tasks/:id', async (req: Request, res: Response) => {
  await delay();
  const { sessionId } = req.query as { sessionId: string };

  const taskId = req.params.id;
  const sessions = await loadSessions();
  const session = sessions[sessionId];

  if (!session) {
    return res.status(401).json({ error: ERROR_UNAUTHORIZED });
  }

  const tasks = await loadTasks();

  const task = tasks.find((t) => t.id === taskId);

  if (!task) {
    return res.status(404).json({ error: ERROR_TASK_NOT_FOUND });
  }

  if (task.authorId !== session.userId) {
    return res.status(403).json({ error: ERROR_PERMISSION_DENIED });
  }

  await saveTasks(tasks.filter((t) => t.id !== taskId));
  res.json({ data: { success: true } });
});

/* -------------------------------------------------------------------------- */
/*                                   Server                                   */
/* -------------------------------------------------------------------------- */

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
});
