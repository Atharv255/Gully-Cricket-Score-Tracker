import { useGetMatchByIdQuery } from "../features/match/matchApi";

const useMatchData = (matchId) => {
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetMatchByIdQuery(matchId, {
    skip: !matchId,
  });

  const match = data?.data?.match;

  return {
    match,
    isLoading,
    isError,
    error,
    refetch,
  };
};

export default useMatchData;