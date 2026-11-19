// Pure function: no database, no Express. Returns a new sorted array.
export function sortTasks(tasks, sortBy, order) {
  const direction = order === "asc" ? 1 : -1;

  return [...tasks].sort((a, b) => {
    if (sortBy === "dueDate") {
      const aHasDate = a.dueDate != null;
      const bHasDate = b.dueDate != null;

      // Tasks without a due date always go last.
      if (aHasDate !== bHasDate) return aHasDate ? -1 : 1;

      if (aHasDate && a.dueDate.getTime() !== b.dueDate.getTime()) {
        return (a.dueDate - b.dueDate) * direction;
      }
    } else if (a.createdAt.getTime() !== b.createdAt.getTime()) {
      return (a.createdAt - b.createdAt) * direction;
    }

    // Same value: newest first, so the order is stable.
    return b.createdAt - a.createdAt;
  });
}