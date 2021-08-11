import {Module} from '@nestjs/common';
import {CqrsModule} from '@nestjs/cqrs';
import {GenerateLearningResourcesCommandHandler} from "./core/generate-learning-resources.command-handler";
import {WhatAreLearningResourcesForUserQueryHandler} from "./core/what-are-learning-resources-for-user.query-handler";
import {LEARNING_RESOURCES_REPOSITORY} from "./core/learning-resources.repository";
import {LearningResourcesInMemoryRepository} from "./infrastructure/learning-resources.in-memory-repository";
import {LEARNING_RESOURCES_GENERATOR} from "./core/learning-resources-generator";
import {PuppeteerLearningResourcesGenerator} from "./infrastructure/puppeteer-learning-resources-generator";
import {WhenLearningResourcesWasGeneratedThenSendEmailAutomation} from "./automation/when-learning-resources-was-generated-then-send-email.automation";
import {TIME_PROVIDER, TimeProvider} from "./core/time-provider.port";
import {SystemTimeProvider} from "./infrastructure/system-time-provider";
import {USERS_FULL_NAMES} from "./core/users-full-names.port";
import {UserModuleToUsersFullNamesAdapter} from "./infrastructure/user-module-to-users-full-names.adapter";

@Module({
  imports: [CqrsModule],
  providers: [
    GenerateLearningResourcesCommandHandler,
    WhatAreLearningResourcesForUserQueryHandler,
    WhenLearningResourcesWasGeneratedThenSendEmailAutomation,
    {
      provide: LEARNING_RESOURCES_REPOSITORY,
      useClass: LearningResourcesInMemoryRepository //todo: leave for unit test, replace for prod with real database
    },
    {
      provide: TIME_PROVIDER,
      useClass: SystemTimeProvider
    },
    // {
    //   provide: USERS_FULL_NAMES,
    //   useClass: new UserModuleToUsersFullNamesAdapter()
    // },
    {
      provide: LEARNING_RESOURCES_GENERATOR,
      useFactory: (timeProvider: TimeProvider) => new PuppeteerLearningResourcesGenerator(timeProvider), //todo: leave for unit test, replace for prod with real database
      inject: [TIME_PROVIDER]
    }
  ]
})
export class LearningResourcesModule {

}
