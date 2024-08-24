import { Inject, Injectable } from '@nestjs/common';
import supertokens from "supertokens-node";

import Session from 'supertokens-node/recipe/session';
import DashBoard from 'supertokens-node/recipe/dashboard';
import UserRoles from 'supertokens-node/recipe/userroles';
import EmailPassword from 'supertokens-node/recipe/emailpassword';

import { ConfigInjectionToken, AuthModuleConfig } from '../config.interface';

@Injectable()
export class SupertokensService {
    constructor(@Inject(ConfigInjectionToken) private config: AuthModuleConfig) {
        supertokens.init({
            appInfo: config.appInfo,
            supertokens: {
                connectionURI: config.connectionURI,
                apiKey: config.apiKey,
            },
            recipeList: [
                Session.init(),
                DashBoard.init(),
                UserRoles.init(),
                EmailPassword.init()
            ]
        });
    }
}