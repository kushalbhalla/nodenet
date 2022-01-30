export class Post {
    public _id: string
    public creator: string;
    public description: string;
    public imgUrl: string;
    public likes: Array<string>;
    public createdAt: string;
    public updatedAt: string;

    constructor(_id: string, creator: string, description: string, imgUrl: string, likes: any[], createdAt: string, updatedAt: string) {
        this._id = _id,
        this.creator = creator,
        this.description = description,
        this.imgUrl = imgUrl,
        this.likes = likes,
        this.createdAt = createdAt,
        this.updatedAt = updatedAt
    }
}

export class PostUser {
    public user: {
        _id: string,
        username: string,
        profilePicture: string
    };
    public post: Post;

    constructor(
        user: {
            _id: string,
            username: string,
            profilePicture: string
        },
        post: Post) {
        this.user = user,
        this.post = post
    }
}
