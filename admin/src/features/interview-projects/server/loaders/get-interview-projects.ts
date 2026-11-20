import "server-only";

import {
  findAllInterviewConfigs,
  type InterviewConfigWithBill,
} from "@/features/interview-config/server/repositories/interview-config-repository";
import { countCompletedSessionsByConfigIds } from "../repositories/interview-project-repository";

export async function getInterviewProjects(): Promise<{
  projects: InterviewConfigWithBill[];
  responseCounts: Record<string, number> | null;
}> {
  let projects: InterviewConfigWithBill[] = [];
  try {
    projects = await findAllInterviewConfigs();
  } catch (error) {
    console.error("Failed to fetch interview projects:", error);
    return { projects: [], responseCounts: null };
  }

  try {
    const responseCounts = await countCompletedSessionsByConfigIds(
      projects.map((p) => p.id)
    );
    return { projects, responseCounts };
  } catch (error) {
    console.error("Failed to count responses:", error);
    return { projects, responseCounts: null };
  }
}
