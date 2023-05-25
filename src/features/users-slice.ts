import data from '../api/data.json';

import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { nanoid } from 'nanoid';

export type UsersState = {
  entities: User[];
};

const initialUsersState: UsersState = {
  entities: data.users,
};

type DraftUser = RequireOnly<User, 'realName' | 'alterEgo'>;

const createUser = (draftUser: DraftUser): User => {
  return {
    id: nanoid(),
    ...draftUser,
    tasks: [],
  };
};

const updateUser = (draftUser: DraftUser, users: User[]): User => {
  const user = users.find((user) => draftUser.id === user.id);
  return {
    ...user,
    ...draftUser,
  } as User;
};

const usersSlice = createSlice({
  name: 'users',
  initialState: initialUsersState,
  reducers: {
    addUser: (state, action: PayloadAction<DraftUser>) => {
      const newUser = createUser(action.payload);
      state.entities.unshift(newUser);
    },
    removeUser: (state, action: PayloadAction<DraftUser['id']>) => {
      const index = state.entities.findIndex(
        (user) => user.id === action.payload,
      );
      state.entities.splice(index, 1);
    },
    updateUser: (state, action: PayloadAction<DraftUser>) => {
      const index = state.entities.findIndex(
        (user) => action.payload.id === user.id,
      );
      const user = state.entities[index];
      state.entities[index] = {
        ...user,
        ...action.payload,
      };
    },
  },
});

export const usersReducer = usersSlice.reducer;

export const {
  addUser: addUserAction,
  removeUser: removeUserAction,
  updateUser: updateUserAction,
} = usersSlice.actions;

export default usersSlice;
