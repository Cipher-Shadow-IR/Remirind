import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useTasks } from '../hooks/useTasks';
import { useToast } from '../context/ToastContext.jsx';
import Layout from '../components/Layout';
import DashboardStats from '../components/DashboardStats';
import TaskCard from '../components/TaskCard';
import TaskFilters from '../components/TaskFilters';
import TaskModal from '../components/TaskModal';
import ConfirmDialog from '../components/ConfirmDialog';
import LoadingSpinner from '../components/LoadingSpinner';
import { Plus, ClipboardList } from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const { addToast } = useToast();
  const {
    tasks,
    stats,
    loading,
    error,
    loadTasks,
    createTask,
    updateTask,
    deleteTask,
  } = useTasks();

  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    search: '',
  });
  const [editingTask, setEditingTask] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    const params = {};
    if (filters.status) params.status = filters.status;
    if (filters.priority) params.priority = filters.priority;
    if (filters.search) params.search = filters.search;
    loadTasks(params);
  }, [filters, loadTasks]);

  const handleToggle = async (task) => {
    try {
      const newStatus = task.status === 'completed' ? 'pending' : 'completed';
      await updateTask(task._id, { status: newStatus });
      addToast(
        `Task marked as ${newStatus}`,
        'success'
      );
    } catch {
      addToast('Failed to update task status', 'error');
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setShowModal(true);
  };

  const handleAddNew = () => {
    setEditingTask(null);
    setShowModal(true);
  };

  const handleSubmit = async (data) => {
    try {
      if (editingTask) {
        await updateTask(editingTask._id, data);
        addToast('Task updated successfully', 'success');
      } else {
        await createTask(data);
        addToast('Task created successfully', 'success');
      }
      setShowModal(false);
      setEditingTask(null);
    } catch {
      // error handled in TaskModal
    }
  };

  const handleCancel = () => {
    setShowModal(false);
    setEditingTask(null);
  };

  const handleDelete = (id) => {
    setDeleteTarget(id);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteTask(deleteTarget);
      addToast('Task deleted successfully', 'success');
    } catch (err) {
      addToast(
        err.response?.data?.message || 'Failed to delete task',
        'error'
      );
    } finally {
      setDeleteTarget(null);
    }
  };

  return (
    <Layout>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome, {user?.name}
          </h1>
          <p className="text-muted-foreground mt-1">
            Here&apos;s your task overview
          </p>
        </div>
        <button
          onClick={handleAddNew}
          className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <Plus className="h-4 w-4" />
          Add Task
        </button>
      </div>

      {!stats ? (
        <LoadingSpinner />
      ) : (
        <DashboardStats stats={stats} />
      )}

      <div className="mt-10 mb-6">
        <div className="flex items-center gap-2">
          <ClipboardList className="h-5 w-5 text-muted-foreground" />
          <h2 className="text-xl font-semibold tracking-tight">
            Tasks ({tasks.length})
          </h2>
        </div>
      </div>

      <TaskFilters filters={filters} onChange={setFilters} />

      {error && (
        <div className="mb-4 rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {loading ? (
        <LoadingSpinner />
      ) : tasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed bg-card py-16 px-4">
          <div className="rounded-full bg-primary/5 p-4 mb-4">
            <ClipboardList className="h-10 w-10 text-primary/40" />
          </div>
          {filters.search || filters.status || filters.priority ? (
            <>
              <h3 className="text-lg font-semibold">No matching tasks</h3>
              <p className="mt-1 text-sm text-muted-foreground text-center max-w-sm">
                No tasks match your current filters. Try adjusting your search or filter criteria.
              </p>
            </>
          ) : (
            <>
              <h3 className="text-lg font-semibold">Welcome to Remirind</h3>
              <p className="mt-1 text-sm text-muted-foreground text-center max-w-sm">
                Stay organized and manage your tasks with ease. Create your first task to get started.
              </p>
              <button
                onClick={handleAddNew}
                className="mt-6 inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
              >
                <Plus className="h-4 w-4" />
                Create Your First Task
              </button>
            </>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {tasks.map((task) => (
            <div key={task._id} className="animate-fade-in">
              <TaskCard
                task={task}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onToggle={handleToggle}
              />
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <TaskModal
          task={editingTask}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Task"
        message="Are you sure you want to delete this task? This action cannot be undone."
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </Layout>
  );
}
