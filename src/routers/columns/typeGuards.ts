import { IColumn } from '../../models/apiModels';

const isColumnRequestBody = (body: object): body is IColumn => {
  return 'title' in body && typeof body.title === 'string';
};

export default isColumnRequestBody;
