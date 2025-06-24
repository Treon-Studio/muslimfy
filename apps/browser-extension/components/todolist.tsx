import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Plus, Check, X, Calendar, Clock } from 'lucide-react';
import { toast } from 'sonner';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
  priority: 'low' | 'medium' | 'high';
}

export function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  // Load todos from localStorage on component mount
  useEffect(() => {
    const savedTodos = localStorage.getItem('islamicTodos');
    if (savedTodos) {
      try {
        const parsedTodos = JSON.parse(savedTodos).map((todo: any) => ({
          ...todo,
          createdAt: new Date(todo.createdAt)
        }));
        setTodos(parsedTodos);
      } catch (error) {
        console.error('Error loading todos:', error);
      }
    }
  }, []);

  // Save todos to localStorage whenever todos change
  useEffect(() => {
    localStorage.setItem('islamicTodos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = () => {
    if (newTodo.trim()) {
      const todo: Todo = {
        id: `todo_${Date.now()}`,
        text: newTodo.trim(),
        completed: false,
        createdAt: new Date(),
        priority: 'medium'
      };
      setTodos(prev => [todo, ...prev]);
      setNewTodo('');
      toast.success('Task ditambahkan!');
    }
  };

  const toggleTodo = (id: string) => {
    setTodos(prev => prev.map(todo => 
      todo.id === id 
        ? { ...todo, completed: !todo.completed }
        : todo
    ));
  };

  const deleteTodo = (id: string) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
    toast.success('Task dihapus!');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addTodo();
    }
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  const completedCount = todos.filter(todo => todo.completed).length;
  const activeCount = todos.filter(todo => !todo.completed).length;

  return (
    <div className="relative rounded-3xl overflow-hidden h-full bg-gradient-to-br from-[#FF5A00] via-[#FF6B10] to-[#F16A16]">
      {/* Enhanced glassmorphism with layered effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/15 via-transparent to-white/8 backdrop-blur-sm"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-[#FF5A00]/30 via-transparent to-[#F16A16]/20"></div>
      
      {/* Refined animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-4 right-4 w-24 h-24 bg-white/10 rounded-full animate-pulse blur-2xl opacity-40"></div>
        <div className="absolute bottom-4 left-4 w-16 h-16 bg-white/12 rounded-full animate-ping blur-xl opacity-50" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 right-6 w-4 h-4 bg-white/15 rounded-full animate-bounce blur-sm opacity-60" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/4 left-8 w-8 h-8 bg-white/10 rounded-full animate-pulse blur-lg opacity-30" style={{ animationDelay: '3s' }}></div>
        <div className="absolute bottom-1/3 right-12 w-6 h-6 bg-white/12 rounded-full animate-bounce blur-md opacity-40" style={{ animationDelay: '4s' }}></div>
        <div className="absolute top-3/4 left-1/4 w-3 h-3 bg-white/15 rounded-full animate-pulse blur-sm opacity-20" style={{ animationDelay: '5s' }}></div>
      </div>

      <div className="relative p-6 h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 border-white/25 backdrop-blur-sm rounded-xl flex items-center justify-center border">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-white font-bold text-lg">Task Manager</h2>
              <p className="text-white/90 text-sm font-medium">Agenda Harian</p>
            </div>
          </div>
        </div>

        {/* Add Todo Input */}
        <div className="mb-4">
          <div className="flex gap-2">
            <Input
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Tambahkan task baru..."
              className="flex-1 bg-white/15 border-white/30 placeholder:text-white/70 text-white font-medium focus:bg-white/25 focus:border-white/50 transition-all duration-200 backdrop-blur-sm"
            />
            <Button
              onClick={addTodo}
              disabled={!newTodo.trim()}
              className="w-10 h-10 p-0 rounded-xl bg-gradient-to-br from-white/40 via-white/35 to-white/25 hover:from-white/55 hover:via-white/45 hover:to-white/35 text-white border border-white/40 hover:border-white/60 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed active:scale-90 backdrop-blur-sm shadow-lg hover:shadow-xl hover:shadow-white/20 transform hover:scale-105 disabled:hover:scale-100 disabled:hover:shadow-lg group"
            >
              <Plus className="w-4 h-4 transition-all duration-300 group-hover:scale-110 group-active:scale-95" />
            </Button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-1 mb-4">
          {(['all', 'active', 'completed'] as const).map((filterType) => (
            <button
              key={filterType}
              onClick={() => setFilter(filterType)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 active:scale-95 backdrop-blur-sm ${
                filter === filterType
                  ? 'bg-white/25 border-white/30 text-white border'
                  : 'bg-white/10 text-white/80 hover:bg-white/15 hover:text-white'
              }`}
            >
              {filterType === 'all' ? 'Semua' : filterType === 'active' ? 'Aktif' : 'Selesai'}
            </button>
          ))}
        </div>

        {/* Todo List */}
        <div className="flex-1 overflow-y-auto mobile-scroll scrollbar-thin">
          {filteredTodos.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-8">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-4 backdrop-blur-sm">
                <Calendar className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-white font-bold text-base mb-2">
                {filter === 'all' ? 'Belum ada task' : 
                 filter === 'active' ? 'Tidak ada task aktif' : 
                 'Belum ada task selesai'}
              </h3>
              <p className="text-white/80 text-sm font-medium">
                {filter === 'all' ? 'Tambahkan task pertama Anda' : 
                 filter === 'active' ? 'Semua task sudah selesai!' : 
                 'Selesaikan beberapa task dulu'}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredTodos.map((todo) => (
                <div
                  key={todo.id}
                  className={`group flex items-start gap-3 p-3 rounded-xl transition-all duration-200 backdrop-blur-sm ${
                    todo.completed
                      ? 'bg-white/10 border border-white/25'
                      : 'bg-white/15 border-white/20 hover:bg-white/20 border'
                  }`}
                >
                  {/* Complete Button */}
                  <button
                    onClick={() => toggleTodo(todo.id)}
                    className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 flex-shrink-0 active:scale-90 ${
                      todo.completed
                        ? 'bg-green-500 border-green-500 text-white'
                        : 'border-white/50 hover:border-white/70 hover:bg-white/15'
                    }`}
                  >
                    {todo.completed && <Check className="w-3 h-3" />}
                  </button>

                  {/* Todo Content */}
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-bold transition-all duration-200 ${
                      todo.completed
                        ? 'text-white/70 line-through'
                        : 'text-white group-hover:text-white'
                    }`}>
                      {todo.text}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center gap-1 text-xs text-white/70 font-medium">
                        <Clock className="w-3 h-3" />
                        <span>{todo.createdAt.toLocaleDateString('id-ID')}</span>
                      </div>
                    </div>
                  </div>

                  {/* Delete Button */}
                  <button
                    onClick={() => deleteTodo(todo.id)}
                    className="opacity-0 group-hover:opacity-100 w-7 h-7 rounded-lg bg-red-500/30 hover:bg-red-500/50 text-red-200 flex items-center justify-center transition-all duration-200 flex-shrink-0 active:scale-90 backdrop-blur-sm"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Summary */}
        {todos.length > 0 && (
          <div className="mt-4 pt-4 border-t border-white/20">
            <div className="flex items-center justify-between text-xs font-bold text-white/90">
              <span>Total: {todos.length} task</span>
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-white rounded-full opacity-80"></div>
                  {activeCount} aktif
                </span>
                <span className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  {completedCount} selesai
                </span>
              </div>
            </div>
            
            {/* Progress Bar */}
            {todos.length > 0 && (
              <div className="mt-2">
                <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden backdrop-blur-sm">
                  <div 
                    className="h-full bg-gradient-to-r from-green-500 to-green-400 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${(completedCount / todos.length) * 100}%` }}
                  />
                </div>
                <p className="text-xs text-white/80 font-bold mt-1 text-center">
                  {Math.round((completedCount / todos.length) * 100)}% selesai
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}