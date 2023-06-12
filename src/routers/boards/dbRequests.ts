import { IBoardData, IBoardRequest, IBoardResponse } from '../../models/apiModels';
import dbQuery from '../../db/dbQuery';

const createBoard = async (title: string, description: string): Promise<IBoardResponse> => {
  const res = await dbQuery(
    `INSERT INTO boards (title, description)
     VALUES ($1, $2)
     RETURNING *;`,
    [title, description],
  );

  return res.rows[0];
};

const getAllBoards = async (): Promise<IBoardResponse[]> => {
  const res = await dbQuery(
    `SELECT *
     FROM boards;`,
  );

  return res.rows;
};

const findBoardById = async (id: string): Promise<IBoardData> => {
  const res = await dbQuery(
    `WITH column_tasks as (
     SELECT "columnId",
            json_agg(to_jsonb(t.*) - 'boardId' - 'columnId' || jsonb_build_object('files', coalesce(f.files, '[]'))) tasks
     FROM tasks t
     LEFT JOIN (
         SELECT "taskId", json_agg(to_jsonb(f.*) - 'fileId' - 'taskId') files
         FROM files f
         GROUP BY "taskId"
       ) f ON (t.id = f."taskId")
     GROUP BY "columnId"
     )

     SELECT b.*, 
           CASE WHEN count(c) = 0 THEN '[]' 
           ELSE json_agg(to_jsonb(c.*) - 'boardId' || jsonb_build_object('tasks', coalesce(t.tasks, '[]')))  END  columns 
     FROM boards b
     LEFT JOIN columns c ON (b.id = c."boardId")
     LEFT JOIN column_tasks t ON (c.id = t."columnId")
     WHERE b.id = $1
     GROUP BY b.id;`,
    [id],
  );

  return res.rows[0];
};

const deleteBoard = async (id: string) => {
  await dbQuery(
    `DELETE
     FROM boards
     WHERE id = $1;`,
    [id],
  );
};

const editBoard = async (id: string, { title, description }: IBoardRequest): Promise<IBoardResponse> => {
  const res = await dbQuery(
    `UPDATE boards
     SET title = $2,
         description = $3
     WHERE id = $1
     RETURNING *;`,
    [id, title, description ?? ''],
  );

  return res.rows[0];
};

export { createBoard, getAllBoards, findBoardById, deleteBoard, editBoard };
