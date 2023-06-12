import { IColumn, IColumnData } from '../../models/apiModels';
import dbQuery from '../../db/dbQuery';

const getAllColumns = async (boardId: string): Promise<IColumn[]> => {
  const res = await dbQuery(
    `SELECT id, title, "order"
     FROM columns
     WHERE "boardId" = $1;`,
    [boardId],
  );

  return res.rows;
};

const createColumn = async (boardId: string, title: string): Promise<IColumn> => {
  const columns = await getAllColumns(boardId);
  const order = columns.length + 1;

  const res = await dbQuery(
    `INSERT INTO columns ("boardId", title, "order")
     VALUES ($1, $2, $3)
     RETURNING id, title, "order";`,
    [boardId, title, order.toString()],
  );

  return res.rows[0];
};

const findColumnById = async (boardId: string, columnId: string): Promise<IColumnData> => {
  const res = await dbQuery(
    `WITH task_files as (
       SELECT "taskId", json_agg(to_jsonb(f.*) - 'fileId' - 'taskId') files
       FROM files f
       GROUP BY "taskId"
     )

     SELECT c.*, 
            json_agg(to_jsonb(t.*) - 'boardId' - 'columnId'|| jsonb_build_object('files', coalesce(f.files, '[]'))) tasks
     FROM columns c
     LEFT JOIN tasks t ON (c.id = t."columnId")
     LEFT JOIN task_files f ON (t.id = f."taskId")
     WHERE c."boardId" = $1 AND c.id = $2
     GROUP BY c.id;`,
    [boardId, columnId],
  );

  return res.rows[0];
};

const deleteColumn = async (boardId: string, columnId: string) => {
  await dbQuery(
    `DELETE
     FROM columns
     WHERE "boardId" = $1 AND id = $2;`,
    [boardId, columnId],
  );
};

const editColumn = async (
  boardId: string,
  columnId: string,
  { title, order }: Omit<IColumn, 'id'>,
): Promise<IColumn> => {
  const res = await dbQuery(
    `UPDATE columns
     SET title = $3, 
         "order" = $4
     WHERE "boardId" = $1 AND id = $2
     RETURNING id, title, "order";`,
    [boardId, columnId, title, order.toString()],
  );

  return res.rows[0];
};

export { getAllColumns, createColumn, findColumnById, deleteColumn, editColumn };
