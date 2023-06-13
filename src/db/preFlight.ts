import dbQuery from './dbQuery';

const createTables = async () =>
  dbQuery(
    `CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
     CREATE TABLE IF NOT EXISTS "users" (
       "id" uuid DEFAULT uuid_generate_v4(), 
       "name" VARCHAR (50) NOT NULL, 
       "login" VARCHAR (50) UNIQUE NOT NULL, 
       "password" VARCHAR NOT NULL,
       PRIMARY KEY ("id")
     );
     CREATE TABLE IF NOT EXISTS "boards" (
       "id" uuid DEFAULT uuid_generate_v4(),
       "title" VARCHAR NOT NULL,
       "description" VARCHAR NOT NULL,
       PRIMARY KEY ("id")
     );
     CREATE TABLE IF NOT EXISTS "columns" (
       "id" uuid DEFAULT uuid_generate_v4(),
       "title" VARCHAR NOT NULL,
       "order" SMALLINT NOT NULL,
       "boardId" uuid REFERENCES "boards" ("id")
         ON DELETE CASCADE ON UPDATE CASCADE,
       PRIMARY KEY ("id")
     );
     CREATE TABLE IF NOT EXISTS "tasks" (
       "id" uuid DEFAULT uuid_generate_v4(),
       "title" VARCHAR NOT NULL,
       "order" SMALLINT NOT NULL,
       "description" VARCHAR NOT NULL,
       "userId" uuid REFERENCES "users" ("id")
         ON DELETE SET NULL ON UPDATE CASCADE,
       "boardId" uuid REFERENCES "boards" ("id")
         ON DELETE CASCADE ON UPDATE CASCADE,
       "columnId" uuid REFERENCES "columns" ("id")
         ON DELETE CASCADE ON UPDATE CASCADE,
       PRIMARY KEY ("id")
     );
     CREATE TABLE IF NOT EXISTS "files" (
       "filename" VARCHAR UNIQUE NOT NULL,
       "fileId" VARCHAR NOT NULL,
       "fileSize" INTEGER NOT NULL,
       "taskId" uuid REFERENCES "tasks" ("id")
         ON DELETE CASCADE ON UPDATE CASCADE,
       PRIMARY KEY ("fileId")
     );`,
  );

const createColumnsTrigger = async () =>
  dbQuery(
    `CREATE OR REPLACE FUNCTION update_order_columns()
    RETURNS trigger AS
    $$
    BEGIN
      IF EXISTS (SELECT 1 FROM columns WHERE "boardId" = NEW."boardId" AND "order" = NEW."order" AND id != NEW.id) THEN
        IF (NEW."order" <= OLD."order") THEN
          UPDATE columns SET "order" = "order" + 1 WHERE "boardId" = NEW."boardId" AND "order" >= NEW."order" AND id != NEW.id;
        ELSE
          UPDATE columns SET "order" = "order" - 1 WHERE "boardId" = NEW."boardId" AND "order" <= NEW."order" AND id != NEW.id;
        END IF;
      END IF;
    
      WITH new_order AS (
        SELECT id, ROW_NUMBER() OVER (PARTITION BY "boardId" ORDER BY "order") AS new_order
        FROM columns
      )

      UPDATE columns c
      SET "order" = n.new_order
      FROM new_order n
      WHERE c.id = n.id;
      RETURN CASE TG_OP WHEN 'DELETE' THEN OLD ELSE NEW END; -- Return the appropriate value depending on the operation type
    END;
    $$ LANGUAGE plpgsql;

    CREATE OR REPLACE TRIGGER update_order_columns_trigger
    AFTER INSERT OR UPDATE OR DELETE ON columns
    FOR EACH ROW
    WHEN (pg_trigger_depth() = 0)
    EXECUTE PROCEDURE update_order_columns();`,
  );

const createTasksTrigger = async () =>
  dbQuery(
    `CREATE OR REPLACE FUNCTION update_order_tasks()
    RETURNS trigger AS
    $$
    BEGIN
      IF EXISTS (SELECT 1 FROM tasks WHERE "columnId" = NEW."columnId" AND "order" = NEW."order" AND id != NEW.id) THEN
        IF (NEW."order" <= OLD.order OR NEW."columnId" != OLD."columnId") THEN
          UPDATE tasks SET "order" = "order" + 1 WHERE "columnId" = NEW."columnId" AND "order" >= NEW."order" AND id != NEW.id;
        ELSE
          UPDATE tasks SET "order" = "order" - 1 WHERE "columnId" = NEW."columnId" AND "order" <= NEW."order" AND id != NEW.id;
        END IF;
      END IF;
      
      WITH new_order AS (
        SELECT id, ROW_NUMBER() OVER (PARTITION BY "columnId" ORDER BY "order") AS new_order
        FROM tasks
      )

      UPDATE tasks t
      SET "order" = n.new_order
      FROM new_order n
      WHERE t.id = n.id;
      RETURN CASE TG_OP WHEN 'DELETE' THEN OLD ELSE NEW END; -- Return the appropriate value depending on the operation type
    END;
    $$ LANGUAGE plpgsql;
    
    CREATE OR REPLACE TRIGGER update_order_tasks_trigger
    AFTER INSERT OR UPDATE OR DELETE ON tasks
    FOR EACH ROW
    WHEN (pg_trigger_depth() = 0)
    EXECUTE PROCEDURE update_order_tasks();`,
  );

export { createTables, createColumnsTrigger, createTasksTrigger };
