import { useQuery } from '@tanstack/react-query';
import { projectAPI } from '@/features/project/api.ts';

export const useSprints = (projectId: number) => {
  return useQuery({
    queryKey: ['sprints', projectId],
    queryFn: () => projectAPI.getSprints(projectId),
  });
};
