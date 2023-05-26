import { use, useMemo } from 'react';
import { format } from 'date-fns';

import useCurrentUser from '@/hooks/useCurrentUser';
import useUser from '@/hooks/useUser';

import Button from '../Button';

interface UserBioProps {
  userId: string;
}

const UserBio: React.FC<UserBioProps> = ({ userId }) => {
  const { data: currentUser } = useCurrentUser();
  const { data: fetchedUser } = useUser(userId);

  const createdAt = useMemo(() => {
    if (!fetchedUser?.createdAt) return null;

    return format(new Date(fetchedUser.createdAt), 'MMMM yyyy');
  }, [fetchedUser?.createdAt]);

  return (
    <div className="border-b-[1px] border-neutral-800 pb-4">
      <div className="flex justify-end p-2">
        {currentUser?.id === userId ? (
          <Button
            label="Edit"
            onClick={() => {}}
            secondary
          />
        ) : (
          <Button
            label="Follow"
            onClick={() => {}}
            secondary
          />
        )}
      </div>
    </div>
  );
};

export default UserBio;
