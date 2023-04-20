export interface IEmailService {
  sendMemberJoinVertification(
    email: string,
    signupVerificationToken: string,
  ): Promise<any>;
}
