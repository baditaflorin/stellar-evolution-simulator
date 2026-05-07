import { useQuery } from "@tanstack/react-query";
import { buildInfo } from "./buildInfo";

type GitHubCommitResponse = {
  sha: string;
};

export function usePublishedCommit() {
  return useQuery({
    queryKey: ["published-commit", buildInfo.repoUrl],
    queryFn: async () => {
      const response = await fetch(
        "https://api.github.com/repos/baditaflorin/stellar-evolution-simulator/commits/main",
        {
          headers: {
            Accept: "application/vnd.github+json",
          },
        },
      );

      if (!response.ok) {
        throw new Error("Unable to load GitHub commit metadata.");
      }

      const payload = (await response.json()) as GitHubCommitResponse;
      return payload.sha.slice(0, 7);
    },
    retry: 1,
    staleTime: 5 * 60 * 1000,
  });
}
