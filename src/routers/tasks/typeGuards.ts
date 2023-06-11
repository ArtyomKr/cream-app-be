import { ITask, ITaskRequest } from '../../models/apiModels';

const isTaskRequestBody = (body: object): body is ITaskRequest => {
  return (
    'title' in body && 'description' in body && typeof body.title === 'string' && typeof body.description === 'string'
  );
};

const isTaskEditRequestBody = (body: object): body is Omit<ITask, 'id'> => {
  return (
    'title' in body &&
    'order' in body &&
    'description' in body &&
    'userId' in body &&
    'columnId' in body &&
    'boardId' in body &&
    typeof body.title === 'string' &&
    typeof body.order === 'number' &&
    typeof body.description === 'string' &&
    typeof body.userId === 'string' &&
    typeof body.columnId === 'string' &&
    typeof body.boardId === 'string'
  );
};

export { isTaskRequestBody, isTaskEditRequestBody };
