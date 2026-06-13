import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGetLiveScoreQuery } from "../features/live/liveApi";
import { setCurrentLiveScore, selectCurrentLiveScore } from "../features/live/liveSlice";
import useSocket from "./useSocket";

const useLiveScore = (matchId) => {
  const dispatch = useDispatch();
  const [isUpdating, setIsUpdating] = useState(false);
  const liveScore = useSelector(selectCurrentLiveScore);

  const {
    data,
    isLoading,
    isError,
    refetch,
  } = useGetLiveScoreQuery(matchId, {
    skip: !matchId,
    pollingInterval: 30000,
  });

  useEffect(() => {
    if (data?.data?.liveScore) {
      dispatch(setCurrentLiveScore(data.data.liveScore));
    }
  }, [data, dispatch]);

  useSocket(matchId, {
    onScoreUpdate: (socketData) => {
      if (socketData.liveScore) {
        setIsUpdating(true);
        dispatch(setCurrentLiveScore(socketData.liveScore));
        setTimeout(() => setIsUpdating(false), 500);
      }
    },
    onBallRecorded: (socketData) => {
      if (socketData.liveScore) {
        dispatch(setCurrentLiveScore(socketData.liveScore));
      }
    },
  });

  return {
    liveScore,
    isLoading,
    isError,
    isUpdating,
    refetch,
  };
};

export default useLiveScore;