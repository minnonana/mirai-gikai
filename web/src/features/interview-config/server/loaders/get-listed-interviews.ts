import "server-only";

import { unstable_cache } from "next/cache";
import { CACHE_TAGS } from "@/lib/cache-tags";
import {
  type ListedInterview,
  toListedInterview,
} from "../../shared/utils/to-listed-interview";
import { findListedPublicInterviews } from "../repositories/interview-config-repository";

/** トップに並べる受付中のインタビュー */
export async function getListedInterviews(): Promise<ListedInterview[]> {
  return _getCachedListedInterviews();
}

const _getCachedListedInterviews = unstable_cache(
  async (): Promise<ListedInterview[]> => {
    try {
      const rows = await findListedPublicInterviews();
      return rows.map(toListedInterview);
    } catch (error) {
      console.error("Failed to fetch listed interviews:", error);
      return [];
    }
  },
  ["listed-interviews"],
  {
    revalidate: 600,
    tags: [CACHE_TAGS.INTERVIEW_CONFIGS, CACHE_TAGS.BILLS],
  }
);
