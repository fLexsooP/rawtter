import { useCallback, useMemo } from 'react';
import { toast } from 'react-hot-toast';
import axios from 'axios';

import useCurrentUser from './useCurrentUser';
import usePost from './usePost';
import usePosts from './usePosts';
import LoginModal from '../components/modals/LoginModal';
import useLoginModal from './useLoginModal';

const useLike = ({ postId, userId }: { postId: string; userId?: string }) => {
  const { data: currentUser } = useCurrentUser();
  const { data: fetchedPost, mutate: mutateFetchedPost } = usePost(postId);
  const { mutate: mutateFetchedPosts } = usePosts(userId);

  const loginModal = useLoginModal();

  const hasLiked = useMemo(() => {
    const likedList = fetchedPost?.likedIds || [];
    return likedList.includes(currentUser?.id);
  }, [currentUser, fetchedPost]);

  const toggleLike = useCallback(async () => {
    if (!currentUser) {
      loginModal.onOpen();
    }

    try {
      let request;
      if (hasLiked) {
        request = () => axios.delete('/api/like', { params: { postId } });
      } else {
        request = () => axios.post('/api/like', { postId });
      }
      await request();

      mutateFetchedPost();
      mutateFetchedPosts();
      toast.success(
        hasLiked ? 'Successfully unliked' : 'Successfully liked'
      );
    } catch (error) {
      toast.error('Failed to like');
    }
  }, [
    currentUser,
    loginModal,
    hasLiked,
    postId,
    mutateFetchedPost,
    mutateFetchedPosts,
  ]);

  return { hasLiked, toggleLike };
};

export default useLike;
