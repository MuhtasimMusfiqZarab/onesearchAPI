import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

import { AuthService } from 'src/auth/auth.service';
import { UserService } from 'src/user/user.service';

import { UserAccessRole } from 'src/user/user.enum';

function getBearerToken(authorization: unknown): string | undefined {
  if (typeof authorization !== 'string') return undefined;

  const match = authorization.match(/^Bearer\s+(\S+)$/i);
  return match ? match[1] : undefined;
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const jwtToken = getBearerToken(
      ctx.getContext()?.req?.headers?.authorization,
    );
    if (!jwtToken) return false;

    //verify the token and get the user type for API authentication
    const result: any = await this.authService.validateToken(jwtToken);

    //check the user type instead of email
    if (result?.email) {
      return true;
    }

    return false;
  }
}

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const jwtToken = getBearerToken(
      ctx.getContext()?.req?.headers?.authorization,
    );
    if (!jwtToken) return false;

    //verify the token and get the user type for API authentication
    const result: any = await this.authService.validateToken(jwtToken);

    //check the user type instead of email
    if (result?.email) {
      const user: any = await this.userService.findOne(result.sub);

      if (user.accessRole === UserAccessRole.Admin) return true;
    }

    return false;
  }
}
