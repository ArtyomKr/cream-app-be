import { IBoardRequest } from '../../models/apiModels';

const isBoardRequestBody = (body: object): body is IBoardRequest => {
  return 'title' in body && typeof body.title === 'string';
};

export default isBoardRequestBody;
