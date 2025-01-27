import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        const roles = this.reflector.getAllAndOverride<string[]>('roles', [
            context.getHandler(),
            context.getClass(),
        ]);
        console.log('RolesGuard: Required roles:', roles); 

        if (!roles) {
            return true;
        }

        const request = context.switchToHttp().getRequest();
        const user = request.user;
        console.log('RolesGuard: User:', user);

        if (!user || !user.role || !roles.includes(user.role)) {
            console.log(`RolesGuard: Forbidden - User role: ${user?.role}`);
            throw new ForbiddenException('You do not have access to this resource');
        }

        return true;
    }
}
