import { createParamDecorator, ExecutionContext } from '@nestjs/common';

// @Request 데코레이터와 비슷하게 사용할 수 있다.
// @Request()는 express의 request 객체를 반환하기 때문에 express or fastify 두가지를 사용할수 있는 nestjs에서는 권장하지 않는다. (express에 종속적이기 때문에)
export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    console.log(request.user);
    return request.user;
  },
);
