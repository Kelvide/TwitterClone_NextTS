// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { create } from 'domain'
import type { NextApiRequest, NextApiResponse } from 'next'
import { CommentBody } from '../../typings'

type Data = {
  name: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
    const comment: CommentBody = JSON.parse(req.body)
    
    const mutations = {
        mutations: [
           {
                create: {
                    _type: 'comment',
                    comment: comment.comment,
                    username: comment.username,
                    profileImage: comment.profileImage,
                    tweet: {
                        _type: 'reference',
                        _ref: comment.tweetId,
                    }
                }
           }
        ]
    }

    const apiEndpoint = `https://${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}.api.sanity.io/v2021-03-25//data/mutate/${process.env.NEXT_PUBLIC_SANITY_DATASET}`
    const result = await fetch(apiEndpoint, {
        headers: {
            'content-type': 'application/json',
            Authorization: `Bearer ${process.env.SANITY_API_TOKEN}`
          },
          body: JSON.stringify(mutations),
          method: 'POST'
    })
    const json = await result.json

  res.status(200).json({ name: 'John Doe' })
}
