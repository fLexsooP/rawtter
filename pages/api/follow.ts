import { NextApiRequest, NextApiResponse } from 'next';

import serverAuth from '@/libs/serverAuth';
import prisma from '@/libs/prismadb';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST' && req.method !== 'DELETE') {
    return res.status(405).end();
  }

  try {
    // user id to follow
    const { userId } = req.method === 'POST' ? req.body : req.query;

    const { currentUser } = await serverAuth(req, res);

    if (!userId || typeof userId !== 'string') {
      throw new Error('Invalid User Id');
    }

    // user to follow
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('User not found with this id');
    }

    let updatedFollowingIds = [...(currentUser.followingIds || [])];

    if (req.method === 'POST') {
      // follow
      updatedFollowingIds.push(userId);
    }

    if (req.method === 'DELETE') {
      // un-follow
      updatedFollowingIds = updatedFollowingIds.filter(
        (followingId) => followingId !== userId
      );
    }

    const updatedUser = await prisma.user.update({
      where: { id: currentUser.id },
      data: { followingIds: updatedFollowingIds },
    });

    return res.status(200).json(updatedUser);
  } catch (error) {
    console.log('follow api error: ' + error);
    return res.status(400).end();
  }
}
