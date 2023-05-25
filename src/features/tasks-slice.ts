import { createSlice, nanoid, PayloadAction } from '@reduxjs/toolkit';
import data from '../api/data.json';
import { removeUserAction } from './users-slice';

export type TasksState = {
  entities: Task[];
};

type DraftTask = RequireOnly<Task, 'title'>;

export const createTask = (draftTask: DraftTask): Task => {
  return { id: nanoid(), ...draftTask };
};

const initialState: TasksState = {
  entities: data.tasks,
};

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    addTask: (state, action: PayloadAction<DraftTask>) => {
      const task = createTask(action.payload);
      state.entities.unshift(task);
    },
    removeTask: (state, action: PayloadAction<Task['id']>) => {
      const index = state.entities.findIndex(
        (task) => task.id === action.payload,
      );
      state.entities.splice(index, 1);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(removeUserAction, (state, action) => {
      // operations here have to be immutable. No Immer here by default
      const userId = action.payload;
      for(const task of state.entities) {
        if(task.user === userId) {
          task.user = undefined;
        }
      }
    })
  }
});

export const tasksReducer = tasksSlice.reducer;
export const { addTask, removeTask } = tasksSlice.actions;

export default tasksSlice;
