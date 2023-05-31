import { useCallback, useMemo } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

import useCurrentUser from './useCurrentUser';
import useUser from './useUser';
import useLoginModal from './useLoginModal';

const useFollow = (userId: string) => {
  const { data: currentUser, mutate: mutateCurrentUser } = useCurrentUser();
  const { mutate: mutateFetchedUser } = useUser(userId);

  const loginModal = useLoginModal();

  const isFollowing = useMemo(() => {
    const followingList = currentUser?.followingIds || [];
    return followingList.includes(userId);
  }, [userId, currentUser]);

  const toggleFollow = useCallback(async () => {
    if (!currentUser) {
      loginModal.onOpen();
    }

    try {
      let request;
      if (isFollowing) {
        request = () => axios.delete('/api/follow', { params: { userId } });
      } else {
        request = () => axios.post('/api/follow', { userId });
      }
      await request();

      mutateCurrentUser();
      mutateFetchedUser();
      toast.success(
        isFollowing ? 'Successfully unfollowed' : 'Successfully followed'
      );
    } catch (error) {
      toast.error('Failed to follow');
    }
  }, [
    currentUser,
    isFollowing,
    userId,
    mutateCurrentUser,
    mutateFetchedUser,
    loginModal,
  ]);

  return { isFollowing, toggleFollow };
};

export default useFollow;
