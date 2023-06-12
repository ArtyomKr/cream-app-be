import { IColumnData, ITask, ITaskRequest } from '../../models/apiModels';
import dbQuery from '../../db/dbQuery';

const getAllTasks = async (boardId: string, columnId: string): Promise<ITask[]> => {
  const res = await dbQuery(
    `SELECT *
     FROM tasks
     WHERE "boardId" = $1 and "columnId" = $2
     ORDER BY "order" ASC;`,
    [boardId, columnId],
  );

  return res.rows;
};

const createTask = async (
  boardId: string,
  columnId: string,
  userId: string,
  { title, description }: ITaskRequest,
): Promise<ITask> => {
  const tasks = await getAllTasks(boardId, columnId);
  const order = tasks.length + 1;
  const res = await dbQuery(
    `INSERT INTO tasks ("boardId", "columnId", "userId", title, "order", description)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *;`,
    [boardId, columnId, userId, title, order.toString(), description],
  );

  return res.rows[0];
};

const findTaskById = async (boardId: string, columnId: string, taskId: string): Promise<IColumnData> => {
  const res = await dbQuery(
    `WITH task_files as (
       SELECT "taskId", json_agg(to_jsonb(f.*) - 'fileId' - 'taskId') files
       FROM files f
       GROUP BY "taskId"
     )
      
     SELECT t.*, 
            coalesce(f.files, '[]') files
     FROM tasks t
     LEFT JOIN task_files f ON (t.id = f."taskId")
     WHERE t."boardId" = $1 AND t."columnId" = $2 AND t.id = $3;`,
    [boardId, columnId, taskId],
  );

  return res.rows[0];
};

const deleteTask = async (boardId: string, columnId: string, taskId: string) => {
  await dbQuery(
    `DELETE
     FROM tasks
     WHERE "boardId" = $1 AND "columnId" = $2 AND id = $3;`,
    [boardId, columnId, taskId],
  );
};

const editTask = async (
  oldBoardId: string,
  oldColumnId: string,
  taskId: string,
  { title, order, description, userId, columnId, boardId }: Omit<ITask, 'id'>,
): Promise<ITask> => {
  const res = await dbQuery(
    `UPDATE tasks
     SET title = $4, 
         "order" = $5,
         description = $6,
         "userId" = $7,
         "columnId" = $8,
         "boardId" = $9
     WHERE "boardId" = $1 AND "columnId" = $2 AND id = $3
     RETURNING *;`,
    [oldBoardId, oldColumnId, taskId, title, order.toString(), description, userId, columnId, boardId],
  );

  return res.rows[0];
};

export { getAllTasks, createTask, findTaskById, deleteTask, editTask };
