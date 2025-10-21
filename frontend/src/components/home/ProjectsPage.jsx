import React, { useState, useEffect } from 'react';
import { getUserProjects, createProject, updateProject, deleteProject } from '../../services/api/projectApi';
import { Plus, Folder, Calendar, Settings, Trash2, ArrowLeft, Pencil, Check, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ProjectsPage() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newProject, setNewProject] = useState({
    projectName: '',
    description: '',
    projectSlug: ''
  });
  const [creating, setCreating] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [editName, setEditName] = useState('');
  const [updating, setUpdating] = useState(false);
  const [deletingProject, setDeletingProject] = useState(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await getUserProjects();
      setProjects(response.projects);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      await createProject(newProject);
      setShowCreateModal(false);
      setNewProject({ projectName: '', description: '', projectSlug: '' });
      fetchProjects();
    } catch (err) {
      setError(err.message);
    } finally {
      setCreating(false);
    }
  };

  const generateSlug = (name) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  };

  const handleNameChange = (e) => {
    const name = e.target.value;
    setNewProject({
      ...newProject,
      projectName: name,
      projectSlug: generateSlug(name)
    });
  };

  const handleEditProject = (project) => {
    setEditingProject(project._id);
    setEditName(project.projectName);
  };

  const handleSaveEdit = async (project) => {
    if (!editName.trim() || editName === project.projectName) {
      setEditingProject(null);
      setEditName('');
      return;
    }

    setUpdating(true);
    try {
      await updateProject(project.projectSlug, { projectName: editName.trim() });
      setEditingProject(null);
      setEditName('');
      fetchProjects();
    } catch (err) {
      setError(err.message);
    } finally {
      setUpdating(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingProject(null);
    setEditName('');
  };

  const handleDeleteProject = async (project) => {
    if (window.confirm(`Are you sure you want to delete "${project.projectName}"? This action cannot be undone.`)) {
      setDeletingProject(project._id);
      try {
        await deleteProject(project.projectSlug);
        fetchProjects();
      } catch (err) {
        setError(err.message);
      } finally {
        setDeletingProject(null);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-white mx-auto mb-3"></div>
          <p className="text-gray-400 text-sm">Loading projects...</p>
        </div>
      </div>
    );
  }

  return (
  <div className="min-h-screen bg-gray-100 text-gray-900 dark:bg-black dark:text-white">
    <div className="max-w-6xl mx-auto px-6 py-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
        >
          <ArrowLeft size={18} />
          <span>Back</span>
        </button>

        <h1 className="text-3xl font-semibold tracking-tight">Projects</h1>

        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium border border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-all dark:border-white/20 dark:hover:border-white/40 dark:hover:bg-white/5"
        >
          <Plus size={16} />
          <span>New Project</span>
        </button>
      </div>

      {error && (
        <div className="border px-4 py-3 rounded-md mb-6 text-sm bg-red-100 border-red-300 text-red-700 dark:bg-red-900/30 dark:border-red-600 dark:text-red-300">
          {error}
        </div>
      )}

      {/* Projects */}
      {projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center py-20">
          <Folder size={50} className="text-gray-400 mb-4 dark:text-gray-700" />
          <h3 className="text-lg font-medium mb-2 text-gray-700 dark:text-gray-400">No projects yet</h3>
          <p className="text-sm mb-6 text-gray-500 dark:text-gray-600">Start by creating a new project.</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-5 py-2 rounded-md text-sm border border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-all dark:border-white/20 dark:hover:border-white/40 dark:hover:bg-white/5"
          >
            Create Project
          </button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div
              key={project._id}
              onClick={() => navigate(`/studio/${project.projectSlug}`)}
              className="group rounded-xl p-5 cursor-pointer transition-all border bg-white border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-md dark:bg-white/5 dark:border-white/10 dark:hover:border-white/30"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-md bg-gray-100 dark:bg-white/10 flex items-center justify-center">
                  <Folder size={20} className="text-gray-700 dark:text-white" />
                </div>
                <div className="flex gap-1">
                  {editingProject === project._id ? (
                    <>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSaveEdit(project);
                        }}
                        disabled={updating}
                        className="text-green-500 hover:text-green-400 disabled:opacity-50 transition-colors"
                      >
                        <Check size={16} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCancelEdit();
                        }}
                        className="text-gray-500 hover:text-gray-400 transition-colors"
                      >
                        <X size={16} />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditProject(project);
                        }}
                        className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-blue-400 transition-opacity"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteProject(project);
                        }}
                        disabled={deletingProject === project._id}
                        className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-400 disabled:opacity-50 transition-opacity"
                      >
                        <Trash2 size={16} />
                      </button>
                    </>
                  )}
                </div>
              </div>

              {editingProject === project._id ? (
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSaveEdit(project);
                    if (e.key === 'Escape') handleCancelEdit();
                  }}
                  autoFocus
                  className="w-full px-2 py-1 mb-2 rounded text-gray-900 dark:text-white bg-gray-100 dark:bg-black border border-gray-300 dark:border-white/20 focus:outline-none focus:border-gray-500 dark:focus:border-white/40 text-lg font-medium"
                />
              ) : (
                <h3 className="text-lg font-medium mb-2 truncate">{project.projectName}</h3>
              )}

              {project.description && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-2">{project.description}</p>
              )}

              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-1">
                  <Calendar size={12} />
                  <span>{new Date(project.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Settings size={12} />
                  <span>{project.settings?.framework || 'React'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>

    {/* Modal */}
    {showCreateModal && (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div
          className="absolute inset-0 bg-black/50 dark:bg-black/70"
          onClick={() => setShowCreateModal(false)}
        />
        <div className="relative bg-white dark:bg-black border border-gray-200 dark:border-white/10 rounded-xl p-8 w-full max-w-md mx-4">
          <h2 className="text-xl font-semibold mb-6 text-center text-gray-900 dark:text-white">Create Project</h2>
          <form onSubmit={handleCreateProject} className="space-y-5">
            <div>
              <label className="block text-sm text-gray-700 dark:text-gray-400 mb-2">Project Name</label>
              <input
                type="text"
                value={newProject.projectName}
                onChange={handleNameChange}
                placeholder="Enter project name"
                required
                className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-white/10 bg-gray-100 dark:bg-black text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-gray-500 dark:focus:border-white/40"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 dark:text-gray-400 mb-2">Project Slug</label>
              <input
                type="text"
                value={newProject.projectSlug}
                onChange={(e) =>
                  setNewProject({ ...newProject, projectSlug: e.target.value })
                }
                placeholder="project-slug"
                required
                className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-white/10 bg-gray-100 dark:bg-black text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-gray-500 dark:focus:border-white/40"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 dark:text-gray-400 mb-2">Description</label>
              <textarea
                value={newProject.description}
                onChange={(e) =>
                  setNewProject({ ...newProject, description: e.target.value })
                }
                placeholder="Describe your project"
                className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-white/10 bg-gray-100 dark:bg-black text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-gray-500 dark:focus:border-white/40 h-24 resize-none"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="flex-1 border border-gray-300 dark:border-white/10 text-gray-700 dark:text-gray-400 rounded-md py-2 hover:bg-gray-50 dark:hover:bg-white/5 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={creating}
                className="flex-1 border border-gray-300 dark:border-white/20 bg-gray-200 dark:bg-white text-gray-900 dark:text-black rounded-md py-2 hover:bg-gray-300 dark:hover:bg-gray-200 transition-all disabled:opacity-50"
              >
                {creating ? 'Creating...' : 'Create'}
              </button>
            </div>
          </form>
        </div>
      </div>
    )}
  </div>
);

}
