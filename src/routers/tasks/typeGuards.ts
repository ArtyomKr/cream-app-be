import { ITaskRequest } from '../../models/apiModels';

const isTaskRequestBody = (body: object): body is ITaskRequest => {
  return (
    'title' in body &&
    'order' in body &&
    'description' in body &&
    typeof body.title === 'string' &&
    typeof body.order === 'number' &&
    typeof body.description === 'string'
  );
};

export default isTaskRequestBody;
