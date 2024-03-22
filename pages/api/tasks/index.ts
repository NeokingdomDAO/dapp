import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiRequest, NextApiResponse } from "next";

import { getUserProjectsQuery } from "@graphql/queries/get-user-projects.query";
import { getUserTasksQuery } from "@graphql/queries/get-user-tasks.query";

import odooGraphQLClient from "@lib/graphql/odoo";
import { ODOO_DB_NAME, ODOO_ENDPOINT, getSession } from "@lib/odooClient";
import { sessionOptions } from "@lib/session";

import { ProjectTask } from "@store/projectTaskStore";

async function tasksRoute(req: NextApiRequest, res: NextApiResponse) {
  const cookie = req.session.cookie;
  const user = req.session.user;
  if (!(cookie && user)) {
    return res.status(401).end();
  }

  const { body } = req;
  const { username, password } = user;
  let session;
  try {
    session = await getSession(ODOO_ENDPOINT, ODOO_DB_NAME, username, password);
  } catch (err) {
    await req.session.destroy();
    return res.status(401).json({ message: "Unauthorized" });
  }

  const getUserTasks = async (userId: number) => {
    const userTasks = await odooGraphQLClient.query(cookie, getUserTasksQuery, { user_id: userId });
    return userTasks?.ProjectTask;
  };

  const getUserProjectIds = (tasks: ProjectTask[]) => {
    return [...new Set(tasks.map((t: ProjectTask) => t.project_id.id))];
  };

  const getTaskIds = (tasks: ProjectTask[]) => {
    return [
      ...new Set(
        tasks.map((task: ProjectTask) => {
          if (task.parent_id) return task.parent_id.id;
          return task.id;
        }),
      ),
    ];
  };

  if (req.method === "GET") {
    // List all Projects Tasks
    try {
      const data = await odooGraphQLClient.query(cookie, getUserProjectsQuery, {
        userId: user.id,
      });
      res.status(200).json(data?.ProjectProject || []);
    } catch (err: any) {
      console.log("🐞 > err:", err);
      res.status(500).json({ message: err.message });
    }
  }

  if (req.method === "POST") {
    // Create New Task
    try {
      const newTaskId = await session.create("project.task", JSON.parse(body));
      if (newTaskId) {
        const [newTask] = await session.read("project.task", [Number(newTaskId)]);
        res.status(200).json(newTask);
      } else {
        throw new Error("Unable to create task");
      }
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  }
}

export default withIronSessionApiRoute(tasksRoute, sessionOptions);
