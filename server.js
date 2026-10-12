const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

let tasks = [
  { id: 1, title: "Review sprint goals", assignee: "Alex", priority: "High", done: false },
  { id: 2, title: "Plan onboarding checklist", assignee: "Jordan", priority: "Medium", done: true },
  { id: 3, title: "Send weekly status update", assignee: "Sam", priority: "Low", done: false }
];

app.get("/api/health", (req, res) => {
  res.json({ ok: true, status: "WerkBot is running" });
});

app.get("/api/tasks", (req, res) => {
  res.json(tasks);
});

app.post("/api/tasks", (req, res) => {
  const { title, assignee, priority } = req.body;

  if (!title || !title.trim()) {
    return res.status(400).json({ error: "Task title is required." });
  }

  const newTask = {
    id: Date.now() + Math.floor(Math.random() * 1000),
    title: title.trim(),
    assignee: assignee ? assignee.trim() : "Unassigned",
    priority: priority || "Medium",
    done: false
  };

  tasks.unshift(newTask);
  res.status(201).json(newTask);
});

app.patch("/api/tasks/:id", (req, res) => {
  const taskId = Number(req.params.id);
  const task = tasks.find((item) => item.id === taskId);

  if (!task) {
    return res.status(404).json({ error: "Task not found." });
  }

  task.done = !task.done;
  res.json(task);
});

app.delete("/api/tasks/:id", (req, res) => {
  const taskId = Number(req.params.id);
  const initialLength = tasks.length;

  tasks = tasks.filter((item) => item.id !== taskId);

  if (tasks.length === initialLength) {
    return res.status(404).json({ error: "Task not found." });
  }

  res.json({ success: true });
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`WerkBot running at http://localhost:${PORT}`);
});
