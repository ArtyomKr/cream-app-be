import { IColumn } from '../../models/apiModels';

const isColumnRequestBody = (body: object): body is IColumn => {
  return 'title' in body && 'order' in body && typeof body.title === 'string' && typeof body.order === 'number';
};

export default isColumnRequestBody;
