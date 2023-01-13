import { Gender } from '../common/user.union';

export class User {
  constructor(
    private seq: number,
    private id: string,
    private password: string,
    private name: string,
    private email: string,
    private gender: Gender,
    private tel: string,
    private createdDate: Date,
    private updatedDate: Date,
    private deletedDate: Date,
    private signUpVerificationToken: string,
  ) {}

  getSeq(): Readonly<number> {
    return this.seq;
  }

  getId(): Readonly<string> {
    return this.id;
  }

  getPassword(): Readonly<string> {
    return this.password;
  }

  getName(): Readonly<string> {
    return this.name;
  }

  getEmail(): Readonly<string> {
    return this.email;
  }

  getGender(): Readonly<Gender> {
    return this.gender;
  }

  getTel(): Readonly<string> {
    return this.tel;
  }

  getCreatedDate(): Readonly<Date> {
    return this.createdDate;
  }

  getUpdatedDate(): Readonly<Date> {
    return this.updatedDate;
  }

  getDeletedDate(): Readonly<Date> {
    return this.deletedDate;
  }

  getSignUpVerificationToken(): Readonly<string> {
    return this.signUpVerificationToken;
  }
}
