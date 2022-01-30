export class User {
    constructor(
        public _id: string,
        public email: string,
        public username: string,
        public profilePicture: string,
        public phoneNumber: string,
        public bio: string,
        public followers: Array<string>,
        public followings: Array<string>,
        public posts: Array<string>,
        public createdAt: string,
        public updatedAt: string,
        private token?: string,
    ) {}

    get tokenValue() {
        return this.token;
    }
}