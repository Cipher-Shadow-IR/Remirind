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
import Button from '../components/ui/Button';
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
  const [deleting, setDeleting] = useState(false);

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
    setDeleting(true);
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
      setDeleting(false);
    }
  };

  return (
    <Layout>
      {/* Editorial Header Statement */}
      <section className="mb-10 pb-8 border-b border-[#d4ccbd]">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <span className="text-[11px] font-sans font-medium uppercase tracking-widest text-[#8b713a]">
              Productivity Ledger
            </span>
            <h1 className="mt-2 font-serif text-3xl sm:text-5xl text-[#29271f] font-normal tracking-tight leading-[1.1]">
              Daily Objectives & Execution
            </h1>
            <p className="font-serif italic text-lg sm:text-xl text-[#8b713a] mt-1 pl-4 border-l border-[#8b713a]/40">
              Welcome back, {user?.name}. Review your active commitments and milestones.
            </p>
          </div>

          <div className="shrink-0">
            <Button onClick={handleAddNew} size="default" className="shadow-sm">
              <Plus className="h-3.5 w-3.5" />
              <span>Create Task</span>
            </Button>
          </div>
        </div>
      </section>

      {/* Metrics Section */}
      <section className="mb-12">
        {!stats ? (
          <div className="py-8">
            <LoadingSpinner />
          </div>
        ) : (
          <DashboardStats stats={stats} />
        )}
      </section>

      {/* Tasks Section Header */}
      <div className="mb-6 flex items-center justify-between border-b border-[#e7e0d3] pb-3">
        <div className="flex items-center gap-2">
          <ClipboardList className="h-4 w-4 text-[#8b713a]" />
          <h2 className="font-serif text-xl sm:text-2xl font-normal tracking-tight text-[#29271f]">
            Task Ledger
          </h2>
          <span className="text-xs uppercase tracking-wider text-[#514d44] font-medium font-sans">
            ({tasks.length})
          </span>
        </div>
      </div>

      <TaskFilters filters={filters} onChange={setFilters} />

      {error ? (
        <div className="mb-6 rounded-[3px] border border-[#8b2b2b]/30 bg-[#8b2b2b]/10 px-4 py-3 text-xs text-[#8b2b2b]">
          {error}
        </div>
      ) : null}

      {loading ? (
        <div className="py-16">
          <LoadingSpinner />
        </div>
      ) : tasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-[3px] border border-dashed border-[#d4ccbd] bg-[#fcfaf5] py-16 px-6 text-center">
          <div className="rounded-[2px] border border-[#d4ccbd] bg-[#f7f4ec] p-3 mb-4 text-[#8b713a]">
            <ClipboardList className="h-6 w-6" />
          </div>
          {filters.search || filters.status || filters.priority ? (
            <>
              <h3 className="font-serif text-xl font-normal text-[#29271f]">
                No matching records
              </h3>
              <p className="mt-1 text-xs text-[#514d44] max-w-sm font-sans leading-relaxed">
                No tasks match your specified query parameters. Try resetting your search filters.
              </p>
            </>
          ) : (
            <>
              <h3 className="font-serif text-xl font-normal text-[#29271f]">
                Your Ledger is Clear
              </h3>
              <p className="mt-1 text-xs text-[#514d44] max-w-sm font-sans leading-relaxed">
                Maintain focus by tracking your immediate responsibilities. Record your first objective.
              </p>
              <Button onClick={handleAddNew} className="mt-6">
                <Plus className="h-3.5 w-3.5" />
                <span>Record Initial Task</span>
              </Button>
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

      {showModal ? (
        <TaskModal
          task={editingTask}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      ) : null}

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete Task"
        message="Are you sure you wish to remove this task? This operation cannot be reversed."
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </Layout>
  );
}
