import { QueryClient } from "@/src/api";
import { vesperAPi } from "@/src/api/apiClient";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useGenerate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: QueryClient) => vesperAPi.generateResponseQuery(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["music"] }),
    onError: (err) => console.log(err),
    retry: false,
  });
};
