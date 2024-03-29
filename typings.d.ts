export type TweetBody = {
    text: string,
    username: string,
    profileImg: string,
    image?:string
}
export interface Tweet extends TweetBody {
    _id: string
    _createdAt: string
    _updatedAt: string
    _rev: string
    _type: 'tweet',
    blockTweet: boolean;
}
export type CommentBody = {
    comment: string,
    tweetId: string,
    username: string,
    profileImage:string
}
export interface Comment extends CommentBody {
    _id: string
    _createdAt: string
    _rev: string
    _type: 'comment',
    _updatedAt: string;
    tweet: {
        _ref: string,
        _type: 'reference'
    }
}
export type LikesBody = {
    tweetId: string,
    username: string,
}
export interface Likes extends LikesBody {
    _id: string
    _createdAt: string
    _rev: string
    _type: 'likes',
    _updatedAt: string;
    tweet: {
        _ref: string,
        _type: 'reference'
    }
}