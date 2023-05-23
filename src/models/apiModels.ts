interface ISignUpRequest {
  name: string;
  login: string;
  password: string;
}

type ISignUpResponse = Omit<IUserData, 'boards'>;

interface ISignInRequest {
  login: string;
  password: string;
}

interface ISignInResponse {
  token: string;
}

interface IUserData {
  id: string;
  name: string;
  login: string;
  boards: IBoardData[];
}

interface ITask {
  id: string;
  title: string;
  order: number;
  description: string;
  userId: string;
  boardId: string;
  columnId: string;
}

interface IColumn {
  id: string;
  title: string;
  order: number;
}

interface IColumnFiles {
  filename: string;
  fileSize: number;
}

interface IColumnTask extends Omit<ITask, 'boardId' | 'columnId'> {
  files: IColumnFiles[];
}

interface IColumnData extends IColumn {
  tasks: IColumnTask[];
}

interface IBoard {
  id: string;
  title: string;
  description: string;
}

interface IBoardData extends IBoard {
  columns: IColumnData[];
}

interface IDBModel {
  users: IUserData[];
}

export type { ISignUpRequest, ISignUpResponse, ISignInRequest, ISignInResponse, IDBModel };